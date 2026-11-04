import type { Metadata } from "next";
import { StudentProfile } from "@/components/portal/profile";

export const metadata: Metadata = { title: "My Profile" };

export default function StudentProfilePage() {
  return <StudentProfile />;
}
