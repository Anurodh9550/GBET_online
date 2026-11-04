import type { Metadata } from "next";
import { StudyMaterialsPage } from "@/components/portal/learning/learning-lists";

export const metadata: Metadata = { title: "Study Materials" };

export default function MaterialsPage() {
  return <StudyMaterialsPage />;
}
