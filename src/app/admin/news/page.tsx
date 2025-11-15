"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import type { NewsItem } from "@/lib/supabase";

export default function AdminNewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadNews();
  }, []);

  async function checkAuthAndLoadNews() {
    try {
      const session = await getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      await loadNews();
    } catch (error) {
      console.error("認証エラー:", error);
      router.push("/admin/login");
    }
  }

  async function loadNews() {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setNewsItems(data || []);
    } catch (error) {
      console.error("Newsの取得エラー:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("このニュースを削除してもよろしいですか？")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("news").delete().eq("id", id);

      if (error) throw error;

      setNewsItems(newsItems.filter((item) => item.id !== id));
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
              <h1 className="text-2xl font-semibold">News管理</h1>
            </div>
            <Link
              href="/admin/news/new"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              + 新規作成
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {newsItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-6">ニュースがまだありません</p>
            <Link
              href="/admin/news/new"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              最初のニュースを追加
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {newsItems.map((news) => (
              <div
                key={news.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6"
              >
                {/* Image */}
                {news.image_url && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={news.image_url}
                      alt={news.title}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {news.category && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {news.category}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">{news.date}</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">{news.title}</h3>
                  {news.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {news.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/news/${news.id}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(news.id)}
                      disabled={deleting === news.id}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
                    >
                      {deleting === news.id ? "削除中..." : "削除"}
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
