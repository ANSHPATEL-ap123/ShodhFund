"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { grants, inr } from "@/lib/data";
import Link from "next/link";

export default function Page() {
  return (
    <AppShell role="PI">
      <h1 className="text-2xl font-semibold mb-4">My Grants</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-muted text-left">
            <tr>{["Code", "Title", "Agency", "Sanctioned", "Spent", "Status"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {grants.map((g) => (
              <tr key={g.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs">{g.id}</td>
                <td className="px-4 py-3"><Link className="hover:underline font-medium" href={`/grants/${g.id}`}>{g.title}</Link></td>
                <td className="px-4 py-3">{g.agency}</td>
                <td className="px-4 py-3 tabular">{inr(g.amount)}</td>
                <td className="px-4 py-3 tabular">{inr(g.spent)}</td>
                <td className="px-4 py-3"><StatusChip s={g.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
