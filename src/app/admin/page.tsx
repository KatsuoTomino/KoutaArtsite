"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, signOut } from "@/lib/auth";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const session = await getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setUser(session.user);
    } catch (error) {
      console.error("認証エラー:", error);
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("ログアウトエラー:", error);
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
            <h1 className="text-2xl font-semibold">管理画面</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Works管理 */}
          <Link href="/admin/works">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Works管理</h2>
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p className="text-gray-600">作品の追加・編集・削除を行います</p>
            </div>
          </Link>

          {/* News管理 */}
          <Link href="/admin/news">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">News管理</h2>
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p className="text-gray-600">
                ニュースの追加・編集・削除を行います
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-4">クイックアクション</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/"
              className="px-6 py-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              サイトを表示
            </Link>
            <Link
              href="/admin/works/new"
              className="px-6 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-center"
            >
              新しいWorkを追加
            </Link>
            <Link
              href="/admin/news/new"
              className="px-6 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-center"
            >
              新しいNewsを追加
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
