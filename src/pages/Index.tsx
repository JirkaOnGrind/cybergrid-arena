import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import GridSelector from "@/components/GridSelector";
import GameBoard from "@/components/GameBoard";

type Screen = "hero" | "select" | "play";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("hero");
  const [gridSize, setGridSize] = useState(3);
  const [robotStarts, setRobotStarts] = useState(false);

  // Zde přijímáme tvé textové hodnoty "player" nebo "robot"
  const handleSelectGrid = (size: number, startsFirst: "player" | "robot") => {
    setGridSize(size);
    // Pokud je startsFirst "robot", nastavíme robotStarts na true
    setRobotStarts(startsFirst === "robot");
    setScreen("play");
  };

  return (
    <div className="min-h-screen bg-background">
      {screen === "hero" && <HeroSection onStart={() => setScreen("select")} />}
      {screen === "select" && (
        <GridSelector onSelect={handleSelectGrid} onBack={() => setScreen("hero")} />
      )}
      {screen === "play" && (
        <GameBoard 
          size={gridSize} 
          robotStarts={robotStarts} 
          onBack={() => setScreen("select")} 
        />
      )}
    </div>
  );
};

export default Index;