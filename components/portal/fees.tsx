"use client";

import { useState } from "react";
import {
  Download,
  IndianRupee,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Notice } from "@/components/portal/form-controls";
import { useStudent } from "@/components/portal/student-session";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  PageHeader,
  ProgressBar,
} from "@/components/portal/ui";
import { usePortalData } from "@/components/portal/use-portal-data";
import { PortalError, formatDate, portalRequest } from "@/lib/portal/client";
import {
  INSTALLMENT_LABEL,
  INSTALLMENT_STYLE,
  rupees,
  type CheckoutOrder,
  type FeeAccountData,
  type FeeInstallment,
  type FeePayment,
  type StudentFees,
} from "@/lib/portal/finance";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};
type RazorpayInstance = {
  open: () => void;
  on: (
    event: string,
    handler: (response: { error?: { description?: string } }) => void,
  ) => void;
};
type RazorpayConstructor = new (
  options: Record<string, unknown>,
) => RazorpayInstance;

let checkoutScript: Promise<RazorpayConstructor> | null = null;

function loadCheckout() {
  checkoutScript ??= new Promise((resolve, reject) => {
    const existing = (window as unknown as { Razorpay?: RazorpayConstructor })
      .Razorpay;
    if (existing) return resolve(existing);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () =>
      resolve(
        (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay,
      );
    script.onerror = () => {
      checkoutScript = null;
      reject(
        new Error(
          "The payment window could not be loaded. Check your internet connection.",
        ),
      );
    };
    document.body.appendChild(script);
  });
  return checkoutScript;
}

function InstallmentRow({
  item,
  online,
  busy,
  onPay,
}: {
  item: FeeInstallment;
  online: boolean;
  busy: boolean;
  onPay: (item: FeeInstallment) => void;
}) {
  const payable = Number(item.remaining) > 0;
  return (
    <li className="flex flex-wrap items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{item.title}</p>
        <p className="text-xs text-ink-soft">
          Due {formatDate(item.due_date)}
          {Number(item.paid) > 0 && payable
            ? ` · ${rupees(item.paid)} paid`
            : ""}
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
      {payable ? (
        online ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onPay(item)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-azure px-4 text-sm font-semibold text-white hover:bg-azure-dark disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Lock className="size-4" aria-hidden />
            )}
            Pay {rupees(item.remaining)}
          </button>
        ) : null
      ) : null}
    </li>
  );
}

