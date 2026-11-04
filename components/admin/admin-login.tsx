"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { setAdminToken, useAdminToken } from "@/components/admin/admin-session";
import {
  Field,
  Notice,
  PasswordInput,
  SubmitButton,
  TextInput,
} from "@/components/portal/form-controls";
import { API_URL } from "@/lib/api";
import { SITE } from "@/lib/site";

export function AdminLogin() {
  const router = useRouter();
  const token = useAdminToken();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (token) router.replace("/admin");
  }, [token, router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password)
      return setError("Enter your username and password.");
    setPending(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = (await res.json().catch(() => ({}))) as { token?: string };
      if (!res.ok || !data.token) {
        setError("Those sign-in details were not accepted.");
        return;
      }
      setAdminToken(data.token);
      router.replace("/admin");
    } catch {
      setError(
        "The admissions API is not running. Start the Django server, then try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-mist text-ink">
      <div className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative size-10 overflow-hidden rounded-full ring-2 ring-azure/30">
            <Image
              src="/logo.png"
              alt=""
              fill
              className="object-cover"
              sizes="40px"
            />
          </span>
          <span className="font-bold">{SITE.name}</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-azure"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to website
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-md rounded-3xl border border-line bg-white p-7 shadow-sm sm:p-8">
          <span className="grid size-12 place-items-center rounded-2xl bg-ink text-white">
            <ShieldCheck className="size-6" aria-hidden />
          </span>
          <h1 className="mt-5 text-2xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Sign in to manage enquiries, students, courses and content.
          </p>
          <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5">
            {error ? <Notice tone="error">{error}</Notice> : null}
            <Field id="admin-username" label="Username">
              <TextInput
                id="admin-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </Field>
            <Field id="admin-password" label="Password">
              <PasswordInput
                id="admin-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </Field>
            <SubmitButton pending={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}
