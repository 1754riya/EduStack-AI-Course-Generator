"use client";
import { db } from "@/configs/db";
import { courselist } from "@/configs/schema";
import React, { useEffect, useState } from "react";
import CourseCard from "../_components/CourseCard";
import { desc, eq } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";
import { HiOutlineGlobeAlt } from "react-icons/hi2";

function Explore() {
  const [courselistData, setCourselistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    GetAllCourses();
  }, []);

  const GetAllCourses = async () => {
    setLoading(true);
    try {
      const result = await db.select().from(courselist).where(eq(courselist.publish, true)).orderBy(desc(courselist.id));
      setCourselistData(result);
    } catch {
      toast({ variant: "destructive", duration: 3000, title: "Uh oh! Something went wrong.", description: "There was a problem loading courses." });
    } finally {
      setLoading(false);
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="flex items-center gap-2 mb-1">
        <HiOutlineGlobeAlt size={20} className="text-gray-400 dark:text-slate-500" />
        <h2 className="font-bold text-gray-900 dark:text-slate-100 text-xl sm:text-2xl">Explore Courses</h2>
      </div>
      <p className="text-sm text-gray-400 dark:text-slate-500 mb-8">
        Discover AI-generated courses created by the community.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : courselistData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courselistData.map((course, index) => (
            <CourseCard key={course.courseId ?? index} course={course} refreshData={GetAllCourses} displayUser={true} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 rounded-2xl
            border border-dashed border-gray-200 dark:border-slate-700/50
            bg-gray-50 dark:bg-slate-900/50"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
            <HiOutlineGlobeAlt size={28} className="text-gray-400 dark:text-slate-500" />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-slate-300 text-base mb-1">No published courses yet</h3>
          <p className="text-sm text-gray-400 dark:text-slate-500 text-center max-w-xs">
            Be the first to create and publish an AI-powered course.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Explore;
