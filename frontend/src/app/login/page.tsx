"use client";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("arjun.sharma@university.edu");
  const [password, setPassword] = useState("demo1234");

  return (
    <div className="min-h-screen bg-surface grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          <Logo />
          <h1 className="text-2xl font-semibold mt-10 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-ink-2 mt-1">Sign in to continue to your dashboard</p>
          <form
            className="mt-8 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
              });
              router.push("/select-role");
            }}
          >
            <div>
              <label className="text-xs font-medium text-muted">Email</label>
              <input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div>
              <div className="flex justify-between">
                <label className="text-xs font-medium text-muted">Password</label>
                <button type="button" className="text-xs text-info">Forgot Password?</button>
              </div>
              <input className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" /> Remember me
            </label>
            <button className="btn-black w-full justify-center" type="submit">Sign In</button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs text-muted">
            <div className="flex-1 h-px bg-border" /> or continue with <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-outline justify-center text-sm">Google</button>
            <button className="btn-outline justify-center text-sm">Microsoft</button>
          </div>
          <p className="text-xs text-muted mt-8">
            Don’t have an account? <span className="text-ink font-medium">Contact Administrator</span>
          </p>
          <p className="text-[11px] text-muted mt-4">Demo: any password works. Demo users are pre-seeded.</p>
        </div>
      </div>
      <div className="hidden md:flex bg-[#0A2540] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute w-40 h-40 bg-[#C8F135] rounded-full blur-3xl opacity-30 top-16 right-16" />
        <div className="relative text-white max-w-md">
          <p className="text-[#C8F135] text-xs font-medium uppercase tracking-wide">Campus research office</p>
          <h2 className="text-3xl font-semibold mt-3 leading-tight">From grant to UC — compliant by design.</h2>
          <p className="text-white/70 mt-4 text-sm leading-6">
            ShodhFund is purpose-built for Indian universities: GFR rules, agency formats, and utilization certificates without the paperwork pile.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              ["4 roles", "PI · Finance · Admin · Auditor"],
              ["GFR 12-A", "UC auto-generated"],
              ["8 AI tools", "OCR to anomaly detection"],
              ["99.8%", "compliance on demo data"],
            ].map(([a, b]) => (
              <div key={a} className="border border-white/10 rounded-xl p-4">
                <div className="font-semibold">{a}</div>
                <div className="text-xs text-white/50 mt-1">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
