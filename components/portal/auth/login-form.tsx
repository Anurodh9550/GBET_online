"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Field,
  Notice,
  PasswordInput,
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
  password: z.string().min(1, "Enter your password."),
});

type Values = z.infer<typeof schema>;

function safeNext(value: string | null) {
  return value && value.startsWith("/student") && !value.startsWith("//")
    ? value
    : "/student";
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<{ message: string; code?: string } | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await portalRequest("login", { method: "POST", body: values });
      router.replace(safeNext(params.get("next")));
      router.refresh();
    } catch (err) {
      setError(
        err instanceof PortalError
          ? { message: err.message, code: err.code }
          : { message: "Login failed. Please try again." },
      );
    }
  });

  return (
    <div>
      <p className="text-xs font-bold tracking-[0.16em] text-azure uppercase">
        Student portal
      </p>
      <h1 className="mt-2 text-3xl font-bold">Log in to your account</h1>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        Use the email registered with the GBET admissions team.
      </p>

      <div className="mt-6 space-y-3">
        {params.get("expired") ? (
          <Notice tone="info">Your session ended. Please log in again.</Notice>
        ) : null}
        {params.get("reset") ? (
          <Notice tone="success">
            Your password has been set. Log in with your new password.
          </Notice>
        ) : null}
        {params.get("logout") ? (
          <Notice tone="success">You have been logged out securely.</Notice>
        ) : null}
        {error ? (
          <Notice tone={error.code === "pending" ? "info" : "error"}>
            {error.message}
          </Notice>
        ) : null}
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5">
        <Field id="login-email" label="Email" error={errors.email?.message}>
          <TextInput
            id="login-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            invalid={!!errors.email}
            {...register("email")}
          />
        </Field>
        <Field
          id="login-password"
          label="Password"
          error={errors.password?.message}
        >
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            invalid={!!errors.password}
            {...register("password")}
          />
        </Field>
        <div className="-mt-2 text-right">
          <Link
            href="/student/forgot-password"
            className="text-sm font-semibold text-azure hover:text-azure-dark"
          >
            Forgot password?
          </Link>
        </div>
        <SubmitButton pending={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </SubmitButton>
      </form>

      <p className="mt-8 border-t border-line pt-6 text-sm text-ink-soft">
        Joined a course but have no account?{" "}
        <Link
          href="/student/register"
          className="font-semibold text-azure hover:text-azure-dark"
        >
          Request student access
        </Link>
      </p>
    </div>
  );
}
