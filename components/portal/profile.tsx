"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, UserRound } from "lucide-react";
import {
  Field,
  Notice,
  PASSWORD_HINT,
  PasswordInput,
  SelectInput,
  SubmitButton,
  TextInput,
} from "@/components/portal/form-controls";
import {
  useStudent,
  useStudentSession,
} from "@/components/portal/student-session";
import {
  PortalError,
  formatDate,
  portalRequest,
  type Student,
} from "@/lib/portal/client";
import { INDIAN_STATES } from "@/lib/site";

const profileSchema = z.object({
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number."),
  state: z.string().min(1, "Select your state."),
  city: z.string().trim().min(2, "Enter your city."),
  address: z.string().trim().max(500, "Keep the address under 500 characters."),
  date_of_birth: z
    .string()
    .refine(
      (value) => !value || new Date(value) < new Date(),
      "Enter a date in the past.",
    )
    .optional(),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Enter your current password."),
    new_password: z.string().min(8, "Use at least 8 characters."),
    confirm: z.string(),
  })
  .refine((values) => values.new_password === values.confirm, {
    path: ["confirm"],
    message: "Passwords do not match.",
  });
type PasswordValues = z.infer<typeof passwordSchema>;

function Card({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-line bg-white p-5 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-azure-soft text-azure">
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-ink-soft">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ProfileForm() {
  const student = useStudent();
  const { updateStudent } = useStudentSession();
  const [status, setStatus] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      mobile: student.mobile,
      state: student.state,
      city: student.city,
      address: student.address,
      date_of_birth: student.date_of_birth ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus(null);
    try {
      const next = await portalRequest<Student>("me", {
        method: "PATCH",
        body: { ...values, date_of_birth: values.date_of_birth || null },
      });
      updateStudent(next);
      reset({
        mobile: next.mobile,
        state: next.state,
        city: next.city,
        address: next.address,
        date_of_birth: next.date_of_birth ?? "",
      });
      setStatus({ tone: "success", message: "Your profile has been updated." });
    } catch (err) {
      if (err instanceof PortalError) {
        for (const field of [
          "mobile",
          "state",
          "city",
          "address",
          "date_of_birth",
        ] as const) {
          if (err.fields[field]?.[0])
            setError(field, { message: err.fields[field][0] });
        }
      }
      setStatus({
        tone: "error",
        message:
          err instanceof PortalError
            ? err.message
            : "Your profile could not be saved.",
      });
    }
  });

  return (
    <Card
      icon={UserRound}
      title="Personal details"
      description="Name and email are managed by the admissions team. Contact them to correct these."
    >
      <dl className="grid gap-3 rounded-2xl bg-mist p-4 text-sm sm:grid-cols-2">
        {[
          ["Full name", student.full_name],
          ["Email", student.email],
          ["Student ID", student.student_id ?? "—"],
          ["Admission verified", formatDate(student.verified_at)],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-ink-soft">{label}</dt>
            <dd className="mt-0.5 font-semibold break-words">{value}</dd>
          </div>
        ))}
      </dl>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-6 grid gap-4 sm:grid-cols-2"
      >
        {status ? (
          <Notice tone={status.tone} className="sm:col-span-2">
            {status.message}
          </Notice>
        ) : null}
        <Field
          id="profile-mobile"
          label="Mobile number"
          error={errors.mobile?.message}
        >
          <TextInput
            id="profile-mobile"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            invalid={!!errors.mobile}
            {...register("mobile", {
              setValueAs: (value: string) => value.replace(/\D/g, ""),
            })}
          />
        </Field>
        <Field
          id="profile-dob"
          label="Date of birth"
          optional
          error={errors.date_of_birth?.message}
        >
          <TextInput
            id="profile-dob"
            type="date"
            invalid={!!errors.date_of_birth}
            {...register("date_of_birth")}
          />
        </Field>
        <Field id="profile-state" label="State" error={errors.state?.message}>
          <SelectInput
            id="profile-state"
            invalid={!!errors.state}
            {...register("state")}
          >
            {INDIAN_STATES.includes(
              student.state as (typeof INDIAN_STATES)[number],
            ) ? null : (
              <option>{student.state}</option>
            )}
            {INDIAN_STATES.map((state) => (
              <option key={state}>{state}</option>
            ))}
          </SelectInput>
        </Field>
        <Field id="profile-city" label="City" error={errors.city?.message}>
          <TextInput
            id="profile-city"
            autoComplete="address-level2"
            invalid={!!errors.city}
            {...register("city")}
          />
        </Field>
        <Field
          id="profile-address"
          label="Address"
          optional
          error={errors.address?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="profile-address"
            rows={3}
            autoComplete="street-address"
            aria-invalid={!!errors.address || undefined}
            className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none focus:border-azure focus:ring-4 focus:ring-azure/15"
            {...register("address")}
          />
        </Field>
        <div className="sm:col-span-2">
          <SubmitButton pending={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Saving…" : isDirty ? "Save changes" : "Saved"}
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}

function ChangePasswordForm() {
  const [status, setStatus] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = handleSubmit(async ({ current_password, new_password }) => {
    setStatus(null);
    try {
      const res = await portalRequest<{ detail: string }>("change-password", {
        method: "POST",
        body: { current_password, new_password },
      });
      reset({ current_password: "", new_password: "", confirm: "" });
      setStatus({
        tone: "success",
        message: `${res.detail} Other devices have been logged out.`,
      });
    } catch (err) {
      if (
        err instanceof PortalError &&
        (err.fields.current_password || err.fields.new_password)
      ) {
        if (err.fields.current_password?.[0])
          setError("current_password", {
            message: err.fields.current_password[0],
          });
        if (err.fields.new_password?.[0])
          setError("new_password", { message: err.fields.new_password[0] });
        return;
      }
      setStatus({
        tone: "error",
        message:
          err instanceof PortalError
            ? err.message
            : "Your password could not be changed.",
      });
    }
  });

  return (
    <Card
      icon={KeyRound}
      title="Change password"
      description="You will stay logged in on this device."
    >
      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        {status ? <Notice tone={status.tone}>{status.message}</Notice> : null}
        <Field
          id="pw-current"
          label="Current password"
          error={errors.current_password?.message}
        >
          <PasswordInput
            id="pw-current"
            autoComplete="current-password"
            invalid={!!errors.current_password}
            {...register("current_password")}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="pw-new"
            label="New password"
            hint={PASSWORD_HINT}
            error={errors.new_password?.message}
          >
            <PasswordInput
              id="pw-new"
              autoComplete="new-password"
              invalid={!!errors.new_password}
              {...register("new_password")}
            />
          </Field>
          <Field
            id="pw-confirm"
            label="Confirm new password"
            error={errors.confirm?.message}
          >
            <PasswordInput
              id="pw-confirm"
              autoComplete="new-password"
              invalid={!!errors.confirm}
              {...register("confirm")}
            />
          </Field>
        </div>
        <div>
          <SubmitButton pending={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Updating…" : "Update password"}
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}

export function StudentProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My profile</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Keep your contact details up to date so the academic team can reach
          you.
        </p>
      </div>
      <ProfileForm />
      <ChangePasswordForm />
    </div>
  );
}
