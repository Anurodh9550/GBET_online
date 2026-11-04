"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { GraduationCap } from "lucide-react";
import {
  useAdminData,
  useAdminSession,
} from "@/components/admin/admin-session";
import { SelectInput } from "@/components/portal/form-controls";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  PageHeader,
  ProgressBar,
} from "@/components/portal/ui";
import {
  AdminError,
  adminRequest,
  when,
  type AdminBatch,
  type AdminCourseSummary,
  type AdminEnrollment,
} from "@/lib/admin/api";

export function EnrollmentsPage() {
  const { token, expire } = useAdminSession();
  const params = useSearchParams();
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const batch = params.get("batch") ?? "";

  const qs = new URLSearchParams();
  if (course) qs.set("course", course);
  if (status) qs.set("status", status);
  if (batch) qs.set("batch", batch);
  if (search) qs.set("q", search);
  const list = useAdminData<AdminEnrollment[]>(
    `/api/portal/admin/enrollments/?${qs.toString()}`,
  );
  const courses = useAdminData<AdminCourseSummary[]>(
    "/api/portal/admin/courses/",
  );
  const batches = useAdminData<AdminBatch[]>("/api/portal/admin/batches/");
  const batchName = batches.data?.find(
    (item) => String(item.id) === batch,
  )?.name;

  async function update(row: AdminEnrollment, body: Record<string, unknown>) {
    setError("");
    try {
      const next = await adminRequest<AdminEnrollment>(
        token,
        `/api/portal/admin/enrollments/${row.id}/`,
        { method: "PATCH", body },
      );
      list.replace(
        (list.data ?? []).map((item) => (item.id === next.id ? next : item)),
      );
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      setError(err instanceof AdminError ? err.message : "That did not save.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrolments"
        description="Every student–course assignment with progress. Assign new courses from the Students page."
      />
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setSearch(query.trim());
        }}
      >
        <SelectInput
          aria-label="Filter by course"
          value={course}
          onChange={(event) => setCourse(event.target.value)}
          className="h-10 w-auto min-w-52"
        >
          <option value="">All courses</option>
          {(courses.data ?? []).map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          aria-label="Filter by status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-10 w-auto"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="suspended">Suspended</option>
        </SelectInput>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search student or course, then press Enter"
          aria-label="Search enrolments"
          className="h-10 min-w-56 flex-1 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-azure"
        />
      </form>
      {batch ? (
        <p className="text-sm">
          Showing batch{" "}
          <span className="font-semibold">{batchName ?? `#${batch}`}</span> ·{" "}
          <Link href="/admin/enrollments" className="font-semibold text-azure">
            Show all
          </Link>
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      {list.loading ? (
        <CardSkeleton count={3} />
      ) : list.error ? (
        <ErrorState message={list.error.message} onRetry={list.reload} />
      ) : !list.data?.length ? (
        <EmptyState
          icon={GraduationCap}
          title="No enrolments found"
          action={{ href: "/admin/students", label: "Assign a course" }}
        >
          Assign courses to active students from the Students page.
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="border-b border-line bg-mist text-xs text-ink-soft uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold">Batch</th>
                <th className="px-4 py-3 font-semibold">Progress</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.data.map((row) => {
                const courseBatches = (batches.data ?? []).filter(
                  (item) => item.course === row.course,
                );
                return (
                  <tr key={row.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{row.student_name}</p>
                      <p className="text-xs text-ink-soft">
                        {row.student_code ?? "—"} · {row.student_email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{row.course_title}</p>
                      <p className="text-xs text-ink-soft">
                        Enrolled {when(row.created_at, false)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <SelectInput
                        aria-label={`Batch for ${row.student_name}`}
                        value={row.batch ?? ""}
                        onChange={(event) =>
                          void update(row, {
                            batch: event.target.value
                              ? Number(event.target.value)
                              : null,
                          })
                        }
                        className="h-9 w-44 text-xs"
                      >
                        <option value="">No batch</option>
                        {courseBatches.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </SelectInput>
                    </td>
                    <td className="w-48 px-4 py-3">
                      <p className="text-xs">
                        {row.progress.percent}% · {row.progress.done}/
                        {row.progress.total} lessons
                      </p>
                      <ProgressBar
                        percent={row.progress.percent}
                        label={`${row.student_name} progress`}
                        className="mt-1"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <SelectInput
                        aria-label={`Status for ${row.student_name}`}
                        value={row.status}
                        onChange={(event) =>
                          void update(row, { status: event.target.value })
                        }
                        className="h-9 w-36 text-xs"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="suspended">Suspended</option>
                      </SelectInput>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
