import React from "react";
import {
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlinePlayCircle,
} from "react-icons/hi2";
import { motion } from "motion/react";

const STATS = [
  {
    icon: HiOutlineChartBar,
    label: "Skill Level",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    getValue: (c) => c?.level,
  },
  {
    icon: HiOutlineClock,
    label: "Duration",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    getValue: (c) => c?.courseOutput?.Duration ?? c?.courseOutput?.duration,
  },
  {
    icon: HiOutlineBookOpen,
    label: "Chapters",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    getValue: (c) => c?.courseOutput?.NoOfChapters ?? c?.courseOutput?.noOfChapters,
  },
  {
    icon: HiOutlinePlayCircle,
    label: "Videos",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-500/10",
    getValue: (c) => c?.includeVideo ?? "—",
  },
];

function CourseDetail({ course }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4"
    >
      {STATS.map((stat, i) => {
        const Icon = stat.icon;
        const value = stat.getValue(course);
        return (
          <div
            key={i}
            className="flex items-center gap-3 p-4 bg-white dark:bg-[#161B22] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-black/30 hover:shadow-md transition-shadow duration-200"
          >
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center flex-none`}>
              <Icon size={17} className={stat.color} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">{stat.label}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate">{value ?? "—"}</p>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

export default CourseDetail;
