"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Mail, Phone } from "lucide-react";
import { LearningSnapshot } from "@/components/portal/learning/learning-snapshot";
import { useStudent } from "@/components/portal/student-session";
import { formatDate } from "@/lib/portal/client";
import { SITE } from "@/lib/site";

export function StudentOverview() {
  const student = useStudent();
  const firstName = student.full_name.split(" ")[0];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink to-azure-dark p-6 text-white sm:p-8">
        <div className="relative">
          <p className="text-sm text-white/70">Welcome back</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Hello, {firstName}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-white/15 px-3 py-1.5">
              Student ID: {student.student_id ?? "—"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1.5 text-emerald-100">
              <BadgeCheck className="size-3.5" aria-hidden />
              Admission verified{" "}
              {student.verified_at
                ? `on ${formatDate(student.verified_at)}`
                : ""}
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/student/courses"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-ink hover:bg-azure-soft"
            >
              My courses <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/student/profile"
              className="inline-flex h-11 items-center rounded-xl border border-white/30 px-5 text-sm font-semibold hover:bg-white/10"
            >
              My profile
            </Link>
          </div>
        </div>
      </section>

      <LearningSnapshot />

      <div className="grid gap-4 lg:grid-cols-2">
        <section
          aria-labelledby="account-heading"
          className="rounded-2xl border border-line bg-white p-5 sm:p-6"
        >
          <h2 id="account-heading" className="font-semibold">
            Account details
          </h2>
          <dl className="mt-4 divide-y divide-line text-sm">
            {[
              ["Email", student.email],
              ["Mobile", `+91 ${student.mobile}`],
              ["Location", `${student.city}, ${student.state}`],
              ["Course requested", student.course_interest || "—"],
              ["Member since", formatDate(student.created_at)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-ink-soft">{label}</dt>
                <dd className="min-w-0 text-right font-medium break-words">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <section
          aria-labelledby="support-heading"
          className="rounded-2xl border border-line bg-white p-5 sm:p-6"
        >
          <h2 id="support-heading" className="font-semibold">
            Need help?
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            The academic and admissions team can help with your account and
            courses.
          </p>
          <div className="mt-4 grid gap-2 text-sm">
            <a
              href={`tel:${SITE.phoneTel}`}
              className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 hover:border-azure"
            >
              <Phone className="size-4 text-azure" aria-hidden />
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 hover:border-azure"
            >
              <Mail className="size-4 text-azure" aria-hidden />
              {SITE.email}
            </a>
          </div>
          <Link
            href="/student/help"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-azure hover:text-azure-dark"
          >
            Help & Support <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      </div>
    </div>
  );
}
