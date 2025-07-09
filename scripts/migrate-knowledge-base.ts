#!/usr/bin/env tsx

/**
 * migrate-knowledge-base.ts
 * -------------------------------------------
 * Reads all markdown files in the local `knowledge-base` directory and upserts
 * them into the `public.knowledge_files` table.
 *
 * Slug: relative path without `.md` extension and path separators converted to `/`.
 * Category: from front-matter `category:` field if present, else top-level directory,
 *           else `general`.
 *
 * Environment variables required:
 *   - SUPABASE_SERVICE_ROLE_KEY  (service role key or any key with insert/update perms)
 *   - NEXT_PUBLIC_SUPABASE_URL   (Supabase project URL)
 *
 * Usage:
 *   pnpm tsx scripts/migrate-knowledge-base.ts
 */

import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";

const KNOWLEDGE_BASE_DIR = "knowledge-base";

async function main() {
  const { SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL } = process.env;
  if (!SUPABASE_SERVICE_ROLE_KEY || !NEXT_PUBLIC_SUPABASE_URL) {
    console.error(
      "❌ SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL env vars are required"
    );
    process.exit(1);
  }

  const supabase = createClient(
    NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );

  const files: string[] = await walk(KNOWLEDGE_BASE_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  console.log(`📄 Found ${mdFiles.length} markdown files to migrate`);

  for (const filePath of mdFiles) {
    const relPath = path.relative(KNOWLEDGE_BASE_DIR, filePath);
    const slug = relPath.replace(/\\/g, "/").replace(/\.md$/, "");

    const raw = await fs.readFile(filePath, "utf8");
    const { content, data } = matter(raw);

    let category: string | null = null;
    if (data.category && typeof data.category === "string") {
      category = data.category.trim();
    } else {
      const parts = relPath.split(path.sep);
      category = parts.length > 1 ? parts[0] : "general";
    }

    const { error } = await supabase.from("knowledge_files").upsert(
      {
        slug,
        content,
        category,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`❌ Failed to upsert ${slug}:`, error.message);
    } else {
      console.log(`✅ Upserted ${slug}`);
    }
  }

  console.log("🎉 Migration complete");
}

// Recursively walk a directory and return full paths
async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map((entry) => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? walk(res) : res;
    })
  );
  return paths.flat();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
