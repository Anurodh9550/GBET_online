import type { Metadata } from "next";
import { CourseProgressPage } from "@/components/portal/learning/learning-lists";

export const metadata: Metadata = { title: "Course Progress" };

export default function ProgressPage() {
  return <CourseProgressPage />;
}
