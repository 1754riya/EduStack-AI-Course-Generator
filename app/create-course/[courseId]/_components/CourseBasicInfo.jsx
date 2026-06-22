import Image from "next/image";
import React, { useState } from "react";
import { HiOutlineTag, HiOutlineCamera } from "react-icons/hi2";
import EditCourseBasicInfo from "./EditCourseBasicInfo";
import { storage } from "@/configs/firebaseConfig";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db } from "@/configs/db";
import { courselist } from "@/configs/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";

const CATEGORY_GRADIENT = {
  Programming: "from-violet-600 via-indigo-600 to-blue-700",
  Development: "from-emerald-500 via-teal-600 to-cyan-700",
  Interview: "from-orange-500 via-rose-500 to-pink-600",
  Deployment: "from-sky-500 via-blue-600 to-indigo-700",
};

function CourseBasicInfo({ course, refreshData, edit = true }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const { toast } = useToast();

  const onFileChanged = async (e) => {
    try {
      const file = e.target.files[0];
      setSelectedFile(URL.createObjectURL(file));

      if (course?.courseBanner !== "/placeholder.png") {
        const filePath = course?.courseBanner
          .replace("https://firebasestorage.googleapis.com/v0/b/edustack-ai-course-generator.firebasestorage.app/o/", "")
          .split("?")[0];
        await deleteObject(ref(storage, decodeURIComponent(filePath)));
      }

      const fileName = Date.now() + file.name;
      const storageRef = ref(storage, "ai-course/" + fileName);
      await uploadBytes(storageRef, file);
      toast({ variant: "success", duration: 3000, title: "Image uploaded successfully!" });
      const imageLink = await getDownloadURL(storageRef);
      await db.update(courselist).set({ courseBanner: imageLink }).where(eq(courselist.id, course?.id));
      refreshData(true);
    } catch {
      toast({ variant: "destructive", duration: 3000, title: "Upload failed.", description: "Please try again." });
    }
  };

  const courseName = course?.courseOutput?.CourseName ?? course?.courseOutput?.courseName ?? course?.name ?? "Untitled";
  const description = course?.courseOutput?.Description ?? course?.courseOutput?.description ?? "";
  const gradient = CATEGORY_GRADIENT[course?.category] ?? "from-slate-700 to-slate-900";
  const hasCustomBanner = selectedFile || (course?.courseBanner && course.courseBanner !== "/placeholder.png");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white dark:bg-[#161B22] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-black/30 overflow-hidden mt-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Info */}
        <div className="p-4 sm:p-6 md:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-2 mb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-50 leading-tight flex-1">
                {courseName}
              </h2>
              {edit && (
                <EditCourseBasicInfo
                  course={course}
                  size={50}
                  refreshData={() => refreshData(true)}
                />
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-4">
              {description}
            </p>

            <div className="flex items-center gap-2 mt-4">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-100 dark:ring-indigo-500/20 px-3 py-1.5 rounded-full">
                <HiOutlineTag size={12} />
                {course?.category}
              </span>
            </div>
          </div>

          {!edit && (
            <Link href={`/course/${course?.courseId}/start`} className="mt-6">
              <button className="w-full py-3 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 transition-all duration-200">
                Start Learning
              </button>
            </Link>
          )}
        </div>

        {/* Right: Image/Thumbnail */}
        <div className="relative">
          <label htmlFor={edit ? "upload-image" : undefined} className={edit ? "cursor-pointer group block h-full" : "block h-full"}>
            {hasCustomBanner ? (
              <Image
                src={selectedFile || course.courseBanner}
                alt="Course banner"
                width={600}
                height={340}
                quality={90}
                priority
                className="w-full h-full min-h-[220px] object-cover"
              />
            ) : (
              <div className={`relative w-full min-h-[220px] h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
                <div className="relative z-10 text-center text-white/80">
                  <p className="text-xs font-medium tracking-widest uppercase">{course?.category}</p>
                </div>
              </div>
            )}

            {/* Upload overlay */}
            {edit && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold px-4 py-2 rounded-xl shadow-lg">
                  <HiOutlineCamera size={16} />
                  Change Photo
                </div>
              </div>
            )}
          </label>
          {edit && (
            <input type="file" accept="image/*" id="upload-image" className="hidden" onChange={onFileChanged} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CourseBasicInfo;
