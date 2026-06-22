"use client";
import { motion, useReducedMotion } from "motion/react";
import React from "react";
import AIMascot from "./AIMascot";

const PARTICLES = [
  { size: 3, x: "8%",  delay: 0,   dur: 7,   op: 0.5 },
  { size: 2, x: "20%", delay: 1.5, dur: 9,   op: 0.4 },
  { size: 4, x: "35%", delay: 0.8, dur: 8,   op: 0.45 },
  { size: 2, x: "55%", delay: 2.2, dur: 10,  op: 0.35 },
  { size: 3, x: "70%", delay: 0.4, dur: 7.5, op: 0.5 },
  { size: 2, x: "82%", delay: 1.8, dur: 8.5, op: 0.4 },
  { size: 3, x: "93%", delay: 3.1, dur: 9,   op: 0.35 },
  { size: 2, x: "47%", delay: 2.8, dur: 6.5, op: 0.3 },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 0.61, 0.36, 1] },
  },
};

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-0 lg:min-h-[calc(100vh-64px)] flex items-center">

      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none select-none">

        {/* Subtle grid mesh */}
        <div className="absolute inset-0 hero-grid" />

        {/* Radial gradient washes */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(99,102,241,0.10), transparent 65%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 45% at 85% 90%, rgba(139,92,246,0.08), transparent 65%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 40% at 10% 80%, rgba(99,102,241,0.06), transparent 65%)" }} />

        {/* Blob 1 — top right */}
        <motion.div
          className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-indigo-300/20 blur-[96px]"
          animate={reduced ? {} : { scale: [1, 1.09, 1], x: [0, 18, 0], y: [0, -14, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Blob 2 — bottom left */}
        <motion.div
          className="absolute -bottom-40 -left-40 w-[440px] h-[440px] rounded-full bg-violet-300/20 blur-[80px]"
          animate={reduced ? {} : { scale: [1, 1.11, 1], x: [0, -12, 0], y: [0, 18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Blob 3 — center behind heading */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-64 rounded-full bg-indigo-200/20 blur-3xl"
          animate={reduced ? {} : { scale: [1, 1.07, 1], y: [0, 14, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Decorative orbiting ring 1 */}
        <motion.div
          className="absolute left-[4%] top-[16%] w-16 h-16 rounded-full border border-indigo-200/40"
          animate={reduced ? {} : { rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />

        {/* Decorative orbiting ring 2 */}
        <motion.div
          className="absolute left-[6%] bottom-[22%] w-10 h-10 rounded-full border border-violet-200/35"
          animate={reduced ? {} : { rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating accent dots */}
        <motion.div
          className="absolute left-[22%] top-[28%] w-2.5 h-2.5 rounded-full bg-indigo-400/35"
          animate={reduced ? {} : { y: [0, -10, 0], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[14%] top-[65%] w-2 h-2 rounded-full bg-violet-400/35"
          animate={reduced ? {} : { y: [0, -8, 0], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Rising particles */}
        {!reduced && PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 rounded-full bg-indigo-400"
            style={{ left: p.x, width: p.size, height: p.size }}
            animate={{ y: [0, -520], opacity: [0, p.op, p.op, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear", times: [0, 0.08, 0.92, 1] }}
          />
        ))}
      </div>

      {/* ── Two-column content ── */}
      <div className="relative z-10 mx-auto max-w-screen-xl px-6 w-full flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-8">

        {/* ── Left: text content ── */}
        <motion.div
          className="flex-1 max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
          variants={container}
          initial={reduced ? "visible" : "hidden"}
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={item} className="mb-6 flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-600 tracking-widest uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Powered by Gemini AI
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            className="text-3xl font-extrabold sm:text-5xl leading-[1.15] tracking-tight"
          >
            <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              AI Course Generator
            </span>
            <strong className="mt-2 block font-extrabold text-gray-900 leading-tight">
              Custom Learning Paths,
              <br className="hidden sm:block" /> Powered by AI.
            </strong>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="mt-5 text-base sm:text-lg text-gray-500 leading-relaxed max-w-md mx-auto lg:mx-0"
          >
            Unlock personalized education with our AI-powered course generator.
            Tailor your learning path to your goals and interests.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap justify-center lg:justify-start gap-4"
          >
            <motion.a
              href="/dashboard"
              className="relative overflow-hidden inline-flex items-center justify-center w-full sm:w-auto rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-10 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/45 transition-shadow duration-300 group"
              whileHover={reduced ? {} : { y: -3, scale: 1.03 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span className="relative z-10">Get Started</span>
              {/* Shine sweep */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-700 ease-in-out" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* ── Right: AI mascot ── */}
        <motion.div
          className="flex-1 flex justify-center lg:justify-end items-center"
          initial={reduced ? { opacity: 1 } : { opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <AIMascot />
        </motion.div>
      </div>
    </section>
  );
}
