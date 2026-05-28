import { useState } from "react";
import { Shell } from "./components/Shell";
import { BroDashboard } from "./components/BroDashboard";
import { WorkoutTracker } from "./components/WorkoutTracker";
import { GameNight } from "./components/GameNight";
import { BroChallenges } from "./components/BroChallenges";
import { FoodLog } from "./components/FoodLog";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "workout", label: "Workout", icon: "🏋️" },
  { id: "food", label: "Food", icon: "🍗" },
  { id: "gamenight", label: "Game Night", icon: "🎮" },
  { id: "challenges", label: "Challenges", icon: "🏆" },
];

export default function App() {
  const [active, setActive] = useState("dashboard");

  const renderPage = () => {
    switch (active) {
      case "dashboard":   return <BroDashboard />;
      case "workout":     return <WorkoutTracker />;
      case "food":        return <FoodLog />;
      case "gamenight":   return <GameNight />;
      case "challenges":  return <BroChallenges />;
      default:            return <BroDashboard />;
    }
  };

  return (
    <Shell nav={NAV} active={active} onNav={setActive}>
      {renderPage()}
    </Shell>
  );
}
