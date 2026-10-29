import { OnlineView } from "@/components/online/online-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Online Courses",
  "Online diploma, degree and certificate courses from Gautam Buddha Technical Education Group. Enquire, download the brochure, or book Noida campus counselling.",
  "/",
);

export default function HomePage() {
  return <OnlineView />;
}
