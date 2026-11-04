import type { Metadata } from "next";
import { StudentOverview } from "@/components/portal/overview";

export const metadata: Metadata = { title: "Overview" };

export default function StudentDashboardPage() {
  return <StudentOverview />;
}
