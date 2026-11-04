export type NewsKind = "news" | "event" | "announcement";

export type NewsPost = {
  id: number;
  kind: NewsKind;
  title: string;
  slug: string;
  summary: string;
  body: string;
  event_start: string | null;
  event_end: string | null;
  location: string;
  link_url: string;
  link_label: string;
  published_at: string | null;
};

export const KIND_LABEL: Record<NewsKind, string> = {
  news: "News",
  event: "Event",
  announcement: "Announcement",
};

const API = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

export async function fetchNews(): Promise<{
  posts: NewsPost[];
  failed: boolean;
}> {
  try {
    const res = await fetch(`${API}/api/news/`, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    return { posts: (await res.json()) as NewsPost[], failed: false };
  } catch {
    return { posts: [], failed: true };
  }
}

export async function fetchNewsPost(
  slug: string,
): Promise<NewsPost | null | "failed"> {
  try {
    const res = await fetch(`${API}/api/news/${encodeURIComponent(slug)}/`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as NewsPost;
  } catch {
    return "failed";
  }
}

export function splitUpcoming(posts: NewsPost[], now = Date.now()) {
  const upcoming = posts
    .filter(
      (post) =>
        post.kind === "event" &&
        post.event_start &&
        new Date(post.event_end ?? post.event_start).getTime() >= now,
    )
    .sort(
      (a, b) =>
        new Date(a.event_start!).getTime() - new Date(b.event_start!).getTime(),
    );
  return { upcoming, rest: posts.filter((post) => !upcoming.includes(post)) };
}

export function formatEventDate(start: string, end?: string | null) {
  const from = new Date(start);
  const date = from.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  const time = (value: Date) =>
    value.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  return `${date}, ${time(from)}${end ? ` – ${time(new Date(end))}` : ""} IST`;
}

export function formatPublished(value: string | null) {
  return value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      })
    : "";
}
