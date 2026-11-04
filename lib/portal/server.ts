import { NextResponse, type NextRequest } from "next/server";

export const SESSION_COOKIE = "gbet_student_session";

const SESSION_HOURS = Number(process.env.PORTAL_SESSION_HOURS ?? 12);
const BACKEND = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

export function backendUrl(path: string, search = "") {
  return `${BACKEND}/api/portal/${path.replace(/^\/|\/$/g, "")}/${search}`;
}

export function setSession(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export function clearSession(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return (
      new URL(origin).host ===
      (request.headers.get("x-forwarded-host") ?? request.headers.get("host"))
    );
  } catch {
    return false;
  }
}

export function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export const UNAVAILABLE = {
  detail:
    "The student portal is not reachable right now. Please try again in a few minutes.",
};
export const FORBIDDEN_ORIGIN = {
  detail:
    "This request was blocked for security reasons. Refresh the page and try again.",
};

export function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    ""
  );
}

export async function callBackend(
  path: string,
  init: {
    method: string;
    request: NextRequest;
    token?: string;
    body?: string;
    search?: string;
  },
) {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (init.body !== undefined) headers["Content-Type"] = "application/json";
  if (init.token) headers.Authorization = `Token ${init.token}`;
  const ip = clientIp(init.request);
  if (ip) headers["X-Forwarded-For"] = ip;
  return fetch(backendUrl(path, init.search), {
    method: init.method,
    headers,
    body: init.body,
    cache: "no-store",
  });
}

export async function readJson(res: Response) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { detail: "Unexpected response from the server." };
  }
}
