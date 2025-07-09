"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function NewKnowledgeFilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("# New Doc\n\nWrite markdown here...");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("knowledge_files").insert({
      slug,
      category: category || null,
      content,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/admin/knowledgebase");
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Create Knowledge File</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 w-full rounded border p-2"
            placeholder="e.g. getting-started"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Category (optional)
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Content (Markdown)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 w-full rounded border p-2 font-mono"
            rows={20}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving || !slug || !content}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
