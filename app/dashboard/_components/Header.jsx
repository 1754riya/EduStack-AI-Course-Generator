"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { HiBars3, HiAcademicCap } from "react-icons/hi2";
import { motion } from "motion/react";
import { ThemeToggle } from "@/app/_components/ThemeToggle";

function Header({ hamBurger = false, handleMobileSidebar }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-30 flex items-center justify-between h-14 px-5
        bg-white/80 dark:bg-slate-900/80
        backdrop-blur-xl
        border-b border-gray-100 dark:border-white/5"
    >
      <div className="flex items-center gap-2">
        {hamBurger && (
          <button
            onClick={() => handleMobileSidebar(true)}
            className="md:hidden p-2 rounded-xl
              text-gray-400 dark:text-slate-500
              hover:bg-gray-100 dark:hover:bg-slate-800
              hover:text-gray-600 dark:hover:text-slate-300
              transition-colors"
          >
            <HiBars3 size={19} />
          </button>
        )}
        <Link href="/dashboard" className="md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
              <HiAcademicCap size={15} className="text-white" />
            </div>
            <span className="font-bold text-sm text-gray-900 dark:text-slate-100">EduStack</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 ring-2 ring-gray-100 dark:ring-slate-700 hover:ring-indigo-200 dark:hover:ring-indigo-500/40 transition-all duration-200 rounded-full cursor-pointer",
            },
          }}
        />
      </div>
    </motion.header>
  );
}

export default Header;
