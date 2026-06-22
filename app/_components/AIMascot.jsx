"use client";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

const MESSAGES = [
  { text: "🤖 What would you like to learn today?" },
  { text: "Let's build your roadmap." },
  { text: "Ready to master a new skill?" },
  { text: "AI-powered learning starts here." },
  { text: "Tell me your goal — I'll create a plan." },
];

const SPARKLES = [
  { size: 10, x: "6%",  y: "10%", delay: 0,    dur: 2.8 },
  { size: 8,  x: "88%", y: "8%",  delay: 0.9,  dur: 3.2 },
  { size: 11, x: "91%", y: "54%", delay: 1.6,  dur: 2.5 },
  { size: 8,  x: "4%",  y: "72%", delay: 0.4,  dur: 3.0 },
  { size: 10, x: "73%", y: "87%", delay: 1.2,  dur: 2.7 },
  { size: 7,  x: "40%", y: "2%",  delay: 2.1,  dur: 3.4 },
  { size: 9,  x: "16%", y: "85%", delay: 0.7,  dur: 2.9 },
];

function StarSparkle({ size, delay, dur, reduced }) {
  if (reduced) return null;
  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0], rotate: [0, 180] }}
      transition={{ duration: dur, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 0.5L7.1 4.9L11.5 6L7.1 7.1L6 11.5L4.9 7.1L0.5 6L4.9 4.9Z"
          fill="rgba(99,102,241,0.8)"
        />
      </svg>
    </motion.div>
  );
}

