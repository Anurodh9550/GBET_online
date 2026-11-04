import Link from "next/link";
import { SearchX } from "lucide-react";
import { CourseHeader } from "@/components/courses/course-header";

export default function NotFound() {
  return (
    <div className="bg-white text-ink">
      <CourseHeader />
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-azure-soft text-azure">
          <SearchX className="size-6" aria-hidden />
        </span>
        <h1 className="mt-5 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-ink-soft">The page or course you are looking for is not available. Browse our online programmes instead.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/courses" className="rounded-full bg-azure px-6 py-3 text-sm font-semibold text-white hover:bg-azure-dark">
            Explore Our Courses
          </Link>
          <Link href="/" className="rounded-full border border-line px-6 py-3 text-sm font-semibold hover:border-ink/30">
            Go to home page
          </Link>
        </div>
      </div>
    </div>
  );
}
