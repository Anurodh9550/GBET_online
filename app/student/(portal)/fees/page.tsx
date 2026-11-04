import type { Metadata } from "next";
import { StudentFeesPage } from "@/components/portal/fees";

export const metadata: Metadata = { title: "Fees & Payments" };

export default function FeesPage() {
  return <StudentFeesPage />;
}
