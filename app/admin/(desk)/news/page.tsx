import type { Metadata } from "next";
import { AdminNewsPage } from "@/components/admin/news";

export const metadata: Metadata = { title: "News & Events" };

export default function NewsAdminPage() {
  return <AdminNewsPage />;
}
