import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import type { CatalogCourse } from "@/lib/course-catalog";
import { cn } from "@/lib/utils";

export function ProgrammeBadge({ type, className }: { type: CatalogCourse["programmeType"]; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        type === "Diploma" ? "bg-ink text-white" : "bg-azure text-white",
        className,
      )}
    >
      {type}
    </span>
  );
}

export function CourseCard({ course, priority = false }: { course: CatalogCourse; priority?: boolean }) {
  const href = `/courses/${course.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(11,31,58,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(11,31,58,0.35)]">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-mist" tabIndex={-1} aria-hidden>
        <Image
          src={course.thumbnail}
          alt=""
          fill
          priority={priority}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <ProgrammeBadge type={course.programmeType} className="absolute top-3 left-3" />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-azure">{course.categoryLabel}</span>
          <span className="inline-flex items-center gap-1 text-ink-soft">
            <Clock className="size-3.5" aria-hidden />
            {course.duration}
          </span>
        </div>

        <h3 className="mt-2 text-lg leading-snug font-semibold text-ink">
          <Link href={href} className="hover:text-azure focus-visible:text-azure">
            {course.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-soft">{course.summary}</p>

        <div className="mt-4">
          <p className="text-[11px] font-bold tracking-[0.12em] text-ink uppercase">Key learning modules</p>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
            {course.curriculum.slice(0, 3).map((module) => (
              <li key={module.number} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-azure" aria-hidden />
                <span>{module.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-bold tracking-[0.12em] text-ink uppercase">Career opportunities</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {course.careerOpportunities.slice(0, 3).map((career) => (
              <li key={career.role} className="rounded-full bg-mist px-2.5 py-1 text-xs text-ink">
                {career.role}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto grid gap-2 pt-6">
          <Link
            href={href}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-ink px-4 text-sm font-semibold whitespace-nowrap text-white transition hover:bg-ink/90"
          >
            View Course Details <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href={`${href}#enquiry`}
            className="inline-flex h-11 items-center justify-center rounded-full border border-azure/40 px-4 text-sm font-semibold whitespace-nowrap text-azure transition hover:bg-azure-soft"
            aria-label={`Enquire now about ${course.title}`}
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </article>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white" aria-hidden>
      <div className="aspect-[16/10] animate-pulse bg-mist" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 animate-pulse rounded bg-mist" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-mist" />
        <div className="h-3 w-full animate-pulse rounded bg-mist" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-mist" />
        <div className="h-24 animate-pulse rounded-xl bg-mist" />
        <div className="h-11 animate-pulse rounded-full bg-mist" />
      </div>
    </div>
  );
}
