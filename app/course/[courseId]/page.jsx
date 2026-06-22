"use client";
import ChapterList from "@/app/create-course/[courseId]/_components/ChapterList";
import CourseBasicInfo from "@/app/create-course/[courseId]/_components/CourseBasicInfo";
import CourseDetail from "@/app/create-course/[courseId]/_components/CourseDetail";
import Header from "@/app/dashboard/_components/Header";
import { db } from "@/configs/db";
import { courselist } from "@/configs/schema";
import { useToast } from "@/hooks/use-toast";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { HiOutlineSparkles } from "react-icons/hi2";

function Course({ params }) {
  const Params = React.use(params);
  const { toast } = useToast();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (Params) GetCourse();
  }, [Params]);

  const GetCourse = async () => {
    try {
      const result = await db.select().from(courselist).where(eq(courselist.courseId, Params?.courseId));

      if (result.length === 0) { setLoading(false); return; }

      if (result[0]?.publish === false) {
        router.replace("/dashboard");
        toast({ variant: "destructive", duration: 3000, title: "Course is not published yet." });
        return;
      }

      setCourse(result[0]);
    } catch {
      toast({ variant: "destructive", duration: 3000, title: "Uh oh! Something went wrong.", description: "There was a problem loading the course." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-8 pb-10 sm:pb-16 md:pb-20 pt-4 sm:pt-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-[280px] bg-gray-100 dark:bg-slate-800 rounded-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-slate-800 rounded-2xl" />)}
            </div>
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800 rounded-2xl" />)}
          </div>
        ) : course ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <CourseBasicInfo course={course} edit={false} refreshData={() => GetCourse()} />
            <CourseDetail course={course} />
            <ChapterList course={course} edit={false} />
            <div className="flex justify-center mt-10">
              <Link href={`/course/${course?.courseId}/start`}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200"
                >
                  <HiOutlineSparkles size={16} />
                  Start Learning
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-gray-500 dark:text-slate-400 text-sm">Course not found.</p>
            <Link href="/dashboard">
              <button className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                Go to Dashboard
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Course;
