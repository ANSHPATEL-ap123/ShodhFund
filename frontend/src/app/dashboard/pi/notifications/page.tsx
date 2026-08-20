"use client";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { getUser } from "@/lib/session";
import { useEffect, useState } from "react";

export default function P() {
  const [uid, setUid] = useState("");
  useEffect(() => setUid(getUser()?.id || ""), []);
  const { data, reload } = useList<{ id: string; title: string; message: string; type: string; read?: boolean }>(
    uid ? `/api/notifications?userId=${uid}` : "/api/notifications"
  );
  return (
    <AppShell role="PI">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <div className="space-y-2">
        {data.map((n) => (
          <div key={n.id} className={`card p-4 flex justify-between gap-4 ${n.read ? "opacity-60" : ""}`}>
            <div>
              <div className="text-xs text-muted">{n.type}</div>
              <div className="font-medium">{n.title}</div>
              <p className="text-sm text-ink-2">{n.message}</p>
            </div>
            {!n.read && (
              <button className="text-xs text-info shrink-0" onClick={async () => {
                await api(`/api/notifications/${n.id}/read`, { method: "POST" });
                reload();
              }}>Mark read</button>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
