import { useState, useEffect } from "react";

interface Set {
  reps: number;
  weight: number;
}

interface Exercise {
  name: string;
  sets: Set[];
}

interface WorkoutSession {
  id: string;
  date: string;
  label: string;
  exercises: Exercise[];
}

const STORAGE_KEY = "brohub_workouts";

const PRESET_EXERCISES = [
  "Bench Press", "Squat", "Deadlift", "Pull-ups", "Shoulder Press",
  "Bicep Curls", "Tricep Dips", "Rows", "Leg Press", "Plank",
];

export function WorkoutTracker() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("Chest Day 💪");
  const [exercises, setExercises] = useState<Exercise[]>([{ name: "Bench Press", sets: [{ reps: 10, weight: 60 }] }]);
  const [view, setView] = useState<"list" | "add">("list");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setSessions(JSON.parse(raw));
  }, []);

  const save = (updated: WorkoutSession[]) => {
    setSessions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addExercise = () => {
    setExercises([...exercises, { name: "Squat", sets: [{ reps: 10, weight: 80 }] }]);
  };

  const addSet = (ei: number) => {
    const updated = exercises.map((ex, i) =>
      i === ei ? { ...ex, sets: [...ex.sets, { reps: 10, weight: 0 }] } : ex
    );
    setExercises(updated);
  };

  const updateSet = (ei: number, si: number, field: "reps" | "weight", val: number) => {
    const updated = exercises.map((ex, i) =>
      i === ei
        ? { ...ex, sets: ex.sets.map((s, j) => (j === si ? { ...s, [field]: val } : s)) }
        : ex
    );
    setExercises(updated);
  };

  const updateExerciseName = (ei: number, name: string) => {
    setExercises(exercises.map((ex, i) => (i === ei ? { ...ex, name } : ex)));
  };

  const removeExercise = (ei: number) => {
    setExercises(exercises.filter((_, i) => i !== ei));
  };

  const logWorkout = () => {
    if (!label.trim() || exercises.length === 0) return;
    const session: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      label,
      exercises,
    };
    save([session, ...sessions]);
    setLabel("Chest Day 💪");
    setExercises([{ name: "Bench Press", sets: [{ reps: 10, weight: 60 }] }]);
    setView("list");
  };

  const deleteSession = (id: string) => {
    save(sessions.filter((s) => s.id !== id));
  };

  const totalSets = sessions.reduce((a, s) => a + s.exercises.reduce((b, e) => b + e.sets.length, 0), 0);
  const totalVolume = sessions.reduce(
    (a, s) => a + s.exercises.reduce((b, e) => b + e.sets.reduce((c, set) => c + set.reps * set.weight, 0), 0),
    0
  );

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
          <h2 className="text-2xl font-bold" style={{ fontFamily: "Fraunces, serif" }}>Log Workout</h2>
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold block mb-1" style={{ color: "var(--muted)" }}>Session Name</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "var(--panel)", border: "1px solid var(--line)", color: "var(--ink)" }}
          />
        </div>

        <div className="flex flex-col gap-4 mb-4">
          {exercises.map((ex, ei) => (
            <div key={ei} className="rounded-2xl p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
              <div className="flex items-center gap-2 mb-3">
                <select
                  value={ex.name}
                  onChange={(e) => updateExerciseName(ei, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)" }}
                >
                  {PRESET_EXERCISES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <button onClick={() => removeExercise(ei)} className="text-red-400 text-lg px-2">✕</button>
              </div>
              <div className="flex gap-2 text-xs font-bold mb-2" style={{ color: "var(--muted)" }}>
                <span className="w-8">#</span>
                <span className="flex-1">Reps</span>
                <span className="flex-1">kg</span>
              </div>
              {ex.sets.map((s, si) => (
                <div key={si} className="flex gap-2 items-center mb-1">
                  <span className="w-8 text-xs font-bold" style={{ color: "var(--muted)" }}>{si + 1}</span>
                  <input
                    type="number"
                    value={s.reps}
                    onChange={(e) => updateSet(ei, si, "reps", Number(e.target.value))}
                    className="flex-1 px-3 py-1.5 rounded-xl text-sm text-center"
                    style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)" }}
                  />
                  <input
                    type="number"
                    value={s.weight}
                    onChange={(e) => updateSet(ei, si, "weight", Number(e.target.value))}
                    className="flex-1 px-3 py-1.5 rounded-xl text-sm text-center"
                    style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)" }}
                  />
                </div>
              ))}
              <button
                onClick={() => addSet(ei)}
                className="text-xs font-semibold mt-2"
                style={{ color: "var(--accent)" }}
              >
                + Add Set
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addExercise}
          className="w-full py-2 rounded-xl text-sm font-semibold mb-4"
          style={{ border: "2px dashed var(--line)", color: "var(--muted)" }}
        >
          + Add Exercise
        </button>

        <button
          onClick={logWorkout}
          className="w-full py-3 rounded-xl font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          💪 Log Workout
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "Fraunces, serif" }}>Workout Tracker</h2>
        <button
          onClick={() => setView("add")}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          + Log Workout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Sessions", value: sessions.length, icon: "📅" },
          { label: "Total Sets", value: totalSets, icon: "🔢" },
          { label: "Volume (kg)", value: totalVolume.toLocaleString(), icon: "⚖️" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--muted)" }}>
          <div className="text-5xl mb-4">🏋️</div>
          <div className="font-semibold">No workouts logged yet, bro!</div>
          <div className="text-sm mt-1">Hit that + button and get to work.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((s) => (
            <div key={s.id} className="rounded-2xl p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-base">{s.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.date}</div>
                </div>
                <button onClick={() => deleteSession(s.id)} className="text-red-400 text-sm">✕</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {s.exercises.map((ex, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2 py-1 rounded-lg"
                    style={{ background: "var(--paper)", color: "var(--ink)" }}
                  >
                    {ex.name} × {ex.sets.length}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
