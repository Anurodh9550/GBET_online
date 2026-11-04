// Renders /brochures/<slug> for every course with headless Chrome and saves A4 PDFs to public/brochures.
// Usage: start the site (npm run dev or npm start), then run `npm run brochures`.
// Env: BROCHURE_BASE_URL (default http://localhost:3000), CHROME_PATH, BROCHURE_ONLY=slug1,slug2
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const BASE = (process.env.BROCHURE_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const CHROME =
  process.env.CHROME_PATH ??
  (process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : "google-chrome");
const PORT = 9400 + Math.floor(Math.random() * 400);
const OUT_DIR = path.resolve("public", "brochures");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connect() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = targets.find((target) => target.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      // Chrome is still starting.
    }
    await sleep(300);
  }
  throw new Error("Chrome did not start. Set CHROME_PATH to your Chrome executable.");
}

function client(url) {
  const socket = new WebSocket(url);
  let id = 0;
  const pending = new Map();
  const events = [];
  socket.addEventListener("message", (message) => {
    const data = JSON.parse(message.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(data.error.message));
      else resolve(data.result);
    } else if (data.method) {
      events.push(data.method);
    }
  });
  const ready = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  return {
    ready,
    events,
    close: () => socket.close(),
    send(method, params = {}) {
      id += 1;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    async evaluate(expression) {
      const result = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      return result.result?.value;
    },
  };
}

async function waitForLoad(cdp, url) {
  cdp.events.length = 0;
  await cdp.send("Page.navigate", { url });
  for (let i = 0; i < 200 && !cdp.events.includes("Page.loadEventFired"); i += 1) await sleep(150);
  await cdp.evaluate(`(async () => {
    await document.fonts.ready;
    const images = [...document.images];
    await Promise.all(images.map((img) => img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; })));
    return images.every((img) => img.naturalWidth > 0);
  })()`);
  await sleep(400);
}

const profile = await mkdtemp(path.join(tmpdir(), "gbet-brochures-"));
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "about:blank"], {
  stdio: "ignore",
});

try {
  const cdp = client(await connect());
  await cdp.ready;
  await cdp.send("Page.enable");

  await waitForLoad(cdp, `${BASE}/brochures`);
  let slugs = await cdp.evaluate(`[...document.querySelectorAll("a[data-slug]")].map((a) => a.dataset.slug)`);
  if (!slugs?.length) throw new Error(`No courses found at ${BASE}/brochures. Is the site running?`);
  if (process.env.BROCHURE_ONLY) slugs = slugs.filter((slug) => process.env.BROCHURE_ONLY.split(",").includes(slug));

  await mkdir(OUT_DIR, { recursive: true });
  for (const slug of slugs) {
    await waitForLoad(cdp, `${BASE}/brochures/${slug}`);
    const pages = await cdp.evaluate(`document.querySelectorAll(".sheet").length`);
    const overflow = await cdp.evaluate(
      `[...document.querySelectorAll(".sheet")].map((sheet, i) => sheet.scrollHeight > sheet.clientHeight + 1 ? i + 1 : 0).filter(Boolean)`,
    );
    const { data } = await cdp.send("Page.printToPDF", {
      printBackground: true,
      preferCSSPageSize: true,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      displayHeaderFooter: false,
    });
    const file = path.join(OUT_DIR, `${slug}.pdf`);
    await writeFile(file, Buffer.from(data, "base64"));
    const warning = overflow.length ? `  ⚠ content cut on page ${overflow.join(", ")}` : "";
    console.log(`✓ ${slug}.pdf  (${pages} pages, ${Math.round(Buffer.byteLength(data, "base64") / 1024)} KB)${warning}`);
  }
  cdp.close();
  console.log(`\n${slugs.length} brochures saved to ${OUT_DIR}`);
} finally {
  chrome.kill();
  await sleep(500);
  await rm(profile, { recursive: true, force: true }).catch(() => undefined);
}
