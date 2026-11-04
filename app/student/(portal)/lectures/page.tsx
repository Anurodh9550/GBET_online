import type { Metadata } from "next";
import { VideoLecturesPage } from "@/components/portal/learning/learning-lists";

export const metadata: Metadata = { title: "Video Lectures" };

export default function LecturesPage() {
  return <VideoLecturesPage />;
}
