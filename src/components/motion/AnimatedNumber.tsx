"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useReducedMotion,
  animate,
  useInView,
} from "framer-motion";

/**
 * Counts up to `value` with a spring, and re-animates smoothly whenever the
 * value changes (e.g. live score updates). Pads to `minDigits` with zeros.
 */
export function AnimatedNumber({
  value,
  minDigits = 0,
  className,
  duration = 0.9,
}: {
  value: number;
  minDigits?: number;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 18, mass: 0.6 });
  const started = useRef(false);

  // Start from 0 → value the first time it scrolls into view.
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (reduce) {
      mv.set(value);
    } else {
      animate(mv, value, { duration, ease: "easeOut" });
    }
  }, [inView, value, reduce, mv, duration]);

  // After the initial play, follow live value changes via the spring.
  useEffect(() => {
    if (started.current) mv.set(value);
  }, [value, mv]);

  useEffect(() => {
    const target = reduce ? mv : spring;
    const unsub = target.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = String(Math.round(v)).padStart(minDigits, "0");
      }
    });
    return () => unsub();
  }, [spring, mv, reduce, minDigits]);

  return (
    <span ref={ref} className={className}>
      {String(0).padStart(minDigits, "0")}
    </span>
  );
}
