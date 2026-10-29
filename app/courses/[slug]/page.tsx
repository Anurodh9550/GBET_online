import { notFound } from "next/navigation";
import { CourseDetail } from "@/components/online/course-detail";
import { COURSES, getCourse } from "@/lib/courses";
import { pageMetadata, JsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return pageMetadata(course.name, course.overview, `/courses/${course.slug}`);
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: course.name,
          description: course.overview,
          provider: { "@type": "EducationalOrganization", name: SITE.fullName, url: SITE.url },
        }}
      />
      <CourseDetail slug={course.slug} />
    </>
  );
}
