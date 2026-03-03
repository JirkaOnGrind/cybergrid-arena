import { Grid3X3, ArrowLeft, Bot, User } from "lucide-react";
import { useState } from "react";

interface GridSelectorProps {
  onSelect: (size: number, startsFirst: "player" | "robot") => void;
  onBack: () => void;
}

const gridOptions = [
  { size: 3, label: "3 × 3", desc: "Classic", difficulty: "Beginner" },
  { size: 5, label: "5 × 5", desc: "Extended", difficulty: "Intermediate" },
  { size: 9, label: "9 × 9", desc: "Advanced", difficulty: "Hard" },
  { size: 15, label: "15 × 15", desc: "Extreme", difficulty: "Nightmare" },
];

const GridSelector = ({ onSelect, onBack }: GridSelectorProps) => {
  const [startsFirst, setStartsFirst] = useState<"player" | "robot">("player");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="animate-slide-up w-full max-w-3xl">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <h2 className="text-4xl sm:text-5xl font-black mb-3 text-gradient">
          Choose Your Arena
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Select a grid size to begin your challenge.
        </p>

        {/* Who starts first — segmented control */}
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-3 font-medium tracking-wide uppercase">Who goes first?</p>
          <div className="glass rounded-full p-1 inline-flex gap-1">
            <button
              onClick={() => setStartsFirst("player")}
              className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300
                ${startsFirst === "player"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <User className="w-4 h-4" />
              <span>Player</span>
            </button>
            <button
              onClick={() => setStartsFirst("robot")}
              className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300
                ${startsFirst === "robot"
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Bot className="w-4 h-4" />
              <span>Robot</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {gridOptions.map((opt, i) => (
            <button
              key={opt.size}
              onClick={() => onSelect(opt.size, startsFirst)}
              className="group glass rounded-xl p-6 text-left transition-all duration-300
                hover:border-primary/40 hover:bg-primary/5 hover:scale-105 active:scale-95
                neon-glow-cyan"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Grid3X3 className="w-8 h-8 text-primary mb-4 transition-transform group-hover:rotate-12" />
              <div className="text-2xl font-black text-foreground mb-1">{opt.label}</div>
              <div className="text-sm text-muted-foreground">{opt.desc}</div>
              <div className="mt-3 inline-block text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                {opt.difficulty}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridSelector;
