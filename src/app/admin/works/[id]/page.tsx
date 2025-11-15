"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import type { Work } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditWorkPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [work, setWork] = useState<Work | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAuthAndLoadWork();
  }, [id]);

  async function checkAuthAndLoadWork() {
    try {
      const session = await getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      await loadWork();
    } catch (error) {
      console.error("認証エラー:", error);
      router.push("/admin/login");
    }
  }

  async function loadWork() {
    try {
      const { data, error } = await supabase
        .from("works")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (error) throw error;

      setWork(data);
      setFormData({
        title: data.title || "",
        year: data.year || "",
      });
      setPreview(data.image_url);
    } catch (error) {
      console.error("Workの取得エラー:", error);
      alert("作品の読み込みに失敗しました");
      router.push("/admin/works");
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
      let imageUrl = work?.image_url || "";

      // 新しい画像がアップロードされた場合
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("works-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error("Image upload error:", uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        // 新しい画像URLを取得
        const {
          data: { publicUrl },
        } = supabase.storage.from("works-images").getPublicUrl(fileName);

        imageUrl = publicUrl;

        // 古い画像を削除
        if (work?.image_url) {
          const oldFileName = work.image_url.split("/").pop();
          if (oldFileName) {
            await supabase.storage.from("works-images").remove([oldFileName]);
          }
        }
      }

      // データベースを更新
      const { error: dbError } = await supabase
        .from("works")
        .update({
          title: formData.title,
          year: formData.year || null,
          image_url: imageUrl,
        })
        .eq("id", parseInt(id));

      if (dbError) {
        console.error("Database update error:", dbError);
        throw new Error(`Database update failed: ${dbError.message}`);
      }

      alert("Work updated successfully!");
      router.push("/admin/works");
    } catch (error: any) {
      console.error("Error updating work:", error);
      alert(`Failed to update work: ${error.message || error}`);
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

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">作品が見つかりません</h1>
          <Link
            href="/admin/works"
            className="text-gray-600 hover:text-black transition-colors"
          >
            ← 作品一覧に戻る
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
            <Link
              href="/admin/works"
              className="text-gray-600 hover:text-black"
            >
              ← 戻る
            </Link>
            <h1 className="text-2xl font-semibold">Edit Work</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-sm"
        >
          {/* Current Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 uppercase tracking-wider text-xs text-gray-600">
              Current Image
            </label>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
              <Image
                src={preview}
                alt={formData.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 uppercase tracking-wider text-xs text-gray-600">
              New Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
            />
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 uppercase tracking-wider text-xs text-gray-600">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Enter artwork title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Year */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2 uppercase tracking-wider text-xs text-gray-600">
              Year
            </label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              placeholder="2024"
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
              {saving ? "Updating..." : "Update"}
            </button>
            <Link
              href="/admin/works"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
