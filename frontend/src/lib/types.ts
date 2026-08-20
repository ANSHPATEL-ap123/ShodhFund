export type Role = "PI" | "FINANCE" | "ADMIN" | "AUDITOR";

export type User = {
  id: string;
  name: string;
  email: string;
  dept: string;
  designation?: string;
  role: Role;
};

export type Grant = {
  id: string;
  title: string;
  agency: string;
  amount: number;
  spent: number;
  start: string;
  end: string;
  status: string;
  piId: string;
  pi: string;
  department: string;
  ucDue: string;
};

export type Expense = {
  id: string;
  grantId: string;
  vendor: string;
  invoice: string;
  amount: number;
  date: string;
  head: string;
  status: string;
  compliance: string;
  gst: string;
  description?: string;
  submittedById?: string;
};

export type Anomaly = {
  id: string;
  severity: string;
  reason: string;
  expenseId: string;
  resolved: boolean;
};

export type BudgetHead = {
  id?: string;
  grantId?: string;
  name: string;
  allocated: number;
  spent: number;
};

export function inr(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}
