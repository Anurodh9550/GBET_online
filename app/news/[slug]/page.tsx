import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { CourseHeader } from "@/components/courses/course-header";
import {
  KIND_LABEL,
  fetchNewsPost,
  formatEventDate,
  formatPublished,
} from "@/lib/news";
import { JsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchNewsPost(slug);
  if (!post || post === "failed") return { title: "News & Events" };
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/news/${post.slug}` },
  };
}

export default async function NewsPostPage({
  params,
}: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const post = await fetchNewsPost(slug);
  if (post === null) notFound();

  return (
    <div className="bg-white text-ink">
      <CourseHeader />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-azure"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All news & events
        </Link>
        {post === "failed" ? (
          <p
            role="alert"
            className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"
          >
            This update could not be loaded right now. Please try again in a few
            minutes.
          </p>
        ) : (
          <>
            {post.kind === "event" && post.event_start ? (
              <JsonLd
                data={{
                  "@context": "https://schema.org",
                  "@type": "Event",
                  name: post.title,
                  description: post.summary,
                  startDate: post.event_start,
                  ...(post.event_end ? { endDate: post.event_end } : {}),
                  eventAttendanceMode: /online|zoom|meet|webinar/i.test(
                    post.location,
                  )
                    ? "https://schema.org/OnlineEventAttendanceMode"
                    : "https://schema.org/OfflineEventAttendanceMode",
                  location: post.location
                    ? { "@type": "Place", name: post.location }
                    : undefined,
                  organizer: {
                    "@type": "EducationalOrganization",
                    name: SITE.name,
                    url: SITE.url,
                  },
                }}
              />
            ) : null}
            <p className="mt-8 text-xs font-bold tracking-[0.16em] text-azure uppercase">
              {KIND_LABEL[post.kind]} · {formatPublished(post.published_at)}
            </p>
            <h1 className="mt-2 text-3xl leading-tight font-bold sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-ink-soft">
              {post.summary}
            </p>
            {post.kind === "event" && post.event_start ? (
              <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-mist p-5 text-sm">
                <p className="flex items-start gap-2.5">
                  <CalendarDays
                    className="mt-0.5 size-4 shrink-0 text-azure"
                    aria-hidden
                  />
                  {formatEventDate(post.event_start, post.event_end)}
                </p>
                {post.location ? (
                  <p className="flex items-start gap-2.5">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-azure"
                      aria-hidden
                    />
                    {post.location}
                  </p>
                ) : null}
              </div>
            ) : null}
            {post.body ? (
              <div className="mt-8 text-[15px] leading-8 whitespace-pre-line">
                {post.body}
              </div>
            ) : null}
            {post.link_url ? (
              <a
                href={post.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-azure px-6 text-sm font-semibold text-white hover:bg-azure-dark"
              >
                {post.link_label ||
                  (post.kind === "event" ? "Register" : "Learn more")}
                <ExternalLink className="size-4" aria-hidden />
              </a>
            ) : null}
          </>
        )}
      </article>
    </div>
  );
}
