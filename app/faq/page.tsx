import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { CourseHeader } from "@/components/courses/course-header";
import { FAQAccordion } from "@/components/courses/faq-accordion";
import { PageHero } from "@/components/site/page-hero";
import { JsonLd, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(
  "Frequently Asked Questions",
  "Answers about GBET Online admissions, eligibility, online classes, fees and payments, certificates and the student portal.",
  "/faq",
);

const GROUPS: {
  id: string;
  title: string;
  faqs: { question: string; answer: string }[];
}[] = [
  {
    id: "admissions",
    title: "Admissions & eligibility",
    faqs: [
      {
        question: "What is GBET Online?",
        answer:
          "GBET Online is the online learning desk of Gautam Buddha Educational Trust. You study diploma and certificate courses through recorded lessons, live sessions and assignments, with counselling from the Noida office.",
      },
      {
        question: "Who can apply?",
        answer:
          "Anyone who meets the eligibility of the chosen course. Each course page lists its eligibility, and the admissions team confirms the latest rules during counselling before a seat is confirmed.",
      },
      {
        question: "How does admission work?",
        answer:
          "Apply online or send an enquiry → an advisor calls you for counselling → you share eligibility documents → your admission and fee plan are confirmed → you receive student portal access.",
      },
      {
        question: "Can I talk to someone before applying?",
        answer: `Yes. Book a free counselling call, call ${SITE.phone}, or visit ${"C-77, Sector 63A, Noida"} after calling ahead.`,
      },
    ],
  },
  {
    id: "learning",
    title: "Online learning",
    faqs: [
      {
        question: "How are classes delivered?",
        answer:
          "Each module has recorded video lectures you can watch at your own pace, a scheduled live session with faculty, practical assignments and study material.",
      },
      {
        question: "Can I study while working?",
        answer:
          "Yes. Recorded lessons stay available in the student portal, and live sessions are scheduled so working learners can join.",
      },
      {
        question: "What do I need to study online?",
        answer:
          "A smartphone or computer with a stable internet connection. Some practical modules may need basic tools or software, explained before the batch starts.",
      },
      {
        question: "Is my progress saved?",
        answer:
          "Yes. Lessons you complete are saved to your account, and the next lesson unlocks when you finish the current one.",
      },
    ],
  },
  {
    id: "fees",
    title: "Fees & payments",
    faqs: [
      {
        question: "What are the fees?",
        answer:
          "Fees depend on the course and are shared by the admissions team during counselling. They are not published on the website.",
      },
      {
        question: "Can I pay in installments?",
        answer:
          "The admissions team can set up your fee plan in installments. You can see each installment and its due date in the student portal.",
      },
      {
        question: "How do I pay safely?",
        answer:
          "Pay only through the Fees & Payments page in the GBET Online student portal or at the admissions office. You always receive an official receipt, which you can download from the portal.",
      },
      {
        question: "Are scholarships available?",
        answer:
          "Scholarship categories are listed on the Scholarships page. Availability for your course and the exact concession are confirmed during counselling.",
      },
      {
        question: "What about refunds?",
        answer:
          "Refund requests are handled by the admissions team. Ask for the refund terms of your course before making a payment.",
      },
    ],
  },
  {
    id: "outcomes",
    title: "Certificates & careers",
    faqs: [
      {
        question: "What do I receive when I complete a course?",
        answer:
          "On completing the modules and assessments, you receive a diploma or certificate completion document from GBET Online, depending on the course. The admissions team explains the details during counselling.",
      },
      {
        question: "Does the course guarantee a job?",
        answer:
          "No. Courses build practical skills and a portfolio of work. Career guidance is available, but placement is not guaranteed and depends on effort, experience and the job market.",
      },
    ],
  },
  {
    id: "portal",
    title: "Student portal",
    faqs: [
      {
        question: "How do I get student portal access?",
        answer:
          "After your admission is verified, the admissions team activates your account and you receive an email. If you have joined but have no account, use “Request student access” on the login page.",
      },
      {
        question: "I forgot my password. What should I do?",
        answer:
          "Use “Forgot password?” on the student login page. A reset link is sent to your registered email and works for 24 hours.",
      },
      {
        question: "Where can I find my receipts?",
        answer:
          "In the student portal, open Fees & Payments. Every recorded payment has a downloadable PDF receipt.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="bg-white text-ink">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: GROUPS.flatMap((group) => group.faqs).map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      <CourseHeader />
      <PageHero
        crumb="FAQ"
        eyebrow="Help"
        title="Frequently asked questions"
        intro="Clear answers about admissions, online classes, fees, certificates and the student portal."
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[14rem_1fr] lg:py-16">
        <nav aria-label="FAQ topics" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 text-sm">
            {GROUPS.map((group) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className="block rounded-lg px-3 py-2 font-medium text-ink-soft hover:bg-mist hover:text-ink"
                >
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-10">
          {GROUPS.map((group) => (
            <section
              key={group.id}
              id={group.id}
              aria-labelledby={`${group.id}-title`}
              className="scroll-mt-24"
            >
              <h2 id={`${group.id}-title`} className="text-xl font-bold">
                {group.title}
              </h2>
              <div className="mt-4">
                <FAQAccordion faqs={group.faqs} />
              </div>
            </section>
          ))}
          <div className="flex flex-col gap-4 rounded-3xl bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-lg font-semibold">Still have a question?</p>
              <p className="text-sm text-white/70">
                Talk to an admissions advisor – counselling is free.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${SITE.phoneTel}`}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/30 px-4 text-sm font-semibold hover:bg-white/10"
              >
                <Phone className="size-4" aria-hidden />
                {SITE.phone}
              </a>
              <Link
                href="/counselling"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-ink hover:bg-azure-soft"
              >
                Book counselling <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
