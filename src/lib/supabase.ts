import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
export interface Work {
  id: number;
  title: string;
  image_url: string;
  details?: string[];
  year?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NewsItem {
  id: number;
  date: string;
  title: string;
  description?: string;
  image_url?: string;
  content?: string[];
  category?: string;
  created_at?: string;
  updated_at?: string;
}
