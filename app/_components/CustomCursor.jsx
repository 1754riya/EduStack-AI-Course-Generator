"use client";
import { useEffect, useState } from "react";
import { useMotionValue, useSpring, motion } from "motion/react";

export default function CustomCursor() {
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  // Dot: near-instant
  const dotX = useSpring(mx, { stiffness: 2000, damping: 70, mass: 0.1 });
  const dotY = useSpring(my, { stiffness: 2000, damping: 70, mass: 0.1 });

  // Ring: soft lag
  const ringX = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.5 });
  const ringY = useSpring(my, { stiffness: 180, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setActive(true);

    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    const onMove = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e) => {
      setHovering(!!e.target.closest('a, button, [role="button"], input, label, select, textarea'));
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [mx, my]);

  if (!active) return null;

  return (
    <>
      {/* Glowing dot — mix-blend-difference inverts against any bg */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-white mix-blend-difference"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 10 : 6,
          height: hovering ? 10 : 6,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          width: { duration: 0.15, ease: "easeOut" },
          height: { duration: 0.15, ease: "easeOut" },
          opacity: { duration: 0.15 },
        }}
      />

      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 46 : 30,
          height: hovering ? 46 : 30,
          opacity: visible ? 1 : 0,
          borderColor: hovering
            ? "rgba(99, 102, 241, 0.75)"
            : "rgba(99, 102, 241, 0.45)",
          boxShadow: hovering
            ? "0 0 14px rgba(99, 102, 241, 0.35)"
            : "none",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  );
}
