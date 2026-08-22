"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  FlaskConical,
  Landmark,
  GraduationCap,
  SearchCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { getUser, setViewRole } from "@/lib/session";
import type { Role } from "@/lib/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const roles: {
  href: string;
  name: string;
  desc: string;
  color: string;
  lightColor: string;
  role: Role;
  icon: typeof FlaskConical;
}[] = [
  {
    href: "/dashboard/pi",
    name: "Principal Investigator",
    desc: "Manage grants, log expenses, generate UCs.",
    color: "#2146C7",
    lightColor: "#E8EDFF",
    role: "PI",
    icon: FlaskConical,
  },
  {
    href: "/dashboard/finance",
    name: "Finance Officer",
    desc: "Verify expenses, enforce GFR, clear UC queues.",
    color: "#12877D",
    lightColor: "#E4F6F3",
    role: "FINANCE",
    icon: Landmark,
  },
  {
    href: "/dashboard/admin",
    name: "Research Admin",
    desc: "University portfolio and NIRF metrics.",
    color: "#7131D9",
    lightColor: "#F0E8FF",
    role: "ADMIN",
    icon: GraduationCap,
  },
  {
    href: "/dashboard/auditor",
    name: "Auditor",
    desc: "Trail, objections, compliance review.",
    color: "#D04A12",
    lightColor: "#FFF0E9",
    role: "AUDITOR",
    icon: SearchCheck,
  },
];

