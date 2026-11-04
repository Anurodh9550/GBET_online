"use client";

import Image from "next/image";
import { FormEvent, useState, useSyncExternalStore } from "react";
import { Download, FileText, ShieldCheck } from "lucide-react";
import { CourseHeader } from "@/components/courses/course-header";
import {
  Field,
  Notice,
  SelectInput,
  SubmitButton,
  TextInput,
} from "@/components/portal/form-controls";
import { createEnquiry } from "@/lib/api";
import { CATALOG, COURSE_CATEGORIES } from "@/lib/course-catalog";
import { SITE } from "@/lib/site";

const UNLOCK_KEY = "gbet-brochure-unlocked";
const UNLOCK_EVENT = "gbet-brochure-unlocked";

function subscribe(callback: () => void) {
  window.addEventListener(UNLOCK_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(UNLOCK_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function useUnlocked() {
  return useSyncExternalStore(
    subscribe,
    () => window.sessionStorage.getItem(UNLOCK_KEY) === "1",
    () => false,
  );
}

function UnlockForm() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    course: "",
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (form.name.trim().length < 2) return setError("Enter your full name.");
    if (!/^[6-9]\d{9}$/.test(form.mobile))
      return setError("Enter a valid 10-digit mobile number.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return setError("Enter a valid email address.");
    setSending(true);
    setError("");
    try {
      const res = await createEnquiry({
        full_name: form.name.trim(),
        mobile: form.mobile,
        email: form.email.trim(),
        state: "Not given",
        city: "Not given",
        course: form.course || "All course brochures",
        message: "Requested course brochures",
        source: "brochure",
      });
      if (!res.ok) throw new Error();
      window.sessionStorage.setItem(UNLOCK_KEY, "1");
      window.dispatchEvent(new Event(UNLOCK_EVENT));
    } catch {
      setError(
        "The request could not be sent. Check the details or call the admissions team.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="grid gap-4 rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-7"
    >
      <h2 className="text-xl font-bold">Get the brochures</h2>
      <p className="-mt-2 text-sm text-ink-soft">
        Share your details to download the course brochures. An advisor may call
        you to help.
      </p>
      {error ? <Notice tone="error">{error}</Notice> : null}
      <Field id="bro-name" label="Full name">
        <TextInput
          id="bro-name"
          autoComplete="name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="bro-mobile" label="Mobile number">
          <TextInput
            id="bro-mobile"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            value={form.mobile}
            onChange={(event) =>
              setForm({
                ...form,
                mobile: event.target.value.replace(/\D/g, "").slice(0, 10),
              })
            }
          />
        </Field>
        <Field id="bro-email" label="Email">
          <TextInput
            id="bro-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </Field>
      </div>
      <Field id="bro-course" label="Course you are interested in" optional>
        <SelectInput
          id="bro-course"
          value={form.course}
          onChange={(event) => setForm({ ...form, course: event.target.value })}
        >
          <option value="">All courses</option>
          {CATALOG.map((course) => (
            <option key={course.slug}>{course.title}</option>
          ))}
        </SelectInput>
      </Field>
      <p className="flex items-center gap-2 text-xs text-ink-soft">
        <ShieldCheck className="size-4 text-emerald-600" aria-hidden />
        Your details are used only by the GBET admissions team.
      </p>
      <SubmitButton pending={sending}>
        {sending ? "Sending…" : "Show brochures"}
      </SubmitButton>
    </form>
  );
}

function BrochureList() {
  return (
    <div className="space-y-8">
      {COURSE_CATEGORIES.map((category) => {
        const courses = CATALOG.filter(
          (course) => course.category === category.id,
        );
        if (!courses.length) return null;
        return (
          <section key={category.id} aria-labelledby={`cat-${category.id}`}>
            <h2
              id={`cat-${category.id}`}
              className="text-sm font-bold tracking-[0.14em] text-azure uppercase"
            >
              {category.label}
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <li key={course.slug}>
                  <a
                    href={`/brochures/${course.slug}.pdf`}
                    download={`GBET-Online-${course.slug}-brochure.pdf`}
                    className="group flex h-full items-center gap-3 rounded-2xl border border-line bg-white p-3 transition hover:border-azure"
                  >
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-mist">
                      <Image
                        src={course.thumbnail}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-snug font-semibold group-hover:text-azure">
                        {course.title}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-xs text-ink-soft">
                        <FileText className="size-3.5" aria-hidden />
                        PDF · 4 pages · {course.duration}
                      </span>
                    </span>
                    <Download
                      className="size-5 shrink-0 text-azure"
                      aria-hidden
                    />
                    <span className="sr-only">
                      Download {course.title} brochure
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default function BrochurePage() {
  const unlocked = useUnlocked();

  return (
    <div className="bg-white text-ink">
      <CourseHeader />
      <section className="border-b border-line bg-gradient-to-b from-azure-soft/70 to-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-14">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-azure uppercase">
              Admissions {SITE.year}
            </p>
            <h1 className="mt-2 text-[2.1rem] leading-tight font-bold tracking-tight sm:text-5xl">
              Course brochures
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft sm:text-lg">
              Detailed 4-page brochures for all {CATALOG.length} GBET Online
              courses: what you learn, the full curriculum, how classes work,
              career areas and how to apply.
            </p>
          </div>
          {unlocked ? null : <UnlockForm />}
        </div>
      </section>
      {unlocked ? (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          <Notice tone="success" className="mb-8">
            Thank you. Download any brochure below. For fees and batch dates,
            call {SITE.phone}.
          </Notice>
          <BrochureList />
        </div>
      ) : null}
    </div>
  );
}
