"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  Pencil,
  PlayCircle,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import {
  useAdminData,
  useAdminSession,
} from "@/components/admin/admin-session";
import { BatchManager } from "@/components/admin/batches";
import {
  LessonEditor,
  type LessonDraft,
} from "@/components/admin/lesson-editor";
import {
  Field,
  Notice,
  SelectInput,
  SubmitButton,
  TextInput,
} from "@/components/portal/form-controls";
import { CardSkeleton, ErrorState, ProgressBar } from "@/components/portal/ui";
import {
  AdminError,
  adminRequest,
  adminUpload,
  when,
  type AdminCourseDetail,
  type AdminLesson,
  type AdminModule,
} from "@/lib/admin/api";
import { formatSize } from "@/lib/portal/learning";
import { cn } from "@/lib/utils";

const SOURCE_LABEL = {
  none: "Reading",
  youtube: "YouTube",
  vimeo: "Vimeo",
  upload: "Uploaded video",
} as const;

function Toggle({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 accent-[var(--color-azure)]"
      />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="text-xs text-ink-soft">{description}</span>
      </span>
    </label>
  );
}

function ModuleCard({
  module,
  onEditLesson,
  onAddLesson,
  onChanged,
  onError,
}: {
  module: AdminModule;
  onEditLesson: (lesson: AdminLesson) => void;
  onAddLesson: () => void;
  onChanged: () => void;
  onError: (message: string) => void;
}) {
  const { token, expire } = useAdminSession();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(module.title);
  const [outcome, setOutcome] = useState(module.outcome);
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      onChanged();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      onError(err instanceof AdminError ? err.message : "That did not save.");
    } finally {
      setBusy(false);
    }
  }

  const published = module.lessons.filter(
    (lesson) => lesson.is_published,
  ).length;

  return (
    <section
      className="rounded-2xl border border-line bg-white"
      aria-labelledby={`module-${module.id}`}
    >
      <div className="flex flex-wrap items-start gap-3 border-b border-line p-4 sm:p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-sm font-bold text-white">
          {String(module.number).padStart(2, "0")}
        </span>
        {editing ? (
          <form
            className="grid min-w-0 flex-1 gap-2"
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              void run(() =>
                adminRequest(token, `/api/portal/admin/modules/${module.id}/`, {
                  method: "PATCH",
                  body: { title, outcome },
                }),
              ).then(() => setEditing(false));
            }}
          >
            <TextInput
              aria-label="Module title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-10"
            />
            <TextInput
              aria-label="Learning outcome"
              value={outcome}
              onChange={(event) => setOutcome(event.target.value)}
              placeholder="Learning outcome"
              className="h-10"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className="h-9 rounded-lg bg-azure px-4 text-sm font-semibold text-white"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="h-9 rounded-lg px-3 text-sm font-semibold text-ink-soft"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="min-w-0 flex-1">
            <h3 id={`module-${module.id}`} className="font-semibold">
              {module.title}
            </h3>
            {module.outcome ? (
              <p className="mt-0.5 text-sm text-ink-soft">{module.outcome}</p>
            ) : null}
            <p className="mt-1 text-xs text-ink-soft">
              {module.lessons.length} lessons · {published} published
            </p>
          </div>
        )}
        {!editing ? (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="grid size-9 place-items-center rounded-lg hover:bg-mist"
              aria-label={`Edit module ${module.number}`}
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                window.confirm(
                  `Delete module ${module.number} “${module.title}” and all its lessons?`,
                ) &&
                void run(() =>
                  adminRequest(
                    token,
                    `/api/portal/admin/modules/${module.id}/`,
                    { method: "DELETE" },
                  ),
                )
              }
              className="grid size-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"
              aria-label={`Delete module ${module.number}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
      <ul className="divide-y divide-line">
        {module.lessons.map((lesson) => (
          <li
            key={lesson.id}
            className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5"
          >
            <span className="w-6 text-xs font-semibold text-ink-soft">
              {lesson.order}.
            </span>
            {lesson.video_source === "none" ? (
              <FileText className="size-4 text-ink-soft" aria-hidden />
            ) : (
              <PlayCircle className="size-4 text-azure" aria-hidden />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{lesson.title}</p>
              <p className="text-xs text-ink-soft">
                {SOURCE_LABEL[lesson.video_source]}
                {lesson.duration_minutes
                  ? ` · ${lesson.duration_minutes} min`
                  : ""}
                {lesson.completions
                  ? ` · completed by ${lesson.completions}`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void run(() =>
                  adminRequest(
                    token,
                    `/api/portal/admin/lessons/${lesson.id}/`,
                    {
                      method: "PATCH",
                      body: { is_published: !lesson.is_published },
                    },
                  ),
                )
              }
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                lesson.is_published
                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                  : "bg-mist text-ink-soft hover:bg-line",
              )}
              title={
                lesson.is_published ? "Click to unpublish" : "Click to publish"
              }
            >
              {lesson.is_published ? "Published" : "Draft"}
            </button>
            <button
              type="button"
              onClick={() => onEditLesson(lesson)}
              className="h-9 rounded-lg border border-line px-3 text-sm font-semibold hover:border-azure"
            >
              Edit
            </button>
          </li>
        ))}
        <li className="px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={onAddLesson}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-azure hover:text-azure-dark"
          >
            <Plus className="size-4" aria-hidden />
            Add lesson
          </button>
        </li>
      </ul>
    </section>
  );
}

function Materials({
  course,
  onChanged,
}: {
  course: AdminCourseDetail;
  onChanged: () => void;
}) {
  const { token, expire } = useAdminSession();
  const [title, setTitle] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    tone: "error" | "success";
    text: string;
  } | null>(null);
  const [formKey, setFormKey] = useState(0);

  async function upload(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !file)
      return setMessage({
        tone: "error",
        text: "Enter a title and choose a file.",
      });
    const form = new FormData();
    form.append("course", String(course.id));
    if (moduleId) form.append("module", moduleId);
    form.append("title", title.trim());
    form.append("description", description.trim());
    form.append("file", file);
    setMessage(null);
    setProgress(0);
    try {
      await adminUpload(
        token,
        "/api/portal/admin/materials/",
        "POST",
        form,
        setProgress,
      );
      setTitle("");
      setDescription("");
      setModuleId("");
      setFile(null);
      setFormKey((key) => key + 1);
      setMessage({ tone: "success", text: "Study material uploaded." });
      onChanged();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      setMessage({
        tone: "error",
        text: err instanceof AdminError ? err.message : "Upload failed.",
      });
    } finally {
      setProgress(null);
    }
  }

  async function act(action: () => Promise<unknown>) {
    try {
      await action();
      onChanged();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      setMessage({
        tone: "error",
        text: err instanceof AdminError ? err.message : "That did not save.",
      });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <form
        key={formKey}
        onSubmit={upload}
        className="grid h-fit gap-4 rounded-2xl border border-line bg-white p-5"
      >
        <h3 className="font-semibold">Upload study material</h3>
        <Field id="mat-title" label="Title">
          <TextInput
            id="mat-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </Field>
        <Field id="mat-module" label="Module" optional>
          <SelectInput
            id="mat-module"
            value={moduleId}
            onChange={(event) => setModuleId(event.target.value)}
          >
            <option value="">Whole course</option>
            {course.modules.map((module) => (
              <option key={module.id} value={module.id}>
                Module {module.number}: {module.title}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field id="mat-desc" label="Short description" optional>
          <TextInput
            id="mat-desc"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={300}
          />
        </Field>
        <Field
          id="mat-file"
          label="File"
          hint="PDF, Word, PowerPoint, Excel or ZIP · max 25 MB"
        >
          <input
            id="mat-file"
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="block w-full rounded-xl border border-line text-sm file:mr-3 file:border-0 file:bg-azure-soft file:px-4 file:py-3 file:font-semibold file:text-azure-dark"
          />
        </Field>
        {progress !== null ? (
          <ProgressBar percent={progress} label="Upload progress" />
        ) : null}
        {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}
        <SubmitButton pending={progress !== null}>
          <Upload className="size-4" aria-hidden />
          Upload
        </SubmitButton>
      </form>

      <div className="rounded-2xl border border-line bg-white">
        {course.materials.length === 0 ? (
          <p className="p-6 text-sm text-ink-soft">
            No study material uploaded for this course yet.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {course.materials.map((material) => {
              const parent = course.modules.find(
                (item) => item.id === material.module,
              );
              return (
                <li
                  key={material.id}
                  className="flex flex-wrap items-center gap-3 p-4"
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-azure-soft text-[10px] font-bold text-azure-dark uppercase">
                    {material.extension}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {material.title}
                    </p>
                    <p className="truncate text-xs text-ink-soft">
                      {parent ? `Module ${parent.number}` : "Whole course"} ·{" "}
                      {formatSize(material.size)} ·{" "}
                      {when(material.uploaded_at, false)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      void act(() =>
                        adminRequest(
                          token,
                          `/api/portal/admin/materials/${material.id}/`,
                          {
                            method: "PATCH",
                            body: { is_published: !material.is_published },
                          },
                        ),
                      )
                    }
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      material.is_published
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-mist text-ink-soft",
                    )}
                  >
                    {material.is_published ? "Published" : "Hidden"}
                  </button>
                  <a
                    href={material.download_url}
                    className="grid size-9 place-items-center rounded-lg hover:bg-mist"
                    aria-label={`Download ${material.title}`}
                  >
                    <Download className="size-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      window.confirm(`Delete “${material.title}”?`) &&
                      void act(() =>
                        adminRequest(
                          token,
                          `/api/portal/admin/materials/${material.id}/`,
                          { method: "DELETE" },
                        ),
                      )
                    }
                    className="grid size-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"
                    aria-label={`Delete ${material.title}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function CourseEditor({ id }: { id: string }) {
  const { token, expire } = useAdminSession();
  const {
    data: course,
    error,
    loading,
    reload,
  } = useAdminData<AdminCourseDetail>(`/api/portal/admin/courses/${id}/`);
  const [tab, setTab] = useState<"curriculum" | "materials" | "batches">(
    "curriculum",
  );
  const [draft, setDraft] = useState<LessonDraft | null>(null);
  const [notice, setNotice] = useState("");
  const [newModule, setNewModule] = useState("");

  if (loading) return <CardSkeleton count={3} />;
  if (error || !course)
    return (
      <ErrorState
        message={error?.message ?? "Course not found."}
        onRetry={reload}
      />
    );

  async function patchCourse(body: Record<string, boolean>) {
    setNotice("");
    try {
      await adminRequest(token, `/api/portal/admin/courses/${id}/`, {
        method: "PATCH",
        body,
      });
      reload();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      setNotice(err instanceof AdminError ? err.message : "That did not save.");
    }
  }

  async function addModule(event: FormEvent) {
    event.preventDefault();
    if (!newModule.trim()) return;
    try {
      await adminRequest(token, "/api/portal/admin/modules/", {
        method: "POST",
        body: { course: course!.id, title: newModule.trim() },
      });
      setNewModule("");
      reload();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      setNotice(
        err instanceof AdminError
          ? err.message
          : "The module could not be added.",
      );
    }
  }

  const lessons = course.modules.flatMap((module) => module.lessons);
  const published = lessons.filter((lesson) => lesson.is_published).length;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-azure"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All courses
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-azure uppercase">
            {course.programme_type} · {course.category_label} ·{" "}
            {course.duration}
          </p>
          <h1 className="mt-1 text-2xl font-bold">{course.title}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {course.modules.length} modules · {published}/{lessons.length}{" "}
            lessons published · {course.students} students enrolled
          </p>
        </div>
        <a
          href={`/courses/${course.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold hover:border-azure"
        >
          <ExternalLink className="size-4" aria-hidden />
          Public course page
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          checked={course.sequential}
          label="Lessons unlock in order"
          description="Students must complete each lesson before the next one opens."
          onChange={(value) => void patchCourse({ sequential: value })}
        />
        <Toggle
          checked={course.is_active}
          label="Course active in the portal"
          description="Inactive courses are hidden from enrolled students."
          onChange={(value) => void patchCourse({ is_active: value })}
        />
      </div>
      {notice ? <Notice tone="error">{notice}</Notice> : null}

      <div
        role="tablist"
        aria-label="Course sections"
        className="flex gap-1 border-b border-line"
      >
        {(
          [
            ["curriculum", `Curriculum (${lessons.length})`],
            ["materials", `Study material (${course.materials.length})`],
            ["batches", `Batches (${course.batches.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 text-sm font-semibold",
              tab === key
                ? "border-azure text-ink"
                : "border-transparent text-ink-soft hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "curriculum" ? (
        <div className="space-y-4">
          {course.modules.map((module) => (
            <ModuleCard
              key={`${module.id}-${module.title}-${module.outcome}`}
              module={module}
              onEditLesson={(lesson) => setDraft({ module: module.id, lesson })}
              onAddLesson={() => setDraft({ module: module.id })}
              onChanged={reload}
              onError={setNotice}
            />
          ))}
          <form
            onSubmit={addModule}
            className="flex flex-wrap gap-2 rounded-2xl border border-dashed border-line bg-white p-4"
          >
            <TextInput
              aria-label="New module title"
              value={newModule}
              onChange={(event) => setNewModule(event.target.value)}
              placeholder="New module title"
              className="h-11 min-w-56 flex-1"
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-ink px-4 text-sm font-semibold text-white hover:bg-azure"
            >
              <Plus className="size-4" aria-hidden />
              Add module
            </button>
          </form>
        </div>
      ) : tab === "materials" ? (
        <Materials course={course} onChanged={reload} />
      ) : (
        <BatchManager courseId={course.id} onChanged={reload} />
      )}

      {draft ? (
        <LessonEditor
          draft={draft}
          onClose={() => setDraft(null)}
          onSaved={() => {
            setDraft(null);
            reload();
          }}
        />
      ) : null}
    </div>
  );
}
