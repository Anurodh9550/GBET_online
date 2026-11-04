import type { Metadata } from "next";
import { AdminCoursesList } from "@/components/admin/courses-list";

export const metadata: Metadata = { title: "Courses & Content" };

export default function AdminCoursesPage() {
  return <AdminCoursesList />;
}
