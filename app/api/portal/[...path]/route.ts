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
} from "@/lib/portal/server";

type Method = "GET" | "POST" | "PATCH";

const ROUTES: { path: RegExp; methods: Method[]; auth: boolean }[] = [
  { path: /^auth\/register$/, methods: ["POST"], auth: false },
  { path: /^auth\/password-reset$/, methods: ["POST"], auth: false },
  { path: /^auth\/password-reset\/confirm$/, methods: ["POST"], auth: false },
  { path: /^me$/, methods: ["GET", "PATCH"], auth: true },
  {
    path: /^learning\/(summary|courses|materials)$/,
    methods: ["GET"],
    auth: true,
  },
  { path: /^learning\/courses\/[a-z0-9-]+$/, methods: ["GET"], auth: true },
  { path: /^learning\/lessons\/\d+$/, methods: ["GET"], auth: true },
  { path: /^learning\/lessons\/\d+\/complete$/, methods: ["POST"], auth: true },
  { path: /^finance\/summary$/, methods: ["GET"], auth: true },
  { path: /^finance\/installments\/\d+\/pay$/, methods: ["POST"], auth: true },
  {
    path: /^finance\/payments\/\d+\/(verify|failed)$/,
    methods: ["POST"],
    auth: true,
  },
];

async function forward(
  request: NextRequest,
  ctx: RouteContext<"/api/portal/[...path]">,
  method: Method,
) {
  const { path: segments } = await ctx.params;
  const path = segments.join("/");
  const route = ROUTES.find(
    (item) => item.path.test(path) && item.methods.includes(method),
  );
  if (!route) return json({ detail: "Not found." }, 404);
  if (method !== "GET" && !isSameOrigin(request))
    return json(FORBIDDEN_ORIGIN, 403);

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (route.auth && !token)
    return json({ detail: "Please log in to continue." }, 401);

  let res: Response;
  try {
    res = await callBackend(path, {
      method,
      request,
      token: route.auth ? token : undefined,
      body: method === "GET" ? undefined : await request.text(),
      search: request.nextUrl.search,
    });
  } catch {
    return json(UNAVAILABLE, 503);
  }
  const response = json(await readJson(res), res.status);
  if (route.auth && res.status === 401) clearSession(response);
  return response;
}

export function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/portal/[...path]">,
) {
  return forward(request, ctx, "GET");
}

export function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/portal/[...path]">,
) {
  return forward(request, ctx, "POST");
}

export function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/portal/[...path]">,
) {
  return forward(request, ctx, "PATCH");
}
