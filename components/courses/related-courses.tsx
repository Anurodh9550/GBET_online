import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import type { CatalogCourse } from "@/lib/course-catalog";

export function RelatedCourses({ courses }: { courses: CatalogCourse[] }) {
  if (courses.length === 0) return null;

  return (
    <section aria-labelledby="related-courses" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-azure uppercase">Keep exploring</p>
          <h2 id="related-courses" className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
            Related courses
          </h2>
        </div>
        <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-azure hover:text-azure-dark">
          View all courses <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <li key={course.slug}>
            <CourseCard course={course} />
          </li>
        ))}
      </ul>
    </section>
  );
}
