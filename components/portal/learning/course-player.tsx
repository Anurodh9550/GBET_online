"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Download,
  FileText,
  Loader2,
  Lock,
  PlayCircle,
} from "lucide-react";
import { EmptyState, ErrorState, ProgressBar } from "@/components/portal/ui";
import { usePortalData } from "@/components/portal/use-portal-data";
import { PortalError, portalRequest } from "@/lib/portal/client";
import {
  formatSize,
  type CompleteResult,
  type CourseOutline,
  type LessonDetail,
  type Material,
  type OutlineModule,
} from "@/lib/portal/learning";
import { cn } from "@/lib/utils";

type LessonState = { id: number; data?: LessonDetail; error?: PortalError };

function minutes(value: number | null) {
  return value ? `${value} min` : null;
}

function VideoArea({ lesson }: { lesson: LessonDetail }) {
  if (!lesson.video) {
    return (
      <div className="grid aspect-video place-items-center bg-gradient-to-br from-ink to-azure-dark px-6 text-center text-white">
        <div>
          <BookOpen className="mx-auto size-10 text-sky-300" aria-hidden />
          <p className="mt-3 text-lg font-semibold">Reading lesson</p>
          <p className="mt-1 text-sm text-white/70">
            Read the lesson notes below, then mark the lesson as complete.
          </p>
        </div>
      </div>
    );
  }
  if (lesson.video.type === "embed") {
    return (
      <div className="relative aspect-video bg-black">
        <iframe
          key={lesson.video.url}
          src={lesson.video.url}
          title={lesson.title}
          className="absolute inset-0 size-full"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }
  return (
    <video
      key={lesson.video.url}
      src={lesson.video.url}
      controls
      controlsList="nodownload"
      preload="metadata"
      playsInline
      onContextMenu={(event) => event.preventDefault()}
      className="aspect-video w-full bg-black"
    >
      Your browser cannot play this video.
    </video>
  );
}

function MaterialList({ materials }: { materials: Material[] }) {
  if (!materials.length)
    return (
      <p className="text-sm text-ink-soft">
        No study material has been added for this course yet.
      </p>
    );
  return (
    <ul className="grid gap-2">
      {materials.map((material) => (
        <li key={material.id}>
          <a
            href={material.download_url}
            className="flex items-center gap-3 rounded-xl border border-line p-3 transition hover:border-azure"
            rel="noopener"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-azure-soft text-[10px] font-bold text-azure-dark uppercase">
              {material.extension}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">
                {material.title}
              </span>
              <span className="block truncate text-xs text-ink-soft">
                {material.module ? `Module ${material.module.number} · ` : ""}
                {formatSize(material.size)}
                {material.description ? ` · ${material.description}` : ""}
              </span>
            </span>
            <Download className="size-4 shrink-0 text-azure" aria-hidden />
            <span className="sr-only">Download</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function Outline({
  outline,
  currentId,
  onSelect,
}: {
  outline: CourseOutline;
  currentId: number | null;
  onSelect: (id: number) => void;
}) {
  const [toggled, setToggled] = useState<Record<number, boolean>>({});
  const isOpen = (module: OutlineModule) =>
    toggled[module.id] ??
    module.lessons.some((lesson) => lesson.id === currentId);

  return (
    <nav
      aria-label="Course content"
      className="overflow-hidden rounded-2xl border border-line bg-white"
    >
      <div className="border-b border-line p-4">
        <p className="text-sm font-semibold">Course content</p>
        <div className="mt-2 flex items-center justify-between text-xs text-ink-soft">
          <span>
            {outline.progress.done}/{outline.progress.total} lessons complete
          </span>
          <span className="font-semibold text-ink">
            {outline.progress.percent}%
          </span>
        </div>
        <ProgressBar
          percent={outline.progress.percent}
          label="Course progress"
          className="mt-1.5"
        />
      </div>
      <ul className="divide-y divide-line">
        {outline.modules.map((module) => {
          const open = isOpen(module);
          return (
            <li key={module.id}>
              <button
                type="button"
                onClick={() =>
                  setToggled((current) => ({ ...current, [module.id]: !open }))
                }
                aria-expanded={open}
                aria-controls={`module-${module.id}`}
                className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-mist"
              >
                <span className="mt-0.5 text-xs font-bold text-azure">
                  {String(module.number).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {module.title}
                  </span>
                  <span className="text-xs text-ink-soft">
                    {module.total
                      ? `${module.done}/${module.total} lessons`
                      : "Lessons coming soon"}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "mt-0.5 size-4 shrink-0 text-ink-soft transition",
                    open && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              {open ? (
                <ul id={`module-${module.id}`} className="pb-2">
                  {module.lessons.length === 0 ? (
                    <li className="px-4 py-2 pl-11 text-xs text-ink-soft">
                      The academic team is preparing these lessons.
                    </li>
                  ) : (
                    module.lessons.map((lesson) => {
                      const current = lesson.id === currentId;
                      const Icon = lesson.completed
                        ? CheckCircle2
                        : lesson.locked
                          ? Lock
                          : current
                            ? PlayCircle
                            : Circle;
                      return (
                        <li key={lesson.id}>
                          <button
                            type="button"
                            disabled={lesson.locked}
                            onClick={() => onSelect(lesson.id)}
                            aria-current={current ? "step" : undefined}
                            className={cn(
                              "flex w-full items-start gap-3 py-2 pr-4 pl-11 text-left text-sm transition",
                              current
                                ? "bg-azure-soft font-semibold text-azure-dark"
                                : "hover:bg-mist",
                              lesson.locked &&
                                "cursor-not-allowed text-ink-soft/70 hover:bg-transparent",
                            )}
                          >
                            <Icon
                              className={cn(
                                "mt-0.5 size-4 shrink-0",
                                lesson.completed
                                  ? "text-emerald-600"
                                  : current
                                    ? "text-azure"
                                    : "text-ink-soft",
                              )}
                              aria-hidden
                            />
                            <span className="min-w-0 flex-1">
                              {lesson.title}
                              <span className="sr-only">
                                {lesson.completed
                                  ? " (completed)"
                                  : lesson.locked
                                    ? " (locked)"
                                    : ""}
                              </span>
                            </span>
                            {lesson.duration_minutes ? (
                              <span className="text-xs font-normal text-ink-soft">
                                {lesson.duration_minutes}m
                              </span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function CoursePlayer({ slug }: { slug: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const topRef = useRef<HTMLDivElement>(null);
  const outline = usePortalData<CourseOutline>(`learning/courses/${slug}`);
  const [lessonState, setLessonState] = useState<LessonState | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState("");
  const [tab, setTab] = useState<"about" | "materials">("about");

  const requested = Number(params.get("lesson")) || null;
  const currentId = requested ?? outline.data?.next_lesson_id ?? null;
  const ready = Boolean(outline.data);

  useEffect(() => {
    if (!currentId || !ready) return;
    let cancelled = false;
    portalRequest<LessonDetail>(`learning/lessons/${currentId}`)
      .then((data) => !cancelled && setLessonState({ id: currentId, data }))
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof PortalError && error.status === 401) {
          router.replace(
            `/student/login?expired=1&next=${encodeURIComponent(window.location.pathname)}`,
          );
          return;
        }
        setLessonState({
          id: currentId,
          error:
            error instanceof PortalError
              ? error
              : new PortalError("The lesson could not be loaded.", 0),
        });
      });
    return () => {
      cancelled = true;
    };
  }, [currentId, ready, router]);

  function select(id: number) {
    setCompleteError("");
    router.replace(`/student/courses/${slug}?lesson=${id}`, { scroll: false });
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function markComplete(lesson: LessonDetail) {
    setCompleting(true);
    setCompleteError("");
    try {
      const result = await portalRequest<CompleteResult>(
        `learning/lessons/${lesson.id}/complete`,
        { method: "POST" },
      );
      setLessonState({
        id: lesson.id,
        data: {
          ...lesson,
          completed: true,
          next_locked: result.next_locked,
          progress: result.progress,
        },
      });
      if (outline.data) {
        outline.replace({
          ...outline.data,
          progress: result.progress,
          modules: outline.data.modules.map((module) => {
            const lessons = module.lessons.map((item) =>
              item.id === lesson.id
                ? { ...item, completed: true }
                : item.id === result.next_id && !result.next_locked
                  ? { ...item, locked: false }
                  : item,
            );
            return {
              ...module,
              lessons,
              done: lessons.filter((item) => item.completed).length,
            };
          }),
        });
      }
    } catch (error) {
      setCompleteError(
        error instanceof PortalError
          ? error.message
          : "Progress could not be saved. Please try again.",
      );
    } finally {
      setCompleting(false);
    }
  }

  if (outline.loading) {
    return (
      <div
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
        aria-busy="true"
        aria-label="Loading course"
      >
        <div className="aspect-video animate-pulse rounded-2xl bg-white" />
        <div className="h-96 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }
  if (outline.error) {
    if (outline.error.status === 404 || outline.error.status === 403) {
      return (
        <EmptyState
          icon={BookOpen}
          title={
            outline.error.status === 404
              ? "Course not available"
              : "Access paused"
          }
          action={{ href: "/student/courses", label: "Back to My Courses" }}
        >
          {outline.error.message}
        </EmptyState>
      );
    }
    return (
      <ErrorState message={outline.error.message} onRetry={outline.reload} />
    );
  }
  if (!outline.data) return null;

  const course = outline.data;
  const lesson = lessonState?.id === currentId ? lessonState.data : undefined;
  const lessonError =
    lessonState?.id === currentId ? lessonState.error : undefined;
  const lessonLoading = Boolean(currentId) && lessonState?.id !== currentId;
  const moduleMaterials = lesson
    ? course.materials.filter(
        (item) => item.module?.number === lesson.module.number,
      )
    : [];
  const otherMaterials = lesson
    ? course.materials.filter(
        (item) => item.module?.number !== lesson.module.number,
      )
    : course.materials;

  return (
    <div ref={topRef} className="scroll-mt-20 space-y-5">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        <Link href="/student/courses" className="hover:text-azure">
          My Courses
        </Link>
        <span aria-hidden> / </span>
        <span className="font-medium text-ink">
          {course.course.short_title}
        </span>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-azure uppercase">
            {course.course.programme_type}
          </p>
          <h1 className="mt-1 text-2xl font-bold">{course.course.title}</h1>
        </div>
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs">
            <span className="font-semibold">
              {course.progress.percent}% complete
            </span>
            <span className="text-ink-soft">
              {course.progress.done}/{course.progress.total} lessons
            </span>
          </div>
          <ProgressBar
            percent={course.progress.percent}
            label="Course progress"
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-5">
          {course.progress.total === 0 ? (
            <EmptyState icon={PlayCircle} title="Lessons are being prepared">
              The academic team is adding videos and notes for this course. The
              module plan is shown alongside; lessons appear here as soon as
              they are published.
            </EmptyState>
          ) : lessonError ? (
            <ErrorState message={lessonError.message} />
          ) : lessonLoading || !lesson ? (
            <div
              className="aspect-video animate-pulse rounded-2xl bg-white"
              aria-busy="true"
              aria-label="Loading lesson"
            />
          ) : (
            <>
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <VideoArea lesson={lesson} />
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-semibold text-azure">
                    Module {lesson.module.number} · {lesson.module.title}
                  </p>
                  <h2 className="mt-1 text-xl font-bold">{lesson.title}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
                    {minutes(lesson.duration_minutes) ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-4" aria-hidden />
                        {minutes(lesson.duration_minutes)}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5">
                      {lesson.video ? (
                        <PlayCircle className="size-4" aria-hidden />
                      ) : (
                        <FileText className="size-4" aria-hidden />
                      )}
                      {lesson.video ? "Video lesson" : "Reading lesson"}
                    </span>
                    {lesson.completed ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                        <CheckCircle2 className="size-4" aria-hidden />
                        Completed
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-line pt-5 sm:flex sm:items-center">
                    <button
                      type="button"
                      disabled={!lesson.prev_id}
                      onClick={() => lesson.prev_id && select(lesson.prev_id)}
                      className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line px-4 text-sm font-semibold disabled:opacity-40"
                    >
                      <ChevronLeft className="size-4" aria-hidden />
                      Previous
                    </button>
                    {lesson.completed ? null : (
                      <button
                        type="button"
                        disabled={completing}
                        onClick={() => void markComplete(lesson)}
                        className="order-first col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70 sm:order-none"
                      >
                        {completing ? (
                          <Loader2
                            className="size-4 animate-spin"
                            aria-hidden
                          />
                        ) : (
                          <CheckCircle2 className="size-4" aria-hidden />
                        )}
                        Mark as complete
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={!lesson.next_id || lesson.next_locked}
                      onClick={() => lesson.next_id && select(lesson.next_id)}
                      title={
                        lesson.next_locked
                          ? "Complete this lesson to unlock the next one"
                          : undefined
                      }
                      className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-azure px-4 text-sm font-semibold text-white hover:bg-azure-dark disabled:bg-line disabled:text-ink-soft sm:ml-auto"
                    >
                      {lesson.next_locked ? (
                        <Lock className="size-4" aria-hidden />
                      ) : null}
                      Next
                      <ChevronRight className="size-4" aria-hidden />
                    </button>
                  </div>
                  {completeError ? (
                    <p role="alert" className="mt-3 text-sm text-red-600">
                      {completeError}
                    </p>
                  ) : null}
                  {!lesson.next_id && lesson.completed ? (
                    <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      You have reached the last published lesson of this course.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white">
                <div
                  role="tablist"
                  aria-label="Lesson details"
                  className="flex border-b border-line px-2"
                >
                  {(
                    [
                      ["about", "About this lesson"],
                      [
                        "materials",
                        `Study material (${course.materials.length})`,
                      ],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={tab === id}
                      onClick={() => setTab(id)}
                      className={cn(
                        "-mb-px border-b-2 px-4 py-3 text-sm font-semibold",
                        tab === id
                          ? "border-azure text-ink"
                          : "border-transparent text-ink-soft hover:text-ink",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div role="tabpanel" className="p-5 sm:p-6">
                  {tab === "about" ? (
                    lesson.description ? (
                      <div className="text-sm leading-7 whitespace-pre-line text-ink">
                        {lesson.description}
                      </div>
                    ) : (
                      <p className="text-sm text-ink-soft">
                        No written notes for this lesson.
                      </p>
                    )
                  ) : (
                    <div className="space-y-5">
                      {moduleMaterials.length ? (
                        <div>
                          <p className="mb-2 text-xs font-bold tracking-wide text-ink-soft uppercase">
                            This module
                          </p>
                          <MaterialList materials={moduleMaterials} />
                        </div>
                      ) : null}
                      <div>
                        {moduleMaterials.length ? (
                          <p className="mb-2 text-xs font-bold tracking-wide text-ink-soft uppercase">
                            Whole course
                          </p>
                        ) : null}
                        <MaterialList materials={otherMaterials} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto">
          <Outline outline={course} currentId={currentId} onSelect={select} />
        </aside>
      </div>
    </div>
  );
}
