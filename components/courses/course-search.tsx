"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function CourseSearch({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div role="search" className={cn("relative", className)}>
      <label htmlFor="course-search" className="sr-only">
        Search courses by name
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-soft" aria-hidden />
      <input
        id="course-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by course name"
        autoComplete="off"
        className="h-14 w-full rounded-2xl border border-line bg-white pr-12 pl-12 text-base text-ink shadow-[0_8px_24px_-16px_rgba(11,31,58,0.35)] outline-none transition placeholder:text-ink-soft/70 focus:border-azure focus:ring-4 focus:ring-azure/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-mist hover:text-ink"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
