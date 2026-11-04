import type { Metadata } from "next";
import { FinancePage } from "@/components/admin/finance";

export const metadata: Metadata = { title: "Finance" };

export default function AdminFinancePage() {
  return <FinancePage />;
}
