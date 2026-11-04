import type { Metadata } from "next";
import { BatchesPage } from "@/components/admin/batches";

export const metadata: Metadata = { title: "Batches" };

export default function AdminBatchesPage() {
  return <BatchesPage />;
}
