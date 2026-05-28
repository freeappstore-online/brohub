import { useState, useEffect } from "react";

interface GameSession {
  id: string;
  game: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  status: "upcoming" | "done" | "cancelled";
}

const STORAGE_KEY = "brohub_gamenights";

const POPULAR_GAMES = [
  "FIFA", "Call of Duty", "Fortnite", "Rocket League", "NBA 2K",
  "Madden", "Mortal Kombat", "Mario Kart", "Poker Night", "Board Games",
  "Smash Bros", "GTA Online", "Warzone", "Pool / Billiards", "Bowling",
];

export function GameNight() {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [view, setView] = useState<"list" | "add">("list");
  const [form, setForm] = useState<Omit<GameSession, "id" | "status">>({
    game: "FIFA",
    date: "",
    time: "20:00",
    location: "My place",
    notes: "",
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setSessions(JSON.parse(raw));
  }, []);

  const save = (updated: GameSession[]) => {
    setSessions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addSession = () => {
    if (!form.date) return;
    const session: GameSession = {
      id: Date.now().toString(),
      ...form,
      status: "upcoming",
    };
    save([...sessions, session].sort((a, b) => a.date.localeCompare(b.date)));
    setForm({ game: "FIFA", date: "", time: "20:00", location: "My place", notes: "" });
    setView("list");
  };

  const updateStatus = (id: string, status: GameSession["status"]) => {
    save(sessions.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const deleteSession = (id: string) => {
    save(sessions.filter((s) => s.id !== id));
  };

  const statusColor: Record<GameSession["status"], string> = {
    upcoming: "#22c55e",
    done: "var(--muted)",
    cancelled: "#ef4444",
  };

  const statusLabel: Record<GameSession["status"], string> = {
    upcoming: "🟢 Upcoming",
    done: "✅ Done",
    cancelled: "❌ Cancelled",
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
          <h2 className="text-2xl font-bold" style={{ fontFamily: "Fraunces, serif" }}>Schedule Game Night</h2>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { label: "Game / Activity", field: "game", type: "select" },
            { label: "Date", field: "date", type: "date" },
            { label: "Time", field: "time", type: "time" },
            { label: "Location", field: "location", type: "text" },
            { label: "Notes (optional)", field: "notes", type: "text" },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="text-sm font-semibold block mb-1" style={{ color: "var(--muted)" }}>{label}</label>
              {type === "select" ? (
                <select
                  value={(form as any)[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: "var(--panel)", border: "1px solid var(--line)", color: "var(--ink)" }}
                >
                  {POPULAR_GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              ) : (
                <input
                  type={type}
                  value={(form as any)[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: "var(--panel)", border: "1px solid var(--line)", color: "var(--ink)" }}
                />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addSession}
          className="w-full py-3 rounded-xl font-bold text-white mt-6"
          style={{ background: "var(--accent)" }}
        >
          🎮 Schedule It!
        </button>
      </div>
    );
  }

  const upcoming = sessions.filter((s) => s.status === "upcoming");
  const past = sessions.filter((s) => s.status !== "upcoming");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "Fraunces, serif" }}>Game Night</h2>
        <button
          onClick={() => setView("add")}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          + Schedule
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--muted)" }}>
          <div className="text-5xl mb-4">🎮</div>
          <div className="font-semibold">No game nights planned yet!</div>
          <div className="text-sm mt-1">Get the crew together, bro.</div>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <>
              <h3 className="text-sm font-bold mb-3" style={{ color: "var(--muted)" }}>UPCOMING</h3>
              <div className="flex flex-col gap-3 mb-6">
                {upcoming.map((s) => (
                  <div key={s.id} className="rounded-2xl p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-base">🎮 {s.game}</div>
                        <div className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
                          📅 {s.date} at {s.time} · 📍 {s.location}
                        </div>
                        {s.notes && <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>💬 {s.notes}</div>}
                      </div>
                      <button onClick={() => deleteSession(s.id)} className="text-red-400 text-sm">✕</button>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => updateStatus(s.id, "done")}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                        style={{ background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--line)" }}
                      >
                        ✅ Mark Done
                      </button>
                      <button
                        onClick={() => updateStatus(s.id, "cancelled")}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                        style={{ background: "var(--paper)", color: "#ef4444", border: "1px solid var(--line)" }}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {past.length > 0 && (
            <>
              <h3 className="text-sm font-bold mb-3" style={{ color: "var(--muted)" }}>HISTORY</h3>
              <div className="flex flex-col gap-2">
                {past.map((s) => (
                  <div key={s.id} className="rounded-2xl p-3 flex items-center justify-between" style={{ background: "var(--panel)", border: "1px solid var(--line)", opacity: 0.7 }}>
                    <div>
                      <span className="font-semibold text-sm">{s.game}</span>
                      <span className="text-xs ml-2" style={{ color: "var(--muted)" }}>{s.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: statusColor[s.status] }}>
                        {statusLabel[s.status]}
                      </span>
                      <button onClick={() => deleteSession(s.id)} className="text-red-400 text-xs">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
