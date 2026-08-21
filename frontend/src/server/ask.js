function inr(n) {
  const x = Number(n) || 0;
  if (x >= 1e7) return `₹${(x / 1e7).toFixed(2)} Cr`;
  if (x >= 1e5) return `₹${(x / 1e5).toFixed(2)} L`;
  return `₹${x.toLocaleString("en-IN")}`;
}

export function answerQuestion(q, data) {
  const text = String(q || "").toLowerCase().trim();
  if (!text) return { answer: "Ask about grants, spend, UCs, or anomalies.", rows: [] };

  const agency = ["DST", "SERB", "ICMR", "UGC", "CSIR"].find((a) => text.includes(a.toLowerCase()));
  let grants = data.grants;
  if (agency) grants = grants.filter((g) => g.agency === agency);

  if (/anomal|duplicate|flag/.test(text)) {
    const open = data.anomalies.filter((a) => !a.resolved);
    return {
      answer: `${open.length} open anomalies. Highest: ${open[0]?.reason || "none"}.`,
      rows: open.slice(0, 8).map((a) => ({ id: a.id, label: a.severity, value: a.reason })),
    };
  }
  if (/pending|submitted|approv|queue/.test(text)) {
    const p = data.expenses.filter((e) => e.status === "SUBMITTED");
    return {
      answer: `${p.length} expenses waiting for finance. Total ${inr(p.reduce((s, e) => s + e.amount, 0))}.`,
      rows: p.slice(0, 8).map((e) => ({ id: e.id, label: e.vendor, value: inr(e.amount) })),
    };
  }
  if (/uc|utilization|certificate/.test(text)) {
    return {
      answer: `${data.ucs.length} UC drafts. Next due: ${grants.map((g) => `${g.id} ${g.ucDue}`).slice(0, 3).join("; ")}.`,
      rows: grants.map((g) => ({ id: g.id, label: g.title, value: g.ucDue })),
    };
  }
  if (/spent|spend|utili|balance|how much/.test(text)) {
    const san = grants.reduce((s, g) => s + g.amount, 0);
    const spent = grants.reduce((s, g) => s + g.spent, 0);
    const pct = san ? Math.round((spent / san) * 1000) / 10 : 0;
    const scope = agency || "all agencies";
    return {
      answer: `${scope}: sanctioned ${inr(san)}, spent ${inr(spent)} (${pct}%), balance ${inr(san - spent)}.`,
      rows: grants.map((g) => ({
        id: g.id,
        label: `${g.agency} · ${g.title}`,
        value: `${inr(g.spent)} / ${inr(g.amount)}`,
      })),
    };
  }
  return {
    answer: `${grants.length} grants in scope. Try: "how much spent on DST", "pending expenses", "open anomalies", "UC due".`,
    rows: grants.slice(0, 8).map((g) => ({ id: g.id, label: g.title, value: g.agency })),
  };
}
