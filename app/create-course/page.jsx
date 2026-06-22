"use client";
import React, { useContext, useState } from "react";
import { HiOutlineSquares2X2, HiOutlineLightBulb, HiOutlineAdjustmentsHorizontal, HiOutlineCheckCircle } from "react-icons/hi2";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOptions from "./_components/SelectOptions";
import { UserInputContext } from "../_context/UserInputContext";
import { GenerateCourseLayout_AI } from "@/configs/AiModel";
import LoadingDialog from "./_components/LoadingDialog";
import { db } from "@/configs/db";
import { courselist } from "@/configs/schema";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";

const STEPS = [
  { id: 1, name: "Category", description: "Pick a domain", icon: HiOutlineSquares2X2 },
  { id: 2, name: "Topic", description: "Define your course", icon: HiOutlineLightBulb },
  { id: 3, name: "Options", description: "Customize settings", icon: HiOutlineAdjustmentsHorizontal },
];

function CreateCourse() {
  const [loading, setLoading] = useState(false);
  const { userCourseInput } = useContext(UserInputContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const checkStatus = () => {
    if (activeIndex === 0 && (!userCourseInput?.category || userCourseInput?.category === "Others")) return true;
    if (activeIndex === 1 && !userCourseInput?.topic) return true;
    if (activeIndex === 2 && (!userCourseInput?.level || !userCourseInput?.displayVideo ||
      !userCourseInput?.noOfChapters || !userCourseInput?.duration ||
      userCourseInput.noOfChapters < 1 || userCourseInput.noOfChapters > 20)) return true;
    return false;
  };

  const SaveCourseLayoutInDB = async (courseLayout) => {
    if (!courseLayout) throw new Error("Course layout is undefined or null");
    if (!user?.primaryEmailAddress?.emailAddress) throw new Error("User email is required");
    const id = uuid4();
    await db.insert(courselist).values({
      courseId: id,
      name: userCourseInput.topic || "",
      category: userCourseInput.category || "",
      level: userCourseInput.level || "",
      includeVideo: userCourseInput.displayVideo ? "Yes" : "No",
      courseOutput: courseLayout,
      createdBy: user.primaryEmailAddress.emailAddress,
      username: user.fullName || "",
      userProfileImage: user.imageUrl || "",
    });
    router.replace(`/create-course/${id}`);
  };

  const GenerateCourseLayout = async () => {
    try {
      setLoading(true);
      const PROMPT =
        "Generate A Course Tutorial on Following Details With field as Course Name, Description, Along with Chapter Name, about, Duration:\n" +
        `Category: ${userCourseInput?.category}, Topic: ${userCourseInput?.topic}, Level: ${userCourseInput?.level}, Duration: ${userCourseInput?.duration}, NoOfChapters: ${userCourseInput?.noOfChapters}, in JSON format`;
      const result = await GenerateCourseLayout_AI.sendMessage(PROMPT);
      const parsedLayout = JSON.parse(result.response.text());
      await SaveCourseLayoutInDB(parsedLayout);
    } catch (error) {
      toast({ variant: "destructive", duration: 5000, title: "Generation Error", description: error?.message ?? "Failed to generate course layout" });
    } finally {
      setLoading(false);
    }
  };

  const stepContent = [<SelectCategory key="cat" />, <TopicDescription key="topic" />, <SelectOptions key="opts" />];

  return (
    <div className="min-h-screen bg-background">
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
      <LoadingDialog loading={loading} />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 ring-1 ring-indigo-100 dark:ring-indigo-500/20">
            <HiOutlineLightBulb size={13} />
            AI Course Generator
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-50 tracking-tight">
            Create a New Course
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
            Answer a few questions and our AI will build a complete course for you.
          </p>
        </motion.div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8 sm:mb-10 md:mb-12 px-2">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const done = activeIndex > i;
            const active = activeIndex === i;
            return (
              <React.Fragment key={step.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm
                    ${done
                      ? "bg-indigo-600 shadow-indigo-500/30"
                      : active
                        ? "bg-indigo-600 shadow-indigo-500/30 ring-4 ring-indigo-100 dark:ring-indigo-500/20"
                        : "bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700"
                    }`}
                  >
                    {done
                      ? <HiOutlineCheckCircle size={16} className="text-white" />
                      : <Icon size={15} className={active ? "text-white" : "text-gray-400 dark:text-slate-500"} />
                    }
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium hidden xs:block
                    ${active ? "text-indigo-700 dark:text-indigo-400" : done ? "text-gray-600 dark:text-slate-400" : "text-gray-400 dark:text-slate-600"}`}
                  >
                    {step.name}
                  </span>
                </motion.div>

                {i < STEPS.length - 1 && (
                  <div className="flex-1 mx-2 sm:mx-3 h-0.5 max-w-[60px] sm:max-w-[80px] rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: activeIndex > i ? "100%" : "0%" }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="h-full bg-indigo-500"
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step card */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white dark:bg-[#161B22]
            rounded-2xl sm:rounded-3xl
            border border-gray-100 dark:border-white/5
            shadow-xl shadow-gray-900/5 dark:shadow-black/40
            p-4 sm:p-6 md:p-10 mb-5 sm:mb-6 md:mb-8"
        >
          <div className="mb-5 sm:mb-7">
            <span className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold uppercase tracking-widest">
              Step {activeIndex + 1} of {STEPS.length}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-slate-50 mt-1">{STEPS[activeIndex].name}</h2>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-slate-500 mt-0.5">{STEPS[activeIndex].description}</p>
          </div>
          {stepContent[activeIndex]}
        </motion.div>

        {/* Navigation */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: activeIndex === 0 ? 1 : 1.02 }}
            whileTap={{ scale: activeIndex === 0 ? 1 : 0.98 }}
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex(activeIndex - 1)}
            className="flex items-center justify-center px-5 py-3 sm:py-2.5 rounded-xl text-sm font-medium
              border border-gray-200 dark:border-slate-700
              text-gray-600 dark:text-slate-400
              hover:bg-gray-50 dark:hover:bg-slate-800
              hover:border-gray-300 dark:hover:border-slate-600
              disabled:opacity-30 disabled:cursor-not-allowed
              w-full sm:w-auto"
          >
            Back
          </motion.button>

          {activeIndex < STEPS.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setActiveIndex(activeIndex + 1)}
              disabled={checkStatus()}
              className="flex items-center justify-center px-6 py-3 sm:py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              Continue
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={checkStatus()}
              onClick={GenerateCourseLayout}
              className="flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <HiOutlineLightBulb size={15} />
              Generate Course
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;
