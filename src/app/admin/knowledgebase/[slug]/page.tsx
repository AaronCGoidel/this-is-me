"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function EditKnowledgeFilePage() {
  const { slug: raw_slug } = useParams<{ slug: string }>();
  const slug = decodeURIComponent(raw_slug);
  const router = useRouter();
  const supabase = createClient();

  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("knowledge_files")
        .select("category, content")
        .eq("slug", slug)
        .single();
      if (error) setError(error.message);
      else if (data) {
        setCategory(data.category ?? "");
        setContent(data.content);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("knowledge_files")
      .update({ category: category || null, content })
      .eq("slug", slug);
    setSaving(false);
    if (error) setError(error.message);
    else router.push("/admin/knowledgebase");
  }

  async function handleDelete() {
    if (!confirm("Delete this knowledge file?")) return;
    await supabase.from("knowledge_files").delete().eq("slug", slug);
    router.push("/admin/knowledgebase");
  }

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Edit Knowledge File – {slug}</h2>

      <div className="space-y-4">
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
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={saving}
          >
            Delete
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
