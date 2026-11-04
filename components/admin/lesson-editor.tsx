"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ExternalLink, Trash2, X } from "lucide-react";
import { useAdminSession } from "@/components/admin/admin-session";
import {
  Field,
  Notice,
  SubmitButton,
  TextInput,
} from "@/components/portal/form-controls";
import { ProgressBar } from "@/components/portal/ui";
import {
  AdminError,
  adminRequest,
  adminUpload,
  type AdminLesson,
  type VideoSource,
} from "@/lib/admin/api";
import { cn } from "@/lib/utils";

const SOURCES: { id: VideoSource; label: string; hint: string }[] = [
  {
    id: "none",
    label: "No video",
    hint: "Reading lesson – students read the notes below.",
  },
  {
    id: "youtube",
    label: "YouTube",
    hint: "Paste the video link. Set the video to Unlisted on YouTube, not Public.",
  },
  {
    id: "vimeo",
    label: "Vimeo",
    hint: "Paste the Vimeo link. Allow embedding on this website in Vimeo privacy settings.",
  },
  {
    id: "upload",
    label: "Upload file",
    hint: "MP4 or WebM. The file stays private and plays only for enrolled students.",
  },
];

export type LessonDraft = { module: number; lesson?: AdminLesson };

export function LessonEditor({
  draft,
  onClose,
  onSaved,
}: {
  draft: LessonDraft;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { token, expire } = useAdminSession();
  const lesson = draft.lesson;
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [description, setDescription] = useState(lesson?.description ?? "");
  const [source, setSource] = useState<VideoSource>(
    lesson?.video_source ?? "none",
  );
  const [url, setUrl] = useState(lesson?.video_url ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(
    lesson?.duration_minutes ? String(lesson.duration_minutes) : "",
  );
  const [published, setPublished] = useState(lesson?.is_published ?? false);
  const [error, setError] = useState<AdminError | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && !saving && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, saving]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!title.trim())
      return setError(
        new AdminError("Enter a lesson title.", 400, {
          title: ["Enter a lesson title."],
        }),
      );
    if (source === "upload" && !file && !lesson?.video_file_name) {
      return setError(
        new AdminError("Choose a video file to upload.", 400, {
          video_file: ["Choose a video file to upload."],
        }),
      );
    }
    const fields: Record<string, string> = {
      title: title.trim(),
      description,
      video_source: source,
      video_url: source === "youtube" || source === "vimeo" ? url.trim() : "",
      duration_minutes: duration,
      is_published: String(published),
    };
    if (!lesson) fields.module = String(draft.module);
    const path = lesson
      ? `/api/portal/admin/lessons/${lesson.id}/`
      : "/api/portal/admin/lessons/";
    setSaving(true);
    try {
      if (file) {
        const form = new FormData();
        Object.entries(fields).forEach(([key, value]) =>
          form.append(key, value),
        );
        form.append("video_file", file);
        setProgress(0);
        await adminUpload(
          token,
          path,
          lesson ? "PATCH" : "POST",
          form,
          setProgress,
        );
      } else {
        await adminRequest(token, path, {
          method: lesson ? "PATCH" : "POST",
          body: {
            ...fields,
            duration_minutes: duration ? Number(duration) : null,
            is_published: published,
          },
        });
      }
      onSaved();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      setError(
        err instanceof AdminError
          ? err
          : new AdminError("The lesson could not be saved.", 0),
      );
    } finally {
      setSaving(false);
      setProgress(null);
    }
  }

  async function remove() {
    if (
      !lesson ||
      !window.confirm(
        `Delete the lesson “${lesson.title}”? This cannot be undone.`,
      )
    )
      return;
    setSaving(true);
    try {
      await adminRequest(token, `/api/portal/admin/lessons/${lesson.id}/`, {
        method: "DELETE",
      });
      onSaved();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      setError(
        err instanceof AdminError
          ? err
          : new AdminError("The lesson could not be deleted.", 0),
      );
      setSaving(false);
    }
  }

  const fieldError = (name: string) => error?.fields[name]?.[0];
  const generalError =
    error &&
    !["title", "video_url", "video_file", "duration_minutes"].some(
      (key) => error.fields[key],
    )
      ? error.message
      : null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-editor-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/50"
        onClick={() => !saving && onClose()}
        aria-label="Close"
      />
      <div
        ref={dialogRef}
        className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-3xl bg-white sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="lesson-editor-title" className="text-lg font-semibold">
            {lesson ? "Edit lesson" : "Add lesson"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid size-9 place-items-center rounded-full hover:bg-mist"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <form
          onSubmit={submit}
          noValidate
          className="grid gap-5 overflow-y-auto px-6 py-5"
        >
          {generalError ? <Notice tone="error">{generalError}</Notice> : null}
          <Field
            id="lesson-title"
            label="Lesson title"
            error={fieldError("title")}
          >
            <TextInput
              id="lesson-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              invalid={!!fieldError("title")}
            />
          </Field>

          <fieldset>
            <legend className="text-sm font-semibold">Video</legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SOURCES.map((item) => (
                <label
                  key={item.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                    source === item.id
                      ? "border-azure bg-azure-soft text-azure-dark"
                      : "border-line hover:border-azure",
                  )}
                >
                  <input
                    type="radio"
                    name="video-source"
                    value={item.id}
                    checked={source === item.id}
                    onChange={() => setSource(item.id)}
                    className="sr-only"
                  />
                  {item.label}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              {SOURCES.find((item) => item.id === source)?.hint}
            </p>
          </fieldset>

          {source === "youtube" || source === "vimeo" ? (
            <Field
              id="lesson-url"
              label={`${source === "youtube" ? "YouTube" : "Vimeo"} link`}
              error={fieldError("video_url")}
            >
              <TextInput
                id="lesson-url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder={
                  source === "youtube"
                    ? "https://www.youtube.com/watch?v=…"
                    : "https://vimeo.com/…"
                }
                invalid={!!fieldError("video_url")}
              />
            </Field>
          ) : null}

          {source === "upload" ? (
            <Field
              id="lesson-file"
              label="Video file"
              error={fieldError("video_file")}
              hint={
                lesson?.video_file_name
                  ? `Current file: ${lesson.video_file_name}. Choose a new file only to replace it.`
                  : undefined
              }
            >
              <input
                id="lesson-file"
                type="file"
                accept="video/mp4,video/webm,.mp4,.webm"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="block w-full rounded-xl border border-line bg-white text-sm file:mr-3 file:border-0 file:bg-azure-soft file:px-4 file:py-3 file:font-semibold file:text-azure-dark"
              />
            </Field>
          ) : null}

          {lesson?.preview_url && source === lesson.video_source ? (
            <a
              href={lesson.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-azure hover:text-azure-dark"
            >
              <ExternalLink className="size-4" aria-hidden />
              Preview current video
            </a>
          ) : null}

          <Field
            id="lesson-notes"
            label="Lesson notes"
            optional
            hint="Shown under the video. Required for reading lessons."
          >
            <textarea
              id="lesson-notes"
              rows={6}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-xl border border-line px-3.5 py-3 text-sm outline-none focus:border-azure focus:ring-4 focus:ring-azure/15"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="lesson-duration"
              label="Duration (minutes)"
              optional
              error={fieldError("duration_minutes")}
            >
              <TextInput
                id="lesson-duration"
                type="number"
                min={1}
                max={600}
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              />
            </Field>
            <label className="flex items-center gap-3 self-end rounded-xl border border-line px-4 py-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
                className="size-4 accent-[var(--color-azure)]"
              />
              Published (visible to students)
            </label>
          </div>

          {progress !== null ? (
            <div>
              <p className="text-xs text-ink-soft">Uploading… {progress}%</p>
              <ProgressBar
                percent={progress}
                label="Upload progress"
                className="mt-1"
              />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
            <SubmitButton pending={saving}>
              {saving ? "Saving…" : lesson ? "Save lesson" : "Add lesson"}
            </SubmitButton>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-12 rounded-xl px-4 text-sm font-semibold text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
            {lesson ? (
              <button
                type="button"
                onClick={() => void remove()}
                disabled={saving || lesson.completions > 0}
                title={
                  lesson.completions > 0
                    ? "Students have completed this lesson. Unpublish it instead."
                    : undefined
                }
                className="ml-auto inline-flex h-12 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:text-ink-soft/50 disabled:hover:bg-transparent"
              >
                <Trash2 className="size-4" aria-hidden />
                Delete
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
