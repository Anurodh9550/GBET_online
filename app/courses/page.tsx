import { Suspense } from "react";
import { CoursesPageSkeleton } from "@/components/courses/courses-page-skeleton";
import { ExploreCoursesView } from "@/components/courses/explore-courses-view";
import { CATALOG } from "@/lib/course-catalog";
import { JsonLd, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(
  "Explore Our Courses",
  "Browse GBET Online diploma and certificate courses in AI, design, media, arts, wellness, hospitality and business. Search, filter and enquire online.",
  "/courses",
);

export default function CoursesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "GBET Online courses",
          itemListElement: CATALOG.map((course, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE.url}/courses/${course.slug}`,
            name: course.title,
          })),
        }}
      />
      <Suspense fallback={<CoursesPageSkeleton />}>
        <ExploreCoursesView />
      </Suspense>
    </>
  );
}
