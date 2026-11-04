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
  PASSWORD_HINT,
  PasswordInput,
  SubmitButton,
} from "@/components/portal/form-controls";
import { PortalError, portalRequest } from "@/lib/portal/client";

const schema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters."),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    path: ["confirm"],
    message: "Passwords do not match.",
  });
type Values = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const uid = params.get("uid") ?? "";
  const token = params.get("token") ?? "";
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async ({ password }) => {
    setError("");
    try {
      await portalRequest("auth/password-reset/confirm", {
        method: "POST",
        body: { uid, token, password },
      });
      router.replace("/student/login?reset=1");
    } catch (err) {
      if (err instanceof PortalError && err.fields.password?.[0])
        setFieldError("password", { message: err.fields.password[0] });
      else
        setError(
          err instanceof PortalError
            ? err.message
            : "The password could not be set. Please try again.",
        );
    }
  });

  if (!uid || !token) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Invalid link</h1>
        <Notice tone="error" className="mt-6">
          This password link is incomplete. Open the link from your email again,
          or request a new one.
        </Notice>
        <Link
          href="/student/forgot-password"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-azure px-6 text-sm font-semibold text-white hover:bg-azure-dark"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-bold tracking-[0.16em] text-azure uppercase">
        Student portal
      </p>
      <h1 className="mt-2 text-3xl font-bold">Set a new password</h1>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        Choose a password you have not used on other websites.
      </p>
      {error ? (
        <Notice tone="error" className="mt-6">
          {error}{" "}
          <Link
            href="/student/forgot-password"
            className="font-semibold underline"
          >
            Request a new link
          </Link>
        </Notice>
      ) : null}
      <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5">
        <Field
          id="reset-password"
          label="New password"
          hint={PASSWORD_HINT}
          error={errors.password?.message}
        >
          <PasswordInput
            id="reset-password"
            autoComplete="new-password"
            invalid={!!errors.password}
            {...register("password")}
          />
        </Field>
        <Field
          id="reset-confirm"
          label="Confirm new password"
          error={errors.confirm?.message}
        >
          <PasswordInput
            id="reset-confirm"
            autoComplete="new-password"
            invalid={!!errors.confirm}
            {...register("confirm")}
          />
        </Field>
        <SubmitButton pending={isSubmitting}>
          {isSubmitting ? "Saving…" : "Set password"}
        </SubmitButton>
      </form>
    </div>
  );
}