export default function AIMascot() {
  const [msgIndex, setMsgIndex] = useState(0);
  const reduced = useReducedMotion();
  const mascotRef = useRef(null);

  // Eye tracking springs
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const eyeX = useSpring(rawX, { stiffness: 80, damping: 18 });
  const eyeY = useSpring(rawY, { stiffness: 80, damping: 18 });

  // Cycle messages
  useEffect(() => {
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % MESSAGES.length), 3600);
    return () => clearInterval(id);
  }, []);

  // Follow cursor with eyes
  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      const el = mascotRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      rawX.set(dx * 5.5);
      rawY.set(dy * 4.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY, reduced]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">

      {/* ── Speech bubble ── */}
      <div className="relative h-16 flex items-end justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.94 }}
            transition={{ duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative bg-white/92 backdrop-blur-md border border-indigo-100/80 shadow-lg shadow-indigo-500/10 rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[230px]"
          >
            <p className="text-sm font-medium text-gray-700 leading-snug text-center">
              {MESSAGES[msgIndex].text}
            </p>
            {/* Downward tail */}
            <span className="absolute -bottom-[7px] left-6 block w-3.5 h-3.5 rotate-45 bg-white border-r border-b border-indigo-100" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Mascot orb ── */}
      <div ref={mascotRef} className="relative w-52 h-52 sm:w-60 sm:h-60 lg:w-72 lg:h-72">

        {/* Sparkle particles */}
        {SPARKLES.map((s, i) => (
          <div key={i} className="absolute pointer-events-none" style={{ left: s.x, top: s.y }}>
            <StarSparkle size={s.size} delay={s.delay} dur={s.dur} reduced={reduced} />
          </div>
        ))}

        {/* Energy pulse rings */}
        {!reduced && (
          <>
            <motion.div
              className="absolute rounded-full border border-indigo-300/30"
              style={{ inset: -14 }}
              animate={{ scale: [1, 1.07, 1], opacity: [0.35, 0.65, 0.35] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full border border-violet-200/20"
              style={{ inset: -28 }}
              animate={{ scale: [1, 1.09, 1], opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
            <motion.div
              className="absolute rounded-full border border-indigo-100/15"
              style={{ inset: -44 }}
              animate={{ scale: [1, 1.06, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            />
          </>
        )}

        {/* Orbiting dashed ring */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: -8,
            border: "1.5px dashed rgba(99,102,241,0.3)",
          }}
          animate={reduced ? {} : { rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Orbiting dot on the ring */}
        {!reduced && (
          <motion.div
            className="absolute w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.7)]"
            style={{ top: "50%", left: "50%" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            // offset to sit on the ring edge
            transformOrigin="-116px 0px"
          />
        )}

        {/* Floating + breathing animation wrapper */}
        <motion.div
          className="absolute inset-0"
          animate={reduced ? {} : { y: [0, -11, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            animate={reduced ? {} : { scale: [1, 1.015, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            whileHover={reduced ? {} : { scale: 1.05 }}
          >
            {/* ── SVG Orb ── */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Main sphere gradient: light top-left → deep violet bottom-right */}
                <radialGradient id="ms-body" cx="32%" cy="28%" r="72%">
                  <stop offset="0%"   stopColor="#a5b4fc" />
                  <stop offset="40%"  stopColor="#6366f1" />
                  <stop offset="80%"  stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#3730a3" />
                </radialGradient>

                {/* Outer aura */}
                <radialGradient id="ms-aura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="rgba(99,102,241,0.30)" />
                  <stop offset="70%"  stopColor="rgba(99,102,241,0.08)" />
                  <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                </radialGradient>

                {/* Eye iris gradient */}
                <radialGradient id="ms-eye" cx="38%" cy="32%" r="65%">
                  <stop offset="0%"   stopColor="white" />
                  <stop offset="60%"  stopColor="#e0e7ff" />
                  <stop offset="100%" stopColor="#c7d2fe" />
                </radialGradient>

                {/* Soft glow for sphere */}
                <filter id="ms-glow" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Eye inner glow */}
                <filter id="ms-eyeglow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer soft aura */}
              <circle cx="100" cy="100" r="97" fill="url(#ms-aura)" />

              {/* Sphere */}
              <circle cx="100" cy="100" r="73" fill="url(#ms-body)" filter="url(#ms-glow)" />

              {/* Sphere rim highlight */}
              <circle cx="100" cy="100" r="73" fill="none" stroke="rgba(165,180,252,0.25)" strokeWidth="1.5" />

              {/* Glass sheen — large */}
              <ellipse cx="73" cy="66" rx="27" ry="17" fill="rgba(255,255,255,0.13)" transform="rotate(-22 73 66)" />
              {/* Glass sheen — small sparkle */}
              <ellipse cx="65" cy="58" rx="11" ry="6" fill="rgba(255,255,255,0.09)" transform="rotate(-22 65 58)" />

              {/* Tech accent lines */}
              <g stroke="rgba(196,181,253,0.25)" strokeWidth="1.2" strokeLinecap="round">
                <line x1="34" y1="104" x2="55" y2="104" />
                <line x1="145" y1="104" x2="166" y2="104" />
                <circle cx="55"  cy="104" r="2.5" fill="rgba(196,181,253,0.4)" stroke="none" />
                <circle cx="145" cy="104" r="2.5" fill="rgba(196,181,253,0.4)" stroke="none" />
              </g>

              {/* ── Left eye ── */}
              {/* Glow halo */}
              <circle cx="79" cy="93" r="14" fill="rgba(99,102,241,0.18)" filter="url(#ms-eyeglow)" />
              {/* Iris */}
              <circle cx="79" cy="93" r="11" fill="url(#ms-eye)" />
              {/* Pupil (follows cursor) */}
              <motion.circle cx="79" cy="93" r="5.5" fill="rgba(49,46,129,0.88)"
                style={{ translateX: eyeX, translateY: eyeY }}
              />
              {/* Catchlight */}
              <motion.circle cx="76" cy="90" r="2.2" fill="white"
                style={{ translateX: eyeX, translateY: eyeY }}
              />

              {/* ── Right eye ── */}
              <circle cx="121" cy="93" r="14" fill="rgba(99,102,241,0.18)" filter="url(#ms-eyeglow)" />
              <circle cx="121" cy="93" r="11" fill="url(#ms-eye)" />
              <motion.circle cx="121" cy="93" r="5.5" fill="rgba(49,46,129,0.88)"
                style={{ translateX: eyeX, translateY: eyeY }}
              />
              <motion.circle cx="118" cy="90" r="2.2" fill="white"
                style={{ translateX: eyeX, translateY: eyeY }}
              />

              {/* Subtle smile */}
              <path
                d="M 86 117 Q 100 128 114 117"
                stroke="rgba(196,181,253,0.55)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />

              {/* Bottom micro vents */}
              <g stroke="rgba(196,181,253,0.18)" strokeWidth="1.3" strokeLinecap="round">
                <line x1="90" y1="148" x2="110" y2="148" />
                <line x1="94" y1="154" x2="106" y2="154" />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Status badges ── */}
      <motion.div
        className="flex flex-col items-center gap-1.5 mt-1"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 px-3 py-1 text-xs font-semibold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          AI Online
        </div>
        <p className="text-xs text-gray-400 font-medium tracking-wide">
          Ready to learn
        </p>
      </motion.div>
    </div>
  );
}
