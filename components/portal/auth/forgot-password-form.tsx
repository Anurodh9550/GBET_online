"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import {
  Field,
  Notice,
  SubmitButton,
  TextInput,
} from "@/components/portal/form-controls";
import { PortalError, portalRequest } from "@/lib/portal/client";

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email.")
    .email("Enter a valid email address."),
});
type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    try {
      const res = await portalRequest<{ detail: string }>(
        "auth/password-reset",
        { method: "POST", body: values },
      );
      setSent(res.detail);
    } catch (err) {
      setError(
        err instanceof PortalError
          ? err.message
          : "The request could not be sent. Please try again.",
      );
    }
  });

  return (
    <div>
      <Link
        href="/student/login"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-azure"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to login
      </Link>
      <h1 className="mt-6 text-3xl font-bold">Forgot your password?</h1>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        Enter your registered email and we will send you a link to set a new
        password.
      </p>

      {sent ? (
        <Notice tone="success" className="mt-6">
          {sent} The link is valid for 24 hours. Check your spam folder if you
          do not see it.
        </Notice>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5">
          {error ? <Notice tone="error">{error}</Notice> : null}
          <Field id="forgot-email" label="Email" error={errors.email?.message}>
            <TextInput
              id="forgot-email"
              type="email"
              autoComplete="email"
              invalid={!!errors.email}
              {...register("email")}
            />
          </Field>
          <SubmitButton pending={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send reset link"}
          </SubmitButton>
        </form>
      )}
    </div>
  );
}
