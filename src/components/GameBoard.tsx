import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import GameCell from "./GameCell";
import { initEngine, playEngine, playRobotEngine, checkWinEngine } from "@/lib/engine";

interface GameBoardProps {
  size: number;
  robotStarts?: boolean;
  onBack: () => void;
}

const GameBoard = ({ size, robotStarts = false, onBack }: GameBoardProps) => {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(size * size).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [lastMove, setLastMove] = useState<number | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const makeRobotMove = (currentBoard: (null | "X" | "O")[]) => {
    setIsThinking(true);
    setStatus("Robot přemýšlí...");

    setTimeout(() => {
      const robotMoveIndex = playRobotEngine(1);
      if (robotMoveIndex !== -1) {
        currentBoard[robotMoveIndex] = "O";
        setBoard([...currentBoard]);
        setLastMove(robotMoveIndex);

        const winStatRobot = checkWinEngine();
        if (winStatRobot === "O") {
          setStatus("Vyhrál Robot O!");
          setGameOver(true);
        } else if (winStatRobot === "tie") {
          setStatus("Remíza!");
          setGameOver(true);
        } else {
          setStatus("");
        }
      }
      setIsThinking(false);
    }, 100);
  };

  const handleReset = () => {
    initEngine(size);
    const emptyBoard = Array(size * size).fill(null);
    setBoard(emptyBoard);
    setGameOver(false);
    setLastMove(null);

    if (robotStarts) {
      makeRobotMove(emptyBoard);
    } else {
      setStatus("");
      setIsThinking(false);
    }
  };

  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, robotStarts]);

  const handleCellClick = (index: number) => {
    if (gameOver || isThinking || board[index] !== null) return;

    const valid = playEngine(0, index);
    if (valid) {
      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);
      setLastMove(index);

      const winStat = checkWinEngine();
      if (winStat === "X") {
        setStatus("Vyhrál hráč X!");
        setGameOver(true);
        return;
      } else if (winStat === "tie") {
        setStatus("Remíza!");
        setGameOver(true);
        return;
      }

      makeRobotMove(newBoard);
    }
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
            <span className="text-sm">Zpět</span>
          </button>

          <div className="glass rounded-full px-5 py-2 flex flex-col items-center gap-1 neon-glow-cyan text-center">
            <span className="text-sm font-semibold tracking-wide" style={{ color: "hsl(var(--foreground))" }}>
              {gameOver ? status : (isThinking ? status : "Tvůj tah (X)")}
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
                index={i}
                value={cell}
                onClick={handleCellClick}
                size={size}
                isLastMove={lastMove === i}
                disabled={gameOver}
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          {size}×{size} Mřížka — {size * size} políček
        </p>
      </div>
    </div>
  );
};

export default GameBoard;