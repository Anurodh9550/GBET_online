"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_TOKEN_KEY, API_URL } from "@/lib/api";

export function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(ADMIN_TOKEN_KEY)) router.replace("/admin");
  }, [router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (!res.ok) {
        setError("Those sign-in details were not accepted.");
        return;
      }
      const data = (await res.json()) as { token?: string };
      if (!data.token) {
        setError("The desk did not return a sign-in token.");
        return;
      }
      window.sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      router.replace("/admin");
    } catch {
      setError("The admissions API is not running. Start the Django server, then try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">GBET Online</p>
      <h1 className="mt-2 font-serif text-4xl text-[#3d2918]">Admissions desk</h1>
      <p className="mt-2 text-sm text-stone-600">Sign in to read enquiries from the website and the brochure.</p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-3xl border border-[#ebe4dc] bg-white p-6">
        <label className="grid gap-1.5 text-sm font-semibold">
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            className="h-11 rounded-xl border border-[#ebe4dc] px-3 font-normal outline-none"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            className="h-11 rounded-xl border border-[#ebe4dc] px-3 font-normal outline-none"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" disabled={pending} className="h-11 rounded-full bg-[#3d2918] text-sm font-semibold text-white disabled:opacity-60">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
