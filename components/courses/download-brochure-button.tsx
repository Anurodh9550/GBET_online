"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { BrochureDialog } from "@/components/online/brochure-dialog";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "light" | "icon";

const VARIANTS: Record<Variant, string> = {
  primary: "h-12 gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-ink/90",
  outline: "h-12 gap-2 rounded-full border border-ink/20 bg-white px-6 text-sm font-semibold text-ink hover:border-ink/40",
  light: "h-12 gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white hover:bg-white/10",
  icon: "size-11 rounded-full border border-line bg-white text-ink hover:border-azure hover:text-azure",
};

export function DownloadBrochureButton({
  courseTitle,
  variant = "outline",
  label = "Download Brochure",
  className,
}: {
  courseTitle?: string;
  variant?: Variant;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("inline-flex shrink-0 items-center justify-center transition", VARIANTS[variant], className)}
        aria-label={variant === "icon" ? label : undefined}
        aria-haspopup="dialog"
      >
        <Download className="size-4" aria-hidden />
        {variant === "icon" ? null : label}
      </button>
      <BrochureDialog open={open} onClose={() => setOpen(false)} defaultCourse={courseTitle} />
    </>
  );
}
