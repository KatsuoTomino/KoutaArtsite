"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export default function NewWorkPage() {
  const [formData, setFormData] = useState({
    title: "",
    year: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
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
    } catch (error) {
      console.error("認証エラー:", error);
      router.push("/admin/login");
    } finally {
      setAuthChecking(false);
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
    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    setLoading(true);

    try {
      // セッション確認
      const session = await getSession();

      if (!session) {
        throw new Error("Authentication required. Please login again.");
      }

      // 画像をアップロード
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("works-images")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      // 画像URLを取得
      const {
        data: { publicUrl },
      } = supabase.storage.from("works-images").getPublicUrl(fileName);

      // データベースに保存
      const { error: dbError } = await supabase.from("works").insert([
        {
          title: formData.title,
          year: formData.year || null,
          image_url: publicUrl,
        },
      ]);

      if (dbError) {
        console.error("Database save error:", dbError);
        throw new Error(`Database save failed: ${dbError.message}`);
      }

      alert("Work added successfully!");
      router.push("/admin/works");
    } catch (error) {
      console.error("Error adding work:", error);
      alert(
        `Failed to add work: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading...</p>
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
            <h1 className="text-2xl font-semibold">Add New Work</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-sm"
        >
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 uppercase tracking-wider text-xs text-gray-600">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
            />
            {preview && (
              <div className="mt-4 relative aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
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
              disabled={loading}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <Link
              href="/admin/works"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
