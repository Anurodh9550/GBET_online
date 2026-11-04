import type { Metadata } from "next";
import { MyCourses } from "@/components/portal/learning/my-courses";

export const metadata: Metadata = { title: "My Courses" };

export default function MyCoursesPage() {
  return <MyCourses />;
}
