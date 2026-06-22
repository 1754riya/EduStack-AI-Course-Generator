import { UserInputContext } from "@/app/_context/UserInputContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useContext } from "react";
import { HiOutlineLightBulb, HiOutlineDocumentText } from "react-icons/hi2";
import { motion } from "motion/react";

function TopicDescription() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const handleInputChange = (fieldName, value) => {
    setUserCourseInput((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col gap-2"
      >
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <HiOutlineLightBulb size={13} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          Course Topic
          <span className="text-red-400">*</span>
        </label>
        <p className="text-xs text-gray-400 dark:text-slate-500 -mt-1">What subject would you like the AI to teach?</p>
        <Input
          placeholder="e.g. React for Beginners, Python Data Science, SDE Interview Prep..."
          className="h-12 rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:placeholder:text-slate-500 text-sm placeholder:text-gray-300 focus:border-indigo-400 dark:focus:border-indigo-500 focus-visible:ring-indigo-200/50 focus-visible:ring-2"
          defaultValue={userCourseInput?.topic}
          onChange={(e) => handleInputChange("topic", e.target.value)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-2"
      >
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
          <div className="w-6 h-6 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
            <HiOutlineDocumentText size={13} className="text-gray-500 dark:text-slate-400" />
          </div>
          Additional Details
          <span className="text-gray-400 font-normal text-xs ml-1">(optional)</span>
        </label>
        <p className="text-xs text-gray-400 dark:text-slate-500 -mt-1">Describe what you'd like to cover, specific goals, or target audience.</p>
        <Textarea
          placeholder="e.g. Cover hooks, state management, and deployment. Target audience: junior developers transitioning to React..."
          className="min-h-[110px] rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:placeholder:text-slate-500 text-sm resize-none placeholder:text-gray-300 focus:border-indigo-400 dark:focus:border-indigo-500 focus-visible:ring-indigo-200/50 focus-visible:ring-2"
          defaultValue={userCourseInput?.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </motion.div>
    </div>
  );
}

export default TopicDescription;
