import { ExploreView } from "@/components/online/explore-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "All online courses",
  "Browse GBET Online diploma and certificate batches in design, media, wellness, hospitality and technology. Enquire for Noida counselling.",
  "/courses",
);

export default function CoursesPage() {
  return <ExploreView />;
}
