import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, CalendarClock, ChevronRight, GraduationCap, MonitorPlay } from "lucide-react";
import { ProgrammeBadge } from "@/components/courses/course-card";
import { DownloadBrochureButton } from "@/components/courses/download-brochure-button";
import type { CatalogCourse } from "@/lib/course-catalog";

export function CourseDetailsHero({ course }: { course: CatalogCourse }) {
  const facts = [
    { icon: Award, label: "Programme type", value: course.programmeType },
    { icon: CalendarClock, label: "Duration", value: course.duration },
    { icon: GraduationCap, label: "Eligibility", value: course.eligibility },
    { icon: MonitorPlay, label: "Mode", value: `${course.mode} (recorded + live)` },
  ];

  return (
    <section className="border-b border-line bg-gradient-to-b from-azure-soft/70 to-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8 lg:pb-14">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-azure">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-4" />
            </li>
            <li>
              <Link href="/courses" className="hover:text-azure">
                Courses
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-4" />
            </li>
            <li aria-current="page" className="font-medium text-ink">
              {course.shortTitle}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <ProgrammeBadge type={course.programmeType} />
              <Link
                href={`/courses?category=${course.category}`}
                className="rounded-full border border-azure/30 bg-white px-2.5 py-1 text-[11px] font-semibold text-azure hover:bg-azure-soft"
              >
                {course.categoryLabel}
              </Link>
            </div>
            <h1 className="mt-4 text-[2rem] leading-tight font-bold tracking-tight text-ink sm:text-5xl">{course.title}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft sm:text-lg">{course.summary}</p>

            <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-3 sm:flex-row sm:items-start sm:gap-3 sm:p-3.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-azure-soft text-azure sm:size-9">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs text-ink-soft">{label}</dt>
                    <dd className="text-sm font-semibold text-ink">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
              <a
                href="#enquiry"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-azure px-6 text-sm font-semibold text-white transition hover:bg-azure-dark"
              >
                Enquire Now <ArrowRight className="size-4" aria-hidden />
              </a>
              <DownloadBrochureButton courseTitle={course.title} />
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist shadow-[0_30px_60px_-30px_rgba(11,31,58,0.45)] lg:aspect-[5/4]">
            <Image src={course.banner} alt={course.title} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
