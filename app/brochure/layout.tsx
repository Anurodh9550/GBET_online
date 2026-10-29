import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Download Brochure",
  "Download the GBTE 2027 admissions brochure after a short enquiry.",
  "/brochure"
);

export default function BrochureLayout({ children }: { children: ReactNode }) {
  return children;
}
