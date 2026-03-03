import { cn } from "@/lib/utils";

interface GameCellProps {
  value: "X" | "O" | null;
  onClick: () => void;
  size: number;
}

const GameCell = ({ value, onClick, size }: GameCellProps) => {
  const cellSize = size <= 5 ? "text-3xl sm:text-4xl" : size <= 9 ? "text-xl sm:text-2xl" : "text-sm sm:text-base";

  return (
    <button
      onClick={onClick}
      className={cn(
        "aspect-square glass rounded-lg flex items-center justify-center font-black transition-all duration-200",
        "hover:border-primary/50 hover:bg-primary/5 active:scale-90",
        !value && "cursor-pointer hover:neon-glow-cyan",
        value && "cursor-default"
      )}
    >
      {value && (
        <span
          className={cn(
            "animate-cell-pop",
            cellSize,
            value === "X" ? "text-primary" : "text-accent"
          )}
          style={{
            textShadow:
              value === "X"
                ? "0 0 20px hsl(var(--neon-cyan) / 0.6)"
                : "0 0 20px hsl(var(--neon-purple) / 0.6)",
          }}
        >
          {value}
        </span>
      )}
    </button>
  );
};

export default GameCell;
