import type { Metadata } from "next";
import { Suspense } from "react";
import { EnrollmentsPage } from "@/components/admin/enrollments";

export const metadata: Metadata = { title: "Enrolments" };

export default function AdminEnrollmentsPage() {
  return (
    <Suspense>
      <EnrollmentsPage />
    </Suspense>
  );
}
