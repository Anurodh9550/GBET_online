import type { Metadata } from "next";
import { StudentsPage } from "@/components/admin/students-page";

export const metadata: Metadata = { title: "Students" };

export default function AdminStudentsPage() {
  return <StudentsPage />;
}
