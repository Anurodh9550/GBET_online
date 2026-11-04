import type { Metadata } from "next";
import { CourseEditor } from "@/components/admin/course-editor";

export const metadata: Metadata = { title: "Edit Course" };

export default async function AdminCourseEditorPage({
  params,
}: PageProps<"/admin/courses/[id]">) {
  const { id } = await params;
  return <CourseEditor id={id} />;
}
