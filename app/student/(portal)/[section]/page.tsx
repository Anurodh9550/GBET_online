import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { UPCOMING_SECTIONS } from "@/lib/portal/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return UPCOMING_SECTIONS.map((section) => ({ section: section.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/student/[section]">): Promise<Metadata> {
  const { section } = await params;
  return {
    title:
      UPCOMING_SECTIONS.find((item) => item.slug === section)?.label ??
      "Student Portal",
  };
}

export default async function UpcomingSectionPage({
  params,
}: PageProps<"/student/[section]">) {
  const { section: slug } = await params;
  const section = UPCOMING_SECTIONS.find((item) => item.slug === slug);
  if (!section) notFound();
  const Icon = section.icon;

  return (
    <div>
      <h1 className="text-2xl font-bold">{section.label}</h1>
      <div className="mt-6 rounded-3xl border border-dashed border-line bg-white px-6 py-14 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-azure-soft text-azure">
          <Icon className="size-7" aria-hidden />
        </span>
        <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-xs font-semibold text-ink-soft">
          <Clock className="size-3.5" aria-hidden />
          Coming soon
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-soft">
          {section.description}
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-ink-soft">
          This section is being set up and will open here soon.
        </p>
        <Link
          href="/student"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-azure px-5 text-sm font-semibold text-white hover:bg-azure-dark"
        >
          Back to overview
        </Link>
      </div>
    </div>
  );
}
