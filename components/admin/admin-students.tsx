"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  StudentEnrollments,
  type AdminCourse,
} from "@/components/admin/admin-enrollments";
import { API_URL, adminHeaders } from "@/lib/api";
import { CATALOG } from "@/lib/course-catalog";
import { INDIAN_STATES } from "@/lib/site";

type StudentStatus = "pending" | "active" | "inactive";

type AdminStudent = {
  id: number;
  full_name: string;
  email: string;
  student_id: string | null;
  mobile: string;
  state: string;
  city: string;
  course_interest: string;
  status: StudentStatus;
  verified_at: string | null;
  created_at: string;
  last_login: string | null;
  has_password: boolean;
  email_sent?: boolean;
};

const FILTERS: { id: StudentStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

const BADGE: Record<StudentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-mist text-ink-soft",
};

const EMPTY_FORM = {
  full_name: "",
  email: "",
  mobile: "",
  state: "Uttar Pradesh",
  city: "",
  course_interest: "",
};

function when(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function firstError(data: Record<string, unknown>) {
  if (typeof data.detail === "string") return data.detail;
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && typeof value[0] === "string")
      return `${key.replace("_", " ")}: ${value[0]}`;
  }
  return "That did not save.";
}

export function AdminStudents({
  token,
  onUnauthorized,
}: {
  token: string;
  onUnauthorized: () => void;
}) {
  const [rows, setRows] = useState<AdminStudent[]>([]);
  const [filter, setFilter] = useState<StudentStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    tone: "ok" | "error";
    text: string;
  } | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [openCourses, setOpenCourses] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/portal/admin/courses/`, {
      headers: adminHeaders(token),
    })
      .then((res) => (res.ok ? (res.json() as Promise<AdminCourse[]>) : []))
      .then((data) => !cancelled && setCourses(data))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/portal/admin/students/`, {
      headers: adminHeaders(token),
    })
      .then(async (res) => {
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        if (!res.ok) throw new Error();
        const data = (await res.json()) as AdminStudent[];
        if (!cancelled) setRows(data);
      })
      .catch(() => {
        if (!cancelled)
          setMessage({
            tone: "error",
            text: "Students could not be loaded. Check that the API is running.",
          });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, onUnauthorized]);

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return rows.filter((row) => {
      const haystack =
        `${row.full_name} ${row.email} ${row.mobile} ${row.student_id ?? ""} ${row.course_interest}`.toLowerCase();
      return (
        (filter === "all" || row.status === filter) &&
        (!text || haystack.includes(text))
      );
    });
  }, [rows, filter, query]);

  const counts = {
    pending: rows.filter((row) => row.status === "pending").length,
    active: rows.filter((row) => row.status === "active").length,
    inactive: rows.filter((row) => row.status === "inactive").length,
  };

  async function request(
    path: string,
    method: "POST" | "PATCH",
    body?: unknown,
  ) {
    const res = await fetch(`${API_URL}/api/portal/admin/students/${path}`, {
      method,
      headers: adminHeaders(token),
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.status === 401) onUnauthorized();
    const data = (await res.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    return { ok: res.ok, data };
  }

  async function setStatus(row: AdminStudent, status: StudentStatus) {
    setBusy(row.id);
    setMessage(null);
    const { ok, data } = await request(`${row.id}/`, "PATCH", { status });
    setBusy(null);
    if (!ok) {
      setMessage({ tone: "error", text: firstError(data) });
      return;
    }
    const next = data as unknown as AdminStudent;
    setRows((current) =>
      current.map((item) => (item.id === next.id ? next : item)),
    );
    const mail =
      next.email_sent === false
        ? " The notification email could not be sent."
        : next.email_sent
          ? " The student has been emailed."
          : "";
    setMessage({
      tone: next.email_sent === false ? "error" : "ok",
      text: `${next.full_name} is now ${status}.${mail}`,
    });
  }

  async function sendLink(row: AdminStudent) {
    setBusy(row.id);
    setMessage(null);
    const { ok, data } = await request(`${row.id}/send-password-link/`, "POST");
    setBusy(null);
    setMessage({
      tone: ok ? "ok" : "error",
      text: ok ? String(data.detail) : firstError(data),
    });
  }

  async function addStudent(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    const { ok, data } = await request("", "POST", {
      ...form,
      mobile: form.mobile.replace(/\D/g, ""),
    });
    setSaving(false);
    if (!ok) {
      setMessage({ tone: "error", text: firstError(data) });
      return;
    }
    const created = data as unknown as AdminStudent;
    setRows((current) => [created, ...current]);
    setForm(EMPTY_FORM);
    setAdding(false);
    setMessage({
      tone: created.email_sent ? "ok" : "error",
      text: created.email_sent
        ? `${created.full_name} was added (${created.student_id}). A set-password link was emailed to ${created.email}.`
        : `${created.full_name} was added, but the set-password email could not be sent. Use “Send password link” after checking email settings.`,
    });
  }

  const input =
    "h-11 rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-azure";

  return (
    <div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Pending verification", counts.pending],
          ["Active", counts.active],
          ["Inactive", counts.inactive],
        ].map(([label, count]) => (
          <div
            key={label}
            className="rounded-2xl border border-line bg-white px-4 py-3"
          >
            <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold">{count}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === item.id ? "bg-ink text-white" : "bg-white ring-1 ring-line"}`}
          >
            {item.label}
          </button>
        ))}
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, mobile, student ID"
          aria-label="Search students"
          className="h-10 min-w-56 flex-1 rounded-full border border-line bg-white px-4 text-sm outline-none"
        />
        <button
          type="button"
          onClick={() => setAdding((value) => !value)}
          className="h-10 rounded-full bg-azure px-4 text-sm font-semibold text-white"
          aria-expanded={adding}
        >
          {adding ? "Close form" : "Add student"}
        </button>
      </div>

      {adding ? (
        <form
          onSubmit={addStudent}
          className="mt-4 grid gap-3 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <p className="text-sm text-ink-soft sm:col-span-2 lg:col-span-3">
            Add a student whose admission is verified. The account is active
            immediately and the student receives an email to set a password.
          </p>
          {(
            [
              ["full_name", "Full name", "text"],
              ["email", "Email", "email"],
              ["mobile", "Mobile (10 digits)", "tel"],
              ["city", "City", "text"],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="grid gap-1 text-sm font-semibold">
              {label}
              <input
                required
                type={type}
                value={form[key]}
                onChange={(event) =>
                  setForm({ ...form, [key]: event.target.value })
                }
                className={`${input} font-normal`}
              />
            </label>
          ))}
          <label className="grid gap-1 text-sm font-semibold">
            State
            <select
              value={form.state}
              onChange={(event) =>
                setForm({ ...form, state: event.target.value })
              }
              className={`${input} font-normal`}
            >
              {INDIAN_STATES.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Course
            <select
              value={form.course_interest}
              onChange={(event) =>
                setForm({ ...form, course_interest: event.target.value })
              }
              className={`${input} font-normal`}
            >
              <option value="">Not set</option>
              {CATALOG.map((course) => (
                <option key={course.slug}>{course.title}</option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="h-11 rounded-full bg-ink px-6 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Adding…" : "Create student account"}
            </button>
          </div>
        </form>
      ) : null}

      {message ? (
        <p
          role="status"
          className={`mt-4 rounded-2xl px-4 py-3 text-sm ${message.tone === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </p>
      ) : null}
      {loading ? (
        <p className="mt-8 text-sm text-ink-soft">Loading students…</p>
      ) : null}
      {!loading && visible.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-line bg-white p-6 text-sm">
          No student matches this view.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4">
        {visible.map((row) => (
          <article
            key={row.id}
            className="rounded-2xl border border-line bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{row.full_name}</h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${BADGE[row.status]}`}
                  >
                    {row.status}
                  </span>
                  {row.student_id ? (
                    <span className="text-xs font-semibold text-ink-soft">
                      {row.student_id}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-ink-soft">
                  {row.course_interest || "Course not set"} · {row.city},{" "}
                  {row.state}
                </p>
              </div>
              <p className="text-xs text-ink-soft">
                Requested {when(row.created_at)}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a
                className="font-semibold text-azure"
                href={`tel:+91${row.mobile}`}
              >
                {row.mobile}
              </a>
              <a className="text-ink-soft" href={`mailto:${row.email}`}>
                {row.email}
              </a>
              <span className="text-ink-soft">
                Last login: {when(row.last_login)}
              </span>
              {!row.has_password ? (
                <span className="text-amber-700">Password not set yet</span>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {row.status !== "active" ? (
                <button
                  type="button"
                  disabled={busy === row.id}
                  onClick={() => void setStatus(row, "active")}
                  className="h-10 rounded-full bg-emerald-700 px-4 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {row.status === "pending"
                    ? "Verify & activate"
                    : "Reactivate"}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={busy === row.id}
                    onClick={() => void setStatus(row, "inactive")}
                    className="h-10 rounded-full border border-ink px-4 text-sm font-semibold disabled:opacity-60"
                  >
                    Deactivate
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCourses((current) =>
                        current === row.id ? null : row.id,
                      )
                    }
                    aria-expanded={openCourses === row.id}
                    className="h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white"
                  >
                    {openCourses === row.id ? "Hide courses" : "Courses"}
                  </button>
                  <button
                    type="button"
                    disabled={busy === row.id}
                    onClick={() => void sendLink(row)}
                    className="h-10 rounded-full bg-white px-4 text-sm font-semibold ring-1 ring-line disabled:opacity-60"
                  >
                    Send password link
                  </button>
                </>
              )}
            </div>
            {openCourses === row.id && row.status === "active" ? (
              <StudentEnrollments
                token={token}
                studentId={row.id}
                courses={courses}
                onUnauthorized={onUnauthorized}
              />
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
