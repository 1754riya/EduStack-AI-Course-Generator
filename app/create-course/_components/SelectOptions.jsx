import React, { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UserInputContext } from "@/app/_context/UserInputContext";
import { HiOutlineChartBar, HiOutlineClock, HiOutlinePlayCircle, HiOutlineBookOpen } from "react-icons/hi2";
import { motion } from "motion/react";

const FIELD_META = [
  {
    key: "level",
    label: "Difficulty Level",
    icon: HiOutlineChartBar,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    type: "select",
    options: [
      { value: "Beginner", label: "Beginner" },
      { value: "Intermediate", label: "Intermediate" },
      { value: "Advance", label: "Advanced" },
    ],
    placeholder: "Select level",
  },
  {
    key: "duration",
    label: "Course Duration",
    icon: HiOutlineClock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    type: "select",
    options: [
      { value: "1 Hours", label: "1 Hour" },
      { value: "2 Hours", label: "2 Hours" },
      { value: "More than 3 Hours", label: "3+ Hours" },
    ],
    placeholder: "Select duration",
  },
  {
    key: "displayVideo",
    label: "Include Videos",
    icon: HiOutlinePlayCircle,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-500/10",
    type: "select",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
    placeholder: "Select option",
  },
  {
    key: "noOfChapters",
    label: "Number of Chapters",
    icon: HiOutlineBookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    type: "number",
    placeholder: "1–20",
  },
];

function SelectOptions() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const handleInputChange = (fieldName, value) => {
    setUserCourseInput((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {FIELD_META.map((field, i) => {
        const Icon = field.icon;
        return (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex flex-col gap-2"
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
              <div className={`w-6 h-6 rounded-lg ${field.bg} flex items-center justify-center flex-none`}>
                <Icon size={13} className={field.color} />
              </div>
              {field.label}
            </label>

            {field.type === "select" ? (
              <Select
                onValueChange={(value) => handleInputChange(field.key, value)}
                defaultValue={userCourseInput?.[field.key]}
              >
                <SelectTrigger className="h-11 rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 text-sm focus:ring-indigo-200 focus:border-indigo-400 dark:focus:border-indigo-500">
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {field.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type="number"
                min={1}
                max={20}
                placeholder={field.placeholder}
                defaultValue={userCourseInput?.noOfChapters}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="h-11 rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:placeholder:text-slate-500 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus-visible:ring-indigo-200/50"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default SelectOptions;
