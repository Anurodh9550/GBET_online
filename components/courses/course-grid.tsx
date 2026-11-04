import { SearchX } from "lucide-react";
import { CourseCard, CourseCardSkeleton } from "@/components/courses/course-card";
import type { CatalogCourse } from "@/lib/course-catalog";

export function CourseGrid({ courses, onClear }: { courses: CatalogCourse[]; onClear?: () => void }) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-mist px-6 py-14 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-white text-azure shadow-sm">
          <SearchX className="size-5" aria-hidden />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-ink">No courses match your search</h3>
        <p className="mt-1 max-w-sm text-sm text-ink-soft">Try a different course name, or remove a filter to see more programmes.</p>
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink/90"
          >
            Clear all filters
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course, index) => (
        <li key={course.slug}>
          <CourseCard course={course} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}

export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading courses">
      {Array.from({ length: count }, (_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
