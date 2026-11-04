"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpenCheck, Users } from "lucide-react";
import { useAdminData } from "@/components/admin/admin-session";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  PageHeader,
  ProgressBar,
} from "@/components/portal/ui";
import type { AdminCourseSummary } from "@/lib/admin/api";
import { cn } from "@/lib/utils";

export function AdminCoursesList() {
  const { data, error, loading, reload } = useAdminData<AdminCourseSummary[]>(
    "/api/portal/admin/courses/",
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "ready" | "draft">("all");

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return (data ?? []).filter((course) => {
      const matches =
        !text ||
        `${course.title} ${course.category_label}`.toLowerCase().includes(text);
      const state =
        filter === "all" ||
        (filter === "ready"
          ? course.lessons_published > 0
          : course.lessons_published === 0);
      return matches && state;
    });
  }, [data, query, filter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses & Content"
        description="Add lessons, videos and study material. Students only see published lessons."
      />
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["all", "All courses"],
            ["ready", "Has published lessons"],
            ["draft", "No lessons published"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
            className={cn(
              "h-10 rounded-full px-4 text-sm font-semibold",
              filter === id
                ? "bg-ink text-white"
                : "border border-line bg-white",
            )}
          >
            {label}
          </button>
        ))}
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search courses"
          aria-label="Search courses"
          className="h-10 min-w-56 flex-1 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-azure"
        />
      </div>

      {loading ? (
        <CardSkeleton count={6} className="sm:grid-cols-2 xl:grid-cols-3" />
      ) : error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : !visible.length ? (
        <EmptyState icon={BookOpenCheck} title="No course matches this view" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((course) => {
            const percent = course.lessons_total
              ? Math.round(
                  (course.lessons_published * 100) / course.lessons_total,
                )
              : 0;
            return (
              <li key={course.id}>
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:border-azure"
                >
                  <div className="relative aspect-[16/8] bg-mist">
                    {course.image ? (
                      <Image
                        src={course.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : null}
                    <span className="absolute top-3 left-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">
                      {course.programme_type}
                    </span>
                    {!course.is_active ? (
                      <span className="absolute top-3 right-3 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                        Inactive
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold text-azure">
                      {course.category_label}
                    </p>
                    <h2 className="mt-1 font-semibold group-hover:text-azure">
                      {course.title}
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
                      <span>{course.modules_total} modules</span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="size-3.5" aria-hidden />
                        {course.students} enrolled
                      </span>
                      <span>{course.batches.length} active batches</span>
                    </div>
                    <div className="mt-auto pt-4">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold">Lessons published</span>
                        <span className="text-ink-soft">
                          {course.lessons_published}/{course.lessons_total}
                        </span>
                      </div>
                      <ProgressBar
                        percent={percent}
                        label={`${course.title} lessons published`}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
