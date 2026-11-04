import Image from "next/image";
import type { ReactNode } from "react";
import {
  BookOpenText,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FolderKanban,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  MonitorPlay,
  NotebookPen,
  Phone,
  PlayCircle,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { CatalogCourse, LearningFeature } from "@/lib/course-catalog";
import { CAMPUSES, SITE } from "@/lib/site";

const FEATURE_ICONS: Record<LearningFeature["id"], LucideIcon> = {
  recorded: PlayCircle,
  live: Video,
  assignments: NotebookPen,
  material: BookOpenText,
  projects: FolderKanban,
  assessments: ClipboardCheck,
};

const ADMISSION_STEPS = [
  [
    "Enquire",
    "Fill in the enquiry form on gbetonline.com or call the admissions team.",
  ],
  [
    "Counselling call",
    "An advisor explains the course, eligibility, batch dates and fees.",
  ],
  [
    "Document check",
    "Share your eligibility documents for admission verification.",
  ],
  [
    "Confirm admission",
    "Receive your fee plan and pay through the student portal or the admissions office, with an official receipt.",
  ],
  [
    "Start learning",
    "Log in to the GBET Online student portal for lessons, live classes and study material.",
  ],
] as const;

const PUBLISHED = "November 2026";
const WEBSITE = "www.gbetonline.com";

const MODULE_FLOW = [
  {
    icon: PlayCircle,
    title: "Watch",
    text: "Recorded lectures at your own pace",
  },
  { icon: Video, title: "Discuss", text: "A live session with faculty" },
  { icon: NotebookPen, title: "Practise", text: "A hands-on assignment" },
  {
    icon: ClipboardCheck,
    title: "Get feedback",
    text: "Reviewed work and a short assessment",
  },
];

function Sheet({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`sheet relative flex flex-col overflow-hidden bg-white text-ink ${className}`}
    >
      {children}
    </section>
  );
}

function SheetHeader({
  course,
  page,
}: {
  course: CatalogCourse;
  page: number;
}) {
  return (
    <header className="flex items-center justify-between border-b border-line px-[16mm] py-[6mm]">
      <div className="flex items-center gap-3">
        <span className="relative size-9 overflow-hidden rounded-full ring-2 ring-azure/30">
          <Image
            src="/logo.png"
            alt=""
            fill
            sizes="40px"
            className="object-cover"
            priority
          />
        </span>
        <span className="text-sm leading-tight font-bold">
          {SITE.name}
          <span className="block text-[10px] font-medium text-ink-soft">
            {SITE.trust}
          </span>
        </span>
      </div>
      <p className="text-[10px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
        {course.title} · {page}/4
      </p>
    </header>
  );
}

function SheetFooter() {
  return (
    <footer className="mt-auto flex items-center justify-between border-t border-line px-[16mm] py-[5mm] text-[10px] text-ink-soft">
      <span>
        {SITE.phone} · {SITE.email}
      </span>
      <span>{WEBSITE}</span>
    </footer>
  );
}

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.18em] text-azure uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-[22px] leading-tight font-bold">{title}</h2>
    </div>
  );
}

