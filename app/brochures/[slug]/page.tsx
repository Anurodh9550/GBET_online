import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseBrochure } from "@/components/brochure/course-brochure";
import { CATALOG, getCatalogCourse } from "@/lib/course-catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATALOG.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/brochures/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = getCatalogCourse(slug);
  return {
    title: course ? `${course.title} – Brochure` : "Brochure",
    robots: { index: false, follow: false },
  };
}

export default async function CourseBrochurePage({
  params,
}: PageProps<"/brochures/[slug]">) {
  const { slug } = await params;
  const course = getCatalogCourse(slug);
  if (!course) notFound();
  return <CourseBrochure course={course} />;
}
