import { CourseGridSkeleton } from "@/components/courses/course-grid";

export function CoursesPageSkeleton() {
  return (
    <div className="bg-white">
      <div className="h-[4.25rem] border-b border-line" />
      <div className="border-b border-line bg-gradient-to-b from-azure-soft/70 to-white">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-10 sm:px-6">
          <div className="h-4 w-32 animate-pulse rounded bg-mist" />
          <div className="h-10 w-72 max-w-full animate-pulse rounded-lg bg-mist" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-mist" />
          <div className="h-14 w-full max-w-3xl animate-pulse rounded-2xl bg-mist" />
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[16.5rem_1fr]">
        <div className="hidden h-96 animate-pulse rounded-2xl bg-mist lg:block" />
        <CourseGridSkeleton />
      </div>
    </div>
  );
}

export function CourseDetailSkeleton() {
  return (
    <div className="bg-white" role="status" aria-label="Loading course">
      <div className="h-[4.25rem] border-b border-line" />
      <div className="border-b border-line bg-gradient-to-b from-azure-soft/70 to-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-4 w-40 animate-pulse rounded bg-mist" />
            <div className="h-12 w-4/5 animate-pulse rounded-lg bg-mist" />
            <div className="h-4 w-full animate-pulse rounded bg-mist" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-2xl bg-mist" />
              ))}
            </div>
          </div>
          <div className="aspect-[4/3] animate-pulse rounded-3xl bg-mist" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl space-y-3 px-4 py-12 sm:px-6">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-2xl bg-mist" />
        ))}
      </div>
    </div>
  );
}
