"use client";

import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { getUser } from "@/lib/session";
import { useEffect, useMemo, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read?: boolean;
  createdAt?: string;
};

function Icon({
  type,
}: {
  type: string;
}) {
  const normalized = type.toLowerCase();

  if (
    normalized.includes("approval") ||
    normalized.includes("approved") ||
    normalized.includes("grant")
  ) {
    return (
      <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
        <svg
          className="h-5 w-5 text-emerald-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
          <path d="M8.5 12l2.2 2.2 4.8-5" />
        </svg>
      </div>
    );
  }

  if (
    normalized.includes("expense") ||
    normalized.includes("bill") ||
    normalized.includes("payment")
  ) {
    return (
      <div className="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
        <svg
          className="h-5 w-5 text-orange-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M8 7h8M8 11h8M8 15h5" />
        </svg>
      </div>
    );
  }

  if (
    normalized.includes("alert") ||
    normalized.includes("warning") ||
    normalized.includes("compliance")
  ) {
    return (
      <div className="h-11 w-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
        <svg
          className="h-5 w-5 text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 4l9 16H3L12 4z" />
          <path d="M12 9v5M12 17h.01" />
        </svg>
      </div>
    );
  }

  return (
    <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
      <svg
        className="h-5 w-5 text-blue-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const now = Date.now();
  const diff = now - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function P() {
  const [uid, setUid] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    setUid(getUser()?.id || "");
  }, []);

  const { data, reload } = useList<Notification>(
    uid
      ? `/api/notifications?userId=${uid}`
      : "/api/notifications"
  );

  const unreadCount = useMemo(
    () => data.filter((n) => !n.read).length,
    [data]
  );

  const filteredNotifications = useMemo(() => {
    return data.filter((notification) => {
      const matchesFilter =
        filter === "all" || !notification.read;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        notification.title.toLowerCase().includes(searchText) ||
        notification.message.toLowerCase().includes(searchText) ||
        notification.type.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [data, filter, search]);

  async function markAsRead(id: string) {
    await api(`/api/notifications/${id}/read`, {
      method: "POST",
    });

    reload();
  }

  async function markAllAsRead() {
    const unread = data.filter((n) => !n.read);

    if (!unread.length) return;

    setMarkingAll(true);

    try {
      await Promise.all(
        unread.map((notification) =>
          api(`/api/notifications/${notification.id}/read`, {
            method: "POST",
          })
        )
      );

      reload();
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <AppShell role="PI">
      <div className="min-h-full bg-[#f5f8fc]">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-[#e6edf5] bg-white px-7 py-7 mb-6 shadow-[0_4px_20px_rgba(24,55,92,0.04)]">
          {/* Soft background glow */}
          <div className="absolute right-0 top-0 h-52 w-72 bg-gradient-to-bl from-[#eff9e7] via-[#f7fbf4] to-transparent pointer-events-none" />

          <div className="relative flex items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d8efb1] bg-[#f5fce9] px-3 py-1.5 text-xs font-medium text-[#4f741b] mb-4">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#dff5b5]">
                  <svg
                    className="h-3.5 w-3.5 text-[#70a91d]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v20M5 7h10a3 3 0 010 6H7a3 3 0 000-6z" />
                  </svg>
                </span>
                Research Funding Workspace
              </div>

              <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.02em] text-[#102c4d]">
                Notifications
              </h1>

              <p className="mt-2 max-w-2xl text-[15px] leading-6 text-[#7186a3]">
                Stay updated on grant approvals, expenses, compliance
                alerts, and important research funding activity.
              </p>
            </div>

            <button
              onClick={markAllAsRead}
              disabled={!unreadCount || markingAll}
              className="relative mt-1 inline-flex items-center gap-2 rounded-xl bg-[#102c4d] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(16,44,77,0.16)] transition hover:bg-[#173a63] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12l4 4L19 6" />
              </svg>
              {markingAll ? "Marking..." : "Mark all as read"}
            </button>
          </div>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-[#e5ebf3] bg-white p-5 shadow-[0_3px_14px_rgba(24,55,92,0.035)]">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M10 21h4" />
                </svg>
              </div>

              <div className="h-1 w-10 rounded-full bg-blue-500" />
            </div>

            <div className="mt-4 text-xs font-medium text-[#8aa0bc]">
              Total notifications
            </div>

            <div className="mt-1 text-[26px] font-semibold text-[#102c4d]">
              {data.length}
            </div>

            <div className="mt-1 text-xs text-[#91a4bd]">
              All account activity
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5ebf3] bg-white p-5 shadow-[0_3px_14px_rgba(24,55,92,0.035)]">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-[#f3fce2] flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-[#83d400]" />
              </div>

              <div className="h-1 w-10 rounded-full bg-[#83d400]" />
            </div>

            <div className="mt-4 text-xs font-medium text-[#8aa0bc]">
              Unread
            </div>

            <div className="mt-1 text-[26px] font-semibold text-[#102c4d]">
              {unreadCount}
            </div>

            <div className="mt-1 text-xs text-[#91a4bd]">
              Require your attention
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5ebf3] bg-white p-5 shadow-[0_3px_14px_rgba(24,55,92,0.035)]">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 19V5" />
                  <path d="M4 5h12l-2 4 2 4H4" />
                </svg>
              </div>

              <div className="h-1 w-10 rounded-full bg-purple-500" />
            </div>

            <div className="mt-4 text-xs font-medium text-[#8aa0bc]">
              Latest activity
            </div>

            <div className="mt-1 text-[26px] font-semibold text-[#102c4d]">
              {data.length ? "Recent" : "None"}
            </div>

            <div className="mt-1 text-xs text-[#91a4bd]">
              Funding workspace updates
            </div>
          </div>
        </section>

        {/* Notification panel */}
        <section className="overflow-hidden rounded-2xl border border-[#e4ebf3] bg-white shadow-[0_4px_20px_rgba(24,55,92,0.04)]">
          {/* Toolbar */}
          <div className="border-b border-[#edf1f6] px-5 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-semibold text-[#183655]">
                  Recent notifications
                </h2>
                <p className="mt-0.5 text-xs text-[#8da1ba]">
                  Important updates from your research funding workspace
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9aabc0]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-4-4" />
                  </svg>

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search notifications..."
                    className="h-10 w-[230px] rounded-lg border border-[#dce5ef] bg-white pl-9 pr-3 text-sm text-[#183655] outline-none placeholder:text-[#a1b1c4] focus:border-[#8db6ee] focus:ring-2 focus:ring-blue-50"
                  />
                </div>

                {/* Filter */}
                <div className="flex rounded-lg border border-[#dce5ef] bg-[#f8fafc] p-1">
                  <button
                    onClick={() => setFilter("all")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      filter === "all"
                        ? "bg-white text-[#183655] shadow-sm"
                        : "text-[#8296b0]"
                    }`}
                  >
                    All
                  </button>

                  <button
                    onClick={() => setFilter("unread")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      filter === "unread"
                        ? "bg-white text-[#183655] shadow-sm"
                        : "text-[#8296b0]"
                    }`}
                  >
                    Unread
                    {unreadCount > 0 && (
                      <span className="ml-1.5 rounded-full bg-[#e9f8c9] px-1.5 py-0.5 text-[10px] text-[#5c851c]">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* List */}
          <div>
            {filteredNotifications.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2f6fa]">
                  <svg
                    className="h-5 w-5 text-[#8ca0b9]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                  </svg>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#183655]">
                  No notifications found
                </h3>

                <p className="mt-1 text-xs text-[#91a4bd]">
                  {filter === "unread"
                    ? "You're all caught up."
                    : "There are no notifications matching your search."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`group relative flex items-start gap-4 border-b border-[#edf1f6] px-5 py-5 transition last:border-b-0 hover:bg-[#fbfcfe] ${
                    !n.read ? "bg-[#fbfdff]" : ""
                  }`}
                >
                  {/* Unread indicator */}
                  {!n.read && (
                    <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2d7ff9]" />
                  )}

                  <Icon type={n.type} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-sm ${
                              n.read
                                ? "font-medium text-[#526983]"
                                : "font-semibold text-[#183655]"
                            }`}
                          >
                            {n.title}
                          </h3>

                          {!n.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#2d7ff9]" />
                          )}
                        </div>

                        <p className="mt-1 text-sm leading-5 text-[#7186a3]">
                          {n.message}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs text-[#9aabc0]">
                        {formatDate(n.createdAt)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex rounded-md bg-[#f3f6fa] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#7186a3]">
                        {n.type}
                      </span>

                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-xs font-medium text-[#2d70d6] opacity-0 transition group-hover:opacity-100 hover:text-[#174f9e]"
                        >
                          Mark as read
                        </button>
                      )}

                      {n.read && (
                        <span className="text-[11px] text-[#a3b1c1]">
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="border-t border-[#edf1f6] bg-[#fbfcfe] px-5 py-3">
              <div className="flex items-center justify-between text-xs text-[#91a4bd]">
                <span>
                  Showing {filteredNotifications.length} of {data.length}{" "}
                  notifications
                </span>

                {unreadCount > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#83d400]" />
                    {unreadCount} unread
                  </span>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}