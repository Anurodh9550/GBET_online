export type Progress = { done: number; total: number; percent: number };

export type EnrollmentStatus = "active" | "completed" | "suspended";

export type CourseCardData = {
  id: number;
  status: EnrollmentStatus;
  start_date: string | null;
  course: {
    slug: string;
    title: string;
    short_title: string;
    programme_type: "Diploma" | "Certificate";
    duration: string;
    category_label: string;
    image: string;
  };
  batch: { name: string; start_date: string; end_date: string | null } | null;
  faculty_name: string | null;
  progress: Progress;
  next_lesson_id: number | null;
};

export type OutlineLesson = {
  id: number;
  title: string;
  duration_minutes: number | null;
  kind: "video" | "reading";
  completed: boolean;
  locked: boolean;
};

export type OutlineModule = {
  id: number;
  number: number;
  title: string;
  outcome: string;
  done: number;
  total: number;
  materials: number;
  lessons: OutlineLesson[];
};

export type Material = {
  id: number;
  title: string;
  description: string;
  extension: string;
  size: number;
  module: { number: number; title: string } | null;
  download_url: string;
};

export type CourseOutline = CourseCardData & {
  sequential: boolean;
  modules: OutlineModule[];
  materials: Material[];
};

export type LessonDetail = {
  id: number;
  title: string;
  description: string;
  duration_minutes: number | null;
  module: { number: number; title: string };
  course: { slug: string; title: string };
  video:
    | { type: "embed"; provider: "youtube" | "vimeo"; url: string }
    | { type: "file"; url: string }
    | null;
  completed: boolean;
  prev_id: number | null;
  next_id: number | null;
  next_locked: boolean;
  progress: Progress;
};

export type CompleteResult = {
  completed: true;
  progress: Progress;
  next_id: number | null;
  next_locked: boolean;
};

export type LearningSummary = {
  enrolled: number;
  active: number;
  completed: number;
  lessons_done: number;
  lessons_total: number;
  overall_percent: number;
};

export type CourseMaterials = {
  course: { slug: string; title: string };
  materials: Material[];
};

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const STATUS_LABEL: Record<EnrollmentStatus, string> = {
  active: "In progress",
  completed: "Completed",
  suspended: "Paused",
};
