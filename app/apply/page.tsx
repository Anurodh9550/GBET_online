import { Suspense } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { CourseHeader } from "@/components/courses/course-header";
import { ApplyForm } from "@/components/site/apply-form";
import { PageHero } from "@/components/site/page-hero";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(
  "Apply Online",
  "Apply online for a GBET Online diploma or certificate course. The admissions team calls you for counselling and document verification.",
  "/apply",
);

const STEPS = [
  ["Submit this form", "Tell us the course and your education details."],
  [
    "Counselling call",
    "An advisor confirms eligibility, batch dates and fees.",
  ],
  ["Document verification", "Share your marksheets and ID for verification."],
  [
    "Confirm admission",
    "Receive your fee plan and pay through the student portal or office.",
  ],
  ["Start learning", "Get your student portal login and join your batch."],
];

export default function ApplyPage() {
  return (
    <div className="bg-white text-ink">
      <CourseHeader />
      <PageHero
        crumb="Apply"
        eyebrow={`Admissions ${SITE.year}`}
        title="Apply online"
        intro="Start your application for a GBET Online diploma or certificate course. Applying is free – fees are discussed during counselling."
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_22rem] lg:py-16">
        <Suspense>
          <ApplyForm />
        </Suspense>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-line bg-mist p-6">
            <h2 className="font-semibold">What happens next</h2>
            <ol className="mt-4 space-y-4">
              {STEPS.map(([title, text], index) => (
                <li key={title} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-ink-soft">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl border border-line p-6 text-sm">
            <p className="font-semibold">Keep these ready</p>
            <ul className="mt-3 space-y-2 text-ink-soft">
              {[
                "Class 10 and 12 marksheets",
                "Graduation marksheet (if any)",
                "Photo ID (Aadhaar / PAN / passport)",
                "Category or scholarship documents, if applying",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-azure"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="mt-5 inline-flex items-center gap-2 font-semibold text-azure"
            >
              <Phone className="size-4" aria-hidden />
              Need help? {SITE.phone}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
