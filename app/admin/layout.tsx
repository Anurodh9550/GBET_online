import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "Admin Panel", template: `%s | ${SITE.name} Admin` },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
