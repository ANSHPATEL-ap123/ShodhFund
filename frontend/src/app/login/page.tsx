"use client";
import { Logo } from "@/components/Logo";
import { api } from "@/lib/api";
import { saveUser } from "@/lib/session";
import type { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("arjun.sharma@university.edu");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-surface grid md:grid-cols-2">
      {/* Left: Form */}
      <div className={`flex items-center justify-center p-8 transition-all duration-500 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}>
        <div className="w-full max-w-[400px]">
          <Logo />
          <h1 className="text-2xl font-semibold mt-10 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-ink-2 mt-1">Sign in to continue to your dashboard</p>
          <form
            className="mt-8 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError("");
              try {
                const res = await api<{ token: string; user: User }>("/api/auth/login", {
                  method: "POST",
                  body: JSON.stringify({ email, password }),
                });
                saveUser(res.user, res.token);
                router.push("/select-role");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Login failed");
              } finally {
                setBusy(false);
              }
            }}
          >
            <div>
              <label className="text-xs font-medium text-muted">Email</label>
              <input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted">Password</label>
              <input className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            </div>
            {error && (
              <p className="text-sm text-danger bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 animate-fade-in">
                {error}
              </p>
            )}
            <button className="btn-lime w-full justify-center group" type="submit" disabled={busy}>
              {busy ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" /></>
              )}
            </button>
          </form>
          <div className="mt-8 p-4 bg-surface rounded-xl border border-border">
            <div className="flex items-center gap-2 text-[11px] text-muted mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Demo credentials — password: <b className="text-ink">demo1234</b>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-ink-2">
              <span className="cursor-pointer hover:text-ink transition-colors" onClick={() => { setEmail("arjun.sharma@university.edu"); setPassword("demo1234"); }}>PI · Arjun Sharma</span>
              <span className="cursor-pointer hover:text-ink transition-colors" onClick={() => { setEmail("rohit.mehta@university.edu"); setPassword("demo1234"); }}>Finance · Rohit Mehta</span>
              <span className="cursor-pointer hover:text-ink transition-colors" onClick={() => { setEmail("meera.iyer@university.edu"); setPassword("demo1234"); }}>Admin · Meera Iyer</span>
              <span className="cursor-pointer hover:text-ink transition-colors" onClick={() => { setEmail("sk.verma@university.edu"); setPassword("demo1234"); }}>Auditor · S.K. Verma</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Hero */}
      <div className={`hidden md:flex bg-[#0A2540] items-center justify-center p-12 relative overflow-hidden transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
        {/* Animated background blobs */}
        <div className="absolute w-64 h-64 bg-[#C8F135] rounded-full blur-[100px] opacity-20 top-8 right-8 animate-pulse" />
        <div className="absolute w-48 h-48 bg-[#1E40AF] rounded-full blur-[80px] opacity-15 bottom-12 left-12" />
        <div className="absolute w-32 h-32 bg-[#C8F135] rounded-full blur-[60px] opacity-10 bottom-1/3 right-1/4" />

        <div className="relative text-white max-w-md animate-fade-in">
          <p className="text-[#C8F135] text-xs font-medium uppercase tracking-wide mb-4">Campus research office</p>
          <h2 className="text-[36px] font-semibold leading-[44px] tracking-tight">
            From grant to UC —<br />compliant by design.
          </h2>
          <p className="text-white/60 mt-5 text-[15px] leading-7">
            Live demo: login hits the Express API, expenses persist in a local JSON database, finance can approve or reject, and UCs are drafted from approved vouchers.
          </p>

          {/* Stats bar */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {[
              ["6", "Grants"],
              ["₹4.9 Cr", "Funds"],
              ["99.8%", "Compliant"],
            ].map(([v, l]) => (
              <div key={l} className="animate-count">
                <div className="text-xl font-semibold tabular">{v}</div>
                <div className="text-[11px] text-white/50 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
