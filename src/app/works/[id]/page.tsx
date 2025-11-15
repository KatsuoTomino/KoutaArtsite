"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { motion } from "framer-motion";
import { getWorkById } from "@/data/works";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WorkDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const work = getWorkById(parseInt(id));

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Work not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-70 transition-opacity">
              KoutaArtworld
            </Link>
            <Link
              href="/#works"
              className="text-sm hover:text-gray-600 transition-colors"
            >
              ← Back to Works
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative pt-16 pb-12 px-6 sm:px-8 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full min-h-[60vh] flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden p-4">
            <div className="relative w-full h-full" style={{ minHeight: '60vh', maxHeight: '80vh' }}>
              <Image
                src={work.image}
                alt={work.title}
                fill
                className="object-contain rounded-2xl"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Content */}
      <section className="py-12 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="mb-4">
              <span className="text-sm text-gray-500">{work.category}</span>
              {work.year && (
                <span className="text-sm text-gray-500 ml-4">• {work.year}</span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-6">
              {work.title}
            </h1>
            {work.description && (
              <p className="text-lg text-gray-700 leading-relaxed mb-12">
                {work.description}
              </p>
            )}
          </motion.div>

          {work.details && work.details.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="border-t border-gray-200 pt-8"
            >
              <h2 className="text-2xl font-light mb-6">Project Details</h2>
              <ul className="space-y-3">
                {work.details.map((detail, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="flex items-start"
                  >
                    <span className="text-gray-400 mr-3">•</span>
                    <span className="text-gray-700">{detail}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Navigation to other works */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <Link
              href="/#works"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="mr-2">←</span>
              View all works
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

