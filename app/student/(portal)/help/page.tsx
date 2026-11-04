import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { FAQAccordion } from "@/components/courses/faq-accordion";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Help & Support" };

const CHANNELS = [
  {
    icon: Phone,
    label: "Call",
    value: SITE.phone,
    href: `tel:${SITE.phoneTel}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE.phone,
    href: `https://wa.me/${SITE.whatsapp}`,
    external: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
];

const FAQS = [
  {
    question: "I forgot my password. What should I do?",
    answer:
      "Use “Forgot password?” on the login page. A reset link is sent to your registered email and works for 24 hours.",
  },
  {
    question: "Why can't I log in after requesting access?",
    answer:
      "New accounts are activated after the admissions team verifies your admission. You will get an email when your account is active. Contact the team if it is taking longer than expected.",
  },
  {
    question: "How do I change my name or email?",
    answer:
      "Your name and email come from your admission record. Contact the admissions team to correct them.",
  },
  {
    question: "When will my courses and classes appear?",
    answer:
      "Courses, live classes and assignments appear in your dashboard once the academic team assigns your course and batch.",
  },
  {
    question: "Is my account safe on a shared computer?",
    answer:
      "Always use “Log out” when you finish. Changing your password logs out every other device.",
  },
];

export default function StudentHelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Reach the GBET academic and admissions team.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-3">
        {CHANNELS.map(({ icon: Icon, label, value, href, external }) => (
          <li key={label}>
            <a
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition hover:border-azure"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-azure-soft text-azure">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="mt-3 text-sm text-ink-soft">{label}</span>
              <span className="font-semibold break-words">{value}</span>
            </a>
          </li>
        ))}
      </ul>
      <section
        aria-labelledby="portal-faq"
        className="rounded-3xl border border-line bg-white p-5 sm:p-7"
      >
        <h2 id="portal-faq" className="text-lg font-semibold">
          Common questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={FAQS} />
        </div>
      </section>
    </div>
  );
}
