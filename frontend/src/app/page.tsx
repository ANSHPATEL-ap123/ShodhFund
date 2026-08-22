"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  Coins,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Sparkles,
  ScanLine,
  Scale,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  Check,
  Zap,
  Activity,
  BrainCircuit,
  CircleDollarSign,
  FileSearch,
  BarChart3,
  LockKeyhole,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* =========================================================
   DATA
========================================================= */

const features = [
  {
    icon: Coins,
    title: "Grant Management",
    desc: "Register sanctions, split budget heads, and track every rupee from DST, UGC, SERB, ICMR and CSIR.",
    size: "large",
  },
  {
    icon: ShieldCheck,
    title: "AI Compliance",
    desc: "Every expense is checked against GFR in real time — before it becomes an audit objection.",
    size: "small",
  },
  {
    icon: FileCheck,
    title: "UC Generation",
    desc: "Auto-draft Utilization Certificates in GFR 12-A format in minutes, not weeks.",
    size: "small",
  },
  {
    icon: AlertCircle,
    title: "Anomaly Detection",
    desc: "Duplicate bills, GST mismatches and over-caps flagged before finance signs off.",
    size: "large",
  },
];

const ai = [
  {
    icon: ScanLine,
    title: "Bill OCR",
    desc: "Extract vendor, GSTIN, amount and date from invoices instantly.",
  },
  {
    icon: FileCheck,
    title: "UC Auto-draft",
    desc: "GFR 12-A certificates generated from live expenditure.",
  },
  {
    icon: Scale,
    title: "GFR Checker",
    desc: "Rule engine plus Gemini reasoning on every voucher.",
  },
  {
    icon: MessageSquare,
    title: "Ask your grants",
    desc: "Natural language queries across the research portfolio.",
  },
];

const roles = [
  {
    name: "Principal Investigator",
    color: "#1E40AF",
    desc: "Enter expenses, watch balances, generate UCs without Excel.",
  },
  {
    name: "Finance Officer",
    color: "#0F766E",
    desc: "Verify vouchers, enforce GFR, keep the university audit-ready.",
  },
  {
    name: "Research Admin",
    color: "#6D28D9",
    desc: "University-wide analytics and NIRF-ready research metrics.",
  },
  {
    name: "Auditor",
    color: "#C2410C",
    desc: "Immutable trail, objections, and evidence in one workspace.",
  },
];

const universities = [
  "IIT Delhi",
  "IISc",
  "JNU",
  "AIIMS",
  "BHU",
  "NIT Trichy",
];

