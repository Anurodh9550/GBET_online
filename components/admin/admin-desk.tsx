"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_TOKEN_KEY, API_URL, adminHeaders, type Enquiry, type EnquiryStatus } from "@/lib/api";

const STATUSES: { id: EnquiryStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "called", label: "Called" },
  { id: "closed", label: "Closed" },
];

function when(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminDesk() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [status, setStatus] = useState<EnquiryStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
    if (!saved) {
      router.replace("/admin/login");
      return;
    }
    setToken(saved);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/api/enquiries/`, { headers: adminHeaders(token) });
        if (res.status === 401) {
          window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
          router.replace("/admin/login");
          return;
        }
        if (!res.ok) {
          setError("The desk could not load enquiries.");
          return;
        }
        const data = (await res.json()) as Enquiry[];
        if (!cancelled) setRows(data);
      } catch {
        if (!cancelled) setError("The admissions API is not running.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [token, router]);

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return rows.filter((row) => {
      const statusOk = status === "all" || row.status === status;
      const haystack = `${row.full_name} ${row.mobile} ${row.email} ${row.course} ${row.city}`.toLowerCase();
      return statusOk && (text === "" || haystack.includes(text));
    });
  }, [rows, query, status]);

  const counts = {
    new: rows.filter((row) => row.status === "new").length,
    called: rows.filter((row) => row.status === "called").length,
    closed: rows.filter((row) => row.status === "closed").length,
  };

  async function save(row: Enquiry, patch: Partial<Pick<Enquiry, "status" | "note">>) {
    const res = await fetch(`${API_URL}/api/enquiries/${row.id}/`, {
      method: "PATCH",
      headers: adminHeaders(token),
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      setError("That update did not save.");
      return;
    }
    const next = (await res.json()) as Enquiry;
    setRows((current) => current.map((item) => (item.id === next.id ? next : item)));
  }

  function signOut() {
    window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    router.replace("/admin/login");
  }

  if (!token) {
    return <p className="px-4 py-16 text-sm text-stone-500">Opening the desk…</p>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">GBET Online</p>
          <h1 className="mt-1 font-serif text-4xl text-[#3d2918]">Admissions desk</h1>
        </div>
        <button type="button" onClick={signOut} className="h-10 rounded-full border border-[#3d2918] px-4 text-sm font-semibold">
          Sign out
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["New", counts.new],
          ["Called", counts.called],
          ["Closed", counts.closed],
        ].map(([label, count]) => (
          <div key={label} className="rounded-2xl border border-[#ebe4dc] bg-white px-4 py-3">
            <p className="text-xs font-semibold tracking-wide text-stone-500 uppercase">{label}</p>
            <p className="mt-1 font-serif text-3xl">{count}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {STATUSES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setStatus(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${status === item.id ? "bg-[#3d2918] text-white" : "bg-white ring-1 ring-[#ebe4dc]"}`}
          >
            {item.label}
          </button>
        ))}
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, mobile, course"
          className="h-10 min-w-56 flex-1 rounded-full border border-[#ebe4dc] bg-white px-4 text-sm outline-none"
        />
      </div>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="mt-8 text-sm text-stone-500">Loading enquiries…</p> : null}
      {!loading && visible.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-[#ebe4dc] bg-white p-6 text-sm">No enquiry matches this view.</p>
      ) : null}

      <div className="mt-6 grid gap-4">
        {visible.map((row) => (
          <article key={row.id} className="rounded-3xl border border-[#ebe4dc] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{row.full_name}</h2>
                <p className="mt-1 text-sm text-stone-600">
                  {row.course} · {row.city}, {row.state}
                </p>
              </div>
              <p className="text-xs text-stone-500">{when(row.created_at)} · {row.source === "brochure" ? "Brochure" : "Website"}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <a className="font-semibold text-brand" href={`tel:+91${row.mobile}`}>{row.mobile}</a>
              <a className="text-stone-600" href={`mailto:${row.email}`}>{row.email}</a>
              <a className="font-semibold" href={`https://wa.me/91${row.mobile}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
            {row.message ? <p className="mt-3 text-sm text-stone-700">{row.message}</p> : null}
            <div className="mt-4 grid gap-3 sm:grid-cols-[10rem_1fr]">
              <select
                value={row.status}
                onChange={(event) => void save(row, { status: event.target.value as EnquiryStatus })}
                className="h-11 rounded-xl border border-[#ebe4dc] bg-white px-3 text-sm"
              >
                <option value="new">New</option>
                <option value="called">Called</option>
                <option value="closed">Closed</option>
              </select>
              <input
                defaultValue={row.note}
                key={`${row.id}-${row.updated_at}`}
                onBlur={(event) => {
                  if (event.target.value !== row.note) void save(row, { note: event.target.value });
                }}
                placeholder="Desk note"
                className="h-11 rounded-xl border border-[#ebe4dc] px-3 text-sm outline-none"
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
