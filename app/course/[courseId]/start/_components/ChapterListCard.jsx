import React from "react";
import { HiOutlineClock } from "react-icons/hi2";

function ChapterListCard({ chapter, index }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-white/5">
      <div className="flex-none w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-bold flex items-center justify-center shadow-sm shadow-indigo-500/20">
        {index + 1}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-slate-200 leading-snug line-clamp-2">
          {chapter?.ChapterName ?? chapter?.chapterName}
        </p>
        <p className="flex items-center gap-1 text-[11px] text-indigo-500 dark:text-indigo-400 mt-0.5 font-medium">
          <HiOutlineClock size={11} />
          {chapter?.Duration ?? chapter?.duration}
        </p>
      </div>
    </div>
  );
}

export default ChapterListCard;
