import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetailsView } from "@/components/courses/course-details-view";
import { CATALOG, getCatalogCourse } from "@/lib/course-catalog";
import { JsonLd, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CATALOG.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const course = getCatalogCourse(slug);
  if (!course) return { title: "Course not found", robots: { index: false } };

  const title = `${course.title} – Online ${course.programmeType}`;
  const description = `${course.summary} ${course.duration}, online. Eligibility: ${course.eligibility}.`;
  const base = pageMetadata(title, description, `/courses/${course.slug}`);
  const image = { url: course.banner, alt: course.title };

  return {
    ...base,
    keywords: [course.title, course.shortTitle, `${course.shortTitle} online course`, course.categoryLabel, SITE.name],
    openGraph: { ...base.openGraph, images: [image] },
    twitter: { ...base.twitter, images: [course.banner] },
  };
}

export default async function CoursePage({ params }: Params) {
  const { slug } = await params;
  const course = getCatalogCourse(slug);
  if (!course) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: course.title,
          description: course.description,
          url: `${SITE.url}/courses/${course.slug}`,
          image: `${SITE.url}${course.banner}`,
          educationalCredentialAwarded: course.programmeType,
          provider: { "@type": "EducationalOrganization", name: SITE.fullName, url: SITE.url },
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "online",
            courseWorkload: course.duration,
          },
          syllabusSections: course.curriculum.map((module) => ({
            "@type": "Syllabus",
            name: `Module ${module.number}: ${module.title}`,
            description: module.topics.join(", "),
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: course.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      <CourseDetailsView course={course} />
    </>
  );
}
