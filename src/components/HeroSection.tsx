import { Bot, Zap, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onStart: () => void;
}

const HeroSection = ({ onStart }: HeroSectionProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--neon-cyan) / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--neon-cyan) / 0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          animation: "grid-pulse 4s ease-in-out infinite",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 max-w-3xl text-center animate-slide-up">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 neon-glow-cyan">
          <Bot className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Engine</span>
          <Zap className="w-3 h-3 text-primary" />
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
          <span className="text-gradient">The World's Most</span>
          <br />
          <span className="text-foreground">Intelligent TicTacToe</span>
          <br />
          <span className="text-gradient">Robot</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Challenge an unbeatable neural network across multiple grid sizes.
          From classic 3×3 to mind-bending 15×15 — do you have what it takes?
        </p>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 glass rounded-full px-8 py-4 text-lg font-bold text-primary
            hover:bg-primary/10 transition-all duration-300 neon-glow-cyan hover:scale-105 active:scale-95"
        >
          <span>Enter the Arena</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Floating decorative elements */}
        <div className="absolute -top-20 -left-10 w-2 h-2 rounded-full bg-primary animate-float opacity-60" />
        <div className="absolute -bottom-10 -right-20 w-3 h-3 rounded-full bg-accent animate-float opacity-40" style={{ animationDelay: "1s" }} />
      </div>
    </div>
  );
};

export default HeroSection;
