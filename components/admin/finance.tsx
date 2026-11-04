"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  IndianRupee,
  Plus,
  Trash2,
  Wallet,
} from "lucide-react";
import {
  useAdminData,
  useAdminSession,
} from "@/components/admin/admin-session";
import {
  Field,
  Notice,
  SelectInput,
  SubmitButton,
  TextInput,
} from "@/components/portal/form-controls";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  PageHeader,
} from "@/components/portal/ui";
import {
  AdminError,
  adminRequest,
  when,
  type AdminEnrollment,
} from "@/lib/admin/api";
import {
  INSTALLMENT_LABEL,
  INSTALLMENT_STYLE,
  rupees,
  type FeePayment,
  type InstallmentStatus,
} from "@/lib/portal/finance";
import { cn } from "@/lib/utils";

type Summary = {
  accounts: number;
  total_fees: string;
  collected: string;
  refunded: string;
  outstanding: string;
  collected_this_month: string;
  overdue_installments: number;
  overdue_amount: string;
  monthly: { month: string; collected: string }[];
  online_enabled: boolean;
  recent_payments: (FeePayment & { student: string })[];
};

type AccountRow = {
  id: number;
  enrollment: number;
  student: { name: string; student_id: string | null };
  course: string;
  total_fee: string;
  net_paid: string;
  balance: string;
  next_due: {
    title: string;
    due_date: string;
    status: InstallmentStatus;
  } | null;
};

type PlanRow = { title: string; amount: string; due_date: string };

