"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import type { Work } from "@/lib/supabase";

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadWorks();
  }, []);

  async function checkAuthAndLoadWorks() {
    try {
      const session = await getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      await loadWorks();
    } catch (error) {
      console.error("認証エラー:", error);
      router.push("/admin/login");
    }
  }

  async function loadWorks() {
    try {
      const { data, error } = await supabase
        .from("works")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setWorks(data || []);
    } catch (error) {
      console.error("Worksの取得エラー:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("この作品を削除してもよろしいですか？")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("works").delete().eq("id", id);

      if (error) throw error;

      setWorks(works.filter((work) => work.id !== id));
      alert("削除しました");
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-black transition-colors"
              >
                ← 戻る
              </Link>
              <h1 className="text-2xl font-semibold">Works管理</h1>
            </div>
            <Link
              href="/admin/works/new"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              + 新規作成
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {works.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-6">作品がまだありません</p>
            <Link
              href="/admin/works/new"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              最初の作品を追加
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={work.image_url}
                    alt={work.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-2">{work.title}</h3>
                  {work.year && (
                    <p className="text-sm text-gray-500 mb-4">
                      Year: {work.year}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/works/${work.id}`}
                      className="flex-1 px-4 py-2 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(work.id)}
                      disabled={deleting === work.id}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
                    >
                      {deleting === work.id ? "削除中..." : "削除"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
