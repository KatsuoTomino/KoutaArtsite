# Supabase セットアップガイド（完全版）

このドキュメントには、Supabase のセットアップに必要なすべての SQL が含まれています。

## 📋 目次

1. [データベーステーブルの作成](#1-データベーステーブルの作成)
2. [Works テーブルの更新](#2-worksテーブルの更新)
3. [ストレージポリシーの設定](#3-ストレージポリシーの設定)

---

## 1. データベーステーブルの作成

最初に実行する SQL：

```sql
-- Worksテーブルの作成
CREATE TABLE IF NOT EXISTS public.works (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsテーブルの作成
CREATE TABLE IF NOT EXISTS public.news (
  id BIGSERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  content TEXT[],
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_atを自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Worksテーブルのトリガー
DROP TRIGGER IF EXISTS update_works_updated_at ON public.works;
CREATE TRIGGER update_works_updated_at
  BEFORE UPDATE ON public.works
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Newsテーブルのトリガー
DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)の有効化
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Worksテーブルのポリシー
CREATE POLICY "Allow public read access on works"
  ON public.works FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated insert on works"
  ON public.works FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on works"
  ON public.works FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on works"
  ON public.works FOR DELETE
  TO authenticated
  USING (true);

-- Newsテーブルのポリシー
CREATE POLICY "Allow public read access on news"
  ON public.news FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated insert on news"
  ON public.news FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on news"
  ON public.news FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on news"
  ON public.news FOR DELETE
  TO authenticated
  USING (true);
```

---

## 2. Works テーブルの更新

category と description カラムを削除（既に実行済みの場合はスキップ）：

```sql
-- Worksテーブルからcategoryとdescriptionカラムを削除
ALTER TABLE public.works DROP COLUMN IF EXISTS category;
ALTER TABLE public.works DROP COLUMN IF EXISTS description;
```

---

## 3. ストレージポリシーの設定

### 必要なストレージバケット

以下のバケットを作成してください（Supabase Dashboard → Storage）：

- `works-images` (Public: OFF)
- `news-images` (Public: OFF)

### ストレージポリシー SQL

```sql
-- 既存のStorageポリシーを削除してから再作成

-- works-imagesバケットの既存ポリシーを削除
DROP POLICY IF EXISTS "Authenticated users can upload works images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view works images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update works images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete works images" ON storage.objects;

-- news-imagesバケットの既存ポリシーを削除
DROP POLICY IF EXISTS "Authenticated users can upload news images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view news images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update news images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete news images" ON storage.objects;

-- works-imagesバケットのポリシーを作成

-- 1. 認証されたユーザーがアップロードできるようにする
CREATE POLICY "Authenticated users can upload works images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'works-images');

-- 2. 誰でも画像を閲覧できるようにする
CREATE POLICY "Anyone can view works images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'works-images');

-- 3. 認証されたユーザーが画像を更新できるようにする
CREATE POLICY "Authenticated users can update works images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'works-images');

-- 4. 認証されたユーザーが画像を削除できるようにする
CREATE POLICY "Authenticated users can delete works images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'works-images');

-- news-imagesバケットのポリシーを作成

-- 1. 認証されたユーザーがアップロードできるようにする
CREATE POLICY "Authenticated users can upload news images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-images');

-- 2. 誰でも画像を閲覧できるようにする
CREATE POLICY "Anyone can view news images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news-images');

-- 3. 認証されたユーザーが画像を更新できるようにする
CREATE POLICY "Authenticated users can update news images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'news-images');

-- 4. 認証されたユーザーが画像を削除できるようにする
CREATE POLICY "Authenticated users can delete news images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news-images');
```

---

## 🔍 確認用 SQL

### テーブル構造の確認

```sql
-- worksテーブルの構造を確認
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'works'
ORDER BY ordinal_position;

-- newsテーブルの構造を確認
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'news'
ORDER BY ordinal_position;
```

### ストレージポリシーの確認

```sql
-- 現在のStorageポリシーを確認
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;
```

---

## ✅ セットアップ完了チェックリスト

- [ ] データベーステーブル（works, news）を作成
- [ ] Works テーブルから category/description を削除
- [ ] ストレージバケット（works-images, news-images）を作成
- [ ] ストレージポリシーを設定
- [ ] 管理者ユーザーを作成（Supabase Dashboard → Authentication）
- [ ] 環境変数（.env.local）を設定
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

**これで Supabase のセットアップは完了です！** 🎉
