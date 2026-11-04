import { Suspense } from "react";
import { CourseHeader } from "@/components/courses/course-header";
import { CompareView } from "@/components/site/compare-view";
import { PageHero } from "@/components/site/page-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Compare Courses",
  "Compare GBET Online courses side by side – duration, eligibility, modules, learning outcomes and career areas.",
  "/compare",
);

export default function ComparePage() {
  return (
    <div className="bg-white text-ink">
      <CourseHeader />
      <PageHero
        crumb="Compare"
        eyebrow="Choose with confidence"
        title="Compare courses"
        intro="Put up to three courses side by side to see how they differ before you apply."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <Suspense>
          <CompareView />
        </Suspense>
      </div>
    </div>
  );
}
