import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_INCREMENT = 2;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, highScore]);

  const generateFood = (currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y));
    setFood(newFood);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * size);
        ctx.lineTo(canvas.width, i * size);
        ctx.stroke();
    }

    // Draw food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF00FF';
    ctx.fillStyle = '#FF00FF';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00FFFF';
    ctx.fillStyle = '#00FFFF';
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      if (isHead) {
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#FFFFFF';
      } else {
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#00FFFF';
      }
      
      const padding = 2;
      ctx.fillRect(
        segment.x * size + padding,
        segment.y * size + padding,
        size - padding * 2,
        size - padding * 2
      );
    });

  }, [snake, food]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-[400px] mb-2 px-2 font-pixel">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-[#ff00ff]">SCORE</span>
          <span className="text-xl text-[#00ffff] glitch-text" data-text={score}>{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-[#ff00ff]">BEST</span>
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-[#ffff00]" />
            <span className="text-xl text-[#00ffff]">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black border-4 border-[#00ffff] shadow-[4px_4px_0px_#ff00ff]"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-none rounded-none"
            >
              <div className="text-center p-8 terminal-box">
                {isGameOver ? (
                  <>
                    <h2 className="text-2xl font-pixel mb-4 text-[#ff00ff] glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                    <p className="font-mono text-[#00ffff] mb-6">RECOVERY_DATA: {score}</p>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 mx-auto px-6 py-3 bg-[#ff00ff] text-black font-pixel text-xs hover:translate-x-1 hover:-translate-y-1 active:translate-0 transition-transform shadow-[4px_4px_0px_#00ffff]"
                    >
                      <RefreshCw size={16} />
                      REBOOT
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-pixel mb-4 text-[#00ffff] glitch-text" data-text="SYSTEM_HALT">SYSTEM_HALT</h2>
                    <p className="font-mono text-[#ff00ff] mb-6 animate-pulse">AWAITING_COMMAND...</p>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="flex items-center gap-2 mx-auto px-6 py-3 bg-[#00ffff] text-black font-pixel text-xs hover:translate-x-1 hover:-translate-y-1 active:translate-0 transition-transform shadow-[4px_4px_0px_#ff00ff]"
                    >
                      <Play size={16} fill="currentColor" />
                      RESUME
                    </button>
                    <button
                        onClick={resetGame}
                        className="mt-6 block mx-auto text-[10px] font-pixel text-[#ff00ff] hover:underline"
                    >
                        INIT_RESTART
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[10px] font-pixel text-[#00ffff]/40 uppercase tracking-tight">
        INPUT: [ARROWS] NAVIGATE / [SPACE] HALT
      </div>
    </div>
  );
}