/* =========================================================
   HOOKS
========================================================= */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useInView();

  return (
    <div
      ref={ref}
      className={`reveal ${
        visible ? "reveal-visible" : ""
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   MAIN LANDING PAGE
========================================================= */

export default function Landing() {
  const [mounted, setMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#F8FAF9] text-[#071A2B]">

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <nav className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-[1280px] px-5 md:px-8 pt-4">
            <div className="nav-glass h-[68px] rounded-2xl px-5 md:px-7 flex items-center justify-between">

              <Link href="/" className="relative z-10">
                <Logo />
              </Link>

              <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#526171]">
                <a
                  href="#product"
                  className="nav-link"
                >
                  Product
                </a>

                <a
                  href="#solutions"
                  className="nav-link"
                >
                  Solutions
                </a>

                <a
                  href="#ai"
                  className="nav-link"
                >
                  Resources
                </a>

                <a
                  href="#about"
                  className="nav-link"
                >
                  About Us
                </a>
              </div>

              <Link
                href="/login"
                className="lime-button compact group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </nav>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative min-h-[850px] pt-32 md:pt-40 pb-24 flex items-center">

          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="hero-grid absolute inset-0 opacity-70" />

            <div
              className="hero-spotlight"
              style={{
                left: `${mouse.x}%`,
                top: `${mouse.y}%`,
              }}
            />

            <div className="absolute -top-40 -right-40 w-[550px] h-[550px] rounded-full bg-[#C8F135]/20 blur-[130px] animate-pulse-slow" />

            <div className="absolute bottom-0 -left-40 w-[450px] h-[450px] rounded-full bg-[#79A7FF]/10 blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8 w-full">

            <div className="grid lg:grid-cols-[1fr_0.95fr] gap-14 lg:gap-20 items-center">

              {/* LEFT */}

              <div
                className={`hero-copy ${
                  mounted ? "hero-visible" : ""
                }`}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE4E2] bg-white/70 backdrop-blur px-3 py-1.5 mb-7 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] animate-pulse" />

                  <span className="text-[10px] font-bold tracking-[0.18em] text-[#647281] uppercase">
                    SIH 2026 · USICT013
                  </span>
                </div>

                <h1 className="hero-title">
                  Research.
                  <br />

                  <span className="lime-word">
                    Comply.
                  </span>

                  <br />

                  <span className="impact-word">
                    Impact.
                  </span>
                </h1>

                <p className="mt-7 max-w-xl text-[16px] md:text-[18px] leading-8 text-[#526171]">
                  End-to-end platform to manage research grants,
                  track expenditures, ensure GFR compliance and
                  accelerate research outcomes.
                </p>

                <div className="mt-9 flex flex-col sm:flex-row gap-3">

                  <Link
                    href="/login"
                    className="lime-button group"
                  >
                    <span>Request a Demo</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                  </Link>

                  <Link
                    href="/select-role"
                    className="outline-button group"
                  >
                    <span>Explore Platform</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                </div>

                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] text-[#718091]">
                  <span className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#607B00]" />
                    GFR-ready
                  </span>

                  <span className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#607B00]" />
                    AI-powered
                  </span>

                  <span className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#607B00]" />
                    Audit-ready
                  </span>
                </div>
              </div>

              {/* RIGHT DASHBOARD */}

              <div
                className={`relative ${
                  mounted ? "dashboard-visible" : ""
                }`}
              >

                {/* floating top label */}

                <div className="absolute -top-8 left-8 z-20 floating-label">
                  <span className="w-2 h-2 rounded-full bg-[#C8F135] animate-pulse" />
                  Live university snapshot
                </div>

                {/* dashboard */}

                <div className="dashboard-card">

                  <div className="dashboard-top">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                        Research funding
                      </p>

                      <p className="mt-1 text-sm font-medium text-white">
                        University overview
                      </p>
                    </div>

                    <div className="dashboard-status">
                      <Activity className="w-3.5 h-3.5" />
                      Live
                    </div>
                  </div>

                  <div className="mt-9 grid grid-cols-2 gap-4">

                    <div className="metric-card">
                      <div className="metric-icon">
                        <BarChart3 />
                      </div>

                      <div className="metric-number">
                        500+
                      </div>

                      <div className="metric-label">
                        Active Projects
                      </div>

                      <div className="mini-line">
                        <span style={{ width: "78%" }} />
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon">
                        <CircleDollarSign />
                      </div>

                      <div className="metric-number">
                        ₹250 Cr+
                      </div>

                      <div className="metric-label">
                        Funds Managed
                      </div>

                      <div className="mini-line">
                        <span style={{ width: "88%" }} />
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon">
                        <FileSearch />
                      </div>

                      <div className="metric-number">
                        100K+
                      </div>

                      <div className="metric-label">
                        Transactions
                      </div>

                      <div className="mini-line">
                        <span style={{ width: "68%" }} />
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon">
                        <BrainCircuit />
                      </div>

                      <div className="metric-number">
                        50+
                      </div>

                      <div className="metric-label">
                        Departments
                      </div>

                      <div className="mini-line">
                        <span style={{ width: "62%" }} />
                      </div>
                    </div>

                  </div>

                  <div className="compliance-panel">

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                          Compliance rate
                        </p>

                        <p className="mt-1 text-sm text-white/80">
                          GFR checks across expenses
                        </p>
                      </div>

                      <span className="text-2xl font-semibold text-[#C8F135]">
                        99.8%
                      </span>
                    </div>

                    <div className="compliance-bar">
                      <span />
                    </div>

                  </div>

                </div>

                {/* floating cards */}

                <div className="floating-card floating-card-one">
                  <div className="floating-icon">
                    <ShieldCheck />
                  </div>

                  <div>
                    <p className="text-[9px] text-[#7A8795] uppercase tracking-wider">
                      Compliance
                    </p>

                    <p className="text-xs font-semibold mt-0.5">
                      Verified
                    </p>
                  </div>
                </div>

                <div className="floating-card floating-card-two">
                  <div className="w-2 h-2 rounded-full bg-[#C8F135] animate-pulse" />

                  <span>
                    AI processing
                  </span>
                </div>

              </div>
            </div>

          </div>

          {/* scroll indicator */}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-[#9AA5AF]">
            <span>Scroll</span>
            <div className="scroll-line">
              <span />
            </div>
          </div>

        </section>

        {/* =====================================================
            TRUST BAR
        ===================================================== */}

        <section className="border-y border-[#E2E9E7] bg-white py-7 overflow-hidden">

          <div className="flex items-center gap-8 mb-5 px-5">
            <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.2em] font-semibold text-[#9AA4AD]">
              Trusted by leading universities and research institutions
            </span>

            <div className="h-px bg-[#E6EBEA] flex-1" />
          </div>

          <div className="trust-marquee">
            <div className="trust-track">

              {[...universities, ...universities].map(
                (university, index) => (
                  <div
                    key={`${university}-${index}`}
                    className="trust-item"
                  >
                    <span className="trust-dot" />
                    {university}
                  </div>
                )
              )}

            </div>
          </div>

        </section>

        {/* =====================================================
            PRODUCT
        ===================================================== */}

        <section
          id="product"
          className="relative py-28 md:py-36 bg-[#F8FAF9]"
        >

          <div className="absolute inset-0 pointer-events-none">
            <div className="section-grid" />
          </div>

          <div className="relative max-w-[1280px] mx-auto px-5 md:px-8">

            <Reveal>
              <div className="max-w-2xl">

                <div className="section-eyebrow">
                  <span />
                  THE PLATFORM
                </div>

                <h2 className="section-title">
                  Built for the full
                  <br />
                  <span>grant lifecycle.</span>
                </h2>

                <p className="section-description">
                  From sanction letter to Utilization Certificate —
                  without the Excel graveyard.
                </p>

              </div>
            </Reveal>

            <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-4">

              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <Reveal
                    key={feature.title}
                    delay={index * 100}
                    className={
                      feature.size === "large"
                        ? "lg:row-span-2"
                        : ""
                    }
                  >
                    <div
                      className={`product-card ${
                        feature.size === "large"
                          ? "product-card-large"
                          : ""
                      }`}
                    >

                      <div className="product-number">
                        0{index + 1}
                      </div>

                      <div className="product-icon">
                        <Icon />
                      </div>

                      <div className="mt-auto">

                        <h3 className="text-[17px] font-semibold tracking-tight">
                          {feature.title}
                        </h3>

                        <p className="mt-3 text-[13px] leading-6 text-[#647281]">
                          {feature.desc}
                        </p>

                        <div className="product-arrow">
                          <ArrowRight />
                        </div>

                      </div>

                    </div>
                  </Reveal>
                );
              })}

            </div>
          </div>
        </section>

        {/* =====================================================
            AI SECTION
        ===================================================== */}

        <section
          id="ai"
          className="relative overflow-hidden bg-[#050708] text-white py-28 md:py-36"
        >

          <div className="absolute inset-0 ai-grid" />

          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C8F135]/10 blur-[150px]" />

          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#4C6FFF]/10 blur-[140px]" />

          <div className="relative max-w-[1280px] mx-auto px-5 md:px-8">

            <Reveal>

              <div className="flex items-center gap-2 text-[#C8F135] text-[11px] font-semibold tracking-[0.18em] uppercase">
                <Sparkles className="w-4 h-4" />
                Gemini-powered
              </div>

              <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] leading-[1.05] max-w-3xl">
                AI That Works For
                <br />
                <span className="text-white/45">
                  Research Administration.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-[15px] leading-7 text-white/45">
                Intelligent automation across the workflows that
                matter most — from bills and vouchers to compliance
                and research intelligence.
              </p>

            </Reveal>

            {/* AI workflow */}

            <div className="relative mt-20">

              <div className="hidden md:block absolute left-[10%] right-[10%] top-[55px] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <div className="grid md:grid-cols-4 gap-5">

                {ai.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <Reveal
                      key={item.title}
                      delay={index * 120}
                    >

                      <div className="ai-card group">

                        <div className="flex items-center justify-between">

                          <div className="ai-icon">
                            <Icon />
                          </div>

                          <span className="text-[10px] text-white/20 font-mono">
                            0{index + 1}
                          </span>

                        </div>

                        <div className="mt-12">

                          <h3 className="text-[16px] font-semibold">
                            {item.title}
                          </h3>

                          <p className="mt-3 text-[13px] leading-6 text-white/40">
                            {item.desc}
                          </p>

                        </div>

                        <div className="mt-7 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#C8F135] opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                          AI enabled
                          <ArrowRight className="w-3 h-3" />
                        </div>

                      </div>

                    </Reveal>
                  );
                })}

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            ROLES
        ===================================================== */}

        <section
          id="solutions"
          className="relative py-28 md:py-36 bg-white"
        >

          <div className="max-w-[1280px] mx-auto px-5 md:px-8">

            <Reveal>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

                <div>

                  <div className="section-eyebrow">
                    <span />
                    ONE PLATFORM
                  </div>

                  <h2 className="section-title mt-4">
                    Purpose-built for
                    <br />
                    <span>every role.</span>
                  </h2>

                </div>

                <p className="max-w-md text-[14px] leading-6 text-[#647281]">
                  One connected workspace that gives every
                  stakeholder exactly what they need.
                </p>

              </div>

            </Reveal>

            <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-4">

              {roles.map((role, index) => (
                <Reveal
                  key={role.name}
                  delay={index * 100}
                >

                  <div
                    className="role-card"
                    style={{
                      "--role-color": role.color,
                    } as React.CSSProperties}
                  >

                    <div className="role-top">
                      <span className="role-index">
                        0{index + 1}
                      </span>

                      <ArrowRight className="role-arrow" />
                    </div>

                    <div className="role-orb" />

                    <div className="relative z-10 mt-24">

                      <h3 className="text-[17px] font-semibold">
                        {role.name}
                      </h3>

                      <p className="mt-3 text-[13px] leading-6 text-white/70">
                        {role.desc}
                      </p>

                    </div>

                  </div>

                </Reveal>
              ))}

            </div>

          </div>
        </section>

        {/* =====================================================
            SECURITY STRIP
        ===================================================== */}

        <section className="bg-[#F2F6F4] border-y border-[#E1E9E5]">

          <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12">

            <div className="grid md:grid-cols-3 gap-8">

              <div className="flex items-center gap-4">
                <div className="security-icon">
                  <LockKeyhole />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Audit-ready
                  </p>

                  <p className="text-xs text-[#718091] mt-1">
                    Complete evidence trail
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="security-icon">
                  <ShieldCheck />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    GFR compliance
                  </p>

                  <p className="text-xs text-[#718091] mt-1">
                    Rules checked in real time
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="security-icon">
                  <Zap />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    AI automation
                  </p>

                  <p className="text-xs text-[#718091] mt-1">
                    Less manual work, faster research
                  </p>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="relative overflow-hidden bg-[#050708] text-white py-28 md:py-32">

          <div className="absolute inset-0 cta-grid" />

          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#C8F135]/10 blur-[130px]" />

          <div className="relative max-w-[1000px] mx-auto px-5 text-center">

            <Reveal>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                <Sparkles className="w-3.5 h-3.5 text-[#C8F135]" />
                Research funding, simplified.
              </div>

              <h2 className="mt-7 text-4xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.05]">
                Ready to transform
                <br />
                <span className="text-[#C8F135]">
                  your research administration?
                </span>
              </h2>

              <p className="mt-6 mx-auto max-w-xl text-sm md:text-base leading-7 text-white/40">
                Bring grants, expenses, compliance and research
                intelligence into one connected platform.
              </p>

              <div className="mt-9 flex justify-center">

                <Link
                  href="/login"
                  className="lime-button large group"
                >
                  <span>Start Free Trial</span>

                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </Link>

              </div>

            </Reveal>

          </div>
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer
          id="about"
          className="bg-white border-t border-[#E2E9E7]"
        >

          <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-16">

            <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-12">

              <div>

                <Logo />

                <p className="text-[13px] text-[#84909B] mt-4 max-w-xs leading-6">
                  Research Funding, Simplified.
                </p>

                <div className="mt-7 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#A2ABB3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135]" />
                  Prototype for SIH 2026
                </div>

              </div>

              {["Product", "Company", "Resources", "Legal"].map(
                (category) => (
                  <div key={category}>

                    <div className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#071A2B] mb-5">
                      {category}
                    </div>

                    <div className="space-y-3">

                      <a
                        href="#product"
                        className="footer-link"
                      >
                        Overview
                      </a>

                      <a
                        href="#ai"
                        className="footer-link"
                      >
                        Documentation
                      </a>

                      <a
                        href="#about"
                        className="footer-link"
                      >
                        Contact
                      </a>

                    </div>

                  </div>
                )
              )}

            </div>

            <div className="mt-16 pt-7 border-t border-[#E8ECEA] flex flex-col md:flex-row justify-between gap-3 text-[11px] text-[#98A2AB]">

              <p>
                © 2026 ShodhFund. Prototype for SIH 2026.
              </p>

              <p>
                Built for research institutions.
              </p>

            </div>

          </div>
        </footer>

      </main>

      {/* =======================================================
          GLOBAL ANIMATION / DESIGN SYSTEM
      ======================================================= */}

      <style jsx global>{`

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #F8FAF9;
        }

        * {
          box-sizing: border-box;
        }

        /* -----------------------------------------------
           NAV
        ----------------------------------------------- */

        .nav-glass {
          background: rgba(255,255,255,.78);
          border: 1px solid rgba(210,220,217,.8);
          box-shadow:
            0 10px 35px rgba(7,26,43,.055),
            inset 0 1px 0 rgba(255,255,255,.8);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        .nav-link {
          position: relative;
          transition:
            color .25s ease,
            transform .25s ease;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 100%;
          bottom: -7px;
          height: 1px;
          background: #071A2B;
          transition: right .25s ease;
        }

        .nav-link:hover {
          color: #071A2B;
          transform: translateY(-1px);
        }

        .nav-link:hover::after {
          right: 0;
        }

        /* -----------------------------------------------
           BUTTONS
        ----------------------------------------------- */

        .lime-button {
          min-height: 46px;
          padding: 0 19px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 11px;
          background: #C8F135;
          color: #071A2B;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -.01em;
          box-shadow:
            0 7px 22px rgba(156,190,23,.18),
            inset 0 1px 0 rgba(255,255,255,.35);
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            background .25s ease;
        }

        .lime-button:hover {
          transform: translateY(-2px);
          background: #D2FA45;
          box-shadow:
            0 12px 30px rgba(156,190,23,.27),
            inset 0 1px 0 rgba(255,255,255,.35);
        }

        .lime-button:active {
          transform: translateY(0) scale(.98);
        }

        .lime-button.compact {
          min-height: 39px;
          padding: 0 15px;
          font-size: 12px;
        }

        .lime-button.large {
          min-height: 54px;
          padding: 0 24px;
          border-radius: 13px;
          font-size: 14px;
        }

        .outline-button {
          min-height: 46px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 11px;
          border: 1px solid #CBD6D2;
          background: rgba(255,255,255,.65);
          color: #071A2B;
          font-size: 13px;
          font-weight: 600;
          transition:
            transform .25s ease,
            border-color .25s ease,
            background .25s ease,
            box-shadow .25s ease;
        }

        .outline-button:hover {
          transform: translateY(-2px);
          border-color: #8C9A95;
          background: white;
          box-shadow: 0 10px 25px rgba(7,26,43,.06);
        }

        /* -----------------------------------------------
           HERO
        ----------------------------------------------- */

        .hero-grid {
          background-image:
            linear-gradient(rgba(7,26,43,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(7,26,43,.035) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: linear-gradient(
            to bottom,
            black 0%,
            rgba(0,0,0,.7) 55%,
            transparent 100%
          );
        }

        .hero-spotlight {
          position: fixed;
          width: 500px;
          height: 500px;
          transform: translate(-50%,-50%);
          border-radius: 999px;
          pointer-events: none;
          background: radial-gradient(
            circle,
            rgba(200,241,53,.09) 0%,
            rgba(200,241,53,.035) 35%,
            transparent 70%
          );
          transition:
            left 1s cubic-bezier(.2,.8,.2,1),
            top 1s cubic-bezier(.2,.8,.2,1);
          z-index: 1;
        }

        .hero-title {
          font-size: clamp(56px, 7vw, 94px);
          line-height: .91;
          letter-spacing: -.065em;
          font-weight: 650;
          color: #071A2B;
        }

        .lime-word {
          display: inline-block;
          color: #C8F135;
          background: #071A2B;
          padding: 8px 18px 12px;
          border-radius: 14px;
          transform: rotate(-1.5deg);
          box-shadow: 0 12px 35px rgba(7,26,43,.14);
        }

        .impact-word {
          display: inline-block;
          margin-top: 5px;
        }

        .hero-copy {
          opacity: 0;
          transform: translateY(30px);
          transition:
            opacity .9s ease,
            transform .9s cubic-bezier(.2,.8,.2,1);
        }

        .hero-copy.hero-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* -----------------------------------------------
           DASHBOARD
        ----------------------------------------------- */

        .dashboard-card {
          position: relative;
          min-height: 500px;
          padding: 27px;
          border-radius: 27px;
          background:
            linear-gradient(145deg, #111518 0%, #050708 60%);
          border: 1px solid rgba(255,255,255,.1);
          box-shadow:
            0 45px 100px rgba(7,26,43,.2),
            0 15px 35px rgba(7,26,43,.1),
            inset 0 1px 0 rgba(255,255,255,.08);
          overflow: hidden;
        }

        .dashboard-card::before {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          right: -100px;
          top: -110px;
          background: #C8F135;
          opacity: .1;
          filter: blur(75px);
          border-radius: 999px;
        }

        .dashboard-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              120deg,
              transparent 30%,
              rgba(255,255,255,.025) 50%,
              transparent 70%
            );
          background-size: 220% 100%;
          animation: dashboard-shine 8s linear infinite;
        }

        .dashboard-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dashboard-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(200,241,53,.08);
          color: #C8F135;
          font-size: 9px;
          border: 1px solid rgba(200,241,53,.13);
        }

        .metric-card {
          position: relative;
          z-index: 2;
          min-height: 145px;
          padding: 17px;
          border-radius: 16px;
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.075);
          transition:
            transform .3s ease,
            background .3s ease,
            border-color .3s ease;
        }

        .metric-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,.07);
          border-color: rgba(200,241,53,.2);
        }

        .metric-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(200,241,53,.08);
          color: #C8F135;
        }

        .metric-icon svg {
          width: 14px;
          height: 14px;
        }

        .metric-number {
          margin-top: 16px;
          font-size: 21px;
          font-weight: 650;
          letter-spacing: -.03em;
          color: white;
        }

        .metric-label {
          margin-top: 3px;
          font-size: 9px;
          color: rgba(255,255,255,.38);
        }

        .mini-line {
          position: absolute;
          bottom: 15px;
          left: 17px;
          right: 17px;
          height: 2px;
          border-radius: 10px;
          background: rgba(255,255,255,.07);
          overflow: hidden;
        }

        .mini-line span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #C8F135;
          box-shadow: 0 0 10px rgba(200,241,53,.5);
        }

        .compliance-panel {
          position: relative;
          z-index: 2;
          margin-top: 16px;
          padding: 18px;
          border-radius: 16px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.07);
        }

        .compliance-bar {
          margin-top: 15px;
          height: 5px;
          border-radius: 999px;
          background: rgba(255,255,255,.07);
          overflow: hidden;
        }

        .compliance-bar span {
          display: block;
          height: 100%;
          width: 99.8%;
          background: linear-gradient(
            90deg,
            #9FCD17,
            #D5FF43
          );
          border-radius: inherit;
          box-shadow: 0 0 15px rgba(200,241,53,.45);
          animation: compliance-grow 2s ease forwards;
        }

        .floating-label {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 11px;
          border-radius: 999px;
          background: white;
          border: 1px solid #DCE4E2;
          box-shadow: 0 12px 30px rgba(7,26,43,.08);
          font-size: 9px;
          color: #526171;
          animation: float 4s ease-in-out infinite;
        }

        .floating-card {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 9px;
          z-index: 10;
          background: rgba(255,255,255,.92);
          border: 1px solid rgba(210,220,217,.9);
          box-shadow: 0 20px 45px rgba(7,26,43,.12);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .floating-card-one {
          left: -30px;
          bottom: 85px;
          padding: 10px 13px;
          border-radius: 14px;
          animation: float 5s ease-in-out infinite .7s;
        }

        .floating-card-two {
          right: -22px;
          top: 145px;
          padding: 9px 12px;
          border-radius: 999px;
          font-size: 9px;
          color: #526171;
          animation: float 4.5s ease-in-out infinite 1.2s;
        }

        .floating-icon {
          width: 31px;
          height: 31px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #F0F6D9;
          color: #5F7900;
        }

        .floating-icon svg {
          width: 15px;
          height: 15px;
        }

        .dashboard-visible {
          animation: dashboard-enter 1s cubic-bezier(.2,.8,.2,1) .25s both;
        }

        /* -----------------------------------------------
           TRUST
        ----------------------------------------------- */

        .trust-marquee {
          width: 100%;
          overflow: hidden;
        }

        .trust-track {
          display: flex;
          width: max-content;
          animation: marquee 28s linear infinite;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 34px;
          font-size: 13px;
          font-weight: 650;
          color: #7A8792;
          white-space: nowrap;
        }

        .trust-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C8F135;
        }

        /* -----------------------------------------------
           SECTION HEADINGS
        ----------------------------------------------- */

        .section-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .2em;
          color: #89949D;
        }

        .section-eyebrow span {
          width: 20px;
          height: 2px;
          background: #C8F135;
        }

        .section-title {
          font-size: clamp(38px, 5vw, 62px);
          line-height: 1.02;
          letter-spacing: -.05em;
          font-weight: 650;
          color: #071A2B;
        }

        .section-title span {
          color: #8C969F;
        }

        .section-description {
          margin-top: 20px;
          font-size: 15px;
          line-height: 1.8;
          color: #647281;
          max-width: 570px;
        }

        .section-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(#071A2B08 1px, transparent 1px),
            linear-gradient(90deg, #071A2B08 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: linear-gradient(
            to bottom,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
        }

        /* -----------------------------------------------
           PRODUCT CARDS
        ----------------------------------------------- */

        .product-card {
          position: relative;
          min-height: 325px;
          padding: 24px;
          border-radius: 21px;
          background: rgba(255,255,255,.9);
          border: 1px solid #DDE6E2;
          box-shadow: 0 12px 30px rgba(7,26,43,.035);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition:
            transform .4s cubic-bezier(.2,.8,.2,1),
            box-shadow .4s ease,
            border-color .4s ease;
        }

        .product-card-large {
          min-height: 420px;
        }

        .product-card:hover {
          transform: translateY(-8px);
          border-color: #C5D2CD;
          box-shadow:
            0 24px 55px rgba(7,26,43,.09),
            0 2px 4px rgba(7,26,43,.03);
        }

        .product-card::after {
          content: "";
          position: absolute;
          width: 170px;
          height: 170px;
          right: -70px;
          bottom: -70px;
          border-radius: 50%;
          background: #C8F135;
          opacity: 0;
          filter: blur(60px);
          transition: opacity .4s ease;
        }

        .product-card:hover::after {
          opacity: .12;
        }

        .product-number {
          position: absolute;
          right: 22px;
          top: 22px;
          font-family: monospace;
          font-size: 10px;
          color: #AAB4B9;
        }

        .product-icon {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #F1F5F3;
          color: #071A2B;
          transition:
            background .3s ease,
            color .3s ease,
            transform .3s ease;
        }

        .product-icon svg {
          width: 19px;
          height: 19px;
        }

        .product-card:hover .product-icon {
          background: #C8F135;
          transform: rotate(-5deg) scale(1.05);
        }

        .product-arrow {
          margin-top: 20px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #DCE4E1;
          color: #7B8790;
          transition:
            background .3s ease,
            color .3s ease,
            transform .3s ease;
        }

        .product-arrow svg {
          width: 12px;
          height: 12px;
        }

        .product-card:hover .product-arrow {
          background: #071A2B;
          color: white;
          transform: translateX(5px);
        }

        /* -----------------------------------------------
           AI
        ----------------------------------------------- */

        .ai-grid {
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 55px 55px;
          mask-image: linear-gradient(
            to bottom,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
        }

        .ai-card {
          position: relative;
          min-height: 290px;
          padding: 23px;
          border-radius: 18px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.08);
          overflow: hidden;
          transition:
            transform .4s cubic-bezier(.2,.8,.2,1),
            border-color .3s ease,
            background .3s ease;
        }

        .ai-card::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background: #C8F135;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .4s ease;
        }

        .ai-card:hover {
          transform: translateY(-8px);
          background: rgba(255,255,255,.055);
          border-color: rgba(200,241,53,.2);
        }

        .ai-card:hover::before {
          transform: scaleX(1);
        }

        .ai-icon {
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(200,241,53,.08);
          color: #C8F135;
        }

        .ai-icon svg {
          width: 19px;
          height: 19px;
        }

        /* -----------------------------------------------
           ROLES
        ----------------------------------------------- */

        .role-card {
          position: relative;
          min-height: 340px;
          padding: 22px;
          border-radius: 21px;
          background: var(--role-color);
          color: white;
          overflow: hidden;
          transition:
            transform .4s cubic-bezier(.2,.8,.2,1),
            box-shadow .4s ease;
        }

        .role-card:hover {
          transform: translateY(-8px);
          box-shadow:
            0 25px 50px color-mix(
              in srgb,
              var(--role-color) 30%,
              transparent
            );
        }

        .role-card::before {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          right: -100px;
          top: -90px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.15);
          box-shadow:
            0 0 0 25px rgba(255,255,255,.025),
            0 0 0 55px rgba(255,255,255,.018);
        }

        .role-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,.1),
            transparent 45%
          );
          pointer-events: none;
        }

        .role-top {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .role-index {
          font-family: monospace;
          font-size: 10px;
          color: rgba(255,255,255,.45);
        }

        .role-arrow {
          width: 16px;
          height: 16px;
          color: rgba(255,255,255,.55);
          transition:
            transform .3s ease,
            color .3s ease;
        }

        .role-card:hover .role-arrow {
          transform: translate(3px,-3px);
          color: white;
        }

        .role-orb {
          position: absolute;
          width: 180px;
          height: 180px;
          right: -70px;
          bottom: -90px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.1);
          box-shadow:
            0 0 0 25px rgba(255,255,255,.025),
            0 0 0 50px rgba(255,255,255,.015);
        }

        /* -----------------------------------------------
           SECURITY
        ----------------------------------------------- */

        .security-icon {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          border-radius: 12px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #647800;
          border: 1px solid #E1E9E5;
          box-shadow: 0 5px 15px rgba(7,26,43,.04);
        }

        .security-icon svg {
          width: 17px;
          height: 17px;
        }

        /* -----------------------------------------------
           CTA
        ----------------------------------------------- */

        .cta-grid {
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        /* -----------------------------------------------
           FOOTER
        ----------------------------------------------- */

        .footer-link {
          display: block;
          width: fit-content;
          font-size: 12px;
          color: #82909B;
          transition:
            color .2s ease,
            transform .2s ease;
        }

        .footer-link:hover {
          color: #071A2B;
          transform: translateX(3px);
        }

        /* -----------------------------------------------
           REVEAL
        ----------------------------------------------- */

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity .8s ease,
            transform .8s cubic-bezier(.2,.8,.2,1);
        }

        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* -----------------------------------------------
           KEYFRAMES
        ----------------------------------------------- */

        @keyframes dashboard-enter {
          0% {
            opacity: 0;
            transform:
              translateY(45px)
              rotateX(8deg)
              rotateY(-4deg)
              scale(.97);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              rotateX(0)
              rotateY(0)
              scale(1);
          }
        }

        @keyframes dashboard-shine {
          0% {
            background-position: 200% 0;
          }

          100% {
            background-position: -200% 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @keyframes compliance-grow {
          from {
            width: 0;
          }

          to {
            width: 99.8%;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: .5;
            transform: scale(1);
          }

          50% {
            opacity: .8;
            transform: scale(1.08);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        /* -----------------------------------------------
           MOBILE
        ----------------------------------------------- */

        @media (max-width: 767px) {

          .hero-title {
            font-size: 60px;
          }

          .lime-word {
            padding-left: 13px;
            padding-right: 13px;
          }

          .dashboard-card {
            min-height: auto;
            padding: 18px;
            border-radius: 20px;
          }

          .metric-card {
            min-height: 125px;
            padding: 13px;
          }

          .metric-number {
            font-size: 18px;
            margin-top: 12px;
          }

          .floating-card-one {
            left: -8px;
            bottom: 40px;
          }

          .floating-card-two {
            right: -8px;
            top: 90px;
          }

          .floating-label {
            left: 12px;
            top: -27px;
          }

          .product-card,
          .product-card-large {
            min-height: 300px;
          }

          .role-card {
            min-height: 290px;
          }

          .hero-spotlight {
            display: none;
          }

          .trust-item {
            padding: 0 20px;
          }

        }

        /* -----------------------------------------------
           REDUCED MOTION
        ----------------------------------------------- */

        @media (prefers-reduced-motion: reduce) {

          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }

          .reveal {
            opacity: 1;
            transform: none;
          }

          .hero-copy {
            opacity: 1;
            transform: none;
          }

        }

      `}</style>
    </>
  );
}