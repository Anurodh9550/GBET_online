import type { NextRequest } from "next/server";
import {
  FORBIDDEN_ORIGIN,
  SESSION_COOKIE,
  UNAVAILABLE,
  callBackend,
  clearSession,
  isSameOrigin,
  json,
  readJson,
  setSession,
} from "@/lib/portal/server";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return json(FORBIDDEN_ORIGIN, 403);
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return json({ detail: "Please log in again." }, 401);
  let res: Response;
  try {
    res = await callBackend("auth/change-password", {
      method: "POST",
      request,
      token,
      body: await request.text(),
    });
  } catch {
    return json(UNAVAILABLE, 503);
  }
  const data = await readJson(res);
  if (res.status === 401) {
    const response = json(data, 401);
    clearSession(response);
    return response;
  }
  if (!res.ok || typeof data.token !== "string")
    return json(data, res.ok ? 502 : res.status);
  const response = json({ detail: data.detail });
  setSession(response, data.token);
  return response;
}
