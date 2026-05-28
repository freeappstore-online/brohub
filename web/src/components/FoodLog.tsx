import { useState, useEffect } from "react";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  emoji: string;
  time: string;
  date: string;
}

const STORAGE_KEY = "brohub_food";

const BRO_FOODS = [
  { name: "Chicken & Rice", calories: 550, emoji: "🍚" },
  { name: "Protein Shake", calories: 200, emoji: "🥛" },
  { name: "Eggs (3)", calories: 210, emoji: "🥚" },
  { name: "Buffalo Wings", calories: 700, emoji: "🍗" },
  { name: "Pizza (2 slices)", calories: 600, emoji: "🍕" },
  { name: "Burger", calories: 800, emoji: "🍔" },
  { name: "Steak", calories: 650, emoji: "🥩" },
  { name: "Tacos (3)", calories: 500, emoji: "🌮" },
  { name: "Protein Bar", calories: 220, emoji: "🍫" },
  { name: "Oats", calories: 350, emoji: "🥣" },
  { name: "Sushi", calories: 450, emoji: "🍣" },
  { name: "Ramen", calories: 600, emoji: "🍜" },
  { name: "Salad", calories: 200, emoji: "🥗" },
  { name: "Sandwich", calories: 450, emoji: "🥪" },
  { name: "Beer 🍺", calories: 150, emoji: "🍺" },
];

const GOAL = 2500;

export function FoodLog() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [selectedFood, setSelectedFood] = useState(BRO_FOODS[0]);
  const [customName, setCustomName] = useState("");
  const [customCals, setCustomCals] = useState("");
  const [mode, setMode] = useState<"preset" | "custom">("preset");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setEntries(JSON.parse(raw));
  }, []);

  const save = (updated: FoodEntry[]) => {
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const today = new Date().toLocaleDateString("en-CA");

  const addEntry = () => {
    let entry: FoodEntry;
    if (mode === "preset") {
      entry = {
        id: Date.now().toString(),
        name: selectedFood.name,
        calories: selectedFood.calories,
        emoji: selectedFood.emoji,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        date: today,
      };
    } else {
      if (!customName.trim() || !customCals) return;
      entry = {
        id: Date.now().toString(),
        name: customName,
        calories: Number(customCals),
        emoji: "🍽️",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        date: today,
      };
      setCustomName("");
      setCustomCals("");
    }
    save([entry, ...entries]);
  };

  const deleteEntry = (id: string) => {
    save(entries.filter((e) => e.id !== id));
  };

  const todayEntries = entries.filter((e) => e.date === today);
  const todayCalories = todayEntries.reduce((a, e) => a + e.calories, 0);
  const progress = Math.min((todayCalories / GOAL) * 100, 100);

  const progressColor =
    todayCalories < GOAL * 0.6
      ? "#ef4444"
      : todayCalories < GOAL
      ? "#f59e0b"
      : "#22c55e";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Fraunces, serif" }}>Food Log</h2>

      {/* Calorie Ring */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-sm">Today's Calories</span>
          <span className="font-bold text-sm" style={{ color: progressColor }}>
            {todayCalories} / {GOAL} kcal
          </span>
        </div>
        <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: "var(--paper)" }}>
          <div
            className="h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: progressColor }}
          />
        </div>
        <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>
          {todayCalories >= GOAL
            ? "🎉 Goal reached! You're fueled, bro!"
            : `${GOAL - todayCalories} kcal left to hit your goal`}
        </div>
      </div>

      {/* Add Food */}
      <div className="rounded-2xl p-4 mb-5" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setMode("preset")}
            className="flex-1 py-2 rounded-xl text-sm font-bold"
            style={{
              background: mode === "preset" ? "var(--accent)" : "var(--paper)",
              color: mode === "preset" ? "#fff" : "var(--ink)",
            }}
          >
            🍗 Quick Add
          </button>
          <button
            onClick={() => setMode("custom")}
            className="flex-1 py-2 rounded-xl text-sm font-bold"
            style={{
              background: mode === "custom" ? "var(--accent)" : "var(--paper)",
              color: mode === "custom" ? "#fff" : "var(--ink)",
            }}
          >
            ✏️ Custom
          </button>
        </div>

        {mode === "preset" ? (
          <div className="flex gap-2">
            <select
              value={selectedFood.name}
              onChange={(e) => {
                const f = BRO_FOODS.find((f) => f.name === e.target.value)!;
                setSelectedFood(f);
              }}
              className="flex-1 px-3 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)" }}
            >
              {BRO_FOODS.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.emoji} {f.name} ({f.calories} kcal)
                </option>
              ))}
            </select>
            <button
              onClick={addEntry}
              className="px-4 py-2 rounded-xl font-bold text-white text-sm"
              style={{ background: "var(--accent)" }}
            >
              + Add
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              placeholder="Food name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl text-sm"
              style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)" }}
            />
            <input
              type="number"
              placeholder="kcal"
              value={customCals}
              onChange={(e) => setCustomCals(e.target.value)}
              className="w-20 px-3 py-2 rounded-xl text-sm text-center"
              style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)" }}
            />
            <button
              onClick={addEntry}
              className="px-4 py-2 rounded-xl font-bold text-white text-sm"
              style={{ background: "var(--accent)" }}
            >
              + Add
            </button>
          </div>
        )}
      </div>

      {/* Today's log */}
      <h3 className="text-sm font-bold mb-3" style={{ color: "var(--muted)" }}>TODAY'S LOG</h3>
      {todayEntries.length === 0 ? (
        <div className="text-center py-10" style={{ color: "var(--muted)" }}>
          <div className="text-4xl mb-3">🍽️</div>
          <div className="text-sm font-semibold">Nothing logged yet. Eat something, bro!</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {todayEntries.map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
            >
              <span className="text-2xl">{e.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-sm">{e.name}</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{e.time}</div>
              </div>
              <div className="font-bold text-sm" style={{ color: "var(--accent)" }}>{e.calories} kcal</div>
              <button onClick={() => deleteEntry(e.id)} className="text-red-400 text-sm ml-1">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
