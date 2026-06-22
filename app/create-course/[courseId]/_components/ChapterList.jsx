import React from "react";
import { HiOutlineClock, HiOutlineCheckCircle } from "react-icons/hi2";
import EditChapters from "./EditChapters";
import { motion } from "motion/react";

function ChapterList({ course, refreshData, edit = true }) {
  const chapters = course?.courseOutput?.Chapters ?? course?.courseOutput?.chapters ?? [];

  return (
    <div className="mt-5">
      <h2 className="text-lg font-bold text-gray-900 dark:text-slate-50 mb-3">Course Chapters</h2>
      <div className="flex flex-col gap-2">
        {chapters.map((chapter, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="group flex items-center gap-4 p-4 bg-white dark:bg-[#161B22] rounded-2xl border border-gray-100 dark:border-white/5 hover:border-indigo-100 dark:hover:border-indigo-500/20 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex-none w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-bold flex items-center justify-center shadow-sm shadow-indigo-500/20">
              {index + 1}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-slate-200 text-sm truncate">
                  {chapter?.ChapterName ?? chapter?.chapterName}
                </h3>
                {edit && (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <EditChapters course={course} index={index} refreshData={() => refreshData(true)} />
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                {chapter?.About ?? chapter?.about}
              </p>
              <div className="flex items-center gap-1 mt-1.5 text-indigo-500 dark:text-indigo-400">
                <HiOutlineClock size={12} />
                <span className="text-[11px] font-medium">{chapter?.Duration ?? chapter?.duration}</span>
              </div>
            </div>

            <HiOutlineCheckCircle size={20} className="flex-none text-gray-200 dark:text-slate-700 group-hover:text-indigo-200 dark:group-hover:text-indigo-400 transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