export function CourseBrochure({ course }: { course: CatalogCourse }) {
  const campus = CAMPUSES[0];
  const facts = [
    { icon: GraduationCap, label: "Programme", value: course.programmeType },
    { icon: CalendarClock, label: "Duration", value: course.duration },
    { icon: MonitorPlay, label: "Mode", value: "Online · recorded + live" },
    { icon: CheckCircle2, label: "Eligibility", value: course.eligibility },
  ];
  const faqs = course.faqs
    .filter((faq) => /guarantee|receive/i.test(faq.question))
    .slice(0, 2);

  return (
    <div className="brochure">
      {/* Page 1 – cover */}
      <Sheet>
        <div className="relative h-[168mm]">
          <Image
            src={course.banner}
            alt=""
            fill
            priority
            sizes="900px"
            quality={85}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/95" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-[16mm] pt-[12mm] text-white">
            <div className="flex items-center gap-3">
              <span className="relative size-12 overflow-hidden rounded-full ring-2 ring-white/40">
                <Image
                  src="/logo.png"
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </span>
              <span className="leading-tight">
                <span className="block text-lg font-bold">{SITE.name}</span>
                <span className="text-xs text-white/75">{SITE.trust}</span>
              </span>
            </div>
            <span className="rounded-full border border-white/40 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
              Admissions {SITE.year}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 px-[16mm] pb-[12mm] text-white">
            <div className="flex gap-2 text-[11px] font-semibold">
              <span className="rounded-full bg-white px-3 py-1 text-ink">
                {course.programmeType}
              </span>
              <span className="rounded-full bg-azure px-3 py-1">
                {course.categoryLabel}
              </span>
            </div>
            <h1 className="mt-4 text-[38px] leading-[1.08] font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="mt-3 max-w-[150mm] text-[15px] leading-relaxed text-white/85">
              {course.summary}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 px-[16mm] py-[9mm]">
          {facts.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-2xl border border-line p-4"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-azure-soft text-azure">
                <Icon className="size-[18px]" aria-hidden />
              </span>
              <div>
                <p className="text-[10px] font-semibold tracking-wide text-ink-soft uppercase">
                  {label}
                </p>
                <p className="mt-0.5 text-[13px] leading-snug font-semibold">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-[16mm]">
          <p className="text-[10px] font-bold tracking-[0.18em] text-azure uppercase">
            Modules at a glance
          </p>
          <ol className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {course.curriculum.map((module) => (
              <li
                key={module.number}
                className="flex items-center gap-3 text-[12.5px] font-medium"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-ink text-[11px] font-bold text-white">
                  {module.number}
                </span>
                {module.title}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-auto bg-ink px-[16mm] py-[8mm] text-white">
          <p className="text-[13px] font-semibold">
            Talk to the admissions team
          </p>
          <div className="mt-2 flex flex-wrap gap-x-8 gap-y-1 text-[12px] text-white/85">
            <span className="inline-flex items-center gap-2">
              <Phone className="size-3.5" aria-hidden />
              {SITE.phone}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="size-3.5" aria-hidden />
              {SITE.email}
            </span>
            <span className="inline-flex items-center gap-2">
              <Globe className="size-3.5" aria-hidden />
              {WEBSITE}
            </span>
          </div>
        </div>
      </Sheet>

      {/* Page 2 – about, outcomes, learning */}
      <Sheet>
        <SheetHeader course={course} page={2} />
        <div className="flex-1 space-y-[9mm] px-[16mm] py-[9mm]">
          <div>
            <Heading
              eyebrow="About the course"
              title="What this course covers"
            />
            <p className="mt-3 text-[13px] leading-[1.75] text-ink-soft">
              {course.description}
            </p>
          </div>
          <div>
            <Heading
              eyebrow="Learning outcomes"
              title="By the end of the course you will be able to"
            />
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {course.learningOutcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-start gap-2.5 rounded-xl bg-mist p-3.5 text-[12.5px] leading-snug"
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-azure"
                    aria-hidden
                  />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Heading
              eyebrow="How you learn"
              title="Online, with structure and support"
            />
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {course.learningFeatures.map((feature) => {
                const Icon = FEATURE_ICONS[feature.id];
                return (
                  <li
                    key={feature.id}
                    className="rounded-xl border border-line p-3.5"
                  >
                    <Icon className="size-5 text-azure" aria-hidden />
                    <p className="mt-2 text-[12.5px] font-semibold">
                      {feature.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-ink-soft">
                      {feature.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-azure-soft p-5">
              <p className="text-[10px] font-bold tracking-[0.16em] text-azure-dark uppercase">
                Who can join
              </p>
              <p className="mt-2 text-[13px] leading-relaxed font-medium">
                {course.eligibility}
              </p>
              <p className="mt-2 text-[11px] text-ink-soft">
                The admissions team confirms the latest eligibility during
                counselling.
              </p>
            </div>
            <div className="rounded-2xl bg-azure-soft p-5">
              <p className="text-[10px] font-bold tracking-[0.16em] text-azure-dark uppercase">
                What you need
              </p>
              <p className="mt-2 text-[13px] leading-relaxed font-medium">
                A smartphone or computer with a stable internet connection.
              </p>
              <p className="mt-2 text-[11px] text-ink-soft">
                Some practical modules may need basic tools or software; these
                are explained before the batch starts.
              </p>
            </div>
          </div>
        </div>
        <SheetFooter />
      </Sheet>

      {/* Page 3 – curriculum */}
      <Sheet>
        <SheetHeader course={course} page={3} />
        <div className="flex-1 px-[16mm] py-[9mm]">
          <Heading
            eyebrow="Curriculum"
            title={`${course.curriculum.length} modules, from foundations to a final project`}
          />
          <p className="mt-2 text-[12px] text-ink-soft">
            Each module combines recorded lectures, a live session and a
            practical assignment.
          </p>
          <ol className="mt-5 space-y-3">
            {course.curriculum.map((module) => (
              <li
                key={module.number}
                className="flex gap-4 rounded-2xl border border-line p-4"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-[13px] font-bold text-white">
                  {String(module.number).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold">{module.title}</p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {module.topics.map((topic) => (
                      <li
                        key={topic}
                        className="rounded-full bg-mist px-2.5 py-1 text-[11px]"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[11.5px] text-ink-soft">
                    <span className="font-semibold text-azure-dark">
                      Outcome:{" "}
                    </span>
                    {module.outcome}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-2xl bg-mist p-5">
            <p className="text-[10px] font-bold tracking-[0.18em] text-azure uppercase">
              How every module works
            </p>
            <ol className="mt-3 grid grid-cols-4 gap-3">
              {MODULE_FLOW.map(({ icon: Icon, title, text }, index) => (
                <li key={title} className="rounded-xl bg-white p-3">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-azure" aria-hidden />
                    <span className="text-[10px] font-bold text-ink-soft">
                      STEP {index + 1}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] font-semibold">{title}</p>
                  <p className="text-[10.5px] leading-snug text-ink-soft">
                    {text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <SheetFooter />
      </Sheet>

      {/* Page 4 – careers, admission, contact */}
      <Sheet>
        <SheetHeader course={course} page={4} />
        <div className="flex-1 space-y-[6mm] px-[16mm] py-[6mm]">
          <div>
            <Heading
              eyebrow="Career opportunities"
              title="Where these skills are used"
            />
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {course.careerOpportunities.map((career) => (
                <li
                  key={career.role}
                  className="flex items-start gap-3 rounded-xl border border-line p-3.5"
                >
                  <Briefcase
                    className="mt-0.5 size-4 shrink-0 text-azure"
                    aria-hidden
                  />
                  <div>
                    <p className="text-[12.5px] font-semibold">{career.role}</p>
                    <p className="text-[11px] leading-snug text-ink-soft">
                      {career.focus}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[10.5px] text-ink-soft">
              Career outcomes depend on individual effort, experience and the
              job market. Placement is not guaranteed.
            </p>
          </div>

          <div>
            <Heading eyebrow="Admission process" title="How to join" />
            <ol className="mt-4 grid grid-cols-5 gap-2">
              {ADMISSION_STEPS.map(([title, text], index) => (
                <li key={title} className="rounded-xl bg-mist p-3">
                  <span className="grid size-7 place-items-center rounded-full bg-azure text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="mt-2 text-[11.5px] font-semibold">{title}</p>
                  <p className="mt-1 text-[10px] leading-snug text-ink-soft">
                    {text}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-3 rounded-xl border border-azure/25 bg-azure-soft px-4 py-3 text-[11.5px] leading-relaxed text-azure-dark">
              <span className="font-semibold">Fees:</span> shared by the
              admissions team during counselling. Pay only through the GBET
              Online student portal or the admissions office, and always collect
              an official receipt.
            </div>
          </div>

          {faqs.length ? (
            <div>
              <Heading eyebrow="Good to know" title="Common questions" />
              <dl className="mt-3 space-y-2.5">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="text-[12px] font-semibold">
                      {faq.question}
                    </dt>
                    <dd className="text-[11px] leading-snug text-ink-soft">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
        <div className="bg-ink px-[16mm] py-[7mm] text-white">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[16px] font-bold">
                Enquire about {course.shortTitle}
              </p>
              <div className="mt-2 grid gap-1 text-[12px] text-white/85">
                <span className="inline-flex items-center gap-2">
                  <Phone className="size-3.5" aria-hidden />
                  {SITE.phone} (call / WhatsApp)
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail className="size-3.5" aria-hidden />
                  {SITE.email}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Globe className="size-3.5" aria-hidden />
                  {WEBSITE}/courses/{course.slug}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-3.5" aria-hidden />
                  {campus.address}
                </span>
              </div>
            </div>
            <span className="relative size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-white/30">
              <Image
                src="/logo.png"
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                priority
              />
            </span>
          </div>
          <p className="mt-4 text-[9.5px] text-white/55">
            Information as of {PUBLISHED}. Course content, batches and
            eligibility may be updated; the admissions team confirms current
            details. {SITE.fullName}.
          </p>
        </div>
      </Sheet>
    </div>
  );
}
