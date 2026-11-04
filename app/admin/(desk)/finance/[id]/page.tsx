import type { Metadata } from "next";
import { FinanceAccountPage } from "@/components/admin/finance-account";

export const metadata: Metadata = { title: "Fee Plan" };

export default async function AdminFeeAccountPage({
  params,
}: PageProps<"/admin/finance/[id]">) {
  const { id } = await params;
  return <FinanceAccountPage id={id} />;
}
