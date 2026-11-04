"use client";

import { DownloadBrochureButton } from "@/components/courses/download-brochure-button";

export function CourseMobileCta({ courseTitle }: { courseTitle: string }) {
  return (
    <div className="mobile-cta-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white/95 p-3 backdrop-blur sm:hidden">
      <a href="#enquiry" className="inline-flex h-11 items-center justify-center rounded-full bg-azure text-sm font-semibold text-white">
        Enquire Now
      </a>
      <DownloadBrochureButton courseTitle={courseTitle} label="Brochure" className="h-11 px-3" />
    </div>
  );
}
