import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Megaphone,
  Newspaper,
} from "lucide-react";
import { CourseHeader } from "@/components/courses/course-header";
import { PageHero } from "@/components/site/page-hero";
import {
  KIND_LABEL,
  fetchNews,
  formatEventDate,
  formatPublished,
  splitUpcoming,
  type NewsPost,
} from "@/lib/news";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata(
  "News & Events",
  "Latest announcements, news and upcoming events from GBET Online – webinars, admission updates and batch information.",
  "/news",
);

function PostCard({ post }: { post: NewsPost }) {
  const Icon =
    post.kind === "event"
      ? CalendarDays
      : post.kind === "announcement"
        ? Megaphone
        : Newspaper;
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition hover:border-azure">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-azure-soft px-2.5 py-1 font-semibold text-azure-dark">
          <Icon className="size-3.5" aria-hidden />
          {KIND_LABEL[post.kind]}
        </span>
        <span className="text-ink-soft">
          {formatPublished(post.published_at)}
        </span>
      </div>
      <h3 className="mt-3 text-lg leading-snug font-semibold">
        <Link href={`/news/${post.slug}`} className="hover:text-azure">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{post.summary}</p>
      {post.kind === "event" && post.event_start ? (
        <p className="mt-3 flex items-start gap-2 text-xs font-medium">
          <CalendarDays
            className="mt-0.5 size-3.5 shrink-0 text-azure"
            aria-hidden
          />
          {formatEventDate(post.event_start, post.event_end)}
        </p>
      ) : null}
      <Link
        href={`/news/${post.slug}`}
        className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-azure hover:text-azure-dark"
      >
        Read more <ArrowRight className="size-4" aria-hidden />
      </Link>
    </article>
  );
}

export default async function NewsPage() {
  const { posts, failed } = await fetchNews();
  const { upcoming, rest } = splitUpcoming(posts);

  return (
    <div className="bg-white text-ink">
      <CourseHeader />
      <PageHero
        crumb="News & Events"
        eyebrow="Updates"
        title="News & events"
        intro="Admission updates, announcements and upcoming webinars and events from GBET Online."
      />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:py-16">
        {failed ? (
          <p
            role="alert"
            className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"
          >
            News could not be loaded right now. Please try again in a few
            minutes.
          </p>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-mist px-6 py-14 text-center">
            <Newspaper className="mx-auto size-10 text-azure" aria-hidden />
            <h2 className="mt-4 text-lg font-semibold">No updates yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              News, announcements and event dates will appear here. For
              admission updates, book a free counselling call.
            </p>
            <Link
              href="/counselling"
              className="mt-6 inline-flex h-11 items-center rounded-xl bg-azure px-5 text-sm font-semibold text-white hover:bg-azure-dark"
            >
              Book counselling
            </Link>
          </div>
        ) : (
          <>
            {upcoming.length ? (
              <section aria-labelledby="upcoming">
                <h2 id="upcoming" className="text-2xl font-bold">
                  Upcoming events
                </h2>
                <ul className="mt-5 grid gap-4 md:grid-cols-2">
                  {upcoming.map((post) => (
                    <li
                      key={post.id}
                      className="flex gap-5 rounded-2xl bg-ink p-5 text-white"
                    >
                      <div className="grid w-16 shrink-0 place-items-center rounded-xl bg-white/10 py-2 text-center">
                        <span className="text-xs uppercase">
                          {new Date(post.event_start!).toLocaleDateString(
                            "en-IN",
                            { month: "short", timeZone: "Asia/Kolkata" },
                          )}
                        </span>
                        <span className="text-2xl font-bold">
                          {new Date(post.event_start!).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", timeZone: "Asia/Kolkata" },
                          )}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold">
                          <Link
                            href={`/news/${post.slug}`}
                            className="hover:underline"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-white/75">
                          {post.summary}
                        </p>
                        <p className="mt-2 text-xs text-white/70">
                          {formatEventDate(post.event_start!, post.event_end)}
                        </p>
                        {post.location ? (
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
                            <MapPin className="size-3.5" aria-hidden />
                            {post.location}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {rest.length ? (
              <section aria-labelledby="latest">
                <h2 id="latest" className="text-2xl font-bold">
                  Latest news & announcements
                </h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <li key={post.id}>
                      <PostCard post={post} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
