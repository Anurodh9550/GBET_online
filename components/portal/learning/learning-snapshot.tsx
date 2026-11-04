"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  FileText,
  GraduationCap,
  Video,
  type LucideIcon,
} from "lucide-react";
import { EnrolledCourseCard } from "@/components/portal/learning/my-courses";
import { ErrorState, ProgressBar } from "@/components/portal/ui";
import { usePortalData } from "@/components/portal/use-portal-data";
import type { CourseCardData, LearningSummary } from "@/lib/portal/learning";

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number | null;
}) {
  return (
    <li className="rounded-2xl border border-line bg-white p-4 sm:p-5">
      <span className="grid size-10 place-items-center rounded-xl bg-azure-soft text-azure">
        <Icon className="size-5" aria-hidden />
      </span>
      <p
        className="mt-3 text-2xl font-bold"
        aria-label={value === null ? `${label}: not available yet` : undefined}
      >
        {value ?? "—"}
      </p>
      <p className="mt-0.5 text-sm text-ink-soft">{label}</p>
    </li>
  );
}

export function LearningSnapshot() {
  const summary = usePortalData<LearningSummary>("learning/summary");
  const courses = usePortalData<CourseCardData[]>("learning/courses");

  if (summary.error)
    return (
      <ErrorState message={summary.error.message} onRetry={summary.reload} />
    );
  const data = summary.data;
  const current = (courses.data ?? [])
    .filter((item) => item.status === "active")
    .slice(0, 2);

  return (
    <section aria-labelledby="learning-heading" aria-busy={summary.loading}>
      <h2 id="learning-heading" className="text-lg font-semibold">
        Your learning
      </h2>
      {data && data.enrolled === 0 ? (
        <div className="mt-3 rounded-2xl border border-azure/20 bg-azure-soft px-4 py-3 text-sm text-azure-dark">
          Your courses appear here once the academic team enrols you in a course
          and batch.
        </div>
      ) : null}
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        <Stat
          icon={BookOpen}
          label="Enrolled courses"
          value={data?.enrolled ?? null}
        />
        <Stat
          icon={GraduationCap}
          label="Active courses"
          value={data?.active ?? null}
        />
        <Stat
          icon={CheckCircle2}
          label="Completed courses"
          value={data?.completed ?? null}
        />
        <Stat icon={FileText} label="Pending assignments" value={null} />
        <Stat icon={Video} label="Upcoming live classes" value={null} />
        <Stat icon={CalendarClock} label="Next deadline" value={null} />
      </ul>
      <p className="mt-2 text-xs text-ink-soft">
        Assignments and live classes will be added to the portal soon.
      </p>

      <div className="mt-4 rounded-2xl border border-line bg-white p-5">
        <div className="flex items-center justify-between text-sm">
          <p className="font-semibold">Overall learning progress</p>
          <p className="text-ink-soft">
            {data
              ? data.lessons_total
                ? `${data.lessons_done}/${data.lessons_total} lessons · ${data.overall_percent}%`
                : "No lessons published yet"
              : "Loading…"}
          </p>
        </div>
        <ProgressBar
          percent={data?.overall_percent ?? 0}
          label="Overall learning progress"
          className="mt-3 h-2.5"
        />
      </div>

      {current.length ? (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Continue learning</h3>
            <Link
              href="/student/courses"
              className="inline-flex items-center gap-1 text-sm font-semibold text-azure hover:text-azure-dark"
            >
              All courses <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-3 grid gap-4 md:grid-cols-2">
            {current.map((item) => (
              <li key={item.id}>
                <EnrolledCourseCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