function PaymentHistory({ payments }: { payments: FeePayment[] }) {
  if (!payments.length)
    return <p className="text-sm text-ink-soft">No payments yet.</p>;
  return (
    <ul className="divide-y divide-line">
      {payments.map((payment) => (
        <li
          key={payment.id}
          className="flex flex-wrap items-center gap-3 py-3 text-sm"
        >
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {rupees(payment.amount)} · {payment.installment ?? "Course fee"}
            </p>
            <p className="text-xs text-ink-soft">
              {payment.status === "paid"
                ? `${payment.method_label} · ${formatDate(payment.paid_at, true)} · Receipt ${payment.receipt_number}`
                : `${payment.method_label} · ${formatDate(payment.created_at, true)} · ${payment.failure_reason || "Not completed"}`}
              {Number(payment.refunded) > 0
                ? ` · ${rupees(payment.refunded)} refunded`
                : ""}
            </p>
          </div>
          {payment.status === "paid" && payment.receipt_url ? (
            <a
              href={payment.receipt_url}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold hover:border-azure"
            >
              <Download className="size-3.5" aria-hidden />
              Receipt
            </a>
          ) : (
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
              Failed
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function AccountCard({
  account,
  online,
  payingId,
  onPay,
}: {
  account: FeeAccountData;
  online: boolean;
  payingId: number | null;
  onPay: (item: FeeInstallment) => void;
}) {
  return (
    <section
      aria-labelledby={`fees-${account.id}`}
      className="rounded-3xl border border-line bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={`fees-${account.id}`} className="text-lg font-semibold">
            {account.course.title}
          </h2>
          {account.note ? (
            <p className="text-sm text-ink-soft">{account.note}</p>
          ) : null}
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            Number(account.balance) > 0
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-800",
          )}
        >
          {Number(account.balance) > 0
            ? `${rupees(account.balance)} due`
            : "Fully paid"}
        </span>
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
        {[
          ["Total fee", account.total_fee],
          ["Paid", account.net_paid],
          ["Balance", account.balance],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-mist px-2 py-3">
            <dt className="text-xs text-ink-soft">{label}</dt>
            <dd className="mt-0.5 text-base font-bold sm:text-lg">
              {rupees(value)}
            </dd>
          </div>
        ))}
      </dl>
      <ProgressBar
        percent={account.percent}
        label={`${account.course.title} fee paid`}
        className="mt-4 h-2.5"
      />

      <h3 className="mt-6 text-sm font-semibold">Installments</h3>
      <ul className="divide-y divide-line">
        {account.installments.map((item) => (
          <InstallmentRow
            key={item.id}
            item={item}
            online={online}
            busy={payingId === item.id}
            onPay={onPay}
          />
        ))}
      </ul>

      <h3 className="mt-6 text-sm font-semibold">Payment history</h3>
      <PaymentHistory payments={account.payments} />
      {account.refunds.length ? (
        <p className="mt-2 text-xs text-ink-soft">
          Refunds:{" "}
          {account.refunds
            .map(
              (refund) =>
                `${rupees(refund.amount)} on ${formatDate(refund.refunded_at)} (${refund.reason})`,
            )
            .join("; ")}
        </p>
      ) : null}
    </section>
  );
}

export function StudentFeesPage() {
  const student = useStudent();
  const { data, error, loading, reload } =
    usePortalData<StudentFees>("finance/summary");
  const [payingId, setPayingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    tone: "error" | "success" | "info";
    text: string;
  } | null>(null);

  async function pay(item: FeeInstallment) {
    setMessage(null);
    setPayingId(item.id);
    try {
      const [Razorpay, order] = await Promise.all([
        loadCheckout(),
        portalRequest<CheckoutOrder>(`finance/installments/${item.id}/pay`, {
          method: "POST",
        }),
      ]);
      const checkout = new Razorpay({
        key: order.key_id,
        order_id: order.order_id,
        amount: order.amount,
        currency: order.currency,
        name: order.name,
        description: order.description,
        image: `${window.location.origin}/logo.png`,
        prefill: order.prefill,
        notes: { student_id: student.student_id ?? "" },
        theme: { color: "#1d5fd1" },
        handler: async (response: RazorpayResponse) => {
          try {
            const paid = await portalRequest<FeePayment>(
              `finance/payments/${order.payment_id}/verify`,
              { method: "POST", body: response },
            );
            setMessage({
              tone: "success",
              text: `Payment of ${rupees(paid.amount)} received. Receipt ${paid.receipt_number}.`,
            });
          } catch (err) {
            setMessage({
              tone: "error",
              text:
                err instanceof PortalError
                  ? err.message
                  : "We could not confirm the payment. If money was deducted, contact the admissions team.",
            });
          } finally {
            setPayingId(null);
            reload();
          }
        },
        modal: {
          ondismiss: () => {
            setPayingId(null);
            setMessage({
              tone: "info",
              text: "Payment window closed. No money was taken. You can try again any time.",
            });
            void portalRequest(`finance/payments/${order.payment_id}/failed`, {
              method: "POST",
              body: { reason: "Payment window closed" },
            }).catch(() => undefined);
          },
        },
      });
      checkout.on("payment.failed", (response) => {
        const reason = response.error?.description ?? "Payment failed";
        void portalRequest(`finance/payments/${order.payment_id}/failed`, {
          method: "POST",
          body: { reason },
        }).catch(() => undefined);
        setMessage({
          tone: "error",
          text: `${reason}. No money was taken; please try again.`,
        });
      });
      checkout.open();
    } catch (err) {
      setPayingId(null);
      setMessage({
        tone: "error",
        text:
          err instanceof Error
            ? err.message
            : "The payment could not be started.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fees & Payments"
        description="Your course fees, installments, payments and receipts."
      />
      {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}
      {loading ? (
        <CardSkeleton count={2} />
      ) : error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : !data?.accounts.length ? (
        <EmptyState
          icon={IndianRupee}
          title="No fee details yet"
          action={{ href: "/student/help", label: "Contact admissions" }}
        >
          Your fee plan appears here once the admissions team confirms it after
          counselling.
        </EmptyState>
      ) : (
        <>
          {data.accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              online={data.online_enabled}
              payingId={payingId}
              onPay={(item) => void pay(item)}
            />
          ))}
          <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-sm text-ink-soft">
            <ShieldCheck
              className="mt-0.5 size-5 shrink-0 text-emerald-600"
              aria-hidden
            />
            {data.online_enabled ? (
              <p>
                Online payments are processed securely by Razorpay (UPI, cards,
                net banking). GBET Online never sees or stores your card or UPI
                PIN. A payment is marked paid only after it is verified.
              </p>
            ) : (
              <p>
                Online payment is not switched on yet. To pay, contact the
                admissions team on {SITE.phone} or {SITE.email}; your payment
                and receipt will appear here once recorded.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
