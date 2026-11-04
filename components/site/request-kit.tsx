"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { createEnquiry, type EnquirySource } from "@/lib/api";

export type RequestPerson = {
  name: string;
  mobile: string;
  email: string;
  state: string;
  city: string;
  course: string;
};

export function validatePerson(person: RequestPerson) {
  if (!/^[A-Za-z][A-Za-z .'-]{1,}$/.test(person.name.trim()))
    return "Enter your full name using letters only.";
  if (!/^[6-9]\d{9}$/.test(person.mobile))
    return "Enter a valid 10-digit mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email.trim()))
    return "Enter a valid email address.";
  if (!person.state) return "Select your state.";
  if (person.city.trim().length < 2) return "Enter your city.";
  return "";
}

export async function sendRequest(
  source: EnquirySource,
  person: RequestPerson,
  details: [string, string][],
) {
  const message = details
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `${label}: ${value.trim()}`)
    .join("\n");
  let res: Response;
  try {
    res = await createEnquiry({
      full_name: person.name.trim(),
      mobile: person.mobile,
      email: person.email.trim(),
      state: person.state,
      city: person.city.trim(),
      course: person.course || "Not decided yet",
      message,
      source,
    });
  } catch {
    throw new Error(
      "The request could not be sent. Check your connection or call the admissions team.",
    );
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as Record<
      string,
      string[]
    >;
    const first = Object.values(data).find((value) =>
      Array.isArray(value),
    )?.[0];
    throw new Error(first ?? "Please check the details and try again.");
  }
}

export function RequestSuccess({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      role="status"
      className="rounded-3xl border border-line bg-white p-8 text-center shadow-sm"
    >
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="size-7" aria-hidden />
      </span>
      <h2 className="mt-4 text-2xl font-bold">{title}</h2>
      <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-soft">
        {children}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/courses"
          className="inline-flex h-11 items-center rounded-xl bg-azure px-5 text-sm font-semibold text-white hover:bg-azure-dark"
        >
          Explore courses
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-xl border border-line px-5 text-sm font-semibold hover:border-azure"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
