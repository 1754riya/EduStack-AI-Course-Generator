"use client";
import { UsercourselistContext } from "@/app/_context/UserCourseListContext";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useContext } from "react";
import { HiOutlineSparkles, HiArrowRight } from "react-icons/hi2";
import { motion } from "motion/react";

function AddCourse() {
  const { user } = useUser();
  const { usercourselist } = useContext(UsercourselistContext);

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "there";
  const isAtLimit = usercourselist?.length >= 5;
  const courseCount = usercourselist?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-4 sm:p-6 md:p-7 text-white shadow-xl shadow-indigo-500/20"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      {/* Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-20 w-48 h-48 bg-violet-400/20 rounded-full translate-y-20 blur-2xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <HiOutlineSparkles size={13} className="text-white" />
            </div>
            <span className="text-white/70 text-xs font-medium tracking-widest uppercase">AI Course Generator</span>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
            Good to see you, {firstName}
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-1.5">
            {courseCount === 0
              ? "Create your first AI-powered course in minutes."
              : `You've created ${courseCount} of 5 courses. Keep building.`}
          </p>
        </div>

        <Link href={isAtLimit ? "/dashboard/upgrade" : "/create-course"} className="flex-none">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-white text-indigo-600 font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 transition-all duration-200 whitespace-nowrap"
          >
            <HiOutlineSparkles size={15} />
            {isAtLimit ? "Upgrade Plan" : "Create AI Course"}
            <HiArrowRight size={14} />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

export default AddCourse;
