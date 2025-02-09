// src/components/Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowUp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="animate-gradientShift relative overflow-hidden bg-[linear-gradient(270deg,#0c1020,#12172e,#0c1020)] bg-[length:600%_600%] py-12">
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
        {/* 로고 및 슬로건 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4 text-4xl font-bold text-skin-accent"
        >
          Astor
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8 text-xl text-white-base/70"
        >
          Dream. Create. Inspire.
        </motion.p>

        {/* 소셜 아이콘 */}
        <div className="mb-8 flex justify-center space-x-6">
          <motion.a
            href="https://github.com/astorverse"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-white-base transition-colors hover:text-skin-accent"
          >
            <FaGithub className="h-6 w-6" />
          </motion.a>
          <motion.a
            href="https://linkedin.com/in/astorverse"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-white-base transition-colors hover:text-skin-accent"
          >
            <FaLinkedin className="h-6 w-6" />
          </motion.a>
          <motion.a
            href="mailto:orangnlp@gmail.com"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-white-base transition-colors hover:text-skin-accent"
          >
            <FaEnvelope className="h-6 w-6" />
          </motion.a>
        </div>

        {/* 네비게이션 */}
        <nav className="mb-8">
          <ul className="flex justify-center space-x-8">
            <li>
              <a
                href="/blog"
                className="text-white-base/70 transition-colors hover:text-skin-accent"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="/portfolio"
                className="text-white-base/70 transition-colors hover:text-skin-accent"
              >
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="text-white-base/70 transition-colors hover:text-skin-accent"
              >
                About
              </a>
            </li>
          </ul>
        </nav>

        {/* 스크롤 투 탑 버튼 */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-white mx-auto mb-8 flex items-center space-x-2 rounded-full border border-white/30 px-4 py-2 text-sm transition-colors hover:border-skin-accent hover:text-skin-accent"
        >
          <FaArrowUp className="h-4 w-4" />
          <span>Scroll to Top</span>
        </motion.button>

        {/* 카피라이트 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xs text-white-base/50"
        >
          © {new Date().getFullYear()} Astor. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}
