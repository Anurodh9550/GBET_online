"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CalendarRange, Users } from "lucide-react";
import {
  useAdminData,
  useAdminSession,
} from "@/components/admin/admin-session";
import {
  Field,
  Notice,
  SelectInput,
  SubmitButton,
  TextInput,
} from "@/components/portal/form-controls";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  PageHeader,
} from "@/components/portal/ui";
import {
  AdminError,
  adminRequest,
  when,
  type AdminBatch,
  type AdminCourseSummary,
} from "@/lib/admin/api";
import { cn } from "@/lib/utils";

const EMPTY = {
  course: "",
  name: "",
  faculty_name: "",
  start_date: "",
  end_date: "",
};

function BatchRow({
  batch,
  showCourse,
  onChanged,
  onError,
}: {
  batch: AdminBatch;
  showCourse: boolean;
  onChanged: () => void;
  onError: (text: string) => void;
}) {
  const { token, expire } = useAdminSession();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: batch.name,
    faculty_name: batch.faculty_name,
    start_date: batch.start_date,
    end_date: batch.end_date ?? "",
  });

  async function save(body: Record<string, unknown>) {
    try {
      await adminRequest(token, `/api/portal/admin/batches/${batch.id}/`, {
        method: "PATCH",
        body,
      });
      setEditing(false);
      onChanged();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      onError(err instanceof AdminError ? err.message : "That did not save.");
    }
  }

  async function remove() {
    if (!window.confirm(`Delete the batch “${batch.name}”?`)) return;
    try {
      await adminRequest(token, `/api/portal/admin/batches/${batch.id}/`, {
        method: "DELETE",
      });
      onChanged();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      onError(
        err instanceof AdminError
          ? err.message
          : "The batch could not be deleted.",
      );
    }
  }

  if (editing) {
    return (
      <li className="p-4">
        <form
          className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_10rem_10rem_auto]"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            void save({ ...form, end_date: form.end_date || null });
          }}
        >
          <TextInput
            aria-label="Batch name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="h-10"
          />
          <TextInput
            aria-label="Faculty name"
            placeholder="Faculty name (optional)"
            value={form.faculty_name}
            onChange={(event) =>
              setForm({ ...form, faculty_name: event.target.value })
            }
            className="h-10"
          />
          <TextInput
            aria-label="Start date"
            type="date"
            value={form.start_date}
            onChange={(event) =>
              setForm({ ...form, start_date: event.target.value })
            }
            className="h-10"
          />
          <TextInput
            aria-label="End date"
            type="date"
            value={form.end_date}
            onChange={(event) =>
              setForm({ ...form, end_date: event.target.value })
            }
            className="h-10"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="h-10 rounded-lg bg-azure px-4 text-sm font-semibold text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="h-10 rounded-lg px-3 text-sm font-semibold text-ink-soft"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center gap-3 p-4">
      <div className="min-w-0 flex-1">
        <p className="font-semibold">
          {batch.name}
          {!batch.is_active ? (
            <span className="ml-2 rounded-full bg-mist px-2 py-0.5 text-xs font-semibold text-ink-soft">
              Inactive
            </span>
          ) : null}
        </p>
        <p className="text-xs text-ink-soft">
          {showCourse ? `${batch.course_title} · ` : ""}
          {when(batch.start_date, false)} –{" "}
          {batch.end_date ? when(batch.end_date, false) : "open"} ·{" "}
          {batch.faculty_name || "Faculty not set"}
        </p>
      </div>
      <Link
        href={`/admin/enrollments?batch=${batch.id}`}
        className="inline-flex items-center gap-1.5 rounded-full bg-azure-soft px-3 py-1 text-xs font-semibold text-azure-dark"
      >
        <Users className="size-3.5" aria-hidden />
        {batch.students} students
      </Link>
      <button
        type="button"
        onClick={() => void save({ is_active: !batch.is_active })}
        className="h-9 rounded-lg border border-line px-3 text-sm font-semibold hover:border-azure"
      >
        {batch.is_active ? "Mark inactive" : "Activate"}
      </button>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="h-9 rounded-lg border border-line px-3 text-sm font-semibold hover:border-azure"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => void remove()}
        disabled={batch.students > 0}
        title={
          batch.students > 0
            ? "Batches with students cannot be deleted."
            : undefined
        }
        className="h-9 rounded-lg px-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:text-ink-soft/40 disabled:hover:bg-transparent"
      >
        Delete
      </button>
    </li>
  );
}

