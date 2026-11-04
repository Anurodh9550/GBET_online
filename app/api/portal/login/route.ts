import type { NextRequest } from "next/server";
import {
  FORBIDDEN_ORIGIN,
  UNAVAILABLE,
  callBackend,
  isSameOrigin,
  json,
  readJson,
  setSession,
} from "@/lib/portal/server";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return json(FORBIDDEN_ORIGIN, 403);
  const body = await request.text();
  let res: Response;
  try {
    res = await callBackend("auth/login", { method: "POST", request, body });
  } catch {
    return json(UNAVAILABLE, 503);
  }
  const data = await readJson(res);
  if (!res.ok || typeof data.token !== "string")
    return json(data, res.ok ? 502 : res.status);
  const response = json({ student: data.student });
  setSession(response, data.token);
  return response;
}
