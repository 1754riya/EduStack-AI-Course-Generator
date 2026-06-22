"use client";
import { db } from "@/configs/db";
import { courselist } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "../_components/CourseBasicInfo";
import { HiOutlineClipboardDocumentCheck, HiOutlineCheckCircle, HiOutlineArrowLeft, HiOutlineSparkles } from "react-icons/hi2";
import {
  EmailIcon,
  EmailShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { motion } from "motion/react";

function FinishScreen({ params }) {
  const Params = React.use(params);
  const { user, isLoaded } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (Params && isLoaded) GetCourse();
  }, [Params, isLoaded, user]);

  const GetCourse = async () => {
    try {
      let result;
      if (user?.primaryEmailAddress?.emailAddress) {
        result = await db.select().from(courselist).where(
          and(eq(courselist.courseId, Params?.courseId), eq(courselist.createdBy, user.primaryEmailAddress.emailAddress))
        );
      } else {
        result = await db.select().from(courselist).where(eq(courselist.courseId, Params?.courseId));
      }

      if (!result || result.length === 0) { setLoading(false); return; }

      if (result[0]?.publish === false) {
        router.replace("/create-course/" + Params?.courseId);
        toast({ variant: "destructive", duration: 3000, title: "Course is not published yet.", description: "Please complete the course generation process!" });
        return;
      }

      setCourse(result[0]);
    } catch {
      toast({ variant: "destructive", duration: 3000, title: "Uh oh! Something went wrong.", description: "There was a problem loading your course." });
    } finally {
      setLoading(false);
    }
  };

  const courseUrl = `${process.env.NEXT_PUBLIC_HOST_NAME}/course/${course?.courseId}`;
  const courseName = course?.courseOutput?.CourseName ?? course?.courseOutput?.courseName ?? course?.name;
  const shareTitle = `Check out this course: ${courseName}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <HiOutlineSparkles size={22} className="text-white" />
          </div>
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Course not found.</p>
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-10">

        {/* Success hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30 mb-4"
          >
            <HiOutlineCheckCircle size={30} className="text-white" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-50">Your course is ready!</h1>
          <p className="text-gray-400 dark:text-slate-500 mt-2 text-sm">Share it or start learning right away.</p>
        </motion.div>

        {/* Course info card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <CourseBasicInfo course={course} refreshData={() => GetCourse()} edit={false} />
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 sm:gap-3 mt-5"
        >
          <Link href="/dashboard" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 transition-all">
              <HiOutlineArrowLeft size={15} />
              Dashboard
            </button>
          </Link>
          <Link href={`/course/${course?.courseId}/start`} className="flex-1">
            <button className="w-full py-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 transition-all">
              Start Learning →
            </button>
          </Link>
        </motion.div>

        {/* Share URL box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 bg-white dark:bg-[#161B22] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-black/30 p-4 sm:p-5"
        >
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Course Link</p>
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 rounded-xl px-4 py-3 border border-gray-100 dark:border-slate-700/50">
            <span className="text-sm text-gray-500 dark:text-slate-400 truncate flex-1">{courseUrl}</span>
            <button
              onClick={async () => { await navigator.clipboard.writeText(courseUrl); toast({ duration: 2000, title: "Link copied!" }); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors flex-none"
            >
              <HiOutlineClipboardDocumentCheck size={14} />
              Copy
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
            <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">Share via</span>
            <div className="flex gap-2">
              <WhatsappShareButton title={shareTitle} url={courseUrl} separator=" — ">
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <EmailShareButton url={courseUrl} subject={`Course: ${courseName}`} body={shareTitle} separator=" — ">
                <EmailIcon size={32} round />
              </EmailShareButton>
              <LinkedinShareButton title={shareTitle} summary="Created on EduStack — AI Course Generator" url={courseUrl}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default FinishScreen;
