"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Work, NewsItem } from "@/lib/supabase";
import PuzzleImage from "@/components/PuzzleImage";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Worksを取得
      const { data: worksData, error: worksError } = await supabase
        .from("works")
        .select("*")
        .order("id", { ascending: false });

      if (worksError) throw worksError;
      setWorks(worksData || []);

      // Newsを取得
      const { data: newsData, error: newsError } = await supabase
        .from("news")
        .select("*")
        .order("id", { ascending: false })
        .limit(3);

      if (newsError) throw newsError;
      setNewsItems(newsData || []);
    } catch (error) {
      console.error("データの取得エラー:", error);
      // エラーが発生した場合は空の配列を設定
      setWorks([]);
      setNewsItems([]);
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white"
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm">
              <a href="#news" className="hover:text-gray-600 transition-colors">
                News
              </a>
              <a
                href="#works"
                className="hover:text-gray-600 transition-colors"
              >
                Works
              </a>
              <a
                href="#about"
                className="hover:text-gray-600 transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="hover:text-gray-600 transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Rainbow Logo */}
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight hover:opacity-70 transition-opacity"
            >
              <span className="text-red-500">K</span>
              <span className="text-orange-500">o</span>
              <span className="text-yellow-500">u</span>
              <span className="text-green-500">t</span>
              <span className="text-blue-500">a</span>
              <span className="text-indigo-500">A</span>
              <span className="text-purple-500">r</span>
              <span className="text-pink-500">t</span>
              <span className="text-red-500">w</span>
              <span className="text-orange-500">o</span>
              <span className="text-yellow-500">r</span>
              <span className="text-green-500">l</span>
              <span className="text-blue-500">d</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={
                  mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                }
                className="w-6 h-0.5 bg-black transition-all"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-black transition-all"
              />
              <motion.span
                animate={
                  mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                }
                className="w-6 h-0.5 bg-black transition-all"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 text-2xl">
              <a
                href="#news"
                onClick={closeMobileMenu}
                className="hover:text-gray-600 transition-colors"
              >
                News
              </a>
              <a
                href="#works"
                onClick={closeMobileMenu}
                className="hover:text-gray-600 transition-colors"
              >
                Works
              </a>
              <a
                href="#about"
                onClick={closeMobileMenu}
                className="hover:text-gray-600 transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={closeMobileMenu}
                className="hover:text-gray-600 transition-colors"
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-16 min-h-[80vh]">
        <div className="absolute inset-0 z-0">
          <PuzzleImage
            src="/image/mainimg.jpg"
            alt="Main Image"
            gridCols={6}
            gridRows={4}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-10 text-right">
          <motion.h1
            className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-tight drop-shadow-2xl text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 2.5, ease: "easeIn" }}
          >
            <span className="inline-block">Kouta</span>
            <br />
            <span className="inline-block font-normal mr-2 sm:mr-4">Art</span>
            <span className="inline-block font-normal">
              worl
              <motion.span
                className="inline-block"
                initial={{ y: 0 }}
                animate={{
                  y: [0, -20, 0, -15, 0, -10, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: 3.2,
                  times: [0, 0.2, 0.4, 0.5, 0.7, 0.8, 1],
                  ease: "easeOut",
                }}
              >
                d
              </motion.span>
            </span>
          </motion.h1>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
              News
            </h2>
            <p className="text-gray-600">最新情報</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {newsItems.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/news/${news.id}`}>
                  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {news.image_url && (
                        <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={news.image_url}
                            alt={news.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, 128px"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {news.category && (
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                              {news.category}
                            </span>
                          )}
                          <time className="text-sm text-gray-500 font-medium">
                            {news.date}
                          </time>
                        </div>
                        <h3 className="text-lg font-medium mb-2 group-hover:text-gray-600 transition-colors">
                          {news.title}
                        </h3>
                        {news.description && (
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {news.description}
                          </p>
                        )}
                        <div className="mt-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors flex items-center">
                          続きを読む
                          <svg
                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Works Section */}
      <section id="works" className="py-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
              Selected Works
            </h2>
            <p className="text-gray-600">
              A curated selection of recent projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {works.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group overflow-hidden"
              >
                <Link href={`/works/${work.id}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-4 rounded-2xl">
                    <Image
                      src={work.image_url}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="text-xl font-medium group-hover:text-gray-600 transition-colors">
                    {work.title}
                  </h3>
                  {work.year && (
                    <div className="text-sm text-gray-500 mt-1">
                      {work.year}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square w-full max-w-md mx-auto md:mx-0"
            >
              <Image
                src="/image/kou.jpg"
                alt="Kouta"
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 90vw, 50vw"
                priority
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-6">
                About
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  はじめまして、こうたです。僕のサイトに訪れてくれてありがとうございます。ぼくの頭の中には、たくさんの世界が広がっています。絵を書くことが大好きなので、たくさん表現していきたいと思います。ニューヨークで個展をすることが僕の夢です。応援して頂けると光栄です。
                </p>
                <p>
                  Thank you for visiting my website. Inside my mind, countless
                  worlds are waiting to be explored. I love drawing, and I want
                  to express as much as I can through my art. My dream is to
                  hold a solo exhibition in New York.Your support means a lot to
                  me.thank you.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Interested in working together? Let&apos;s start a conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:to.katufumi.629@gmail.com"
                className="px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors inline-block"
              >
                Email Me
              </a>
              <a
                href="#"
                className="px-8 py-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors inline-block"
              >
                View Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-8 lg:px-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div>© 2024 Portfolio. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-700 transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-gray-700 transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
