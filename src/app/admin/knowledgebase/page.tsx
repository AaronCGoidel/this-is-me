"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface KnowledgeFile {
  id: number;
  slug: string;
  category: string | null;
  updated_at: string;
}

export default function KnowledgeBasePage() {
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [rebuildStatus, setRebuildStatus] = useState<
    null | "success" | "error"
  >(null);

  useEffect(() => {
    async function fetchFiles() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("knowledge_files")
        .select("id, slug, category, updated_at")
        .order("slug");
      if (!error && data) setFiles(data as KnowledgeFile[]);
      setLoading(false);
    }
    fetchFiles();
  }, []);

  async function handleRebuild() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/knowledgebase/rebuild", {
          method: "POST",
        });
        if (res.ok) setRebuildStatus("success");
        else setRebuildStatus("error");
      } catch {
        setRebuildStatus("error");
      }
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Knowledge Base</h2>
        <div className="flex gap-2">
          <Link href="/admin/knowledgebase/new">
            <Button>Create New</Button>
          </Link>
          <Button
            onClick={handleRebuild}
            disabled={isPending}
            variant="outline"
          >
            {isPending ? "Rebuilding..." : "Rebuild KB"}
          </Button>
        </div>
      </div>

      {rebuildStatus === "success" && (
        <p className="text-sm text-green-600">
          Rebuild completed successfully.
        </p>
      )}
      {rebuildStatus === "error" && (
        <p className="text-sm text-red-600">
          Rebuild failed. Check server logs.
        </p>
      )}

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Slug</th>
            <th className="py-2">Category</th>
            <th className="py-2">Updated</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.id}
              className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="py-2 font-mono">{file.slug}</td>
              <td className="py-2">{file.category ?? "—"}</td>
              <td className="py-2 text-sm text-gray-500">
                {new Date(file.updated_at).toLocaleString()}
              </td>
              <td className="py-2 text-right">
                <Link
                  href={`/admin/knowledgebase/${encodeURIComponent(file.slug)}`}
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
          {files.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-gray-500">
                No knowledge files yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
