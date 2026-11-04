"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import {
  Field,
  Notice,
  PASSWORD_HINT,
  PasswordInput,
  SelectInput,
  SubmitButton,
  TextInput,
} from "@/components/portal/form-controls";
import { CATALOG } from "@/lib/course-catalog";
import { PortalError, portalRequest } from "@/lib/portal/client";
import { INDIAN_STATES } from "@/lib/site";

const schema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Enter your full name.")
      .regex(/^[A-Za-z][A-Za-z .'-]+$/, "Use letters only."),
    email: z
      .string()
      .trim()
      .min(1, "Enter your email.")
      .email("Enter a valid email address."),
    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number."),
    state: z.string().min(1, "Select your state."),
    city: z.string().trim().min(2, "Enter your city."),
    course_interest: z.string().optional(),
    password: z.string().min(8, "Use at least 8 characters."),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    path: ["confirm"],
    message: "Passwords do not match.",
  });

type Values = z.infer<typeof schema>;
const FIELDS = [
  "full_name",
  "email",
  "mobile",
  "state",
  "city",
  "course_interest",
  "password",
] as const;

export function RegisterForm() {
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { state: "Uttar Pradesh", course_interest: "" },
  });

  const onSubmit = handleSubmit(async (form) => {
    setError("");
    const values = Object.fromEntries(
      FIELDS.map((field) => [field, form[field] ?? ""]),
    );
    try {
      const res = await portalRequest<{ detail: string }>("auth/register", {
        method: "POST",
        body: values,
      });
      setDone(res.detail);
    } catch (err) {
      if (err instanceof PortalError) {
        let mapped = false;
        for (const field of FIELDS) {
          if (err.fields[field]?.[0]) {
            setFieldError(field, { message: err.fields[field][0] });
            mapped = true;
          }
        }
        if (!mapped) setError(err.message);
      } else {
        setError("The request could not be sent. Please try again.");
      }
    }
  });

  if (done) {
    return (
      <div className="rounded-3xl border border-line bg-white p-7 text-center shadow-sm">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h1 className="mt-4 text-2xl font-bold">Request received</h1>
        <p className="mt-2 text-sm leading-6 text-ink-soft">{done}</p>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          You will get an email when your account is activated.
        </p>
        <Link
          href="/student/login"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-azure px-6 text-sm font-semibold text-white hover:bg-azure-dark"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-bold tracking-[0.16em] text-azure uppercase">
        Student portal
      </p>
      <h1 className="mt-2 text-3xl font-bold">Request student access</h1>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        For students who have taken admission. Your account is activated after
        the admissions team verifies your admission.
      </p>

      {error ? (
        <Notice tone="error" className="mt-6">
          {error}
        </Notice>
      ) : null}

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-6 grid gap-4 sm:grid-cols-2"
      >
        <Field
          id="reg-name"
          label="Full name"
          error={errors.full_name?.message}
          className="sm:col-span-2"
        >
          <TextInput
            id="reg-name"
            autoComplete="name"
            invalid={!!errors.full_name}
            {...register("full_name")}
          />
        </Field>
        <Field id="reg-email" label="Email" error={errors.email?.message}>
          <TextInput
            id="reg-email"
            type="email"
            autoComplete="email"
            invalid={!!errors.email}
            {...register("email")}
          />
        </Field>
        <Field
          id="reg-mobile"
          label="Mobile number"
          error={errors.mobile?.message}
        >
          <TextInput
            id="reg-mobile"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            invalid={!!errors.mobile}
            {...register("mobile", {
              setValueAs: (value: string) => value.replace(/\D/g, ""),
            })}
          />
        </Field>
        <Field id="reg-state" label="State" error={errors.state?.message}>
          <SelectInput
            id="reg-state"
            invalid={!!errors.state}
            {...register("state")}
          >
            {INDIAN_STATES.map((state) => (
              <option key={state}>{state}</option>
            ))}
          </SelectInput>
        </Field>
        <Field id="reg-city" label="City" error={errors.city?.message}>
          <TextInput
            id="reg-city"
            autoComplete="address-level2"
            invalid={!!errors.city}
            {...register("city")}
          />
        </Field>
        <Field
          id="reg-course"
          label="Course you joined"
          optional
          error={errors.course_interest?.message}
          className="sm:col-span-2"
        >
          <SelectInput id="reg-course" {...register("course_interest")}>
            <option value="">Select a course</option>
            {CATALOG.map((course) => (
              <option key={course.slug}>{course.title}</option>
            ))}
          </SelectInput>
        </Field>
        <Field
          id="reg-password"
          label="Create password"
          hint={PASSWORD_HINT}
          error={errors.password?.message}
        >
          <PasswordInput
            id="reg-password"
            autoComplete="new-password"
            invalid={!!errors.password}
            {...register("password")}
          />
        </Field>
        <Field
          id="reg-confirm"
          label="Confirm password"
          error={errors.confirm?.message}
        >
          <PasswordInput
            id="reg-confirm"
            autoComplete="new-password"
            invalid={!!errors.confirm}
            {...register("confirm")}
          />
        </Field>
        <SubmitButton pending={isSubmitting} className="sm:col-span-2">
          {isSubmitting ? "Sending request…" : "Send request"}
        </SubmitButton>
      </form>

      <p className="mt-8 border-t border-line pt-6 text-sm text-ink-soft">
        Already have an account?{" "}
        <Link
          href="/student/login"
          className="font-semibold text-azure hover:text-azure-dark"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
