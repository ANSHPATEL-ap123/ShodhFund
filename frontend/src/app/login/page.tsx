"use client";
import { Logo } from "@/components/Logo";
import { api } from "@/lib/api";
import { saveUser } from "@/lib/session";
import type { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("arjun.sharma@university.edu");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
            {error && <p className="text-sm text-danger">{error}</p>}
            <button className="btn-black w-full justify-center" type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p className="text-[12px] text-muted mt-6 leading-5">
            Demo password for all accounts: <b className="text-ink">demo1234</b>
            <br />
            PI: arjun.sharma@university.edu
            <br />
            Finance: rohit.mehta@university.edu
            <br />
            Admin: meera.iyer@university.edu
            <br />
            Auditor: sk.verma@university.edu
          </p>
        </div>
      </div>
      <div className="hidden md:flex bg-[#0A2540] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute w-40 h-40 bg-[#C8F135] rounded-full blur-3xl opacity-30 top-16 right-16" />
        <div className="relative text-white max-w-md">
          <p className="text-[#C8F135] text-xs font-medium uppercase tracking-wide">Campus research office</p>
          <h2 className="text-3xl font-semibold mt-3 leading-tight">From grant to UC — compliant by design.</h2>
          <p className="text-white/70 mt-4 text-sm leading-6">
            Live demo: login hits the Express API, expenses persist in a local JSON database, finance can approve or reject, and UCs are drafted from approved vouchers.
          </p>
        </div>
      </div>
    </div>
  );
}
