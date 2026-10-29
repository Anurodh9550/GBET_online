"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Rise plus hover. False keeps a slow fade with no shift — used on full-bleed photos. */
  lift?: boolean;
  /** Hover raise. Sections turn this off so the whole block does not jump. */
  hover?: boolean;
  /** Share of the element that must be on screen before it eases in. */
  amount?: number;
  as?: "div" | "section";
} & Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "className" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>;

export function Reveal({
  children,
  className,
  delay = 0,
  lift = true,
  hover,
  amount = 0.4,
  as = "div",
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  const canHover = hover ?? lift;
  const shift = lift;
  const Tag = as === "section" ? "section" : "div";

  if (reduce) {
    return (
      <Tag className={cn(as === "div" && "h-full", className)} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = as === "section" ? motion.section : motion.div;

  return (
    <MotionTag
      className={cn(as === "div" && "h-full", className)}
      initial={{ opacity: 0, y: shift ? 40 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: "0px 0px -12% 0px" }}
      whileHover={canHover ? { y: -6, transition: { duration: 0.45, delay: 0 } } : undefined}
      transition={{
        duration: shift ? 1.15 : 1.45,
        delay: delay * 3,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
