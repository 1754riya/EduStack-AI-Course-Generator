"use client";
import { UserInputContext } from "@/app/_context/UserInputContext";
import React, { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { HiOutlineCheckCircle } from "react-icons/hi2";

const CATEGORY_VISUALS = {
  Programming: {
    gradient: "from-violet-500 to-indigo-600",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <polyline points="10,14 4,20 10,26" /><polyline points="30,14 36,20 30,26" /><line x1="23" y1="10" x2="17" y2="30" />
      </svg>
    ),
  },
  Development: {
    gradient: "from-emerald-400 to-teal-600",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="4" y="7" width="32" height="22" rx="3" /><line x1="12" y1="33" x2="28" y2="33" /><line x1="20" y1="29" x2="20" y2="33" />
        <polyline points="12,16 17,20 12,24" /><line x1="19" y1="24" x2="27" y2="24" />
      </svg>
    ),
  },
  Interview: {
    gradient: "from-orange-400 to-rose-500",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M20 6c-8 0-14 5-14 11 0 3.6 2 6.8 5 9l-1 8 7.5-3.5A17 17 0 0020 32c8 0 14-5 14-11S28 6 20 6z" />
        <line x1="14" y1="17" x2="26" y2="17" /><line x1="14" y1="22" x2="22" y2="22" />
      </svg>
    ),
  },
  Deployment: {
    gradient: "from-sky-400 to-blue-600",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M20 5L12 19h16L20 5z" /><line x1="20" y1="19" x2="20" y2="31" />
        <line x1="12" y1="31" x2="28" y2="31" />
      </svg>
    ),
  },
  Others: {
    gradient: "from-slate-400 to-slate-600",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="20" cy="20" r="14" /><line x1="20" y1="14" x2="20" y2="20" /><circle cx="20" cy="26" r="1" fill="currentColor" />
      </svg>
    ),
  },
};
const DEFAULT_VISUAL = { gradient: "from-gray-400 to-gray-600", icon: null };

function SelectCategory() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
  const [inputCategory, setInputCategory] = useState("");

  const handleCategoryChange = (category, active) => {
    setUserCourseInput((prev) => ({ ...prev, category, activeInput: active }));
  };

  const CATEGORIES = ["Programming", "Development", "Interview", "Deployment", "Others"];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CATEGORIES.map((name, i) => {
          const viz = CATEGORY_VISUALS[name] ?? DEFAULT_VISUAL;
          const selected = userCourseInput?.category === name && !(name === "Others" && !userCourseInput?.activeInput);
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleCategoryChange(name, false)}
              className={`relative group flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200
                ${selected
                  ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 shadow-md shadow-indigo-500/15"
                  : "border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-indigo-200 dark:hover:border-slate-600 hover:shadow-md hover:shadow-gray-900/5"
                }`}
            >
              {selected && (
                <span className="absolute top-2.5 right-2.5">
                  <HiOutlineCheckCircle size={16} className="text-indigo-600 dark:text-indigo-400" />
                </span>
              )}
              <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${viz.gradient} flex items-center justify-center text-white shadow-md transition-transform duration-200 group-hover:scale-110`}>
                {viz.icon}
              </div>
              <span className={`text-xs sm:text-sm font-semibold transition-colors ${selected ? "text-indigo-700 dark:text-indigo-400" : "text-gray-700 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-slate-100"}`}>
                {name}
              </span>
            </motion.div>
          );
        })}
      </div>

      {userCourseInput?.category === "Others" && !userCourseInput?.activeInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 flex gap-2 items-center"
        >
          <Input
            placeholder="Enter your category..."
            className="h-11 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-200"
            onChange={(e) => setInputCategory(e.target.value)}
          />
          <button
            disabled={inputCategory.length <= 0}
            onClick={() => handleCategoryChange(inputCategory, true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold disabled:opacity-40 hover:bg-indigo-700 transition-colors"
          >
            Save
          </button>
        </motion.div>
      )}

      {userCourseInput?.activeInput && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 flex items-center gap-3 p-3.5 rounded-2xl border-2 border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${DEFAULT_VISUAL.gradient} flex items-center justify-center text-white flex-none`}>
            <HiOutlineCheckCircle size={18} />
          </div>
          <div>
            <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">Custom Category</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{userCourseInput?.category}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default SelectCategory;
