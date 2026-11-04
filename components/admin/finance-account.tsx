"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Download, Plus, Trash2, Undo2 } from "lucide-react";
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
import { CardSkeleton, ErrorState, ProgressBar } from "@/components/portal/ui";
import { AdminError, adminRequest, when } from "@/lib/admin/api";
import {
  INSTALLMENT_LABEL,
  INSTALLMENT_STYLE,
  rupees,
  type FeeAccountData,
  type FeeInstallment,
  type FeePayment,
} from "@/lib/portal/finance";
import { cn } from "@/lib/utils";

type AdminAccount = FeeAccountData & {
  student: {
    id: number;
    name: string;
    email: string;
    student_id: string | null;
  };
  created_at: string;
};

const METHODS = [
  ["upi", "UPI (offline)"],
  ["bank_transfer", "Bank transfer"],
  ["cash", "Cash"],
  ["cheque", "Cheque / DD"],
  ["other", "Other"],
] as const;

function useAction(onDone: () => void) {
  const { token, expire } = useAdminSession();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function run(
    path: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: unknown,
  ) {
    setBusy(true);
    setError("");
    try {
      await adminRequest(token, path, { method, body });
      onDone();
      return true;
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) expire();
      setError(err instanceof AdminError ? err.message : "That did not save.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  return { run, error, busy, setError };
}

function InstallmentEditor({
  item,
  onChanged,
}: {
  item: FeeInstallment;
  onChanged: () => void;
}) {
  const { run, error, busy } = useAction(onChanged);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: item.title,
    amount: item.amount,
    due_date: item.due_date,
  });

  return (
    <li className="py-3">
      {editing ? (
        <form
          className="grid gap-2 sm:grid-cols-[1fr_8rem_9.5rem_auto]"
          onSubmit={async (event: FormEvent) => {
            event.preventDefault();
            if (
              await run(
                `/api/portal/admin/finance/installments/${item.id}/`,
                "PATCH",
                form,
              )
            )
              setEditing(false);
          }}
        >
          <TextInput
            aria-label="Title"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            className="h-10"
          />
          <TextInput
            aria-label="Amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(event) =>
              setForm({ ...form, amount: event.target.value })
            }
            className="h-10"
          />
          <TextInput
            aria-label="Due date"
            type="date"
            value={form.due_date}
            onChange={(event) =>
              setForm({ ...form, due_date: event.target.value })
            }
            className="h-10"
          />
          <div className="flex gap-1">
            <button
              type="submit"
              disabled={busy}
              className="h-10 rounded-lg bg-azure px-3 text-sm font-semibold text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="h-10 rounded-lg px-2 text-sm font-semibold text-ink-soft"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-xs text-ink-soft">
              Due {when(item.due_date, false)} · paid {rupees(item.paid)} ·
              remaining {rupees(item.remaining)}
            </p>
          </div>
          <p className="text-sm font-bold">{rupees(item.amount)}</p>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              INSTALLMENT_STYLE[item.status],
            )}
          >
            {INSTALLMENT_LABEL[item.status]}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="h-9 rounded-lg border border-line px-3 text-xs font-semibold hover:border-azure"
          >
            Edit
          </button>
          <button
            type="button"
            disabled={busy || item.has_payments}
            title={
              item.has_payments
                ? "Installments with payments cannot be deleted."
                : undefined
            }
            onClick={() =>
              window.confirm(`Delete “${item.title}”?`) &&
              void run(
                `/api/portal/admin/finance/installments/${item.id}/`,
                "DELETE",
              )
            }
            className="grid size-9 place-items-center rounded-lg text-red-600 hover:bg-red-50 disabled:text-ink-soft/40 disabled:hover:bg-transparent"
            aria-label={`Delete ${item.title}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </li>
  );
}

function RefundForm({
  payment,
  onDone,
}: {
  payment: FeePayment;
  onDone: () => void;
}) {
  const { run, error, busy } = useAction(onDone);
  const available = Number(payment.amount) - Number(payment.refunded);
  const [form, setForm] = useState({
    amount: available.toFixed(2),
    reason: "",
    reference: "",
  });
  return (
    <form
      className="mt-2 grid gap-2 rounded-xl bg-mist p-3 sm:grid-cols-[8rem_1fr_10rem_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        if (!form.reason.trim()) return;
        void run("/api/portal/admin/finance/refunds/", "POST", {
          payment: payment.id,
          ...form,
        });
      }}
    >
      <TextInput
        aria-label="Refund amount"
        type="number"
        step="0.01"
        max={available}
        value={form.amount}
        onChange={(event) => setForm({ ...form, amount: event.target.value })}
        className="h-10"
      />
      <TextInput
        aria-label="Refund reason"
        placeholder="Reason (required)"
        value={form.reason}
        onChange={(event) => setForm({ ...form, reason: event.target.value })}
        className="h-10"
      />
      <TextInput
        aria-label="Refund reference"
        placeholder="Reference"
        value={form.reference}
        onChange={(event) =>
          setForm({ ...form, reference: event.target.value })
        }
        className="h-10"
      />
      <button
        type="submit"
        disabled={busy || !form.reason.trim()}
        className="h-10 rounded-lg bg-red-600 px-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        Record refund
      </button>
      {error ? (
        <p className="text-xs text-red-600 sm:col-span-4">{error}</p>
      ) : null}
    </form>
  );
}

export function FinanceAccountPage({ id }: { id: string }) {
  const {
    data: account,
    error,
    loading,
    reload,
  } = useAdminData<AdminAccount>(`/api/portal/admin/finance/accounts/${id}/`);
  const settings = useAction(reload);
  const installmentAction = useAction(reload);
  const paymentAction = useAction(reload);
  const [feeForm, setFeeForm] = useState<{
    total_fee: string;
    note: string;
  } | null>(null);
  const [newInstallment, setNewInstallment] = useState({
    title: "",
    amount: "",
    due_date: "",
  });
  const [payment, setPayment] = useState({
    installment: "",
    amount: "",
    method: "upi",
    reference: "",
    paid_at: "",
    notes: "",
  });
  const [refunding, setRefunding] = useState<number | null>(null);
  const [saved, setSaved] = useState("");

  if (loading) return <CardSkeleton count={3} />;
  if (error || !account)
    return (
      <ErrorState
        message={error?.message ?? "Fee plan not found."}
        onRetry={reload}
      />
    );

  const mismatch = account.installments_total !== account.total_fee;
  const open = account.installments.filter(
    (item) => Number(item.remaining) > 0,
  );

  return (
    <div className="space-y-6">
      <Link
        href="/admin/finance"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-azure"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All fee plans
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-azure uppercase">
            {account.student.student_id ?? "Student"}
          </p>
          <h1 className="mt-1 text-2xl font-bold">{account.student.name}</h1>
          <p className="text-sm text-ink-soft">
            {account.course.title} · {account.student.email}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["Total", account.total_fee],
            ["Paid", account.net_paid],
            ["Balance", account.balance],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-line bg-white px-4 py-2"
            >
              <p className="text-xs text-ink-soft">{label}</p>
              <p className="font-bold">{rupees(value)}</p>
            </div>
          ))}
        </div>
      </div>
      <ProgressBar
        percent={account.percent}
        label="Fee paid"
        className="h-2.5"
      />
      {saved ? <Notice tone="success">{saved}</Notice> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Installments</h2>
              {mismatch ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  Installments total {rupees(account.installments_total)} ≠ fee
                </span>
              ) : null}
            </div>
            <ul className="divide-y divide-line">
              {account.installments.map((item) => (
                <InstallmentEditor
                  key={`${item.id}-${item.amount}-${item.due_date}-${item.title}`}
                  item={item}
                  onChanged={reload}
                />
              ))}
            </ul>
            <form
              className="mt-3 grid gap-2 border-t border-line pt-3 sm:grid-cols-[1fr_8rem_9.5rem_auto]"
              onSubmit={async (event) => {
                event.preventDefault();
                if (
                  await installmentAction.run(
                    "/api/portal/admin/finance/installments/",
                    "POST",
                    { account: account.id, ...newInstallment },
                  )
                ) {
                  setNewInstallment({ title: "", amount: "", due_date: "" });
                }
              }}
            >
              <TextInput
                aria-label="New installment title"
                placeholder="New installment"
                value={newInstallment.title}
                onChange={(event) =>
                  setNewInstallment({
                    ...newInstallment,
                    title: event.target.value,
                  })
                }
                className="h-10"
              />
              <TextInput
                aria-label="New installment amount"
                type="number"
                step="0.01"
                placeholder="₹"
                value={newInstallment.amount}
                onChange={(event) =>
                  setNewInstallment({
                    ...newInstallment,
                    amount: event.target.value,
                  })
                }
                className="h-10"
              />
              <TextInput
                aria-label="New installment due date"
                type="date"
                value={newInstallment.due_date}
                onChange={(event) =>
                  setNewInstallment({
                    ...newInstallment,
                    due_date: event.target.value,
                  })
                }
                className="h-10"
              />
              <button
                type="submit"
                disabled={installmentAction.busy}
                className="inline-flex h-10 items-center gap-1 rounded-lg bg-ink px-3 text-sm font-semibold text-white"
              >
                <Plus className="size-4" aria-hidden />
                Add
              </button>
            </form>
            {installmentAction.error ? (
              <p className="mt-1 text-xs text-red-600">
                {installmentAction.error}
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-semibold">Payments</h2>
            {account.payments.length ? (
              <ul className="mt-2 divide-y divide-line">
                {account.payments.map((item) => (
                  <li key={item.id} className="py-3 text-sm">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">
                          {rupees(item.amount)} ·{" "}
                          {item.installment ?? "Course fee"}
                        </p>
                        <p className="text-xs text-ink-soft">
                          {item.method_label} ·{" "}
                          {item.status === "paid"
                            ? `${when(item.paid_at)} · ${item.receipt_number}`
                            : `${item.status} · ${when(item.created_at)}`}
                          {item.reference ? ` · Ref ${item.reference}` : ""}
                          {Number(item.refunded) > 0
                            ? ` · ${rupees(item.refunded)} refunded`
                            : ""}
                        </p>
                      </div>
                      {item.status === "paid" ? (
                        <>
                          {item.receipt_url ? (
                            <a
                              href={item.receipt_url}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold hover:border-azure"
                            >
                              <Download className="size-3.5" aria-hidden />
                              Receipt
                            </a>
                          ) : null}
                          {Number(item.amount) > Number(item.refunded) ? (
                            <button
                              type="button"
                              onClick={() =>
                                setRefunding(
                                  refunding === item.id ? null : item.id,
                                )
                              }
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              <Undo2 className="size-3.5" aria-hidden />
                              Refund
                            </button>
                          ) : null}
                        </>
                      ) : (
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            item.status === "failed"
                              ? "bg-red-50 text-red-700"
                              : "bg-mist text-ink-soft",
                          )}
                        >
                          {item.status === "failed"
                            ? "Failed"
                            : "Not completed"}
                        </span>
                      )}
                    </div>
                    {refunding === item.id ? (
                      <RefundForm
                        payment={item}
                        onDone={() => {
                          setRefunding(null);
                          setSaved("Refund recorded.");
                          reload();
                        }}
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">No payments yet.</p>
            )}
            {account.refunds.length ? (
              <div className="mt-4 rounded-xl bg-mist p-3 text-xs">
                <p className="font-semibold">Refunds</p>
                <ul className="mt-1 space-y-1 text-ink-soft">
                  {account.refunds.map((refund) => (
                    <li key={refund.id}>
                      {rupees(refund.amount)} on {when(refund.refunded_at)}{" "}
                      against {refund.receipt_number} – {refund.reason}
                      {refund.reference ? ` (Ref ${refund.reference})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        </div>

        <div className="space-y-6">
          <form
            className="grid gap-3 rounded-2xl border border-line bg-white p-5"
            onSubmit={async (event) => {
              event.preventDefault();
              const ok = await paymentAction.run(
                "/api/portal/admin/finance/payments/",
                "POST",
                {
                  account: account.id,
                  installment: payment.installment
                    ? Number(payment.installment)
                    : null,
                  amount: payment.amount,
                  method: payment.method,
                  reference: payment.reference,
                  notes: payment.notes,
                  ...(payment.paid_at
                    ? { paid_at: new Date(payment.paid_at).toISOString() }
                    : {}),
                },
              );
              if (ok) {
                setPayment({
                  installment: "",
                  amount: "",
                  method: "upi",
                  reference: "",
                  paid_at: "",
                  notes: "",
                });
                setSaved("Payment recorded and receipt generated.");
              }
            }}
          >
            <h2 className="font-semibold">Record offline payment</h2>
            <p className="-mt-1 text-xs text-ink-soft">
              For UPI, bank transfer, cash or cheque received by the admissions
              office.
            </p>
            <Field id="pay-installment" label="Towards">
              <SelectInput
                id="pay-installment"
                value={payment.installment}
                onChange={(event) => {
                  const selected = open.find(
                    (item) => String(item.id) === event.target.value,
                  );
                  setPayment({
                    ...payment,
                    installment: event.target.value,
                    amount: selected ? selected.remaining : payment.amount,
                  });
                }}
              >
                <option value="">General (no installment)</option>
                {open.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} – {rupees(item.remaining)} remaining
                  </option>
                ))}
              </SelectInput>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field id="pay-amount" label="Amount (₹)">
                <TextInput
                  id="pay-amount"
                  type="number"
                  step="0.01"
                  min={1}
                  value={payment.amount}
                  onChange={(event) =>
                    setPayment({ ...payment, amount: event.target.value })
                  }
                />
              </Field>
              <Field id="pay-method" label="Method">
                <SelectInput
                  id="pay-method"
                  value={payment.method}
                  onChange={(event) =>
                    setPayment({ ...payment, method: event.target.value })
                  }
                >
                  {METHODS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </div>
            <Field
              id="pay-ref"
              label="Reference"
              optional={payment.method === "cash"}
              hint="UTR, transaction ID or cheque number"
            >
              <TextInput
                id="pay-ref"
                value={payment.reference}
                onChange={(event) =>
                  setPayment({ ...payment, reference: event.target.value })
                }
              />
            </Field>
            <Field
              id="pay-date"
              label="Received on"
              optional
              hint="Leave empty for now"
            >
              <TextInput
                id="pay-date"
                type="datetime-local"
                value={payment.paid_at}
                onChange={(event) =>
                  setPayment({ ...payment, paid_at: event.target.value })
                }
              />
            </Field>
            <Field id="pay-notes" label="Notes" optional>
              <TextInput
                id="pay-notes"
                value={payment.notes}
                onChange={(event) =>
                  setPayment({ ...payment, notes: event.target.value })
                }
              />
            </Field>
            {paymentAction.error ? (
              <Notice tone="error">{paymentAction.error}</Notice>
            ) : null}
            <SubmitButton pending={paymentAction.busy}>
              Record payment
            </SubmitButton>
          </form>

          <form
            className="grid gap-3 rounded-2xl border border-line bg-white p-5"
            onSubmit={async (event) => {
              event.preventDefault();
              if (
                feeForm &&
                (await settings.run(
                  `/api/portal/admin/finance/accounts/${account.id}/`,
                  "PATCH",
                  feeForm,
                ))
              ) {
                setFeeForm(null);
                setSaved("Fee plan updated.");
              }
            }}
          >
            <h2 className="font-semibold">Fee plan settings</h2>
            <Field id="fee-total" label="Total fee (₹)">
              <TextInput
                id="fee-total"
                type="number"
                step="0.01"
                value={feeForm?.total_fee ?? account.total_fee}
                onChange={(event) =>
                  setFeeForm({
                    total_fee: event.target.value,
                    note: feeForm?.note ?? account.note,
                  })
                }
              />
            </Field>
            <Field id="fee-note" label="Note" optional>
              <TextInput
                id="fee-note"
                value={feeForm?.note ?? account.note}
                onChange={(event) =>
                  setFeeForm({
                    total_fee: feeForm?.total_fee ?? account.total_fee,
                    note: event.target.value,
                  })
                }
              />
            </Field>
            {settings.error ? (
              <Notice tone="error">{settings.error}</Notice>
            ) : null}
            <SubmitButton pending={settings.busy}>Save</SubmitButton>
            <p className="text-xs text-ink-soft">
              Created {when(account.created_at)}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