export default function SelectRole() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getUser()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5F8FA] text-[#071C2C]">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Lime glow */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#B7F51A]/20 blur-[110px]" />

        {/* Blue glow */}
        <div className="absolute right-[-180px] top-[5%] h-[550px] w-[550px] rounded-full bg-[#C9D9FF]/35 blur-[120px]" />

        {/* Purple glow */}
        <div className="absolute bottom-[-220px] left-[35%] h-[500px] w-[500px] rounded-full bg-[#E7D9FF]/30 blur-[120px]" />

        {/* Very subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(7,28,44,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(7,28,44,0.045) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-6 py-8 sm:px-8 lg:px-10">
        {/* =======================================================
            HEADER
        ======================================================= */}

        <header className="animate-fade-in">
          <Logo />
        </header>

        {/* =======================================================
            HERO / INTRO
        ======================================================= */}

        <section className="mt-20 sm:mt-24">
          {/* Workspace badge */}
          <div
            className="
              inline-flex
              animate-fade-in
              items-center
              gap-2
              rounded-full
              border
              border-[#C9D8E5]
              bg-white/80
              px-4
              py-2
              text-xs
              font-semibold
              text-[#48627A]
              shadow-[0_5px_20px_rgba(7,28,44,0.06)]
              backdrop-blur
            "
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B7F51A]">
              <Sparkles className="h-3 w-3 text-[#071C2C]" />
            </span>

            ShodhFund Workspace
          </div>

          {/* Heading */}
          <h1
            className="
              mt-6
              max-w-4xl
              animate-fade-in
              text-[38px]
              font-semibold
              leading-[1.05]
              tracking-[-0.045em]
              text-[#071C2C]
              sm:text-[48px]
              lg:text-[56px]
            "
          >
            Choose your
            <span className="relative ml-3 inline-block">
              role.
              <span className="absolute -bottom-1 left-0 h-[6px] w-full rounded-full bg-[#B7F51A]" />
            </span>
          </h1>

          <p
            className="
              mt-5
              max-w-xl
              animate-fade-in
              text-[15px]
              leading-7
              text-[#60778C]
              sm:text-base
            "
            style={{ animationDelay: "80ms" }}
          >
            Demo allows switching roles without re-login. Select the workspace
            that matches your responsibilities.
          </p>
        </section>

        {/* =======================================================
            ROLE CARDS
        ======================================================= */}

        <section
          aria-label="Available roles"
          className="
            mt-12
            grid
            gap-5
            sm:grid-cols-2
            lg:mt-14
            lg:grid-cols-4
          "
        >
          {roles.map((r, index) => {
            const Icon = r.icon;

            return (
              <Link
                key={r.name}
                href={r.href}
                onClick={() => setViewRole(r.role)}
                className="
                  group
                  relative
                  min-h-[295px]
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-white/80
                  p-6
                  shadow-[0_12px_35px_rgba(7,28,44,0.08)]
                  outline-none
                  transition-all
                  duration-500
                  ease-out
                  hover:-translate-y-2
                  hover:shadow-[0_25px_55px_rgba(7,28,44,0.16)]
                  focus-visible:ring-2
                  focus-visible:ring-[#B7F51A]
                  focus-visible:ring-offset-4
                  animate-fade-in-scale
                "
                style={{
                  animationDelay: `${index * 90}ms`,
                  background: `linear-gradient(145deg, ${r.lightColor} 0%, #FFFFFF 62%)`,
                }}
              >
                {/* =================================================
                    COLORED TOP EDGE
                ================================================= */}

                <div
                  className="absolute left-0 right-0 top-0 h-[5px]"
                  style={{
                    background: `linear-gradient(90deg, ${r.color}, ${r.color}88)`,
                  }}
                />

                {/* =================================================
                    BIG BACKGROUND GLOW
                ================================================= */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-48
                    w-48
                    rounded-full
                    opacity-20
                    blur-2xl
                    transition-all
                    duration-700
                    group-hover:scale-150
                    group-hover:opacity-30
                  "
                  style={{
                    background: r.color,
                  }}
                />

                {/* =================================================
                    DECORATIVE CIRCLES
                ================================================= */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-14
                    -top-14
                    h-40
                    w-40
                    rounded-full
                    border
                    transition-all
                    duration-700
                    group-hover:scale-125
                  "
                  style={{
                    borderColor: `${r.color}20`,
                  }}
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-5
                    -top-5
                    h-24
                    w-24
                    rounded-full
                    border
                    transition-all
                    duration-700
                    group-hover:scale-125
                  "
                  style={{
                    borderColor: `${r.color}15`,
                  }}
                />

                {/* =================================================
                    CARD CONTENT
                ================================================= */}

                <div className="relative z-10 flex h-full flex-col">
                  {/* Icon */}
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      shadow-sm
                      transition-all
                      duration-500
                      group-hover:scale-110
                      group-hover:rotate-[-4deg]
                    "
                    style={{
                      background: r.color,
                      color: "#FFFFFF",
                      boxShadow: `0 8px 20px ${r.color}30`,
                    }}
                  >
                    <Icon
                      className="h-[21px] w-[21px]"
                      strokeWidth={2}
                    />
                  </div>

                  {/* Role information */}
                  <div className="mt-7">
                    <div
                      className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em]"
                      style={{
                        color: r.color,
                      }}
                    >
                      Workspace
                    </div>

                    <h2 className="text-[19px] font-semibold tracking-[-0.025em] text-[#092640]">
                      {r.name}
                    </h2>

                    <p className="mt-3 max-w-[225px] text-[14px] leading-6 text-[#667E94]">
                      {r.desc}
                    </p>
                  </div>

                  {/* =================================================
                      ACTION
                  ================================================= */}

                  <div className="mt-auto pt-7">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[13px] font-bold"
                        style={{
                          color: r.color,
                        }}
                      >
                        Access Dashboard
                      </span>

                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          border
                          bg-white/70
                          transition-all
                          duration-300
                          group-hover:translate-x-1
                          group-hover:bg-[#071C2C]
                        "
                        style={{
                          borderColor: `${r.color}30`,
                        }}
                      >
                        <ArrowRight
                          className="
                            h-3.5
                            w-3.5
                            transition-colors
                            duration-300
                            group-hover:text-[#B7F51A]
                          "
                          style={{
                            color: r.color,
                          }}
                          strokeWidth={2.2}
                        />
                      </span>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    HOVER BOTTOM LINE
                ================================================= */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[3px]
                    w-0
                    transition-all
                    duration-500
                    group-hover:w-full
                  "
                  style={{
                    background: r.color,
                  }}
                />
              </Link>
            );
          })}
        </section>

        {/* =======================================================
            BOTTOM STATUS
        ======================================================= */}

        <div className="mt-auto flex justify-center pb-3 pt-16">
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-[#8CA0B2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B7F51A] shadow-[0_0_8px_#B7F51A]" />
            Select a role to continue to your ShodhFund workspace
          </div>
        </div>
      </div>
    </main>
  );
}