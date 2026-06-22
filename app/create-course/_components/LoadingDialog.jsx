import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion } from "motion/react";
import { HiOutlineSparkles } from "react-icons/hi2";

function LoadingDialog({ loading }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="max-w-sm border-0 shadow-2xl rounded-3xl bg-white dark:bg-[#161B22] p-0 overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <VisuallyHidden>Generating Course</VisuallyHidden>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="relative flex flex-col items-center gap-6 p-10">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 dark:from-indigo-950/40 dark:via-[#161B22] dark:to-violet-950/30 pointer-events-none" />

              {/* Icon + spinner */}
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                  <HiOutlineSparkles size={28} className="text-white" />
                </div>
                <div className="absolute -inset-2">
                  <svg className="w-20 h-20 animate-spin" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="36" stroke="url(#spinGrad)" strokeWidth="3.5" strokeLinecap="round"
                      strokeDasharray="56 170" />
                    <defs>
                      <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity="1" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Text */}
              <div className="relative z-10 text-center">
                <h3 className="text-base font-bold text-gray-900 dark:text-slate-50">Generating your course</h3>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">AI is crafting the perfect curriculum…</p>
              </div>

              {/* Animated dots */}
              <div className="relative z-10 flex items-center gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.18, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LoadingDialog;
