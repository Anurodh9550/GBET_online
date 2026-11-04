export type InstallmentStatus = "paid" | "partial" | "due" | "overdue";

export type FeeInstallment = {
  id: number;
  number: number;
  title: string;
  amount: string;
  due_date: string;
  paid: string;
  remaining: string;
  status: InstallmentStatus;
  has_payments: boolean;
};

export type FeePayment = {
  id: number;
  amount: string;
  method: string;
  method_label: string;
  status: "created" | "paid" | "failed";
  installment: string | null;
  receipt_number: string | null;
  reference: string;
  failure_reason: string;
  notes: string;
  paid_at: string | null;
  created_at: string;
  refunded: string;
  receipt_url: string | null;
};

export type FeeRefund = {
  id: number;
  payment: number;
  receipt_number: string | null;
  amount: string;
  reason: string;
  reference: string;
  refunded_at: string;
};

export type FeeAccountData = {
  id: number;
  enrollment: number;
  course: { title: string; slug: string };
  total_fee: string;
  paid: string;
  refunded: string;
  net_paid: string;
  balance: string;
  percent: number;
  note: string;
  installments_total: string;
  installments: FeeInstallment[];
  payments: FeePayment[];
  refunds: FeeRefund[];
};

export type StudentFees = {
  online_enabled: boolean;
  accounts: FeeAccountData[];
};

export type CheckoutOrder = {
  payment_id: number;
  key_id: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
};

export function rupees(value: string | number) {
  return `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export const INSTALLMENT_STYLE: Record<InstallmentStatus, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  partial: "bg-azure-soft text-azure-dark",
  due: "bg-mist text-ink-soft",
  overdue: "bg-red-100 text-red-700",
};

export const INSTALLMENT_LABEL: Record<InstallmentStatus, string> = {
  paid: "Paid",
  partial: "Part paid",
  due: "Due",
  overdue: "Overdue",
};
