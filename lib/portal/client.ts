export type StudentStatus = "pending" | "active" | "inactive";

export type Student = {
  full_name: string;
  email: string;
  student_id: string | null;
  mobile: string;
  state: string;
  city: string;
  address: string;
  date_of_birth: string | null;
  course_interest: string;
  status: StudentStatus;
  verified_at: string | null;
  created_at: string;
};

export type FieldErrors = Record<string, string[]>;

export class PortalError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly fields: FieldErrors = {},
  ) {
    super(message);
  }
}

function firstMessage(data: Record<string, unknown>) {
  if (typeof data.detail === "string") return data.detail;
  for (const value of Object.values(data)) {
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  }
  return "Something went wrong. Please try again.";
}

export async function portalRequest<T>(
  path: string,
  options: { method?: "GET" | "POST" | "PATCH"; body?: unknown } = {},
) {
  let res: Response;
  try {
    res = await fetch(`/api/portal/${path}`, {
      method: options.method ?? "GET",
      headers:
        options.body === undefined
          ? undefined
          : { "Content-Type": "application/json" },
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    throw new PortalError("Check your internet connection and try again.", 0);
  }
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const fields = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) =>
          key !== "detail" && key !== "code" && Array.isArray(value),
      ),
    ) as FieldErrors;
    throw new PortalError(
      firstMessage(data),
      res.status,
      typeof data.code === "string" ? data.code : undefined,
      fields,
    );
  }
  return data as T;
}

export function formatDate(value: string | null, withTime = false) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}
