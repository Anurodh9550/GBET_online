import type { NextRequest } from "next/server";
import {
  FORBIDDEN_ORIGIN,
  SESSION_COOKIE,
  callBackend,
  clearSession,
  isSameOrigin,
  json,
} from "@/lib/portal/server";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return json(FORBIDDEN_ORIGIN, 403);
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      await callBackend("auth/logout", { method: "POST", request, token });
    } catch {
      // The cookie is cleared below even if the API is unreachable.
    }
  }
  const response = json({ detail: "You have been logged out." });
  clearSession(response);
  return response;
}
