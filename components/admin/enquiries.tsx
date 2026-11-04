"use client";

import { useMemo, useState } from "react";
import { Inbox, MessageCircle, Phone } from "lucide-react";
import {
  useAdminData,
  useAdminSession,
} from "@/components/admin/admin-session";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  PageHeader,
} from "@/components/portal/ui";
import { AdminError, adminRequest, when } from "@/lib/admin/api";
import {
  SOURCE_LABEL,
  type Enquiry,
  type EnquirySource,
  type EnquiryStatus,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const FILTERS: { id: EnquiryStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "called", label: "Called" },
  { id: "closed", label: "Closed" },
];

export function AdminEnquiries() {
  const { token, expire } = useAdminSession();
  const { data, error, loading, reload, replace } =
    useAdminData<Enquiry[]>("/api/enquiries/");
  const [status, setStatus] = useState<EnquiryStatus | "all">("all");
  const [source, setSource] = useState<EnquirySource | "all">("all");
  const [query, setQuery] = useState("");
  const [saveError, setSaveError] = useState("");

  const rows = useMemo(() => data ?? [], [data]);
  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return rows.filter((row) => {
      const haystack =
        `${row.full_name} ${row.mobile} ${row.email} ${row.course} ${row.city}`.toLowerCase();
      return (
        (status === "all" || row.status === status) &&
        (source === "all" || row.source === source) &&
        (!text || haystack.includes(text))
      );
    });
  }, [rows, query, status, source]);

  async function save(
    row: Enquiry,
    patch: Partial<Pick<Enquiry, "status" | "note">>,
  ) {
    setSaveError("");
    try {
      const next = await adminRequest<Enquiry>(
        token,
        `/api/enquiries/${row.id}/`,
        { method: "PATCH", body: patch },
      );
      replace(rows.map((item) => (item.id === next.id ? next : item)));
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      setSaveError(
        err instanceof AdminError ? err.message : "That update did not save.",
      );
    }
  }

  const count = (id: EnquiryStatus) =>
    rows.filter((row) => row.status === id).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiries"
        description="Admission enquiries from the website forms and brochure requests."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        {(["new", "called", "closed"] as const).map((id) => (
          <div
            key={id}
            className="rounded-2xl border border-line bg-white px-5 py-4"
          >
            <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
              {id}
            </p>
            <p className="mt-1 text-2xl font-bold">{count(id)}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setStatus(item.id)}
            aria-pressed={status === item.id}
            className={cn(
              "h-10 rounded-full px-4 text-sm font-semibold",
              status === item.id
                ? "bg-ink text-white"
                : "border border-line bg-white",
            )}
          >
            {item.label}
          </button>
        ))}
        <select
          aria-label="Filter by source"
          value={source}
          onChange={(event) =>
            setSource(event.target.value as EnquirySource | "all")
          }
          className="h-10 rounded-full border border-line bg-white px-4 text-sm font-semibold"
        >
          <option value="all">All sources</option>
          {(Object.keys(SOURCE_LABEL) as EnquirySource[]).map((id) => (
            <option key={id} value={id}>
              {SOURCE_LABEL[id]} (
              {rows.filter((row) => row.source === id).length})
            </option>
          ))}
        </select>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, mobile, course, city"
          aria-label="Search enquiries"
          className="h-10 min-w-56 flex-1 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-azure"
        />
      </div>
      {saveError ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {saveError}
        </p>
      ) : null}

      {loading ? (
        <CardSkeleton count={3} />
      ) : error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : !visible.length ? (
        <EmptyState icon={Inbox} title="No enquiry matches this view" />
      ) : (
        <ul className="grid gap-3">
          {visible.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold">{row.full_name}</h2>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {row.course} · {row.city}, {row.state}
                  </p>
                </div>
                <p className="text-xs text-ink-soft">
                  {when(row.created_at)} ·{" "}
                  {SOURCE_LABEL[row.source] ?? row.source}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a
                  className="inline-flex items-center gap-1.5 font-semibold text-azure"
                  href={`tel:+91${row.mobile}`}
                >
                  <Phone className="size-3.5" aria-hidden />
                  {row.mobile}
                </a>
                <a
                  className="text-ink-soft hover:text-azure"
                  href={`mailto:${row.email}`}
                >
                  {row.email}
                </a>
                <a
                  className="inline-flex items-center gap-1.5 font-semibold text-emerald-700"
                  href={`https://wa.me/91${row.mobile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-3.5" aria-hidden />
                  WhatsApp
                </a>
              </div>
              {row.message ? (
                <p className="mt-3 rounded-xl bg-mist px-3 py-2 text-sm">
                  {row.message}
                </p>
              ) : null}
              <div className="mt-4 grid gap-2 sm:grid-cols-[10rem_1fr]">
                <select
                  aria-label={`Status for ${row.full_name}`}
                  value={row.status}
                  onChange={(event) =>
                    void save(row, {
                      status: event.target.value as EnquiryStatus,
                    })
                  }
                  className="h-11 rounded-xl border border-line bg-white px-3 text-sm"
                >
                  <option value="new">New</option>
                  <option value="called">Called</option>
                  <option value="closed">Closed</option>
                </select>
                <input
                  defaultValue={row.note}
                  key={`${row.id}-${row.updated_at}`}
                  onBlur={(event) =>
                    event.target.value !== row.note &&
                    void save(row, { note: event.target.value })
                  }
                  placeholder="Desk note (saves when you leave the field)"
                  aria-label={`Note for ${row.full_name}`}
                  className="h-11 rounded-xl border border-line px-3 text-sm outline-none focus:border-azure"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
