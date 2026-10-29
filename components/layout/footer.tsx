"use client";

import { ArrowRight, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useI18n } from "@/components/providers/language-provider";
import { SITE, SOCIAL } from "@/lib/site";
import { CATEGORIES, COURSES } from "@/lib/courses";

function campusHref(path: string) {
  return `${SITE.campusUrl}${path}`;
}

const LOCATIONS = ["Noida", "Pharmacy", "Education", "Paramedical", "AI", "Design"] as const;

const ABOUT_LINKS = [
  { href: "/about", key: "about" as const },
  { href: "/campus", key: "campus" as const },
  { href: "/admissions", key: "admissions" as const },
  { href: "/placements", key: "placements" as const },
  { href: "/partners", key: "partners" as const },
  { href: "/contact", key: "contact" as const },
];

const RESOURCE_LINKS = [
  { href: "/news", key: "news" as const },
  { href: "/faq", key: "faq" as const },
  { href: "/brochure", key: "brochure" as const },
  { href: "/scholarships", key: "scholarships" as const },
  { href: "/compare", key: "compare" as const },
  { href: "/apply", key: "apply" as const },
];

const COURSE_COLUMNS: { ids: Array<(typeof CATEGORIES)[number]["id"]> }[] = [
  { ids: ["pharmacy", "education", "paramedical"] },
  { ids: ["ai", "business"] },
  { ids: ["design", "media", "arts", "wellness", "hospitality"] },
];

const SOCIAL_PATHS: Record<string, string> = {
  Facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  Instagram:
    "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 .001 8.001A4 4 0 0 0 12 8zm6.5-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z",
  LinkedIn:
    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  YouTube:
    "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
};

export function Footer() {
  const { t, locale } = useI18n();

  return (
    <footer className="mt-auto border-t border-[#eedfd0] bg-cream text-navy">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-[2.15rem]">
            {locale === "hi" ? "अगला सत्र शुरू करने के लिए तैयार हैं?" : "Ready to start your next session?"}
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-[15px]">
            {locale === "hi"
              ? "डिप्लोमा आवेदन से निःशुल्क काउंसलिंग तक — हम आपको तेज़ और स्पष्ट रास्ता देते हैं।"
              : "From diploma application to free counselling, we help you move faster and with a clearer plan."}
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-[15px]">
            {locale === "hi" ? "साथ मिलकर हम आपकी पहली भूमिका बनाते हैं।" : "Together, we shape your first role."}
          </p>
        </div>
        <a
          href={campusHref("/contact")}
          className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(232,92,26,0.28)] hover:bg-brand/90"
        >
          {locale === "hi" ? "संपर्क करें" : "Contact Us"}
          <ArrowRight className="size-4" />
        </a>
      </div>

      <div className="mx-auto max-w-7xl border-t border-[#eedfd0] px-4 sm:px-6">
        <div className="flex flex-col gap-8 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Logo />
            <div className="mt-5 flex items-center gap-4">
              {SOCIAL.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy/70 hover:text-brand"
                  aria-label={s.name}
                >
                  <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="1.8" aria-hidden>
                    <path d={SOCIAL_PATHS[s.name]} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div className="lg:text-right">
            <p className="text-sm font-medium tracking-wide text-navy">{LOCATIONS.join("  |  ")}</p>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand/80"
            >
              <Phone className="size-4" aria-hidden />
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-[#eedfd0] px-4 py-10 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h3 className="text-sm font-semibold text-navy">{locale === "hi" ? "हमारे बारे में" : "About Us"}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-600">
              {ABOUT_LINKS.map((item) => (
                <li key={item.href}>
                  <a href={campusHref(item.href)} className="hover:text-brand">
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
              <li>
                <a href={campusHref("/login/student")} className="hover:text-brand">
                  {t.top.student}
                </a>
              </li>
            </ul>
            <div className="mt-8">
              <p className="text-xs font-semibold tracking-wide text-brand uppercase">
                {locale === "hi" ? "नीतियाँ" : "Policies"}
              </p>
              <ul className="mt-2 space-y-2.5 text-sm text-stone-600">
                <li>
                  <a
                    href="/GBET_Grievance%20Redressal%20Policy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand"
                  >
                    {locale === "hi" ? "छात्र शिकायत निवारण नीति" : "Student Grievance Redressal Policy"}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {COURSE_COLUMNS.map((col, i) => (
            <div key={i}>
              {i === 0 ? (
                <h3 className="text-sm font-semibold text-navy">{locale === "hi" ? "पाठ्यक्रम" : "Courses"}</h3>
              ) : (
                <h3 className="hidden text-sm font-semibold text-navy lg:block lg:invisible">Courses</h3>
              )}
              {col.ids.map((id) => {
                const cat = CATEGORIES.find((c) => c.id === id);
                const items = COURSES.filter((c) => c.category === id);
                if (!cat || items.length === 0) return null;
                return (
                  <div key={id} className="mt-5 first:mt-4">
                    <p className="text-xs font-semibold tracking-wide text-brand uppercase">
                      {locale === "hi" ? cat.labelHi : cat.label}
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-stone-600">
                      {items.map((course) => (
                        <li key={course.slug}>
                          <a href={`/courses/${course.slug}`} className="hover:text-brand">
                            {locale === "hi" ? course.nameHi : course.shortName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-navy">{locale === "hi" ? "संसाधन" : "Resources"}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-600">
              {RESOURCE_LINKS.map((item) => (
                <li key={item.href}>
                  <a href={item.href === "/brochure" ? "/brochure" : campusHref(item.href)} className="hover:text-brand">
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
              <li>
                <a href={campusHref("/counselling")} className="hover:text-brand">
                  {t.nav.counselling}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-[#eedfd0] px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} {SITE.fullName}. {t.footer.rights}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <a href={campusHref("/privacy")} className="hover:text-brand">
              Privacy
            </a>
            <a href={campusHref("/terms")} className="hover:text-brand">
              Terms
            </a>
            <a
              href="/GBET_Grievance%20Redressal%20Policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand"
            >
              {locale === "hi" ? "छात्र शिकायत निवारण नीति" : "Student Grievance Redressal Policy"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
