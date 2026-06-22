"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiAcademicCap } from "react-icons/hi2";
import { motion } from "motion/react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl shadow-sm shadow-black/[0.05] border-b border-gray-200/60"
          : "bg-white/50 backdrop-blur-md"
      }`}
    >
      <Link href="/" className="flex items-center gap-2 group">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20"
        >
          <HiAcademicCap size={17} className="text-white" />
        </motion.div>
        <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
          EduStack
        </span>
      </Link>

      <a
        href="/dashboard"
        className="relative overflow-hidden inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-200 group"
      >
        <span className="relative z-10">Get Started</span>
        {/* Shine sweep */}
        <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[200%] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 transition-transform duration-700 ease-in-out" />
      </a>
    </motion.header>
  );
}
