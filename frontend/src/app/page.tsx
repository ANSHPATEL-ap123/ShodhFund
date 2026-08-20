import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Coins, ShieldCheck, FileCheck, AlertCircle, Sparkles, ScanLine, Scale, MessageSquare } from "lucide-react";

const features = [
  { icon: Coins, title: "Grant Management", desc: "Register sanctions, split budget heads, and track every rupee from DST, UGC, SERB, ICMR and CSIR." },
  { icon: ShieldCheck, title: "AI Compliance", desc: "Every expense is checked against GFR in real time — before it becomes an audit objection." },
  { icon: FileCheck, title: "UC Generation", desc: "Auto-draft Utilization Certificates in GFR 12-A format in minutes, not weeks." },
  { icon: AlertCircle, title: "Anomaly Detection", desc: "Duplicate bills, GST mismatches and over-caps flagged before finance signs off." },
];

const ai = [
  { icon: ScanLine, title: "Bill OCR", desc: "Extract vendor, GSTIN, amount and date from invoices instantly." },
  { icon: FileCheck, title: "UC Auto-draft", desc: "GFR 12-A certificates generated from live expenditure." },
  { icon: Scale, title: "GFR Checker", desc: "Rule engine plus Gemini reasoning on every voucher." },
  { icon: MessageSquare, title: "Ask your grants", desc: "Natural language queries across the research portfolio." },
];

const roles = [
  { name: "Principal Investigator", color: "#1E40AF", desc: "Enter expenses, watch balances, generate UCs without Excel." },
  { name: "Finance Officer", color: "#0F766E", desc: "Verify vouchers, enforce GFR, keep the university audit-ready." },
  { name: "Research Admin", color: "#6D28D9", desc: "University-wide analytics and NIRF-ready research metrics." },
  { name: "Auditor", color: "#C2410C", desc: "Immutable trail, objections, and evidence in one workspace." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-7 text-[14px] text-ink-2">
            <a href="#product">Product</a>
            <a href="#solutions">Solutions</a>
            <a href="#ai">Resources</a>
            <Link href="/select-role">Pricing</Link>
            <a href="#about">About Us</a>
          </div>
          <Link href="/login" className="btn-lime text-sm">Get Started</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[12px] font-medium tracking-wide text-muted uppercase mb-4">SIH 2026 · USICT013</p>
          <h1 className="text-[40px] leading-[48px] font-semibold tracking-tight">Research. Comply. Impact.</h1>
          <p className="mt-4 text-[16px] leading-7 text-ink-2 max-w-md">
            End-to-end platform to manage research grants, track expenditures, ensure GFR compliance and accelerate research outcomes.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/login" className="btn-lime">Request a Demo</Link>
            <Link href="/select-role" className="btn-outline">Explore Platform</Link>
          </div>
        </div>
        <div className="bg-black text-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(10,37,64,0.12)]">
          <p className="text-xs text-white/50 mb-6">Live university snapshot</p>
          <div className="grid grid-cols-2 gap-6">
            {[
              ["500+", "Active Projects"],
              ["₹250 Cr+", "Funds Managed"],
              ["100K+", "Transactions"],
              ["50+", "Departments"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-semibold tabular">{n}</div>
                <div className="text-xs text-white/50 mt-1">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-sm text-white/70">Compliance rate</span>
            <span className="text-[#C8F135] font-semibold tabular">99.8%</span>
          </div>
        </div>
      </section>

      <section className="bg-surface border-y border-border py-8">
        <p className="text-center text-xs text-muted mb-5">Trusted by leading universities and research institutions</p>
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 text-muted font-semibold tracking-tight">
          {["IIT Delhi", "IISc", "JNU", "AIIMS", "BHU", "NIT Trichy"].map((u) => (
            <span key={u} className="text-sm opacity-70">{u}</span>
          ))}
        </div>
      </section>

      <section id="product" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-[30px] leading-[38px] font-semibold tracking-tight">Built for the full grant lifecycle</h2>
        <p className="text-ink-2 mt-2 mb-10 max-w-xl">From sanction letter to Utilization Certificate — without the Excel graveyard.</p>
        <div className="grid md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card p-5">
              <f.icon className="w-5 h-5 text-ink mb-4" />
              <h3 className="font-medium text-[16px]">{f.title}</h3>
              <p className="text-[13px] text-ink-2 mt-2 leading-5">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ai" className="bg-black text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#C8F135] text-xs font-medium mb-3">
            <Sparkles className="w-4 h-4" /> Gemini-powered
          </div>
          <h2 className="text-[30px] font-semibold tracking-tight">AI That Works For Research Administration</h2>
          <div className="grid md:grid-cols-4 gap-6 mt-10">
            {ai.map((a) => (
              <div key={a.title}>
                <a.icon className="w-5 h-5 text-[#C8F135] mb-3" />
                <h3 className="font-medium">{a.title}</h3>
                <p className="text-sm text-white/60 mt-2">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-[30px] font-semibold tracking-tight mb-8">Purpose-built for every role</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {roles.map((r) => (
            <div key={r.name} className="rounded-xl p-5 text-white" style={{ background: r.color }}>
              <h3 className="font-medium">{r.name}</h3>
              <p className="text-sm text-white/80 mt-2">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-[30px] font-semibold max-w-lg">Ready to transform your research administration?</h2>
          <Link href="/login" className="btn-lime">Start Free Trial</Link>
        </div>
      </section>

      <footer className="border-t border-border py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-8 text-sm">
          <div className="md:col-span-2">
            <Logo />
            <p className="text-muted mt-3 text-[13px]">Research Funding, Simplified.</p>
          </div>
          {["Product", "Company", "Resources", "Legal"].map((c) => (
            <div key={c}>
              <div className="font-medium mb-3">{c}</div>
              <div className="space-y-2 text-muted">
                <div>Overview</div>
                <div>Documentation</div>
                <div>Contact</div>
              </div>
            </div>
          ))}
        </div>
        <p className="max-w-6xl mx-auto mt-12 text-xs text-muted">© 2026 ShodhFund. Prototype for SIH 2026.</p>
      </footer>
    </div>
  );
}
