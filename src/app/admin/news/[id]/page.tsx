"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import type { NewsItem } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditNewsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [news, setNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "",
    description: "",
    content: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAuthAndLoadNews();
  }, [id]);

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
        .eq("id", parseInt(id))
        .single();

      if (error) throw error;

      setNews(data);
      setFormData({
        title: data.title || "",
        date: data.date || "",
        category: data.category || "",
        description: data.description || "",
        content: data.content ? data.content.join("\n\n") : "",
      });
      if (data.image_url) {
        setPreview(data.image_url);
      }
    } catch (error) {
      console.error("Newsの取得エラー:", error);
      alert("ニュースの読み込みに失敗しました");
      router.push("/admin/news");
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = news?.image_url || "";

      // 新しい画像がアップロードされた場合
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("news-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error("Image upload error:", uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        // 新しい画像URLを取得
        const {
          data: { publicUrl },
        } = supabase.storage.from("news-images").getPublicUrl(fileName);

        imageUrl = publicUrl;

        // 古い画像を削除
        if (news?.image_url) {
          const oldFileName = news.image_url.split("/").pop();
          if (oldFileName) {
            await supabase.storage.from("news-images").remove([oldFileName]);
          }
        }
      }

      // コンテンツを段落に分割
      const contentArray = formData.content
        .split("\n\n")
        .filter((p) => p.trim() !== "");

      // データベースを更新
      const { error: dbError } = await supabase
        .from("news")
        .update({
          title: formData.title,
          date: formData.date,
          category: formData.category || null,
          description: formData.description || null,
          image_url: imageUrl || null,
          content: contentArray,
        })
        .eq("id", parseInt(id));

      if (dbError) {
        console.error("Database update error:", dbError);
        throw new Error(`Database update failed: ${dbError.message}`);
      }

      alert("News updated successfully!");
      router.push("/admin/news");
    } catch (error) {
      console.error("Error updating news:", error);
      alert(
        `Failed to update news: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setSaving(false);
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

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            ニュースが見つかりません
          </h1>
          <Link
            href="/admin/news"
            className="text-gray-600 hover:text-black transition-colors"
          >
            ← ニュース一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/news" className="text-gray-600 hover:text-black">
              ← 戻る
            </Link>
            <h1 className="text-2xl font-semibold">ニュースを編集</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-sm space-y-6"
        >
          {/* Current Image */}
          {preview && (
            <div>
              <label className="block text-sm font-medium mb-2">
                現在の画像
              </label>
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <Image
                  src={preview}
                  alt={formData.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {preview
                ? "新しい画像（変更する場合のみ）"
                : "画像（オプション）"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">タイトル *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">日付 *</label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              placeholder="2024.12.15"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">カテゴリ</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="お知らせ、作品、イベント など"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">概要</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              placeholder="一覧ページに表示される短い説明"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">
              詳細内容（段落ごとに空行で区切る）
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={10}
              placeholder="段落1の内容&#10;&#10;段落2の内容&#10;&#10;段落3の内容"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "更新中..." : "更新"}
            </button>
            <Link
              href="/admin/news"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center flex items-center justify-center"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
