"use client";

import { FormEvent, useState } from "react";
import { ExternalLink, Newspaper, Pencil, Plus, Trash2 } from "lucide-react";
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
import { AdminError, adminRequest, when } from "@/lib/admin/api";
import { KIND_LABEL, type NewsKind, type NewsPost } from "@/lib/news";
import { cn } from "@/lib/utils";

type AdminPost = NewsPost & { is_published: boolean; updated_at: string };

const EMPTY = {
  kind: "news" as NewsKind,
  title: "",
  summary: "",
  body: "",
  event_start: "",
  event_end: "",
  location: "",
  link_url: "",
  link_label: "",
  is_published: false,
};

function toLocalInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function PostEditor({
  post,
  onDone,
  onCancel,
}: {
  post: AdminPost | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { token, expire } = useAdminSession();
  const [form, setForm] = useState(
    post
      ? {
          kind: post.kind,
          title: post.title,
          summary: post.summary,
          body: post.body,
          event_start: toLocalInput(post.event_start),
          event_end: toLocalInput(post.event_end),
          location: post.location,
          link_url: post.link_url,
          link_label: post.link_label,
          is_published: post.is_published,
        }
      : EMPTY,
  );
  const [error, setError] = useState<AdminError | null>(null);
  const [saving, setSaving] = useState(false);
  const set =
    (key: keyof typeof form) => (event: { target: { value: string } }) =>
      setForm({ ...form, [key]: event.target.value });

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const body = {
      ...form,
      event_start: form.event_start
        ? new Date(form.event_start).toISOString()
        : null,
      event_end: form.event_end ? new Date(form.event_end).toISOString() : null,
    };
    try {
      await adminRequest(
        token,
        post ? `/api/portal/admin/news/${post.id}/` : "/api/portal/admin/news/",
        { method: post ? "PATCH" : "POST", body },
      );
      onDone();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      setError(
        err instanceof AdminError ? err : new AdminError("Could not save.", 0),
      );
    } finally {
      setSaving(false);
    }
  }

  const fieldError = (name: string) => error?.fields[name]?.[0];

  return (
    <form
      onSubmit={submit}
      noValidate
      className="grid gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2"
    >
      <h2 className="text-lg font-semibold sm:col-span-2">
        {post ? "Edit post" : "New post"}
      </h2>
      {error &&
      !Object.keys(error.fields).some((key) =>
        ["title", "summary", "event_start", "event_end", "link_url"].includes(
          key,
        ),
      ) ? (
        <Notice tone="error" className="sm:col-span-2">
          {error.message}
        </Notice>
      ) : null}
      <Field id="news-kind" label="Type">
        <SelectInput id="news-kind" value={form.kind} onChange={set("kind")}>
          {(Object.keys(KIND_LABEL) as NewsKind[]).map((kind) => (
            <option key={kind} value={kind}>
              {KIND_LABEL[kind]}
            </option>
          ))}
        </SelectInput>
      </Field>
      <label className="flex items-center gap-3 self-end rounded-xl border border-line px-4 py-3 text-sm font-semibold">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(event) =>
            setForm({ ...form, is_published: event.target.checked })
          }
          className="size-4 accent-[var(--color-azure)]"
        />
        Published on the website
      </label>
      <Field
        id="news-title"
        label="Title"
        error={fieldError("title")}
        className="sm:col-span-2"
      >
        <TextInput
          id="news-title"
          value={form.title}
          onChange={set("title")}
          maxLength={180}
          invalid={!!fieldError("title")}
        />
      </Field>
      <Field
        id="news-summary"
        label="Short summary"
        error={fieldError("summary")}
        hint="Shown on the list (max 300 characters)"
        className="sm:col-span-2"
      >
        <TextInput
          id="news-summary"
          value={form.summary}
          onChange={set("summary")}
          maxLength={300}
          invalid={!!fieldError("summary")}
        />
      </Field>
      {form.kind === "event" ? (
        <>
          <Field
            id="news-start"
            label="Event starts"
            error={fieldError("event_start")}
          >
            <TextInput
              id="news-start"
              type="datetime-local"
              value={form.event_start}
              onChange={set("event_start")}
              invalid={!!fieldError("event_start")}
            />
          </Field>
          <Field
            id="news-end"
            label="Event ends"
            optional
            error={fieldError("event_end")}
          >
            <TextInput
              id="news-end"
              type="datetime-local"
              value={form.event_end}
              onChange={set("event_end")}
              invalid={!!fieldError("event_end")}
            />
          </Field>
          <Field
            id="news-location"
            label="Location"
            optional
            hint="e.g. Online (Zoom) or C-77, Sector 63A, Noida"
            className="sm:col-span-2"
          >
            <TextInput
              id="news-location"
              value={form.location}
              onChange={set("location")}
            />
          </Field>
        </>
      ) : null}
      <Field
        id="news-body"
        label="Full text"
        optional
        className="sm:col-span-2"
      >
        <textarea
          id="news-body"
          rows={7}
          value={form.body}
          onChange={set("body")}
          className="w-full rounded-xl border border-line px-3.5 py-3 text-sm outline-none focus:border-azure focus:ring-4 focus:ring-azure/15"
        />
      </Field>
      <Field
        id="news-link"
        label="Link"
        optional
        error={fieldError("link_url")}
        hint="Registration, webinar or reference link"
      >
        <TextInput
          id="news-link"
          type="url"
          value={form.link_url}
          onChange={set("link_url")}
          placeholder="https://"
          invalid={!!fieldError("link_url")}
        />
      </Field>
      <Field id="news-link-label" label="Button text" optional>
        <TextInput
          id="news-link-label"
          value={form.link_label}
          onChange={set("link_label")}
          placeholder={form.kind === "event" ? "Register" : "Learn more"}
          maxLength={60}
        />
      </Field>
      <div className="flex gap-3 sm:col-span-2">
        <SubmitButton pending={saving}>
          {saving ? "Saving…" : post ? "Save changes" : "Create post"}
        </SubmitButton>
        <button
          type="button"
          onClick={onCancel}
          className="h-12 rounded-xl px-4 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function AdminNewsPage() {
  const { token, expire } = useAdminSession();
  const { data, error, loading, reload } = useAdminData<AdminPost[]>(
    "/api/portal/admin/news/",
  );
  const [editing, setEditing] = useState<AdminPost | "new" | null>(null);
  const [message, setMessage] = useState("");

  async function remove(post: AdminPost) {
    if (!window.confirm(`Delete “${post.title}”?`)) return;
    try {
      await adminRequest(token, `/api/portal/admin/news/${post.id}/`, {
        method: "DELETE",
      });
      reload();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      setMessage(err instanceof AdminError ? err.message : "Could not delete.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="News & Events"
        description="Announcements, news and events shown on the website's News & Events page."
        action={
          editing ? null : (
            <button
              type="button"
              onClick={() => setEditing("new")}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-azure px-4 text-sm font-semibold text-white hover:bg-azure-dark"
            >
              <Plus className="size-4" aria-hidden />
              New post
            </button>
          )
        }
      />
      {message ? <Notice tone="error">{message}</Notice> : null}
      {editing ? (
        <PostEditor
          key={editing === "new" ? "new" : editing.id}
          post={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onDone={() => {
            setEditing(null);
            reload();
          }}
        />
      ) : null}
      {loading ? (
        <CardSkeleton count={2} />
      ) : error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : !data?.length ? (
        <EmptyState icon={Newspaper} title="No posts yet">
          Create an announcement, news item or event. Only published posts
          appear on the website.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
          {data.map((post) => (
            <li key={post.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{post.title}</p>
                <p className="text-xs text-ink-soft">
                  {KIND_LABEL[post.kind]}
                  {post.event_start ? ` · ${when(post.event_start)}` : ""} ·
                  updated {when(post.updated_at)}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  post.is_published
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-mist text-ink-soft",
                )}
              >
                {post.is_published ? "Published" : "Draft"}
              </span>
              {post.is_published ? (
                <a
                  href={`/news/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-9 place-items-center rounded-lg hover:bg-mist"
                  aria-label={`View ${post.title}`}
                >
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => setEditing(post)}
                className="grid size-9 place-items-center rounded-lg hover:bg-mist"
                aria-label={`Edit ${post.title}`}
              >
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => void remove(post)}
                className="grid size-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"
                aria-label={`Delete ${post.title}`}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
