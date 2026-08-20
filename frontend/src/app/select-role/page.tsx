import Link from "next/link";
import { Logo } from "@/components/Logo";
import { FlaskConical, Landmark, GraduationCap, SearchCheck } from "lucide-react";

const roles = [
  { href: "/dashboard/pi", name: "Principal Investigator", desc: "Manage your grants, log expenses, and generate UCs.", color: "#1E40AF", icon: FlaskConical },
  { href: "/dashboard/finance", name: "Finance Officer", desc: "Verify expenses, enforce GFR, and clear UC queues.", color: "#0F766E", icon: Landmark },
  { href: "/dashboard/admin", name: "Research Admin", desc: "University portfolio, departments, and NIRF metrics.", color: "#6D28D9", icon: GraduationCap },
  { href: "/dashboard/auditor", name: "Auditor", desc: "Assignments, objections, and an immutable audit trail.", color: "#C2410C", icon: SearchCheck },
];

export default function SelectRole() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Logo />
        <h1 className="text-[30px] font-semibold mt-12 tracking-tight">Choose Your Role</h1>
        <p className="text-ink-2 mt-1">Access your personalized dashboard</p>
        <div className="grid md:grid-cols-4 gap-4 mt-10">
          {roles.map((r) => (
            <Link key={r.name} href={r.href} className="rounded-xl p-6 text-white min-h-[220px] flex flex-col" style={{ background: r.color }}>
              <r.icon className="w-6 h-6 mb-6" />
              <h2 className="font-semibold text-lg">{r.name}</h2>
              <p className="text-sm text-white/80 mt-2 flex-1">{r.desc}</p>
              <span className="text-sm mt-4">Access Dashboard →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
