"use client";
import { db } from "@/configs/db";
import { courselist, Chapters } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import { GenerateChapterContent_AI } from "@/configs/AiModel";
import LoadingDialog from "../_components/LoadingDialog";
import getVideos from "@/configs/service";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { HiOutlineSparkles } from "react-icons/hi2";
import { motion } from "motion/react";

function CourseLayout({ params }) {
  const Params = React.use(params);
  const { user, isLoaded } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (Params && isLoaded && user) GetCourse();
  }, [Params, isLoaded, user]);

  const GetCourse = async () => {
    try {
      const result = await db.select().from(courselist).where(
        and(eq(courselist.courseId, Params?.courseId), eq(courselist.createdBy, user?.primaryEmailAddress?.emailAddress))
      );
      setCourse(result[0] ?? null);
    } catch {
      toast({ variant: "destructive", duration: 3000, title: "Uh oh! Something went wrong.", description: "There was a problem fetching your course." });
    }
  };

  const GenerateChapterContent = async () => {
    if (!course) return;
    setLoading(true);

    try {
      const chapters = course?.courseOutput?.Chapters ?? course?.courseOutput?.chapters ?? [];

      if (chapters.length === 0) throw new Error("No chapters found in course layout.");

      const includeVideo = course?.includeVideo;

      await db.delete(Chapters).where(eq(Chapters.courseId, course?.courseId));

      for (const [index, chapter] of chapters.entries()) {
        const chapterName = chapter?.ChapterName ?? chapter?.chapterName ?? `Chapter ${index + 1}`;

        const PROMPT = `Generate detailed content for the following topic in strict JSON format:
- Topic: ${course?.name}
- Chapter: ${chapterName}

The response must be a valid JSON object with this exact structure:
{
  "title": "Chapter title",
  "chapters": [
    {
      "title": "Subtopic title",
      "explanation": "Detailed explanation here.",
      "codeExample": "<precode>Code example here</precode>"
    }
  ]
}

Rules:
- Return ONLY valid JSON, no extra text
- codeExample should be an empty string if no code applies
- explanation should be detailed (3-5 sentences minimum)
- Include at least 3-5 subtopics per chapter`;

        const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
        const content = JSON.parse(result?.response?.text());

        let videoId = [];
        if (includeVideo === "Yes") {
          try {
            const resp = await getVideos(course?.name + ": " + chapterName);
            videoId = [resp[0]?.id?.videoId, resp[1]?.id?.videoId, resp[2]?.id?.videoId].filter(Boolean);
          } catch {
            videoId = [];
          }
        }

        await db.insert(Chapters).values({
          chapterId: String(index),
          courseId: course?.courseId,
          content: content,
          videoId: videoId,
        });

        toast({ duration: 2000, title: `Chapter ${index + 1} of ${chapters.length} generated` });
      }

      await db.update(courselist).set({ publish: true }).where(eq(courselist.courseId, course?.courseId));
      router.replace("/create-course/" + course?.courseId + "/finish");
    } catch (error) {
      toast({ variant: "destructive", duration: 5000, title: "Generation failed", description: error?.message || "An unexpected error occurred." });
      await GetCourse();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingDialog loading={loading} />
      <div className="min-h-screen bg-background">
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-5 sm:py-7 md:py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 ring-1 ring-indigo-100 dark:ring-indigo-500/20">
              <HiOutlineSparkles size={12} />
              AI Course Generator
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-50">Review Your Course</h1>
            <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Review the layout before generating full content.</p>
          </motion.div>

          <CourseBasicInfo course={course} refreshData={() => GetCourse()} />
          <CourseDetail course={course} />
          <ChapterList course={course} refreshData={() => GetCourse()} />

          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => GenerateChapterContent()}
              disabled={!course || loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <HiOutlineSparkles size={16} />
              Generate Course Content
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseLayout;
