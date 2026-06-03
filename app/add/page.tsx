import { redirect } from "next/navigation";
import { getUser } from "@/lib/actions/auth";
import { getCategories } from "@/lib/actions/budgets";
import { getAccounts } from "@/lib/actions/accounts";
import AddTransactionClient from "@/components/ui/AddTransactionClient";

export default async function AddTransactionPage() {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const [categories, accounts] = await Promise.all([
    getCategories(),
    getAccounts(),
  ]);

  return <AddTransactionClient categories={categories} accounts={accounts} />;
}
