import { useEffect, useState } from "react";

const BRO_QUOTES = [
  "The iron never lies to you. — Henry Rollins",
  "Bro code: always spot your bro. 🏋️",
  "Champions aren't made in gyms. — Muhammad Ali",
  "Game night is sacred. Protect it. 🎮",
  "Eat. Sleep. Lift. Repeat. 💪",
  "No bro left behind. 🤜🤛",
  "Pain is temporary. Gains are forever. 💪",
  "The only bad workout is the one that didn't happen.",
];

export function BroDashboard() {
  const [workouts, setWorkouts] = useState(0);
  const [challenges, setChallenges] = useState({ active: 0, completed: 0 });
  const [gameNights, setGameNights] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [quote] = useState(BRO_QUOTES[Math.floor(Math.random() * BRO_QUOTES.length)]);
  const [hour] = useState(new Date().getHours());

  useEffect(() => {
    const w = localStorage.getItem("brohub_workouts");
    if (w) setWorkouts(JSON.parse(w).length);

    const c = localStorage.getItem("brohub_challenges");
    if (c) {
      const arr = JSON.parse(c);
      setChallenges({
        active: arr.filter((x: any) => x.status === "active").length,
        completed: arr.filter((x: any) => x.status === "completed").length,
      });
    }

    const g = localStorage.getItem("brohub_gamenights");
    if (g) setGameNights(JSON.parse(g).filter((x: any) => x.status === "upcoming").length);

    const f = localStorage.getItem("brohub_food");
    if (f) {
      const today = new Date().toLocaleDateString("en-CA");
      const todayEntries = JSON.parse(f).filter((x: any) => x.date === today);
      setTodayCalories(todayEntries.reduce((a: number, e: any) => a + e.calories, 0));
    }
  }, []);

  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "What's good" : "Evening";

  return (
    <div>
      {/* Hero */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)",
          color: "#fff",
        }}
      >
        <div className="text-3xl font-bold mb-1" style={{ fontFamily: "Fraunces, serif" }}>
          {greeting}, Bro! 🤜
        </div>
        <div className="text-sm opacity-80 mt-2 italic">"{quote}"</div>
      </div>

      {/* Stats Grid */}
      <h3 className="text-sm font-bold mb-3" style={{ color: "var(--muted)" }}>YOUR BRO STATS</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: "🏋️", label: "Workouts Logged", value: workouts, color: "#3b82f6" },
          { icon: "🔥", label: "Active Challenges", value: challenges.active, color: "#f59e0b" },
          { icon: "✅", label: "Challenges Won", value: challenges.completed, color: "#22c55e" },
          { icon: "🎮", label: "Game Nights Planned", value: gameNights, color: "#8b5cf6" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Calories today */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold">🍽️ Today's Fuel</div>
            <div className="text-2xl font-bold mt-1" style={{ color: "var(--accent)" }}>
              {todayCalories} <span className="text-sm font-normal" style={{ color: "var(--muted)" }}>kcal</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: "var(--muted)" }}>Goal: 2,500 kcal</div>
            <div
              className="text-sm font-bold mt-1"
              style={{ color: todayCalories >= 2500 ? "#22c55e" : "#f59e0b" }}
            >
              {todayCalories >= 2500 ? "✅ Goal Hit!" : `${2500 - todayCalories} left`}
            </div>
          </div>
        </div>
        <div className="w-full h-3 rounded-full mt-3 overflow-hidden" style={{ background: "var(--paper)" }}>
          <div
            className="h-3 rounded-full transition-all"
            style={{
              width: `${Math.min((todayCalories / 2500) * 100, 100)}%`,
              background: todayCalories >= 2500 ? "#22c55e" : "var(--accent)",
            }}
          />
        </div>
      </div>

      {/* Bro Code */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
      >
        <div className="text-sm font-bold mb-3">📜 The Bro Code</div>
        {[
          "Always spot your bro at the gym 🏋️",
          "Game night is non-negotiable 🎮",
          "Never skip leg day 🦵",
          "Hype your bro's wins 🏆",
          "Bros before… everything 🤜🤛",
        ].map((rule, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 text-sm"
            style={{ borderBottom: i < 4 ? "1px solid var(--line)" : "none" }}
          >
            <span className="font-bold" style={{ color: "var(--accent)" }}>{i + 1}.</span>
            <span>{rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
