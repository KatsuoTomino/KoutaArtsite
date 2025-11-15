"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { works } from "@/data/works";
import PuzzleImage from "@/components/PuzzleImage";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight hover:opacity-70 transition-opacity"
            >
              KoutaArtworld
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm">
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
      <section className="relative pt-16 pb-20 px-6 sm:px-8 lg:px-12 min-h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <PuzzleImage
            src="/image/mainimg.jpg"
            alt="Main Image"
            gridCols={6}
            gridRows={4}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight mb-6 leading-tight text-white drop-shadow-lg">
            <span className="inline-block animate-fade-in-up animation-delay-0">
              Kouta
            </span>
            <br />
            <span className="inline-block font-normal animate-fade-in-up animation-delay-500">
              Artworld
            </span>
          </h1>
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
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    {work.category}
                  </div>
                  <h3 className="text-xl font-medium group-hover:text-gray-600 transition-colors">
                    {work.title}
                  </h3>
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
                  I am a creative professional passionate about design, art, and
                  innovation. With years of experience in various creative
                  fields, I bring a unique perspective to every project.
                </p>
                <p>
                  My work focuses on creating meaningful experiences through
                  thoughtful design, attention to detail, and a deep
                  understanding of visual communication.
                </p>
                <p>
                  I believe in the power of creativity to inspire, connect, and
                  transform ideas into reality.
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
              Interested in working together? Let's start a conversation.
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
