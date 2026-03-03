import { cn } from "@/lib/utils";

interface GameCellProps {
  value: "X" | "O" | null;
  onClick: () => void;
  size: number;
  disabled?: boolean;
}

const GameCell = ({ value, onClick, size, disabled }: GameCellProps) => {
  const cellText =
    size <= 5
      ? "text-2xl sm:text-4xl"
      : size <= 9
      ? "text-base sm:text-2xl"
      : "text-[clamp(0.6rem,2vw,0.875rem)]";

  return (
    <button
      onClick={onClick}
      disabled={!!value || disabled}
      className={cn(
        "aspect-square glass rounded-md sm:rounded-lg flex items-center justify-center font-black transition-all duration-200 select-none touch-manipulation",
        !value && !disabled && "cursor-pointer hover:border-primary/50 hover:bg-primary/5 active:scale-90 hover:neon-glow-cyan",
        (value || disabled) && "cursor-default"
      )}
    >
      {value && (
        <span
          className={cn(
            "animate-cell-pop leading-none",
            cellText,
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
