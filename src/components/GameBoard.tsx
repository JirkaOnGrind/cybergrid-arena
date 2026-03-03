import { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import GameCell from "./GameCell";

interface GameBoardProps {
  size: number;
  onBack: () => void;
}

const GameBoard = ({ size, onBack }: GameBoardProps) => {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(size * size).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);

  const handleCellClick = (index: number) => {
    if (board[index]) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  const handleReset = () => {
    setBoard(Array(size * size).fill(null));
    setIsXTurn(true);
  };

  const maxBoardPx = size <= 5 ? "max-w-md" : size <= 9 ? "max-w-xl" : "max-w-3xl";
  const gap = size <= 5 ? "gap-2" : "gap-1";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="animate-slide-up w-full flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6" style={{ maxWidth: "48rem" }}>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <div className="glass rounded-full px-5 py-2 flex items-center gap-3 neon-glow-cyan">
            <span className="text-sm text-muted-foreground">Turn:</span>
            <span
              className="font-black text-lg"
              style={{
                color: isXTurn ? "hsl(var(--neon-cyan))" : "hsl(var(--neon-purple))",
                textShadow: isXTurn
                  ? "0 0 12px hsl(var(--neon-cyan) / 0.5)"
                  : "0 0 12px hsl(var(--neon-purple) / 0.5)",
              }}
            >
              {isXTurn ? "X" : "O"}
            </span>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Reset</span>
          </button>
        </div>

        {/* Board */}
        <div className={`w-full ${maxBoardPx}`}>
          <div
            className={`grid ${gap}`}
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          >
            {board.map((cell, i) => (
              <GameCell
                key={i}
                value={cell}
                onClick={() => handleCellClick(i)}
                size={size}
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          {size}×{size} Grid — {size * size} cells
        </p>
      </div>
    </div>
  );
};

export default GameBoard;
