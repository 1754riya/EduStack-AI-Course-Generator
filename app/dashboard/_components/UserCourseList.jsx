"use client";
import { db } from "@/configs/db";
import { courselist } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { UsercourselistContext } from "@/app/_context/UserCourseListContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";
import { HiOutlineAcademicCap, HiOutlinePlusCircle } from "react-icons/hi2";
import Link from "next/link";

function Usercourselist() {
  const [courselistData, setCourselistData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { setUsercourselist } = useContext(UsercourselistContext);
  const { user } = useUser();

  useEffect(() => {
    if (user) getUserCourses();
  }, [user]);

  const getUserCourses = async () => {
    setIsLoading(true);
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const result = await db.select().from(courselist).where(eq(courselist.createdBy, email)).orderBy(desc(courselist.id));
      setCourselistData(result);
      setUsercourselist(result);
      localStorage.setItem("usercourselist", JSON.stringify(result));
    } catch {
      toast({ variant: "destructive", duration: 3000, title: "Uh oh! Something went wrong.", description: "There was a problem loading your courses." });
    } finally {
      setIsLoading(false);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden animate-pulse">
      <div className="w-full h-[140px] sm:h-[160px] md:h-[170px] bg-gray-100 dark:bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full w-1/3" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 bg-gray-100 dark:bg-slate-800 rounded-full w-24" />
          <div className="h-6 bg-gray-100 dark:bg-slate-800 rounded-full w-20" />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mt-6 sm:mt-10"
    >
      <div className="flex items-center gap-2 mb-6">
        <HiOutlineAcademicCap size={20} className="text-gray-400 dark:text-slate-500" />
        <h2 className="font-semibold text-gray-800 dark:text-slate-200 text-lg">My Courses</h2>
        {!isLoading && courselistData.length > 0 && (
          <span className="ml-1 text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
            {courselistData.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : courselistData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courselistData.map((course, index) => (
            <CourseCard key={course.courseId ?? index} course={course} refreshData={getUserCourses} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-20 rounded-2xl
            border border-dashed border-gray-200 dark:border-slate-700/50
            bg-gray-50 dark:bg-slate-900/50"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
            <HiOutlineAcademicCap size={28} className="text-gray-400 dark:text-slate-500" />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-slate-300 text-base mb-1">No courses yet</h3>
          <p className="text-sm text-gray-400 dark:text-slate-500 mb-6 text-center max-w-xs">
            Create your first AI-powered course and start learning today.
          </p>
          <Link href="/create-course">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              <HiOutlinePlusCircle size={16} />
              Create Course
            </button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Usercourselist;
