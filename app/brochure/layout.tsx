import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Course Brochures",
  "Download detailed brochures for every GBET Online diploma and certificate course: curriculum, learning format, careers and admission process.",
  "/brochure",
);

export default function BrochureLayout({ children }: { children: ReactNode }) {
  return children;
}
