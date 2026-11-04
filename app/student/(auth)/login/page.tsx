import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/portal/auth/login-form";

export const metadata: Metadata = { title: "Student Login" };

export default function StudentLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
