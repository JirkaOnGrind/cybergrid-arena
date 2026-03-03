import { cn } from "@/lib/utils";
import React from "react";

interface GameCellProps {
  value: "X" | "O" | null;
  index: number;
  onClick: (index: number) => void;
  size: number;
  isLastMove?: boolean;
  disabled?: boolean;
}

const GameCell = React.memo(({ value, index, onClick, size, isLastMove, disabled }: GameCellProps) => {
  const cellSize = size <= 5 ? "text-3xl sm:text-4xl" : size <= 9 ? "text-xl sm:text-2xl" : "text-sm sm:text-base";

  // Vypnutí náročných efektů pro hrací plochy 15x15 (a větší než 9x9)
  const isLargeGrid = size > 9;
  
  // Třída "glass" obsahuje CSS filtr "backdrop-filter: blur()". 
  // Počítat toto rozostření 225x při každém pohnutí myši extrémně zatěžuje GPU.
  // Proto na velkých polích použijeme jen jednoduchý poloprůhledný podklad.
  const baseBg = isLargeGrid ? "bg-white/5 border border-white/10" : "glass";

  // Zjistíme, zda je pole klikatelné (hra neskončila a pole je prázdné)
  const isInteractive = !disabled && !value;

  return (
    <button
      onClick={() => onClick(index)}
      disabled={!isInteractive}
      className={cn(
        "aspect-square rounded-lg flex items-center justify-center font-black transition-all",
        isLargeGrid ? "duration-75" : "duration-200", // Zkrácení animace u velkých polí
        baseBg,
        isInteractive && `cursor-pointer hover:border-primary/50 hover:bg-primary/10 active:scale-95 ${!isLargeGrid && "hover:neon-glow-cyan"}`,
        !isInteractive && "cursor-default",
        isLastMove && "ring-2 ring-yellow-400 bg-yellow-400/10"
      )}
    >
      {value && (
        <span
          className={cn(
            "animate-cell-pop",
            cellSize,
            value === "X" ? "text-primary" : "text-accent",
            isLastMove && "text-yellow-400"
          )}
          style={{
            // Na velkém poli vypínáme svítící stíny písma, které se překreslují s každým pohybem
            textShadow: isLargeGrid ? "none" : (
              isLastMove ? "0 0 20px rgba(250,204,21,0.8)" : 
              value === "X" ? "0 0 20px hsl(var(--neon-cyan) / 0.6)" : "0 0 20px hsl(var(--neon-purple) / 0.6)"
            ),
          }}
        >
          {value}
        </span>
      )}
    </button>
  );
});

GameCell.displayName = "GameCell";
export default GameCell;