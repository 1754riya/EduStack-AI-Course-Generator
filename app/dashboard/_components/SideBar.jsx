"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import {
  HiOutlineHome,
  HiOutlineSquare3Stack3D,
  HiOutlineShieldCheck,
  HiArrowRightOnRectangle,
  HiAcademicCap,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { UsercourselistContext } from "@/app/_context/UserCourseListContext";
import { motion } from "motion/react";

const Menu = [
  { id: 1, name: "Home", icon: HiOutlineHome, path: "/dashboard" },
  { id: 2, name: "Explore", icon: HiOutlineSquare3Stack3D, path: "/dashboard/explore" },
  { id: 3, name: "Upgrade", icon: HiOutlineShieldCheck, path: "/dashboard/upgrade" },
  { id: 4, name: "Log Out", icon: HiArrowRightOnRectangle, path: "/dashboard/logout" },
];

function SideBar() {
  const { usercourselist, setUsercourselist } = useContext(UsercourselistContext);
  const path = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("usercourselist");
    if (stored) setUsercourselist(JSON.parse(stored));
  }, []);

  const courseCount = usercourselist?.length ?? 0;
  const maxCourses = 5;
  const pct = Math.min(100, Math.round((courseCount / maxCourses) * 100));

  return (
    <motion.aside
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed h-full md:w-64
        bg-white dark:bg-[#0D1117]
        border-r border-gray-100 dark:border-white/5
        flex flex-col z-20"
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <Link href="/dashboard">
          <div className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow duration-200">
              <HiAcademicCap size={19} className="text-white" />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-gray-900 dark:text-slate-100">EduStack</span>
          </div>
        </Link>
      </div>

      <div className="px-3 pb-3">
        <div className="h-px bg-gray-100 dark:bg-white/5" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-4">
        {Menu.map((item, i) => {
          const Icon = item.icon;
          const isActive = path === item.path;
          return (
            <Link href={item.path} key={item.id}>
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.25 }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer group
                  ${isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                    : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/60 hover:text-gray-900 dark:hover:text-slate-200"
                  }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-full"
                  />
                )}
                <Icon
                  size={17}
                  className={isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300"
                  }
                />
                <span>{item.name}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      {courseCount >= 3 && (
        <div className="mx-3 mb-3">
          <Link href="/dashboard/upgrade">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 p-3 cursor-pointer hover:opacity-95 transition-opacity">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
              <div className="relative flex items-center gap-2">
                <HiOutlineSparkles size={15} className="text-white flex-none" />
                <div>
                  <p className="text-white text-xs font-semibold">Upgrade to Pro</p>
                  <p className="text-white/60 text-[10px]">Unlimited AI courses</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Usage */}
      <div className="px-5 py-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">Course usage</span>
          <span className="text-xs font-semibold text-gray-600 dark:text-slate-400">{courseCount}/{maxCourses}</span>
        </div>
        <Progress value={pct} className="h-1.5" />
        {courseCount < 3 && (
          <Link href="/dashboard/upgrade">
            <p className="text-[11px] text-gray-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mt-2.5 cursor-pointer">
              Upgrade for unlimited →
            </p>
          </Link>
        )}
      </div>
    </motion.aside>
  );
}

export default SideBar;