function CreatePlan({
  accounts,
  onCreated,
}: {
  accounts: AccountRow[];
  onCreated: (id: number) => void;
}) {
  const { token, expire } = useAdminSession();
  const enrollments = useAdminData<AdminEnrollment[]>(
    "/api/portal/admin/enrollments/",
  );
  const taken = new Set(accounts.map((row) => row.enrollment));
  const available = (enrollments.data ?? []).filter(
    (row) => !taken.has(row.id),
  );
  const [enrollment, setEnrollment] = useState("");
  const [total, setTotal] = useState("");
  const [note, setNote] = useState("");
  const [rows, setRows] = useState<PlanRow[]>([
    { title: "Installment 1", amount: "", due_date: "" },
  ]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const sum = rows.reduce((value, row) => value + (Number(row.amount) || 0), 0);
  const matches = Number(total) > 0 && Math.abs(sum - Number(total)) < 0.005;

  function split(count: number) {
    const value = Number(total);
    if (!value) return;
    const base = Math.floor((value / count) * 100) / 100;
    const today = new Date();
    setRows(
      Array.from({ length: count }, (_, index) => {
        const due = new Date(
          today.getFullYear(),
          today.getMonth() + index,
          today.getDate(),
        );
        const amount =
          index === count - 1
            ? (value - base * (count - 1)).toFixed(2)
            : base.toFixed(2);
        return {
          title: count === 1 ? "Full fee" : `Installment ${index + 1}`,
          amount,
          due_date: due.toISOString().slice(0, 10),
        };
      }),
    );
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!enrollment) return setError("Choose a student enrolment.");
    if (!matches)
      return setError("The installments must add up to the total fee.");
    if (rows.some((row) => !row.title.trim() || !row.due_date))
      return setError("Every installment needs a title and a due date.");
    setSaving(true);
    setError("");
    try {
      const created = await adminRequest<{ id: number }>(
        token,
        "/api/portal/admin/finance/accounts/",
        {
          method: "POST",
          body: {
            enrollment: Number(enrollment),
            total_fee: total,
            note,
            installments: rows,
          },
        },
      );
      onCreated(created.id);
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return expire();
      setError(
        err instanceof AdminError
          ? err.message
          : "The fee plan could not be created.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-4 rounded-2xl border border-line bg-white p-5"
    >
      <h2 className="font-semibold">Create a fee plan</h2>
      <p className="-mt-2 text-xs text-ink-soft">
        Use the fee agreed during counselling. Fees are only visible to the
        student in their portal.
      </p>
      <Field id="plan-enrollment" label="Student and course">
        <SelectInput
          id="plan-enrollment"
          value={enrollment}
          onChange={(event) => setEnrollment(event.target.value)}
        >
          <option value="">
            {available.length
              ? "Choose an enrolment"
              : "No enrolment without a fee plan"}
          </option>
          {available.map((row) => (
            <option key={row.id} value={row.id}>
              {row.student_name} – {row.course_title}
            </option>
          ))}
        </SelectInput>
      </Field>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <Field id="plan-total" label="Total fee (₹)">
          <TextInput
            id="plan-total"
            type="number"
            min={1}
            step="0.01"
            value={total}
            onChange={(event) => setTotal(event.target.value)}
          />
        </Field>
        <Field id="plan-note" label="Note" optional>
          <TextInput
            id="plan-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. 10% scholarship applied"
          />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-ink-soft">Quick split:</span>
        {[1, 2, 3, 4, 6].map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => split(count)}
            className="rounded-full border border-line px-3 py-1 font-semibold hover:border-azure"
          >
            {count === 1 ? "Full" : `${count} parts`}
          </button>
        ))}
      </div>
      <div className="grid gap-2">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 rounded-xl bg-mist p-2"
          >
            <TextInput
              aria-label={`Installment ${index + 1} title`}
              value={row.title}
              onChange={(event) =>
                setRows(
                  rows.map((item, i) =>
                    i === index ? { ...item, title: event.target.value } : item,
                  ),
                )
              }
              className="col-span-3 h-10"
            />
            <TextInput
              aria-label={`Installment ${index + 1} amount`}
              type="number"
              min={1}
              step="0.01"
              value={row.amount}
              onChange={(event) =>
                setRows(
                  rows.map((item, i) =>
                    i === index
                      ? { ...item, amount: event.target.value }
                      : item,
                  ),
                )
              }
              className="h-10"
              placeholder="₹"
            />
            <TextInput
              aria-label={`Installment ${index + 1} due date`}
              type="date"
              value={row.due_date}
              onChange={(event) =>
                setRows(
                  rows.map((item, i) =>
                    i === index
                      ? { ...item, due_date: event.target.value }
                      : item,
                  ),
                )
              }
              className="h-10"
            />
            <button
              type="button"
              onClick={() => setRows(rows.filter((_, i) => i !== index))}
              disabled={rows.length === 1}
              className="grid size-10 place-items-center rounded-lg text-red-600 hover:bg-red-50 disabled:text-ink-soft/40"
              aria-label={`Remove installment ${index + 1}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setRows([
              ...rows,
              {
                title: `Installment ${rows.length + 1}`,
                amount: "",
                due_date: "",
              },
            ])
          }
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-azure"
        >
          <Plus className="size-4" aria-hidden />
          Add installment
        </button>
      </div>
      <p
        className={cn(
          "text-xs font-semibold",
          matches ? "text-emerald-700" : "text-amber-700",
        )}
      >
        Installments total {rupees(sum)}{" "}
        {Number(total) ? `of ${rupees(total)}` : ""} {matches ? "✓" : ""}
      </p>
      {error ? <Notice tone="error">{error}</Notice> : null}
      <SubmitButton pending={saving}>Create fee plan</SubmitButton>
    </form>
  );
}

export function FinancePage() {
  const router = useRouter();
  const summary = useAdminData<Summary>("/api/portal/admin/finance/summary/");
  const [state, setState] = useState("");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const qs = new URLSearchParams();
  if (state) qs.set("state", state);
  if (search) qs.set("q", search);
  const accounts = useAdminData<AccountRow[]>(
    `/api/portal/admin/finance/accounts/?${qs.toString()}`,
  );
  const allAccounts = useAdminData<AccountRow[]>(
    "/api/portal/admin/finance/accounts/",
  );
  const maxMonth = useMemo(
    () =>
      Math.max(
        1,
        ...(summary.data?.monthly ?? []).map((item) => Number(item.collected)),
      ),
    [summary.data],
  );

  if (summary.loading)
    return <CardSkeleton count={4} className="sm:grid-cols-2 xl:grid-cols-4" />;
  if (summary.error || !summary.data)
    return (
      <ErrorState
        message={summary.error?.message ?? "Finance could not be loaded."}
        onRetry={summary.reload}
      />
    );
  const data = summary.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance"
        description="Fee plans, collections, offline payments, refunds and receipts."
      />
      {data.online_enabled ? (
        <Notice tone="success">
          Razorpay online payment is switched on. Students can pay installments
          from their portal.
        </Notice>
      ) : (
        <Notice tone="info">
          Online payment is off. Add <code>RAZORPAY_KEY_ID</code>,{" "}
          <code>RAZORPAY_KEY_SECRET</code> and{" "}
          <code>RAZORPAY_WEBHOOK_SECRET</code> to <code>gbt-api/.env</code> to
          switch it on. Offline payments can be recorded below.
        </Notice>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {[
          {
            label: "Total fees",
            value: data.total_fees,
            note: `${data.accounts} fee plans`,
            icon: Wallet,
          },
          {
            label: "Collected",
            value: data.collected,
            note: `${rupees(data.refunded)} refunded`,
            icon: CheckCircle2,
          },
          {
            label: "Outstanding",
            value: data.outstanding,
            note: "Balance across all plans",
            icon: IndianRupee,
          },
          {
            label: "Overdue",
            value: data.overdue_amount,
            note: `${data.overdue_installments} installments`,
            icon: AlertTriangle,
          },
        ].map(({ label, value, note, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-line bg-white p-4 sm:p-5"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-azure-soft text-azure">
              <Icon className="size-5" aria-hidden />
            </span>
            <p className="mt-3 text-xl font-bold sm:text-2xl">
              {rupees(value)}
            </p>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-ink-soft">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_26rem]">
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Monthly collection</h2>
            <p className="text-sm text-ink-soft">
              This month: {rupees(data.collected_this_month)}
            </p>
          </div>
          <div className="mt-5 flex h-40 items-end gap-3">
            {data.monthly.map((item) => (
              <div
                key={item.month}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-azure"
                    style={{
                      height: `${Math.max(2, (Number(item.collected) / maxMonth) * 100)}%`,
                    }}
                    title={rupees(item.collected)}
                  />
                </div>
                <span className="text-[11px] text-ink-soft">
                  {new Date(`${item.month}-01`).toLocaleString("en-IN", {
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
          <h3 className="mt-6 text-sm font-semibold">Latest payments</h3>
          {data.recent_payments.length ? (
            <ul className="mt-2 divide-y divide-line text-sm">
              {data.recent_payments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-2.5"
                >
                  <span>
                    <span className="font-semibold">{payment.student}</span> ·{" "}
                    {payment.method_label}
                  </span>
                  <span className="text-ink-soft">
                    {rupees(payment.amount)} · {when(payment.paid_at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">
              No payments recorded yet.
            </p>
          )}
        </section>
        <CreatePlan
          accounts={allAccounts.data ?? []}
          onCreated={(id) => router.push(`/admin/finance/${id}`)}
        />
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="mr-auto font-semibold">Fee plans</h2>
          {(
            [
              ["", "All"],
              ["due", "Balance due"],
              ["paid", "Fully paid"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setState(id)}
              aria-pressed={state === id}
              className={cn(
                "h-9 rounded-full px-4 text-sm font-semibold",
                state === id
                  ? "bg-ink text-white"
                  : "border border-line bg-white",
              )}
            >
              {label}
            </button>
          ))}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(query.trim());
            }}
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search student or course"
              aria-label="Search fee plans"
              className="h-9 w-56 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-azure"
            />
          </form>
        </div>
        {accounts.loading ? (
          <CardSkeleton count={2} />
        ) : accounts.error ? (
          <ErrorState
            message={accounts.error.message}
            onRetry={accounts.reload}
          />
        ) : !accounts.data?.length ? (
          <EmptyState icon={Wallet} title="No fee plans yet">
            Create a fee plan for an enrolled student to start tracking
            payments.
          </EmptyState>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="border-b border-line bg-mist text-xs text-ink-soft uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                  <th className="px-4 py-3 text-right font-semibold">Paid</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Balance
                  </th>
                  <th className="px-4 py-3 font-semibold">Next due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {accounts.data.map((row) => (
                  <tr key={row.id} className="hover:bg-mist/60">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/finance/${row.id}`}
                        className="font-semibold text-azure hover:text-azure-dark"
                      >
                        {row.student.name}
                      </Link>
                      <p className="text-xs text-ink-soft">
                        {row.student.student_id ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">{row.course}</td>
                    <td className="px-4 py-3 text-right">
                      {rupees(row.total_fee)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {rupees(row.net_paid)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {rupees(row.balance)}
                    </td>
                    <td className="px-4 py-3">
                      {row.next_due ? (
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-semibold",
                              INSTALLMENT_STYLE[row.next_due.status],
                            )}
                          >
                            {INSTALLMENT_LABEL[row.next_due.status]}
                          </span>
                          <span className="text-xs text-ink-soft">
                            {when(row.next_due.due_date, false)}
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700">
                          Fully paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
