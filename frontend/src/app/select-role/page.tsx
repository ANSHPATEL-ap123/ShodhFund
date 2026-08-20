"use client";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { FlaskConical, Landmark, GraduationCap, SearchCheck } from "lucide-react";
import { getUser, setViewRole } from "@/lib/session";
import type { Role } from "@/lib/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const roles: { href: string; name: string; desc: string; color: string; role: Role; icon: typeof FlaskConical }[] = [
  { href: "/dashboard/pi", name: "Principal Investigator", desc: "Manage grants, log expenses, generate UCs.", color: "#1E40AF", role: "PI", icon: FlaskConical },
  { href: "/dashboard/finance", name: "Finance Officer", desc: "Verify expenses, enforce GFR, clear UC queues.", color: "#0F766E", role: "FINANCE", icon: Landmark },
  { href: "/dashboard/admin", name: "Research Admin", desc: "University portfolio and NIRF metrics.", color: "#6D28D9", role: "ADMIN", icon: GraduationCap },
  { href: "/dashboard/auditor", name: "Auditor", desc: "Trail, objections, compliance review.", color: "#C2410C", role: "AUDITOR", icon: SearchCheck },
];

export default function SelectRole() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!getUser()) router.replace("/login");
    else setReady(true);
  }, [router]);
  if (!ready) return null;

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Logo />
        <h1 className="text-[30px] font-semibold mt-12 tracking-tight">Choose Your Role</h1>
        <p className="text-ink-2 mt-1">Demo allows switching roles without re-login.</p>
        <div className="grid md:grid-cols-4 gap-4 mt-10">
          {roles.map((r) => (
            <Link
              key={r.name}
              href={r.href}
              onClick={() => setViewRole(r.role)}
              className="rounded-xl p-6 text-white min-h-[220px] flex flex-col"
              style={{ background: r.color }}
            >
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
