import { createClient } from "@/lib/supabase/server";

// Row shape for knowledge_files. Update database.types.ts later for full typing.
export interface KnowledgeFile {
  id: string;
  slug: string;
  content: string;
  category: string | null;
  updated_at: string;
}

export class KnowledgeBaseDB {
  private async client() {
    return createClient();
  }

  /**
   * Fetch all knowledge files.
   */
  async list(): Promise<KnowledgeFile[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("knowledge_files")
      .select("id, slug, content, category, updated_at")
      .order("slug", { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Get a single file by slug.
   */
  async get(slug: string): Promise<KnowledgeFile | null> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("knowledge_files")
      .select("id, slug, content, category, updated_at")
      .eq("slug", slug)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116: no rows
    return data;
  }

  /**
   * Upsert a knowledge file by slug.
   */
  async upsert(
    file: Omit<KnowledgeFile, "id" | "updated_at">
  ): Promise<KnowledgeFile> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("knowledge_files")
      .upsert({ ...file }, { onConflict: "slug", ignoreDuplicates: false })
      .select()
      .single();

    if (error) throw error;
    return data as KnowledgeFile;
  }

  /**
   * Delete a knowledge file by slug.
   */
  async delete(slug: string): Promise<void> {
    const supabase = await this.client();
    const { error } = await supabase
      .from("knowledge_files")
      .delete()
      .eq("slug", slug);
    if (error) throw error;
  }
}
