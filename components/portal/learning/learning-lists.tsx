"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Download,
  FolderOpen,
  Lock,
  PlayCircle,
} from "lucide-react";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  PageHeader,
  ProgressBar,
} from "@/components/portal/ui";
import { usePortalData } from "@/components/portal/use-portal-data";
import { PortalError, portalRequest } from "@/lib/portal/client";
import {
  formatSize,
  type CourseCardData,
  type CourseMaterials,
  type CourseOutline,
} from "@/lib/portal/learning";

function useOutlines() {
  const courses = usePortalData<CourseCardData[]>("learning/courses");
  const [outlines, setOutlines] = useState<{
    key: string;
    items: CourseOutline[];
  } | null>(null);
  const [error, setError] = useState<PortalError | null>(null);
  const learnable = (courses.data ?? []).filter(
    (item) => item.status !== "suspended",
  );
  const key = learnable.map((item) => item.course.slug).join(",");

  useEffect(() => {
    if (!courses.data) return;
    let cancelled = false;
    Promise.all(
      key
        ? key
            .split(",")
            .map((slug) =>
              portalRequest<CourseOutline>(`learning/courses/${slug}`),
            )
        : [],
    )
      .then((items) => !cancelled && setOutlines({ key, items }))
      .catch(
        (err: unknown) =>
          !cancelled &&
          setError(
            err instanceof PortalError
              ? err
              : new PortalError("Progress could not be loaded.", 0),
          ),
      );
    return () => {
      cancelled = true;
    };
  }, [courses.data, key]);

  return {
    outlines: outlines?.key === key ? outlines.items : null,
    error: courses.error ?? error,
    reload: courses.reload,
  };
}

const NO_COURSES =
  "Your courses appear here once the academic team enrols you in a course and batch after admission.";

