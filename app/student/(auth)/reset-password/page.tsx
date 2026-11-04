import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/portal/auth/reset-password-form";

export const metadata: Metadata = { title: "Set a New Password" };

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
