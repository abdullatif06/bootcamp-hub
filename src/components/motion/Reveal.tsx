"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale";

const OFFSET = 48;

function hidden(dir: Direction, reduce: boolean) {
  if (reduce) return { opacity: 0 };
  switch (dir) {
    case "up": return { opacity: 0, y: OFFSET };
    case "down": return { opacity: 0, y: -OFFSET };
    case "left": return { opacity: 0, x: OFFSET };
    case "right": return { opacity: 0, x: -OFFSET };
    case "scale": return { opacity: 0, scale: 0.85 };
  }
}

/**
 * Scroll-reveal wrapper. Fades + slides its children in when they enter the
 * viewport. Respects prefers-reduced-motion (fades only, no movement).
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  once = true,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      className={className}
      initial={hidden(direction, reduce)}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration: reduce ? 0.3 : 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1], // expo-out: bold but smooth
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered container — children wrapped in <RevealItem> animate in sequence.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.1,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  };
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  direction = "up",
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  className?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const item: Variants = {
    hidden: hidden(direction, reduce),
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: reduce ? 0.3 : 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
