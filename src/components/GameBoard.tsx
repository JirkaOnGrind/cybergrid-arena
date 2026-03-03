import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, RotateCcw, Bot, Loader2 } from "lucide-react";
import GameCell from "./GameCell";

interface GameBoardProps {
  size: number;
  startsFirst: "player" | "robot";
  onBack: () => void;
}

const GameBoard = ({ size, startsFirst, onBack }: GameBoardProps) => {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(size * size).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [robotThinking, setRobotThinking] = useState(false);

  // Player is always X, Robot is always O
  const isRobotTurn = startsFirst === "robot" ? isXTurn : !isXTurn;
  // If robot starts, X = robot; if player starts, X = player
  const playerMark = startsFirst === "player" ? "X" : "O";
  const robotMark = startsFirst === "player" ? "O" : "X";

  // Simulate robot "thinking" on robot's turn
  useEffect(() => {
    if (!isRobotTurn) return;
    const emptyIndices = board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
    if (emptyIndices.length === 0) return;

    setRobotThinking(true);
    const delay = setTimeout(() => {
      // Random move for now — replace with AI later
      const pick = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      handleCellClick(pick, true);
      setRobotThinking(false);
    }, 600);
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isXTurn, board]);

  const handleCellClick = (index: number, fromRobot = false) => {
    if (board[index]) return;
    if (!fromRobot && isRobotTurn) return; // block player clicks during robot turn
    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  const handleReset = () => {
    setBoard(Array(size * size).fill(null));
    setIsXTurn(true);
    setRobotThinking(false);
  };

  // Responsive cell sizing: calculate max board width to fit viewport
  const cellSizePx = useMemo(() => {
    // On mobile, use ~95vw; on desktop cap at reasonable max
    const gapPx = size <= 5 ? 8 : 4;
    const totalGap = (size - 1) * gapPx;
    // We'll use CSS clamp for responsiveness, but provide a base
    return undefined; // handled via CSS
  }, [size]);

  const maxBoardPx = size <= 5 ? "max-w-md" : size <= 9 ? "max-w-xl" : "max-w-3xl";
  const gap = size <= 5 ? "gap-2" : "gap-1";

  const currentMark = isXTurn ? (startsFirst === "player" ? "X (You)" : "X (Robot)") : (startsFirst === "player" ? "O (Robot)" : "O (You)");
  const currentColor = isXTurn ? "hsl(var(--neon-cyan))" : "hsl(var(--neon-purple))";
  const currentGlow = isXTurn
    ? "0 0 12px hsl(var(--neon-cyan) / 0.5)"
    : "0 0 12px hsl(var(--neon-purple) / 0.5)";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 py-8">
      <div className="animate-slide-up w-full flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4 sm:mb-6 px-1" style={{ maxWidth: "48rem" }}>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Back</span>
          </button>

          <div className="glass rounded-full px-4 sm:px-5 py-2 flex items-center gap-2 sm:gap-3 neon-glow-cyan">
            {robotThinking ? (
              <>
                <Bot className="w-4 h-4 text-accent animate-pulse" />
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
                <span className="text-sm font-semibold text-accent">Thinking…</span>
              </>
            ) : (
              <>
                <span className="text-xs sm:text-sm text-muted-foreground">Turn:</span>
                <span
                  className="font-black text-base sm:text-lg"
                  style={{ color: currentColor, textShadow: currentGlow }}
                >
                  {isXTurn ? "X" : "O"}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {isRobotTurn ? "(Robot)" : "(You)"}
                </span>
              </>
            )}
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Board — responsive with viewport-based sizing */}
        <div
          className="w-full"
          style={{
            maxWidth: size <= 5 ? "28rem" : size <= 9 ? "36rem" : "min(48rem, 95vw)",
          }}
        >
          <div
            className={`grid ${gap}`}
            style={{
              gridTemplateColumns: `repeat(${size}, 1fr)`,
            }}
          >
            {board.map((cell, i) => (
              <GameCell
                key={i}
                value={cell}
                onClick={() => handleCellClick(i)}
                size={size}
                disabled={robotThinking || isRobotTurn}
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 sm:mt-6">
          {size}×{size} Grid — {size * size} cells
        </p>
      </div>
    </div>
  );
};

export default GameBoard;
