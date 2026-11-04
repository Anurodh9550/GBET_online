import Image from "next/image";
import { BadgeCheck, FileText, Info } from "lucide-react";
import { CourseHeader } from "@/components/courses/course-header";
import { PageHero } from "@/components/site/page-hero";
import { ScholarshipForm } from "@/components/site/scholarship-form";
import { SCHOLARSHIPS } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Scholarships",
  "Scholarship categories at Gautam Buddha Educational Trust – merit, girl child, sports and economically weaker section. Eligibility and concession are confirmed during counselling.",
  "/scholarships",
);

const ONLINE_TEXT: Record<string, { detail: string; eligibility: string }> = {
  merit: {
    detail: "Recognises strong academic performance.",
    eligibility: "Applicants with strong Class 12 or graduation marks.",
  },
  "girl-child": {
    detail: "Encourages women learners to build professional skills.",
    eligibility:
      "Women applicants for GBET Online diploma and certificate courses.",
  },
  sports: {
    detail: "For state, national and university-level sportspersons.",
    eligibility:
      "State, national or university sporting credentials that are still valid.",
  },
  ews: {
    detail: "Income-linked support with transparent documentation.",
    eligibility: "A valid income / EWS certificate for the current session.",
  },
};

export default function ScholarshipsPage() {
  return (
    <div className="bg-white text-ink">
      <CourseHeader />
      <PageHero
        crumb="Scholarships"
        eyebrow="Financial support"
        title="Scholarships"
        intro="Gautam Buddha Educational Trust offers scholarship categories to support deserving learners. Check the categories below and request an eligibility check."
      >
        <div className="mt-6 flex max-w-3xl items-start gap-3 rounded-2xl border border-azure/20 bg-white/80 p-4 text-sm text-ink-soft">
          <Info className="mt-0.5 size-5 shrink-0 text-azure" aria-hidden />
          <p>
            Availability for each online course, the exact concession and the
            documents required are confirmed by the admissions team during
            counselling. A scholarship is applied only after document
            verification.
          </p>
        </div>
      </PageHero>

      <section
        aria-labelledby="categories"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16"
      >
        <h2 id="categories" className="text-2xl font-bold">
          Scholarship categories
        </h2>
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {SCHOLARSHIPS.map((item) => (
            <li
              key={item.slug}
              className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white sm:flex-row"
            >
              <div className="relative h-40 shrink-0 bg-mist sm:h-auto sm:w-40">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 160px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <span className="rounded-full bg-azure-soft px-3 py-1 text-xs font-semibold text-azure-dark">
                    {item.amount}*
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-soft">
                  {ONLINE_TEXT[item.slug]?.detail ?? item.detail}
                </p>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div className="flex gap-2.5">
                    <BadgeCheck
                      className="mt-0.5 size-4 shrink-0 text-azure"
                      aria-hidden
                    />
                    <div>
                      <dt className="font-semibold">Who can apply</dt>
                      <dd className="text-ink-soft">
                        {ONLINE_TEXT[item.slug]?.eligibility ??
                          item.eligibility}
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <FileText
                      className="mt-0.5 size-4 shrink-0 text-azure"
                      aria-hidden
                    />
                    <div>
                      <dt className="font-semibold">Documents</dt>
                      <dd className="text-ink-soft">{item.docs}</dd>
                    </div>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-soft">
          * As published by Gautam Buddha Educational Trust. The concession for
          your course is confirmed in writing in your fee plan.
        </p>
      </section>

      <section className="border-t border-line bg-mist">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-azure uppercase">
              How it works
            </p>
            <h2 className="mt-2 text-3xl leading-tight font-bold">
              From request to concession
            </h2>
            <ol className="mt-6 space-y-4">
              {[
                [
                  "Send a request",
                  "Choose your course and scholarship category.",
                ],
                [
                  "Eligibility call",
                  "An advisor checks your eligibility and lists the documents.",
                ],
                [
                  "Document verification",
                  "Share the documents for your category.",
                ],
                [
                  "Fee plan",
                  "Any approved concession is shown in your fee plan in the student portal.",
                ],
              ].map(([title, text], index) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-ink-soft">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <ScholarshipForm />
        </div>
      </section>
    </div>
  );
}
