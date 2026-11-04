import Link from "next/link";
import { ArrowRight, ChevronRight, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { AdmissionEnquiryForm } from "@/components/courses/admission-enquiry-form";
import { CourseHeader } from "@/components/courses/course-header";
import { DownloadBrochureButton } from "@/components/courses/download-brochure-button";
import { PhotoPanel } from "@/components/courses/photo-panel";
import { JsonLd, pageMetadata } from "@/lib/seo";
import { CAMPUSES, SITE, SOCIAL } from "@/lib/site";

export const metadata = pageMetadata(
  "Contact Us",
  "Contact the GBET Online admissions team by phone, WhatsApp or email, or send an enquiry about diploma and certificate courses.",
  "/contact",
);

const campus = CAMPUSES[0];
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campus.mapQuery)}`;

const CHANNELS: { icon: LucideIcon; label: string; value: string; href: string; action: string; external?: boolean }[] = [
  { icon: Phone, label: "Call admissions", value: SITE.phone, href: `tel:${SITE.phoneTel}`, action: "Call now" },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE.phone,
    href: `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hi, I would like to know about GBET Online courses.")}`,
    action: "Chat on WhatsApp",
    external: true,
  },
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}`, action: "Send an email" },
  { icon: MapPin, label: campus.name, value: campus.address, href: mapsLink, action: "Get directions", external: true },
];

export default function ContactPage() {
  return (
    <div className="bg-white text-ink">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: SITE.name,
          url: SITE.url,
          email: SITE.email,
          telephone: SITE.phoneTel,
          address: { "@type": "PostalAddress", streetAddress: campus.address, addressCountry: "IN" },
          sameAs: SOCIAL.map((item) => item.href),
        }}
      />
      <CourseHeader />

      <section className="border-b border-line bg-gradient-to-b from-azure-soft/70 to-white">
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pt-10 sm:pb-14">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-azure">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              <li aria-current="page" className="font-medium text-ink">
                Contact
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-azure uppercase">Contact us</p>
              <h1 className="mt-2 text-[2.1rem] leading-tight font-bold tracking-tight sm:text-5xl">Talk to the admissions team</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft sm:text-lg">
                Questions about a course, eligibility, batch dates or fees? Call, WhatsApp or email us, or send an enquiry and an
                advisor will call you back.
              </p>
              <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
                <a
                  href={`tel:${SITE.phoneTel}`}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-azure px-6 text-sm font-semibold text-white transition hover:bg-azure-dark"
                >
                  <Phone className="size-4" aria-hidden />
                  {SITE.phone}
                </a>
                <a
                  href="#enquiry"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-6 text-sm font-semibold transition hover:border-azure hover:text-azure"
                >
                  Send an enquiry <ArrowRight className="size-4" aria-hidden />
                </a>
              </div>
            </div>
            <PhotoPanel
              src="/photos/hero-class.jpg"
              alt="Learners talking together around laptops"
              className="hidden aspect-[4/3] shadow-[0_30px_60px_-30px_rgba(11,31,58,0.45)] lg:block"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="channels-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <h2 id="channels-heading" className="sr-only">
          Ways to reach us
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map(({ icon: Icon, label, value, href, action, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-azure hover:shadow-[0_18px_40px_-24px_rgba(11,31,58,0.35)]"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-azure-soft text-azure">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="mt-4 text-sm text-ink-soft">{label}</span>
                <span className="mt-1 font-semibold break-words">{value}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-azure">
                  {action}
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="enquiry" aria-labelledby="enquiry-heading" className="scroll-mt-20 border-t border-line bg-mist">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-azure uppercase">Admissions {SITE.year}</p>
            <h2 id="enquiry-heading" className="mt-2 text-3xl leading-tight font-bold sm:text-4xl">
              Send us an enquiry
            </h2>
            <p className="mt-3 max-w-md leading-7 text-ink-soft">
              Share your details and the course you are interested in. An admissions advisor will call you to explain the course,
              eligibility and fees.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <DownloadBrochureButton />
              <Link
                href="/courses"
                className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-azure hover:text-azure-dark"
              >
                Explore courses <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-white">
              <iframe
                title={`Map of ${campus.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(campus.mapQuery)}&output=embed`}
                className="block h-64 w-full sm:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex items-start gap-3 p-4 text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0 text-azure" aria-hidden />
                <p>
                  <span className="font-semibold">{campus.name}</span>
                  <span className="block text-ink-soft">{campus.address}</span>
                </p>
              </div>
            </div>
          </div>
          <AdmissionEnquiryForm title="Admission enquiry" />
        </div>
      </section>

      <section aria-labelledby="social-heading" className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="social-heading" className="font-semibold">
            Follow {SITE.shortName}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {SOCIAL.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center rounded-full border border-line px-4 text-sm font-semibold hover:border-azure hover:text-azure"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
