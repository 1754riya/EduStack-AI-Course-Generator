"use client";
import React from "react";
import { HiOutlineBookOpen, HiEllipsisVertical } from "react-icons/hi2";
import DropdownOption from "./DropdownOption";
import { db } from "@/configs/db";
import { Chapters, courselist } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/configs/firebaseConfig";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";
import Image from "next/image";

/* ── Category visual identities ─────────────────────────────────── */
const CATEGORY_CONFIG = {
  Programming: {
    gradient: "from-violet-600 via-indigo-600 to-blue-700",
    icon: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-25 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20,28 8,40 20,52" /><polyline points="60,28 72,40 60,52" /><line x1="46" y1="20" x2="34" y2="60" />
      </svg>
    ),
  },
  Development: {
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    icon: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-25 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="16" width="56" height="40" rx="4" /><line x1="24" y1="64" x2="56" y2="64" /><line x1="40" y1="56" x2="40" y2="64" />
        <polyline points="26,32 34,40 26,48" /><line x1="38" y1="48" x2="50" y2="48" />
      </svg>
    ),
  },
  Interview: {
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    icon: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-25 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 16c-13.3 0-24 8.7-24 19.4 0 6 3.3 11.4 8.5 15L22 62l12-6a28 28 0 006 .6c13.3 0 24-8.7 24-19.3S53.3 16 40 16z" />
        <line x1="30" y1="34" x2="50" y2="34" /><line x1="30" y1="42" x2="44" y2="42" />
      </svg>
    ),
  },
  Deployment: {
    gradient: "from-sky-500 via-blue-600 to-indigo-700",
    icon: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-25 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 14L28 38h24L40 14z" /><line x1="40" y1="38" x2="40" y2="58" />
        <line x1="28" y1="58" x2="52" y2="58" />
      </svg>
    ),
  },
};
const DEFAULT_CONFIG = {
  gradient: "from-slate-600 via-slate-700 to-slate-800",
  icon: (
    <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-25 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 16h40a4 4 0 014 4v32a4 4 0 01-4 4H20a4 4 0 01-4-4V20a4 4 0 014-4z" />
      <line x1="28" y1="30" x2="52" y2="30" /><line x1="28" y1="38" x2="52" y2="38" /><line x1="28" y1="46" x2="40" y2="46" />
    </svg>
  ),
};

const LEVEL_STYLES = {
  Beginner: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/20",
  Intermediate: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-500/20",
  Advanced: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-500/20",
  Advance: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-500/20",
};

function CourseCard({ course, refreshData, displayUser = false, index = 0 }) {
  const { toast } = useToast();

  const handleOnDelete = async () => {
    try {
      if (course?.courseBanner !== "/placeholder.png") {
        const filePath = course?.courseBanner
          .replace("https://firebasestorage.googleapis.com/v0/b/edustack-ai-course-generator.firebasestorage.app/o/", "")
          .split("?")[0];
        await deleteObject(ref(storage, decodeURIComponent(filePath)));
      }
      const courseResponse = await db.delete(courselist).where(eq(courselist.id, course?.id)).returning({ id: courselist?.id });
      const chapterResponse = await db.delete(Chapters).where(eq(Chapters.courseId, course?.courseId)).returning({ id: Chapters?.id });
      if (courseResponse && chapterResponse) {
        refreshData();
        toast({ variant: "success", duration: 3000, title: "Course deleted successfully." });
      }
    } catch {
      toast({ variant: "destructive", duration: 3000, title: "Couldn't delete course.", description: "Try again." });
    }
  };

  const cfg = CATEGORY_CONFIG[course?.category] ?? DEFAULT_CONFIG;
  const courseName = course?.courseOutput?.CourseName ?? course?.courseOutput?.courseName ?? course?.name ?? "Untitled Course";
  const chapterCount = course?.courseOutput?.NoOfChapters ?? course?.courseOutput?.noOfChapters ?? 0;
  const level = course?.level ?? "";
  const levelStyle = LEVEL_STYLES[level] ?? "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 ring-1 ring-gray-200 dark:ring-slate-600";
  const hasCustomBanner = course?.courseBanner && course.courseBanner !== "/placeholder.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative
        bg-white dark:bg-[#161B22]
        rounded-2xl
        border border-gray-100/80 dark:border-white/5
        shadow-sm dark:shadow-black/30
        hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/15 dark:hover:border-indigo-500/20
        hover:-translate-y-1.5
        cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Visual header */}
      <Link
        href={course?.publish ? `/course/${course.courseId}` : `/create-course/${course?.courseId}`}
        className="block relative overflow-hidden flex-none"
      >
        {hasCustomBanner ? (
          <Image src={course.courseBanner} alt={courseName} width={400} height={200}
            className="w-full h-[140px] sm:h-[160px] md:h-[170px] object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className={`relative w-full h-[140px] sm:h-[160px] md:h-[170px] bg-gradient-to-br ${cfg.gradient} flex items-center justify-center overflow-hidden`}>
            <div className="absolute inset-0"
              style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="relative z-10 flex flex-col items-center gap-2">
              {cfg.icon}
              <span className="text-white/80 text-xs font-medium tracking-widest uppercase">
                {course?.category ?? "Course"}
              </span>
            </div>
          </div>
        )}
        {!displayUser && course?.publish === false && (
          <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide">
            DRAFT
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-gray-900 dark:text-slate-100 text-sm leading-snug line-clamp-2 flex-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
            {courseName}
          </h2>
          {!displayUser && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-none">
              <DropdownOption courseId={course?.courseId} handleOnDelete={() => handleOnDelete()}>
                <div className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300">
                  <HiEllipsisVertical size={15} />
                </div>
              </DropdownOption>
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-400 dark:text-slate-600 font-medium -mt-1 uppercase tracking-wider">
          {course?.category}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap mt-auto">
          <span className="flex items-center gap-1 text-[11px] font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full ring-1 ring-indigo-100 dark:ring-indigo-500/20">
            <HiOutlineBookOpen size={11} />
            {chapterCount} {chapterCount === 1 ? "Chapter" : "Chapters"}
          </span>
          {level && (
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${levelStyle}`}>
              {level}
            </span>
          )}
        </div>

        {displayUser && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-white/5">
            <Image src={course?.userProfileImage} width={20} height={20} alt="author"
              className="rounded-full ring-2 ring-white dark:ring-slate-700 shadow-sm object-cover" />
            <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium truncate">{course?.userName}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CourseCard;
