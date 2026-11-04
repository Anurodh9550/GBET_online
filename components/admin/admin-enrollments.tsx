"use client";

import { FormEvent, useEffect, useState } from "react";
import { API_URL, adminHeaders } from "@/lib/api";

export type AdminCourse = {
  id: number;
  slug: string;
  title: string;
  programme_type: string;
  lessons_total: number;
  lessons_published: number;
  batches: {
    id: number;
    name: string;
    faculty_name: string;
    start_date: string;
    end_date: string | null;
  }[];
};

type AdminEnrollment = {
  id: number;
  course: number;
  course_title: string;
  batch: number | null;
  batch_name: string | null;
  status: "active" | "completed" | "suspended";
  start_date: string | null;
  progress: { done: number; total: number; percent: number };
};

const input =
  "h-10 rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-azure";

function firstError(data: Record<string, unknown>) {
  if (typeof data.detail === "string") return data.detail;
  for (const value of Object.values(data))
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return "That did not save.";
}

export function StudentEnrollments({
  token,
  studentId,
  courses,
  onUnauthorized,
}: {
  token: string;
  studentId: number;
  courses: AdminCourse[];
  onUnauthorized: () => void;
}) {
  const [rows, setRows] = useState<AdminEnrollment[] | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ course: "", batch: "", start_date: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/portal/admin/enrollments/?student=${studentId}`, {
      headers: adminHeaders(token),
    })
      .then(async (res) => {
        if (res.status === 401) return onUnauthorized();
        if (!res.ok) throw new Error();
        const data = (await res.json()) as AdminEnrollment[];
        if (!cancelled) setRows(data);
      })
      .catch(() => !cancelled && setError("Enrolments could not be loaded."));
    return () => {
      cancelled = true;
    };
  }, [token, studentId, onUnauthorized]);

  async function send(path: string, method: "POST" | "PATCH", body: unknown) {
    const res = await fetch(`${API_URL}/api/portal/admin/enrollments/${path}`, {
      method,
      headers: adminHeaders(token),
      body: JSON.stringify(body),
    });
    if (res.status === 401) onUnauthorized();
    return {
      ok: res.ok,
      data: (await res.json().catch(() => ({}))) as Record<string, unknown>,
    };
  }

  async function assign(event: FormEvent) {
    event.preventDefault();
    if (!form.course) return setError("Choose a course.");
    setSaving(true);
    setError("");
    const { ok, data } = await send("", "POST", {
      student: studentId,
      course: Number(form.course),
      batch: form.batch ? Number(form.batch) : null,
      start_date: form.start_date || null,
    });
    setSaving(false);
    if (!ok) return setError(firstError(data));
    setRows((current) => [
      data as unknown as AdminEnrollment,
      ...(current ?? []),
    ]);
    setForm({ course: "", batch: "", start_date: "" });
  }

  async function update(
    row: AdminEnrollment,
    patch: Partial<Pick<AdminEnrollment, "status" | "batch">>,
  ) {
    setError("");
    const { ok, data } = await send(`${row.id}/`, "PATCH", patch);
    if (!ok) return setError(firstError(data));
    const next = data as unknown as AdminEnrollment;
    setRows((current) =>
      (current ?? []).map((item) => (item.id === next.id ? next : item)),
    );
  }

  const selected = courses.find((course) => String(course.id) === form.course);
  const enrolledIds = new Set((rows ?? []).map((row) => row.course));

  return (
    <div className="mt-4 rounded-2xl bg-mist p-4">
      <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
        Course enrolments
      </p>
      {rows === null && !error ? (
        <p className="mt-2 text-sm text-ink-soft">Loading…</p>
      ) : null}
      {rows?.length === 0 ? (
        <p className="mt-2 text-sm text-ink-soft">No course assigned yet.</p>
      ) : null}
      <ul className="mt-2 grid gap-2">
        {(rows ?? []).map((row) => {
          const course = courses.find((item) => item.id === row.course);
          return (
            <li
              key={row.id}
              className="grid gap-2 rounded-xl border border-line bg-white p-3 text-sm sm:grid-cols-[1fr_auto_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="font-semibold">{row.course_title}</p>
                <p className="text-xs text-ink-soft">
                  {row.progress.done}/{row.progress.total} lessons (
                  {row.progress.percent}%)
                  {course
                    ? ` · ${course.lessons_published}/${course.lessons_total} lessons published`
                    : ""}
                </p>
              </div>
              <select
                aria-label={`Batch for ${row.course_title}`}
                value={row.batch ?? ""}
                onChange={(event) =>
                  void update(row, {
                    batch: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
                className={input}
              >
                <option value="">No batch</option>
                {(course?.batches ?? []).map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
              <select
                aria-label={`Status for ${row.course_title}`}
                value={row.status}
                onChange={(event) =>
                  void update(row, {
                    status: event.target.value as AdminEnrollment["status"],
                  })
                }
                className={input}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="suspended">Suspended</option>
              </select>
            </li>
          );
        })}
      </ul>
      <form
        onSubmit={assign}
        className="mt-3 grid gap-2 sm:grid-cols-[1fr_12rem_10rem_auto]"
      >
        <select
          aria-label="Course to assign"
          value={form.course}
          onChange={(event) =>
            setForm({
              course: event.target.value,
              batch: "",
              start_date: form.start_date,
            })
          }
          className={input}
        >
          <option value="">Assign a course…</option>
          {courses.map((course) => (
            <option
              key={course.id}
              value={course.id}
              disabled={enrolledIds.has(course.id)}
            >
              {course.title}
            </option>
          ))}
        </select>
        <select
          aria-label="Batch"
          value={form.batch}
          onChange={(event) => setForm({ ...form, batch: event.target.value })}
          className={input}
          disabled={!selected?.batches.length}
        >
          <option value="">
            {selected?.batches.length ? "Choose batch" : "No batch yet"}
          </option>
          {(selected?.batches ?? []).map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          aria-label="Start date"
          value={form.start_date}
          onChange={(event) =>
            setForm({ ...form, start_date: event.target.value })
          }
          className={input}
        />
        <button
          type="submit"
          disabled={saving}
          className="h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Assigning…" : "Assign"}
        </button>
      </form>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
