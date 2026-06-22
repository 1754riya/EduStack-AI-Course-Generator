"use client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { HiChevronDoubleLeft, HiArrowLeft, HiBars3, HiAcademicCap } from "react-icons/hi2";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";
import React, { useState, useEffect } from "react";
import { db } from "@/configs/db";
import { Chapters, courselist } from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

function CourseStart({ params }) {
  const Params = React.use(params);
  const [course, setCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedChapterContent, setSelectedChapterContent] = useState(null);
  const [handleSidebar, setHandleSidebar] = useState(false);
  const [courseLoading, setCourseLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const { toast } = useToast();

  const getChapters = (courseOutput) =>
    courseOutput?.Chapters ?? courseOutput?.chapters ?? [];

  useEffect(() => {
    if (Params) GetCourse();
  }, [Params]);

  useEffect(() => {
    const chapters = getChapters(course?.courseOutput);
    if (course && chapters.length > 0) {
      setSelectedChapter(chapters[0]);
      GetSelectedChapterContent(0);
    }
  }, [course]);

  useEffect(() => {
    setHandleSidebar(false);
  }, [selectedChapter]);

  const GetCourse = async () => {
    setCourseLoading(true);
    try {
      const result = await db.select().from(courselist).where(eq(courselist.courseId, Params?.courseId));
      if (result.length > 0) setCourse(result[0]);
    } catch {
      toast({ variant: "destructive", duration: 3000, title: "Uh oh! Something went wrong.", description: "There was a problem loading the course." });
    } finally {
      setCourseLoading(false);
    }
  };

  const GetSelectedChapterContent = async (chapterId) => {
    setContentLoading(true);
    try {
      const result = await db.select().from(Chapters).where(
        and(eq(Chapters.courseId, Params?.courseId), eq(Chapters.chapterId, String(chapterId)))
      );
      setSelectedChapterContent(result.length > 0 ? result[0] : null);
    } catch {
      toast({ variant: "destructive", title: "Uh oh! Something went wrong.", description: "There was a problem loading chapter content." });
    } finally {
      setContentLoading(false);
    }
  };

  const chapters = getChapters(course?.courseOutput);
  const courseName = course?.courseOutput?.CourseName ?? course?.courseOutput?.courseName ?? course?.name;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {handleSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setHandleSidebar(false)}
        />
      )}

      {/* Chapter sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#0D1117] border-r border-gray-100 dark:border-white/5 shadow-xl z-50 flex flex-col transition-transform duration-300
          ${handleSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between gap-3 p-4 bg-gradient-to-br from-indigo-600 to-violet-700 flex-none">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-none">
              <HiAcademicCap size={15} className="text-white" />
            </div>
            <span className="text-white font-semibold text-sm truncate">
              {courseLoading ? <Skeleton width={120} baseColor="rgba(255,255,255,0.15)" highlightColor="rgba(255,255,255,0.3)" /> : courseName}
            </span>
          </div>
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors flex-none"
            onClick={() => setHandleSidebar(false)}
          >
            <HiChevronDoubleLeft size={20} />
          </button>
        </div>

        {/* Back link */}
        <Link
          href={`/course/${Params?.courseId}`}
          className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 border-b border-gray-50 dark:border-white/5 transition-colors"
        >
          <HiArrowLeft size={13} />
          Back to course
        </Link>

        {/* Chapter list */}
        <div className="flex-1 overflow-y-auto">
          {courseLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-4 py-3 border-b border-gray-50">
                  <Skeleton height={16} width="80%" />
                  <Skeleton height={12} width="40%" className="mt-1" />
                </div>
              ))
            : chapters.map((chapter, index) => (
                <div
                  key={index}
                  className={`cursor-pointer transition-colors duration-150
                    ${selectedChapter === chapter
                      ? "bg-indigo-50 dark:bg-indigo-500/10 border-l-2 border-indigo-500 dark:border-indigo-400"
                      : "hover:bg-gray-50 dark:hover:bg-slate-800/60 border-l-2 border-transparent"
                    }`}
                  onClick={() => { setSelectedChapter(chapter); GetSelectedChapterContent(index); }}
                >
                  <ChapterListCard chapter={chapter} index={index} />
                </div>
              ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="md:ml-72">
        {/* Top bar (mobile) */}
        <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
          <button
            onClick={() => setHandleSidebar(true)}
            className="p-2 rounded-xl text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
          >
            <HiBars3 size={19} />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{courseName}</span>
        </div>

        <div className="p-4 sm:p-6 md:p-10">
          {contentLoading ? (
            <div className="space-y-4">
              <Skeleton height={32} width={280} />
              <Skeleton height={16} width="60%" />
              <Skeleton height={220} className="rounded-2xl mt-6" />
              <div className="mt-6 space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} height={120} className="rounded-xl" />)}
              </div>
            </div>
          ) : (
            <ChapterContent
              chapter={selectedChapter}
              content={selectedChapterContent}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseStart;
