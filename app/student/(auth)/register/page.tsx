import type { Metadata } from "next";
import { RegisterForm } from "@/components/portal/auth/register-form";

export const metadata: Metadata = { title: "Request Student Access" };

export default function StudentRegisterPage() {
  return <RegisterForm />;
}
