import { supabase } from "./supabase";

// ログイン
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

// ログアウト
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

// 現在のユーザーを取得
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

// セッションを取得
export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
}

// 認証状態の変更を監視
export function onAuthStateChange(callback: (session: unknown) => void) {
  return supabase.auth.onAuthStateChange((event: string, session: unknown) => {
    callback(session);
  });
}
