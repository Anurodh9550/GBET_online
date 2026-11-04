"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  UserRound,
} from "lucide-react";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  PageHeader,
  ProgressBar,
} from "@/components/portal/ui";
import { usePortalData } from "@/components/portal/use-portal-data";
import { formatDate } from "@/lib/portal/client";
import { STATUS_LABEL, type CourseCardData } from "@/lib/portal/learning";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  active: "bg-azure-soft text-azure-dark",
  completed: "bg-emerald-100 text-emerald-800",
  suspended: "bg-amber-100 text-amber-800",
};

export function EnrolledCourseCard({ item }: { item: CourseCardData }) {
  const { course, progress } = item;
  const started = progress.done > 0;
  const action =
    item.status === "suspended"
      ? null
      : progress.total === 0
        ? "View course"
        : started
          ? "Continue learning"
          : "Start learning";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative aspect-[16/9] bg-mist">
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
        <span
          className={cn(
            "absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            STATUS_STYLE[item.status],
          )}
        >
          {STATUS_LABEL[item.status]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold text-azure">
          {course.category_label}
        </p>
        <h2 className="mt-1 text-lg leading-snug font-semibold">
          {course.title}
        </h2>
        <dl className="mt-3 grid gap-1.5 text-sm text-ink-soft">
          <div className="flex items-center gap-2">
            <Clock className="size-4 shrink-0" aria-hidden />
            <dt className="sr-only">Duration</dt>
            <dd>{course.duration}</dd>
          </div>
          <div className="flex items-center gap-2">
            <UserRound className="size-4 shrink-0" aria-hidden />
            <dt className="sr-only">Faculty</dt>
            <dd>{item.faculty_name ?? "Faculty to be announced"}</dd>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" aria-hidden />
            <dt className="sr-only">Start date</dt>
            <dd>
              {item.start_date
                ? `Starts ${formatDate(item.start_date)}`
                : "Start date to be confirmed"}
              {item.batch ? ` · ${item.batch.name}` : ""}
            </dd>
          </div>
        </dl>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">{progress.percent}% complete</span>
            <span className="text-ink-soft">
              {progress.done}/{progress.total} lessons
            </span>
          </div>
          <ProgressBar
            percent={progress.percent}
            label={`${course.title} progress`}
            className="mt-1.5"
          />
        </div>
        <div className="mt-auto pt-5">
          {action ? (
            <Link
              href={`/student/courses/${course.slug}`}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink text-sm font-semibold text-white transition hover:bg-azure"
            >
              {action} <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : (
            <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-center text-sm text-amber-800">
              Access paused – contact the academic team.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function MyCourses() {
  const { data, error, loading, reload } =
    usePortalData<CourseCardData[]>("learning/courses");

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        description="Courses assigned to you by the GBET academic team."
      />
      {loading ? (
        <CardSkeleton count={3} className="sm:grid-cols-2 xl:grid-cols-3" />
      ) : error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : !data?.length ? (
        <EmptyState
          icon={BookOpen}
          title="No courses assigned yet"
          action={{ href: "/student/help", label: "Contact support" }}
        >
          Your courses appear here once the academic team enrols you in a course
          and batch after admission.
        </EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((item) => (
            <li key={item.id}>
              <EnrolledCourseCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
