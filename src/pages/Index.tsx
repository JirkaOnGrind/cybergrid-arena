import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import GridSelector from "@/components/GridSelector";
import GameBoard from "@/components/GameBoard";

type Screen = "hero" | "select" | "play";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("hero");
  const [gridSize, setGridSize] = useState(3);
  const [startsFirst, setStartsFirst] = useState<"player" | "robot">("player");

  const handleSelectGrid = (size: number, starter: "player" | "robot") => {
    setGridSize(size);
    setStartsFirst(starter);
    setScreen("play");
  };

  return (
    <div className="min-h-screen bg-background">
      {screen === "hero" && <HeroSection onStart={() => setScreen("select")} />}
      {screen === "select" && (
        <GridSelector onSelect={handleSelectGrid} onBack={() => setScreen("hero")} />
      )}
      {screen === "play" && (
        <GameBoard size={gridSize} startsFirst={startsFirst} onBack={() => setScreen("select")} />
      )}
    </div>
  );
};

export default Index;
