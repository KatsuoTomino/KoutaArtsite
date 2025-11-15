export interface NewsItem {
  id: number;
  date: string;
  title: string;
  description?: string;
  image?: string;
  content?: string[];
  category?: string;
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    date: "2024.12.15",
    title: "新作アートワークを公開しました",
    description: "最新作「Artwork Fourteen」をポートフォリオに追加しました。",
    image: "/image/art14.jpg",
    category: "作品",
    content: [
      "この度、新作アートワーク「Artwork Fourteen」を公開いたしました。",
      "今回の作品は、光と影のコントラストをテーマに、デジタルとアナログの融合を試みた作品となっています。",
      "制作期間は約3ヶ月、様々な技法を組み合わせて完成させました。",
      "ぜひWorksセクションからご覧ください。",
    ],
  },
  {
    id: 2,
    date: "2024.12.01",
    title: "ウェブサイトをリニューアルしました",
    description: "より見やすく、使いやすいデザインに刷新しました。",
    image: "/image/art01.jpg",
    category: "お知らせ",
    content: [
      "ポートフォリオサイトを全面的にリニューアルいたしました。",
      "新しいデザインでは、作品をより魅力的に表示できるよう、レイアウトとナビゲーションを改善しています。",
      "モバイルデバイスでも快適にご覧いただけるよう、レスポンシブデザインを採用しました。",
      "今後も定期的にコンテンツを更新してまいりますので、ぜひご覧ください。",
    ],
  },
  {
    id: 3,
    date: "2024.11.20",
    title: "個展開催のお知らせ",
    description: "2025年1月に個展を開催予定です。詳細は後日発表いたします。",
    image: "/image/art05.jpg",
    category: "イベント",
    content: [
      "2025年1月、個展「Kouta Artworld Exhibition」を開催いたします。",
      "会場：東京都内ギャラリー（詳細は後日発表）",
      "期間：2025年1月15日〜1月31日",
      "今回の個展では、過去1年間に制作した作品約20点を展示予定です。",
      "入場無料となっておりますので、ぜひお越しください。",
    ],
  },
];
