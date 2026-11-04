import type { Metadata } from "next";
import { Suspense } from "react";
import { CoursePlayer } from "@/components/portal/learning/course-player";

export const metadata: Metadata = { title: "Learn" };

export default async function CourseLearningPage({
  params,
}: PageProps<"/student/courses/[slug]">) {
  const { slug } = await params;
  return (
    <Suspense>
      <CoursePlayer slug={slug} />
    </Suspense>
  );
}
