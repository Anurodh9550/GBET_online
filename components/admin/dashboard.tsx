"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarRange,
  FileText,
  GraduationCap,
  Inbox,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useAdminData } from "@/components/admin/admin-session";
import {
  CardSkeleton,
  ErrorState,
  PageHeader,
  ProgressBar,
} from "@/components/portal/ui";
import { when, type AdminDashboard } from "@/lib/admin/api";

function Stat({
  icon: Icon,
  label,
  value,
  note,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  note?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-line bg-white p-4 transition hover:border-azure sm:p-5"
    >
      <div className="flex items-start justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-azure-soft text-azure">
          <Icon className="size-5" aria-hidden />
        </span>
        <ArrowRight
          className="size-4 text-ink-soft opacity-0 transition group-hover:opacity-100"
          aria-hidden
        />
      </div>
      <p className="mt-3 text-2xl font-bold sm:text-3xl">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      {note ? <p className="mt-0.5 text-xs text-ink-soft">{note}</p> : null}
    </Link>
  );
}

const STATUS_STYLE: Record<string, string> = {
  new: "bg-azure-soft text-azure-dark",
  called: "bg-amber-100 text-amber-800",
  closed: "bg-mist text-ink-soft",
};

export function AdminDashboardView() {
  const { data, error, loading, reload } = useAdminData<AdminDashboard>(
    "/api/portal/admin/dashboard/",
  );

  if (loading)
    return <CardSkeleton count={4} className="sm:grid-cols-2 xl:grid-cols-4" />;
  if (error || !data)
    return (
      <ErrorState
        message={error?.message ?? "Dashboard could not be loaded."}
        onRetry={reload}
      />
    );

  const published = data.content.lessons_total
    ? Math.round(
        (data.content.lessons_published * 100) / data.content.lessons_total,
      )
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Admissions, students and course content at a glance."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat
          icon={Inbox}
          label="New enquiries"
          value={data.enquiries.new}
          note={`${data.enquiries.last_7_days} in the last 7 days · ${data.enquiries.total} total`}
          href="/admin/enquiries"
        />
        <Stat
          icon={UserCheck}
          label="Pending verification"
          value={data.students.pending}
          note="Student access requests"
          href="/admin/students"
        />
        <Stat
          icon={Users}
          label="Active students"
          value={data.students.active}
          note={`${data.students.total} accounts in total`}
          href="/admin/students"
        />
        <Stat
          icon={GraduationCap}
          label="Active enrolments"
          value={data.enrollments.active}
          note={`${data.enrollments.completed} completed · ${data.enrollments.suspended} suspended`}
          href="/admin/enrollments"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-line bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Course content</h2>
            <Link
              href="/admin/courses"
              className="text-sm font-semibold text-azure hover:text-azure-dark"
            >
              Manage courses
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: BookOpenCheck,
                label: "Active courses",
                value: data.content.courses,
              },
              {
                icon: FileText,
                label: "Study materials",
                value: data.content.materials,
              },
              {
                icon: CalendarRange,
                label: "Active batches",
                value: data.content.batches_active,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-mist p-4">
                <Icon className="size-5 text-azure" aria-hidden />
                <p className="mt-2 text-2xl font-bold">{value}</p>
                <p className="text-xs text-ink-soft">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Lessons published</span>
              <span className="text-ink-soft">
                {data.content.lessons_published} of {data.content.lessons_total}{" "}
                ({published}%)
              </span>
            </div>
            <ProgressBar
              percent={published}
              label="Lessons published"
              className="mt-2 h-2.5"
            />
            {published < 100 ? (
              <p className="mt-2 text-xs text-ink-soft">
                Draft lessons stay hidden from students until you add a video or
                notes and publish them.
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-semibold">Most enrolled courses</h2>
          {data.top_courses.length ? (
            <ul className="mt-4 space-y-3">
              {data.top_courses.map((course) => (
                <li key={course.id}>
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="flex items-center justify-between gap-3 text-sm hover:text-azure"
                  >
                    <span className="truncate">{course.title}</span>
                    <span className="shrink-0 rounded-full bg-azure-soft px-2.5 py-0.5 text-xs font-semibold text-azure-dark">
                      {course.students}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-soft">No enrolments yet.</p>
          )}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Latest enquiries</h2>
            <Link
              href="/admin/enquiries"
              className="text-sm font-semibold text-azure hover:text-azure-dark"
            >
              View all
            </Link>
          </div>
          {data.recent_enquiries.length ? (
            <ul className="mt-3 divide-y divide-line">
              {data.recent_enquiries.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.full_name}</p>
                    <p className="truncate text-xs text-ink-soft">
                      {item.course} · {when(item.created_at)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[item.status] ?? ""}`}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink-soft">No enquiries yet.</p>
          )}
        </section>
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Waiting for verification</h2>
            <Link
              href="/admin/students"
              className="text-sm font-semibold text-azure hover:text-azure-dark"
            >
              Open students
            </Link>
          </div>
          {data.pending_students.length ? (
            <ul className="mt-3 divide-y divide-line">
              {data.pending_students.map((item) => (
                <li key={item.id} className="py-3 text-sm">
                  <p className="font-medium">{item.full_name}</p>
                  <p className="text-xs text-ink-soft">
                    {item.course_interest || "Course not given"} ·{" "}
                    {when(item.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink-soft">No pending requests.</p>
          )}
        </section>
      </div>
    </div>
  );
}
