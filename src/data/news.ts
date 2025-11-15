export interface NewsItem {
  id: number;
  date: string;
  title: string;
  description?: string;
  link?: string;
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    date: "2024.12.15",
    title: "新作アートワークを公開しました",
    description: "最新作「Artwork Fourteen」をポートフォリオに追加しました。",
  },
  {
    id: 2,
    date: "2024.12.01",
    title: "ウェブサイトをリニューアルしました",
    description: "より見やすく、使いやすいデザインに刷新しました。",
  },
  {
    id: 3,
    date: "2024.11.20",
    title: "個展開催のお知らせ",
    description: "2025年1月に個展を開催予定です。詳細は後日発表いたします。",
  },
];
