import React, { useState } from "react";
import YouTube from "react-youtube";
import ReactMarkdown from "react-markdown";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import "./youtubeAdjustments.css";
import { motion } from "motion/react";
import { useToast } from "@/hooks/use-toast";

function ChapterContent({ chapter, content }) {
  const [selectedVideo, setSelectedVideo] = useState(0);
  const { toast } = useToast();

  const chapterName = chapter?.ChapterName ?? chapter?.chapterName ?? "";
  const chapterAbout = chapter?.About ?? chapter?.about ?? "";

  const getSubtopics = () => {
    if (!content?.content) return [];
    const c = content.content;
    if (Array.isArray(c.chapters)) return c.chapters;
    if (Array.isArray(c.content)) return c.content;
    if (Array.isArray(c.topics)) return c.topics;
    if (Array.isArray(c)) return c;
    return [];
  };

  const subtopics = getSubtopics();

  const videoIds = Array.isArray(content?.videoId)
    ? content.videoId.filter(Boolean)
    : content?.videoId
    ? [content.videoId]
    : [];

  const currentVideoId = videoIds[selectedVideo] ?? null;

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code.replace(/<\/?precode>/g, ""));
    toast({ duration: 2000, title: "Code copied!" });
  };

  return (
    <div className="max-w-3xl">
      {/* Chapter header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-50 leading-tight">{chapterName}</h1>
        {chapterAbout && (
          <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">{chapterAbout}</p>
        )}
      </motion.div>

      {/* YouTube video */}
      {currentVideoId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="my-6 rounded-2xl overflow-hidden shadow-xl shadow-gray-900/10 dark:shadow-black/30 border border-gray-100 dark:border-white/5"
        >
          <div className="video-responsive">
            <YouTube videoId={currentVideoId} opts={{ playerVars: { autoplay: 0 } }} />
          </div>
        </motion.div>
      )}

      {/* Video selector */}
      {videoIds.length > 1 && (
        <div className="flex gap-2 my-4 flex-wrap">
          {videoIds.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedVideo(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                ${selectedVideo === i
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                }`}
            >
              Video {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Subtopic cards */}
      <div className="mt-6 space-y-4">
        {subtopics.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-slate-500 text-sm">
            No content available for this chapter yet.
          </div>
        ) : (
          subtopics.map((item, i) => {
            const code = item?.codeExample ?? item?.CodeExample ?? "";
            const cleanCode = code.replace(/<\/?precode>/g, "").trim();
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[#161B22] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-black/30 overflow-hidden"
              >
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <span className="flex-none w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {item?.title ?? item?.Title ?? ""}
                  </h3>

                  <div className="prose prose-sm max-w-none text-gray-600 dark:text-slate-300 prose-headings:text-gray-900 dark:prose-headings:text-slate-100 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs">
                    <ReactMarkdown>
                      {item?.explanation ?? item?.Explanation ?? item?.description ?? ""}
                    </ReactMarkdown>
                  </div>

                  {cleanCode && (
                    <div className="relative mt-4 bg-[#0d1117] rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
                        <span className="text-[11px] font-medium text-gray-400">Code</span>
                        <button
                          onClick={() => copyCode(code)}
                          className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-white transition-colors"
                          title="Copy code"
                        >
                          <HiOutlineClipboardDocumentList size={14} />
                          Copy
                        </button>
                      </div>
                      <pre className="p-4 text-xs text-gray-200 overflow-auto whitespace-pre-wrap break-words leading-relaxed">
                        <code>{cleanCode}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ChapterContent;