export function BatchManager({
  courseId,
  onChanged,
}: {
  courseId?: number;
  onChanged?: () => void;
}) {
  const { token, expire } = useAdminSession();
  const [courseFilter, setCourseFilter] = useState("");
  const effectiveCourse = courseId ? String(courseId) : courseFilter;
  const batches = useAdminData<AdminBatch[]>(
    `/api/portal/admin/batches/${effectiveCourse ? `?course=${effectiveCourse}` : ""}`,
  );
  const courses = useAdminData<AdminCourseSummary[]>(
    courseId ? null : "/api/portal/admin/courses/",
  );
  const [form, setForm] = useState(EMPTY);
  const [message, setMessage] = useState<{
    tone: "error" | "success";
    text: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const changed = () => {
    batches.reload();
    onChanged?.();
  };

  async function create(event: FormEvent) {
    event.preventDefault();
    const course = courseId ? String(courseId) : form.course;
    if (!course || !form.name.trim() || !form.start_date)
      return setMessage({
        tone: "error",
        text: "Choose a course and enter a batch name and start date.",
      });
    setSaving(true);
    setMessage(null);
    try {
      await adminRequest(token, "/api/portal/admin/batches/", {
        method: "POST",
        body: {
          course: Number(course),
          name: form.name.trim(),
          faculty_name: form.faculty_name.trim(),
          start_date: form.start_date,
          end_date: form.end_date || null,
        },
      });
      setForm({ ...EMPTY, course: form.course });
      setMessage({ tone: "success", text: "Batch created." });
      changed();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      setMessage({
        tone: "error",
        text:
          err instanceof AdminError
            ? err.message
            : "The batch could not be created.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <form
        onSubmit={create}
        className="grid h-fit gap-4 rounded-2xl border border-line bg-white p-5"
      >
        <h3 className="font-semibold">Create a batch</h3>
        {!courseId ? (
          <Field id="batch-course" label="Course">
            <SelectInput
              id="batch-course"
              value={form.course}
              onChange={(event) =>
                setForm({ ...form, course: event.target.value })
              }
            >
              <option value="">Choose a course</option>
              {(courses.data ?? []).map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </SelectInput>
          </Field>
        ) : null}
        <Field
          id="batch-name"
          label="Batch name"
          hint="e.g. January 2027 – Weekend"
        >
          <TextInput
            id="batch-name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </Field>
        <Field
          id="batch-faculty"
          label="Faculty name"
          optional
          hint="Enter only a confirmed, real faculty name."
        >
          <TextInput
            id="batch-faculty"
            value={form.faculty_name}
            onChange={(event) =>
              setForm({ ...form, faculty_name: event.target.value })
            }
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Field id="batch-start" label="Start date">
            <TextInput
              id="batch-start"
              type="date"
              value={form.start_date}
              onChange={(event) =>
                setForm({ ...form, start_date: event.target.value })
              }
            />
          </Field>
          <Field id="batch-end" label="End date" optional>
            <TextInput
              id="batch-end"
              type="date"
              value={form.end_date}
              onChange={(event) =>
                setForm({ ...form, end_date: event.target.value })
              }
            />
          </Field>
        </div>
        {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}
        <SubmitButton pending={saving}>Create batch</SubmitButton>
      </form>

      <div className="space-y-3">
        {!courseId ? (
          <SelectInput
            aria-label="Filter batches by course"
            value={courseFilter}
            onChange={(event) => setCourseFilter(event.target.value)}
            className="h-11 max-w-md"
          >
            <option value="">All courses</option>
            {(courses.data ?? []).map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </SelectInput>
        ) : null}
        {batches.loading ? (
          <CardSkeleton count={2} />
        ) : batches.error ? (
          <ErrorState
            message={batches.error.message}
            onRetry={batches.reload}
          />
        ) : !batches.data?.length ? (
          <EmptyState icon={CalendarRange} title="No batches yet">
            Create a batch to group students by start date and assign a faculty
            member.
          </EmptyState>
        ) : (
          <ul
            className={cn(
              "divide-y divide-line rounded-2xl border border-line bg-white",
            )}
          >
            {batches.data.map((batch) => (
              <BatchRow
                key={`${batch.id}-${batch.name}-${batch.is_active}-${batch.start_date}`}
                batch={batch}
                showCourse={!courseId}
                onChanged={changed}
                onError={(text) => setMessage({ tone: "error", text })}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function BatchesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Batches"
        description="Group students by course and start date. Faculty names appear on the student's course card."
      />
      <BatchManager />
    </div>
  );
}