export function CourseProgressPage() {
  const { outlines, error, reload } = useOutlines();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Progress"
        description="Lesson and module completion, saved automatically as you learn."
      />
      {error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : !outlines ? (
        <CardSkeleton count={2} />
      ) : !outlines.length ? (
        <EmptyState icon={BarChart3} title="No progress to show yet">
          {NO_COURSES}
        </EmptyState>
      ) : (
        outlines.map((outline) => (
          <section
            key={outline.id}
            aria-labelledby={`progress-${outline.id}`}
            className="rounded-3xl border border-line bg-white p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2
                  id={`progress-${outline.id}`}
                  className="text-lg font-semibold"
                >
                  {outline.course.title}
                </h2>
                <p className="text-sm text-ink-soft">
                  {outline.progress.done} of {outline.progress.total} published
                  lessons complete
                </p>
              </div>
              <Link
                href={`/student/courses/${outline.course.slug}`}
                className="inline-flex h-10 items-center rounded-xl bg-ink px-4 text-sm font-semibold text-white hover:bg-azure"
              >
                Continue learning
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <ProgressBar
                percent={outline.progress.percent}
                label={`${outline.course.title} progress`}
                className="h-3 flex-1"
              />
              <span className="w-12 text-right text-sm font-bold">
                {outline.progress.percent}%
              </span>
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {outline.modules.map((module) => {
                const percent = module.total
                  ? Math.round((module.done * 100) / module.total)
                  : 0;
                return (
                  <li key={module.id} className="rounded-2xl bg-mist p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold">
                        <span className="text-azure">
                          Module {module.number}.
                        </span>{" "}
                        {module.title}
                      </p>
                      {module.total && module.done === module.total ? (
                        <CheckCircle2
                          className="size-5 shrink-0 text-emerald-600"
                          aria-label="Module complete"
                        />
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-ink-soft">
                      {module.total
                        ? `${module.done}/${module.total} lessons`
                        : "Lessons coming soon"}
                    </p>
                    <ProgressBar
                      percent={percent}
                      label={`Module ${module.number} progress`}
                      className="mt-2 bg-white"
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

export function VideoLecturesPage() {
  const { outlines, error, reload } = useOutlines();
  const groups = (outlines ?? []).map((outline) => ({
    outline,
    lessons: outline.modules.flatMap((module) =>
      module.lessons
        .filter((lesson) => lesson.kind === "video")
        .map((lesson) => ({ ...lesson, module: module.number })),
    ),
  }));
  const total = groups.reduce((sum, group) => sum + group.lessons.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Video Lectures"
        description="Recorded lessons from your courses. Lessons unlock in order as you complete them."
      />
      {error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : !outlines ? (
        <CardSkeleton count={2} />
      ) : !outlines.length ? (
        <EmptyState icon={PlayCircle} title="No video lectures yet">
          {NO_COURSES}
        </EmptyState>
      ) : total === 0 ? (
        <EmptyState icon={PlayCircle} title="Videos are being prepared">
          Your faculty is adding recorded lectures. They appear here as soon as
          they are published.
        </EmptyState>
      ) : (
        groups
          .filter((group) => group.lessons.length)
          .map(({ outline, lessons }) => (
            <section
              key={outline.id}
              aria-labelledby={`lectures-${outline.id}`}
              className="rounded-3xl border border-line bg-white p-5 sm:p-6"
            >
              <h2 id={`lectures-${outline.id}`} className="font-semibold">
                {outline.course.title}
              </h2>
              <ul className="mt-4 divide-y divide-line">
                {lessons.map((lesson) => (
                  <li key={lesson.id}>
                    {lesson.locked ? (
                      <div className="flex items-center gap-3 py-3 text-sm text-ink-soft">
                        <Lock className="size-5 shrink-0" aria-hidden />
                        <span className="flex-1">
                          <span className="text-xs">
                            Module {lesson.module}
                          </span>
                          <span className="block">{lesson.title}</span>
                        </span>
                        <span className="text-xs">Locked</span>
                      </div>
                    ) : (
                      <Link
                        href={`/student/courses/${outline.course.slug}?lesson=${lesson.id}`}
                        className="flex items-center gap-3 py-3 text-sm hover:text-azure"
                      >
                        {lesson.completed ? (
                          <CheckCircle2
                            className="size-5 shrink-0 text-emerald-600"
                            aria-hidden
                          />
                        ) : (
                          <PlayCircle
                            className="size-5 shrink-0 text-azure"
                            aria-hidden
                          />
                        )}
                        <span className="flex-1">
                          <span className="text-xs text-ink-soft">
                            Module {lesson.module}
                          </span>
                          <span className="block font-medium">
                            {lesson.title}
                          </span>
                        </span>
                        {lesson.duration_minutes ? (
                          <span className="text-xs text-ink-soft">
                            {lesson.duration_minutes} min
                          </span>
                        ) : null}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))
      )}
    </div>
  );
}

export function StudyMaterialsPage() {
  const { data, error, loading, reload } =
    usePortalData<CourseMaterials[]>("learning/materials");
  const total = (data ?? []).reduce(
    (sum, group) => sum + group.materials.length,
    0,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Study Materials"
        description="Notes and resources for your courses, grouped by module."
      />
      {loading ? (
        <CardSkeleton count={2} />
      ) : error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : !data?.length ? (
        <EmptyState icon={FolderOpen} title="No study material yet">
          {NO_COURSES}
        </EmptyState>
      ) : total === 0 ? (
        <EmptyState icon={FolderOpen} title="Study material is being prepared">
          Your faculty is uploading notes and resources. They appear here as
          soon as they are published.
        </EmptyState>
      ) : (
        data
          .filter((group) => group.materials.length)
          .map((group) => {
            const byModule = new Map<string, typeof group.materials>();
            for (const material of group.materials) {
              const label = material.module
                ? `Module ${material.module.number} · ${material.module.title}`
                : "General";
              byModule.set(label, [...(byModule.get(label) ?? []), material]);
            }
            return (
              <section
                key={group.course.slug}
                className="rounded-3xl border border-line bg-white p-5 sm:p-6"
              >
                <h2 className="font-semibold">{group.course.title}</h2>
                <div className="mt-4 space-y-5">
                  {[...byModule.entries()].map(([label, materials]) => (
                    <div key={label}>
                      <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">
                        {label}
                      </p>
                      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                        {materials.map((material) => (
                          <li key={material.id}>
                            <a
                              href={material.download_url}
                              className="flex items-center gap-3 rounded-xl border border-line p-3 transition hover:border-azure"
                            >
                              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-azure-soft text-[10px] font-bold text-azure-dark uppercase">
                                {material.extension}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold">
                                  {material.title}
                                </span>
                                <span className="block truncate text-xs text-ink-soft">
                                  {formatSize(material.size)}
                                </span>
                              </span>
                              <Download
                                className="size-4 shrink-0 text-azure"
                                aria-label="Download"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
      )}
    </div>
  );
}
