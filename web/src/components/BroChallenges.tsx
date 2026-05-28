import { useState, useEffect } from "react";

interface Challenge {
  id: string;
  title: string;
  challenger: string;
  target: string;
  deadline: string;
  status: "active" | "completed" | "failed";
  createdAt: string;
}

const STORAGE_KEY = "brohub_challenges";

const CHALLENGE_IDEAS = [
  "100 push-ups in a day 💪",
  "No fast food for a week 🥗",
  "Run 5km under 30 mins 🏃",
  "Drink 3L of water daily 💧",
  "Cold shower every morning 🚿",
  "No phone for 24 hours 📵",
  "Beat me at FIFA ⚽",
  "50 pull-ups challenge 🏋️",
  "Wake up at 6am for a week ⏰",
  "Read a book this month 📚",
];

export function BroChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [view, setView] = useState<"list" | "add">("list");
  const [form, setForm] = useState({ title: "", challenger: "", target: "", deadline: "" });
  const [randomIdea, setRandomIdea] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setChallenges(JSON.parse(raw));
    setRandomIdea(CHALLENGE_IDEAS[Math.floor(Math.random() * CHALLENGE_IDEAS.length)]);
  }, []);

  const save = (updated: Challenge[]) => {
    setChallenges(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addChallenge = () => {
    if (!form.title.trim() || !form.challenger.trim()) return;
    const c: Challenge = {
      id: Date.now().toString(),
      ...form,
      status: "active",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    save([c, ...challenges]);
    setForm({ title: "", challenger: "", target: "", deadline: "" });
    setView("list");
  };

  const updateStatus = (id: string, status: Challenge["status"]) => {
    save(challenges.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const deleteChallenge = (id: string) => {
    save(challenges.filter((c) => c.id !== id));
  };

  const active = challenges.filter((c) => c.status === "active");
  const done = challenges.filter((c) => c.status !== "active");

  const statusBadge: Record<Challenge["status"], { bg: string; text: string; label: string }> = {
    active: { bg: "#dbeafe", text: "#2563eb", label: "🔥 Active" },
    completed: { bg: "#dcfce7", text: "#16a34a", label: "✅ Completed" },
    failed: { bg: "#fee2e2", text: "#dc2626", label: "💀 Failed" },
  };

  if (view === "add") {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setView("list")}
            className="text-sm font-semibold px-3 py-1.5 rounded-xl"
            style={{ background: "var(--panel)", color: "var(--muted)", border: "1px solid var(--line)" }}
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "Fraunces, serif" }}>New Bro Challenge</h2>
        </div>

        <div
          className="rounded-2xl p-4 mb-5 cursor-pointer"
          style={{ background: "var(--panel)", border: "2px dashed var(--accent)" }}
          onClick={() => setForm({ ...form, title: randomIdea })}
        >
          <div className="text-xs font-bold mb-1" style={{ color: "var(--accent)" }}>💡 RANDOM IDEA — tap to use</div>
          <div className="text-sm font-semibold">{randomIdea}</div>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { label: "Challenge", field: "title", placeholder: "e.g. 100 push-ups in a day 💪" },
            { label: "Challenger (who set this?)", field: "challenger", placeholder: "e.g. Big Mike" },
            { label: "Target (who must do it?)", field: "target", placeholder: "e.g. Me, or the whole crew" },
            { label: "Deadline", field: "deadline", placeholder: "e.g. End of the week", type: "date" },
          ].map(({ label, field, placeholder, type }) => (
            <div key={field}>
              <label className="text-sm font-semibold block mb-1" style={{ color: "var(--muted)" }}>{label}</label>
              <input
                type={type || "text"}
                placeholder={placeholder}
                value={(form as any)[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full px-4 py-2 rounded-xl text-sm"
                style={{ background: "var(--panel)", border: "1px solid var(--line)", color: "var(--ink)" }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={addChallenge}
          className="w-full py-3 rounded-xl font-bold text-white mt-6"
          style={{ background: "var(--accent)" }}
        >
          🏆 Drop the Challenge!
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "Fraunces, serif" }}>Bro Challenges</h2>
        <button
          onClick={() => setView("add")}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          + Challenge
        </button>
      </div>

      {/* Score */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Active", value: active.length, emoji: "🔥" },
          { label: "Completed", value: done.filter((c) => c.status === "completed").length, emoji: "✅" },
          { label: "Failed", value: done.filter((c) => c.status === "failed").length, emoji: "💀" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--muted)" }}>
          <div className="text-5xl mb-4">🏆</div>
          <div className="font-semibold">No challenges yet, bro!</div>
          <div className="text-sm mt-1">Step up and dare your crew.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {[...active, ...done].map((c) => {
            const badge = statusBadge[c.status];
            return (
              <div key={c.id} className="rounded-2xl p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-base">{c.title}</div>
                    <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      From: <strong>{c.challenger}</strong>
                      {c.target && <> → <strong>{c.target}</strong></>}
                      {c.deadline && <> · Due: {c.deadline}</>}
                    </div>
                  </div>
                  <button onClick={() => deleteChallenge(c.id)} className="text-red-400 text-sm ml-2">✕</button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-lg"
                    style={{ background: badge.bg, color: badge.text }}
                  >
                    {badge.label}
                  </span>
                  {c.status === "active" && (
                    <>
                      <button
                        onClick={() => updateStatus(c.id, "completed")}
                        className="text-xs font-semibold px-3 py-1 rounded-xl"
                        style={{ background: "var(--paper)", color: "#16a34a", border: "1px solid var(--line)" }}
                      >
                        ✅ Done
                      </button>
                      <button
                        onClick={() => updateStatus(c.id, "failed")}
                        className="text-xs font-semibold px-3 py-1 rounded-xl"
                        style={{ background: "var(--paper)", color: "#dc2626", border: "1px solid var(--line)" }}
                      >
                        💀 Failed
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
