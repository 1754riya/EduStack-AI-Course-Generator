"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import { Progress } from "@/components/ui/progress";
import {
  HiOutlineHome,
  HiOutlineSquare3Stack3D,
  HiOutlineShieldCheck,
  HiArrowRightOnRectangle,
  HiAcademicCap,
  HiXMark,
} from "react-icons/hi2";
import { UsercourselistContext } from "@/app/_context/UserCourseListContext";
import { motion } from "motion/react";

const Menu = [
  { id: 1, name: "Home", icon: HiOutlineHome, path: "/dashboard" },
  { id: 2, name: "Explore", icon: HiOutlineSquare3Stack3D, path: "/dashboard/explore" },
  { id: 3, name: "Upgrade", icon: HiOutlineShieldCheck, path: "/dashboard/upgrade" },
  { id: 4, name: "Log Out", icon: HiArrowRightOnRectangle, path: "/dashboard/logout" },
];

function MobileSideBar({ handleMobileSidebar }) {
  const { usercourselist } = useContext(UsercourselistContext);
  const path = usePathname();

  const courseCount = usercourselist?.length ?? 0;
  const maxCourses = 5;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
        onClick={() => handleMobileSidebar(true)}
      />

      <motion.div
        initial={{ x: -288 }}
        animate={{ x: 0 }}
        exit={{ x: -288 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="fixed top-0 left-0 h-full w-72
          bg-white dark:bg-[#0D1117]
          shadow-2xl dark:shadow-black/60
          z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 dark:border-white/5">
          <Link href="/dashboard" onClick={() => handleMobileSidebar(true)}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/25">
                <HiAcademicCap size={19} className="text-white" />
              </div>
              <span className="font-bold text-[17px] tracking-tight text-gray-900 dark:text-slate-100">EduStack</span>
            </div>
          </Link>
          <button
            onClick={() => handleMobileSidebar(true)}
            className="p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
          >
            <HiXMark size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {Menu.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === path;
            return (
              <Link href={item.path} key={item.id} onClick={() => handleMobileSidebar(true)}>
                <div
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150
                    ${isActive
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                      : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/60 hover:text-gray-900 dark:hover:text-slate-200"
                    }`}
                >
                  {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-full" />}
                  <Icon size={17} className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-slate-500"} />
                  {item.name}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Usage footer */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">Course usage</span>
            <span className="text-xs font-semibold text-gray-600 dark:text-slate-400">{courseCount}/{maxCourses}</span>
          </div>
          <Progress value={(courseCount / maxCourses) * 100} className="h-1.5" />
          <p className="text-xs text-gray-400 dark:text-slate-600 mt-2.5">Upgrade for unlimited courses</p>
        </div>
      </motion.div>
    </>
  );
}

export default MobileSideBar;
