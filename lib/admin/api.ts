import { API_URL } from "@/lib/api";

export class AdminError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fields: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

function errorFrom(status: number, data: Record<string, unknown>) {
  const fields = Object.fromEntries(
    Object.entries(data).filter(([, value]) => Array.isArray(value)),
  ) as Record<string, string[]>;
  const first =
    typeof data.detail === "string"
      ? data.detail
      : Object.entries(fields).map(([key, value]) =>
          key === "non_field_errors"
            ? value[0]
            : `${key.replaceAll("_", " ")}: ${value[0]}`,
        )[0];
  return new AdminError(
    first ??
      (status === 0 ? "The API is not reachable." : "That did not save."),
    status,
    fields,
  );
}

export async function adminRequest<T>(
  token: string,
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    form?: FormData;
  } = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Token ${token}`,
        ...(options.body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
      },
      body:
        options.form ??
        (options.body !== undefined ? JSON.stringify(options.body) : undefined),
      cache: "no-store",
    });
  } catch {
    throw new AdminError(
      "The admissions API is not running. Start the Django server and try again.",
      0,
    );
  }
  if (res.status === 204) return undefined as T;
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw errorFrom(res.status, data);
  return data as T;
}

export function adminUpload<T>(
  token: string,
  path: string,
  method: "POST" | "PATCH",
  form: FormData,
  onProgress: (percent: number) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${API_URL}${path}`);
    xhr.setRequestHeader("Authorization", `Token ${token}`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable)
        onProgress(Math.round((event.loaded * 100) / event.total));
    };
    xhr.onload = () => {
      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(xhr.responseText || "{}");
      } catch {
        data = {};
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data as T);
      else reject(errorFrom(xhr.status, data));
    };
    xhr.onerror = () =>
      reject(
        new AdminError(
          "The upload failed. Check the connection and try again.",
          0,
        ),
      );
    xhr.send(form);
  });
}

export type AdminBatch = {
  id: number;
  course: number;
  course_title: string;
  name: string;
  faculty_name: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  students: number;
};

export type AdminCourseSummary = {
  id: number;
  slug: string;
  title: string;
  programme_type: string;
  category_label: string;
  duration: string;
  image: string;
  is_active: boolean;
  sequential: boolean;
  modules_total: number;
  lessons_total: number;
  lessons_published: number;
  students: number;
  batches: AdminBatch[];
};

export type VideoSource = "none" | "youtube" | "vimeo" | "upload";

export type AdminLesson = {
  id: number;
  module: number;
  order: number;
  title: string;
  description: string;
  video_source: VideoSource;
  video_url: string;
  video_file_name: string | null;
  preview_url: string | null;
  duration_minutes: number | null;
  is_published: boolean;
  completions: number;
  updated_at: string;
};

export type AdminModule = {
  id: number;
  course: number;
  number: number;
  title: string;
  outcome: string;
  lessons: AdminLesson[];
};

export type AdminMaterial = {
  id: number;
  course: number;
  module: number | null;
  title: string;
  description: string;
  original_name: string;
  size: number;
  extension: string;
  is_published: boolean;
  uploaded_at: string;
  download_url: string;
};

export type AdminCourseDetail = Omit<
  AdminCourseSummary,
  "modules_total" | "lessons_total" | "lessons_published"
> & {
  short_title: string;
  modules: AdminModule[];
  materials: AdminMaterial[];
};

export type AdminEnrollment = {
  id: number;
  student: number;
  student_name: string;
  student_email: string;
  student_code: string | null;
  course: number;
  course_title: string;
  course_slug: string;
  batch: number | null;
  batch_name: string | null;
  status: "active" | "completed" | "suspended";
  start_date: string | null;
  completed_at: string | null;
  created_at: string;
  progress: { done: number; total: number; percent: number };
};

export type AdminDashboard = {
  students: {
    total: number;
    pending: number;
    active: number;
    inactive: number;
  };
  enquiries: {
    total: number;
    new: number;
    called: number;
    closed: number;
    last_7_days: number;
  };
  enrollments: {
    total: number;
    active: number;
    completed: number;
    suspended: number;
  };
  content: {
    courses: number;
    lessons_total: number;
    lessons_published: number;
    materials: number;
    batches_active: number;
  };
  top_courses: { id: number; title: string; students: number }[];
  recent_enquiries: {
    id: number;
    full_name: string;
    course: string;
    status: string;
    source: string;
    created_at: string;
  }[];
  pending_students: {
    id: number;
    full_name: string;
    course_interest: string;
    created_at: string;
  }[];
};

export function when(value: string | null, withTime = true) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}
