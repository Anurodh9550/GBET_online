"use client";

import { useId, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Phone } from "lucide-react";
import { createEnquiry } from "@/lib/api";
import { CATALOG } from "@/lib/course-catalog";
import { INDIAN_STATES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(120, "Name is too long.")
    .regex(/^[\p{L} .'-]+$/u, "Use letters only."),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
  email: z.string().trim().email("Enter a valid email address."),
  state: z.string().min(2, "Select your state."),
  city: z.string().trim().min(2, "Enter your city.").max(80, "City name is too long."),
  course: z.string().min(1, "Select a course."),
  message: z.string().trim().max(500, "Keep the message under 500 characters.").optional(),
});

type EnquiryValues = z.infer<typeof schema>;

type Status = { type: "idle" } | { type: "success"; name: string; mobile: string } | { type: "error"; message: string };

const fieldClass =
  "h-12 w-full min-w-0 rounded-xl border bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-azure focus:ring-4 focus:ring-azure/15";

function Field({
  id,
  label,
  error,
  required = true,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-red-600"> *</span> : <span className="font-normal text-ink-soft"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AdmissionEnquiryForm({
  defaultCourse,
  title = "Admission enquiry",
  description = "Share your details and the admissions team will call you to discuss the course, eligibility and fees.",
}: {
  defaultCourse?: string;
  title?: string;
  description?: string;
}) {
  const uid = useId();
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const form = useForm<EnquiryValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      mobile: "",
      email: "",
      state: "Uttar Pradesh",
      city: "",
      course: defaultCourse ?? "",
      message: "",
    },
  });
  const { errors, isSubmitting } = form.formState;
  const id = (name: keyof EnquiryValues) => `${uid}-${name}`;
  const a11y = (name: keyof EnquiryValues) => ({
    id: id(name),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id(name)}-error` : undefined,
  });
  const border = (name: keyof EnquiryValues) => (errors[name] ? "border-red-400" : "border-line");

  async function onSubmit(values: EnquiryValues) {
    setStatus({ type: "idle" });
    try {
      const res = await createEnquiry({
        full_name: values.fullName,
        mobile: values.mobile,
        email: values.email,
        state: values.state,
        city: values.city,
        course: values.course,
        message: values.message ?? "",
        source: "website",
      });
      if (!res.ok) {
        setStatus({ type: "error", message: "We could not send your enquiry. Please check your details and try again." });
        return;
      }
      setStatus({ type: "success", name: values.fullName.split(" ")[0], mobile: values.mobile });
      form.reset({ ...form.getValues(), fullName: "", mobile: "", email: "", city: "", message: "" });
    } catch {
      setStatus({
        type: "error",
        message: "We could not reach the admissions server. Please try again in a moment, or call us directly.",
      });
    }
  }

  if (status.type === "success") {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <CheckCircle2 className="size-10 text-emerald-600" aria-hidden />
        <h3 className="mt-4 text-xl font-semibold text-ink">Thank you, {status.name}. Your enquiry has been received.</h3>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          The admissions team will call you on <span className="font-semibold text-ink">+91 {status.mobile}</span> to discuss the course,
          eligibility and fees.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ type: "idle" })}
          className="mt-6 rounded-full border border-ink/20 bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:border-ink/40"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      aria-labelledby={`${uid}-title`}
      className="rounded-2xl border border-line bg-white p-5 shadow-[0_18px_40px_-28px_rgba(11,31,58,0.35)] sm:p-7"
    >
      <h3 id={`${uid}-title`} className="text-xl font-semibold text-ink">
        {title}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">{description}</p>

      <div className="mt-6 grid gap-4">
        <Field id={id("fullName")} label="Full Name" error={errors.fullName?.message}>
          <input {...form.register("fullName")} {...a11y("fullName")} autoComplete="name" placeholder="Your full name" className={cn(fieldClass, border("fullName"))} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={id("mobile")} label="Mobile Number" error={errors.mobile?.message}>
            <div className={cn("flex h-12 overflow-hidden rounded-xl border bg-white focus-within:border-azure focus-within:ring-4 focus-within:ring-azure/15", border("mobile"))}>
              <span className="grid place-items-center border-r border-line bg-mist px-3 text-sm font-medium text-ink-soft">+91</span>
              <input
                {...form.register("mobile", { setValueAs: (value: string) => value.replace(/\D/g, "") })}
                {...a11y("mobile")}
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel-national"
                placeholder="10-digit number"
                className="w-full min-w-0 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-ink-soft/60"
              />
            </div>
          </Field>
          <Field id={id("email")} label="Email" error={errors.email?.message}>
            <input {...form.register("email")} {...a11y("email")} type="email" autoComplete="email" placeholder="you@example.com" className={cn(fieldClass, border("email"))} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={id("state")} label="State" error={errors.state?.message}>
            <select {...form.register("state")} {...a11y("state")} className={cn(fieldClass, border("state"))}>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </Field>
          <Field id={id("city")} label="City" error={errors.city?.message}>
            <input {...form.register("city")} {...a11y("city")} autoComplete="address-level2" placeholder="Your city" className={cn(fieldClass, border("city"))} />
          </Field>
        </div>

        <Field id={id("course")} label="Course Interested In" error={errors.course?.message}>
          <select {...form.register("course")} {...a11y("course")} className={cn(fieldClass, border("course"))}>
            <option value="">Select a course</option>
            {CATALOG.map((course) => (
              <option key={course.slug} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </Field>

        <Field id={id("message")} label="Message" required={false} error={errors.message?.message}>
          <textarea
            {...form.register("message")}
            {...a11y("message")}
            rows={4}
            placeholder="Anything you would like to ask the admissions team"
            className={cn(fieldClass, "h-auto py-3", border("message"))}
          />
        </Field>
      </div>

      {status.type === "error" ? (
        <div role="alert" className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p>{status.message}</p>
            <a href={`tel:${SITE.phoneTel}`} className="mt-1 inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline">
              <Phone className="size-3.5" aria-hidden />
              {SITE.phone}
            </a>
          </div>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-azure text-sm font-semibold text-white transition hover:bg-azure-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
          </>
        ) : (
          "Submit Enquiry"
        )}
      </button>
      <p className="mt-3 text-center text-xs text-ink-soft">Your details are used only to respond to this enquiry.</p>
    </form>
  );
}
