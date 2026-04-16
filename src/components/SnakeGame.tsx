import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Point>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setNextDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setNextDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setNextDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setNextDirection({ x: 1, y: 0 }); break;
        case ' ': setIsPaused(prev => !prev); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;
    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + nextDirection.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + nextDirection.y + GRID_SIZE) % GRID_SIZE,
        };
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }
        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          setSpeed(prev => Math.max(prev - 2, 60));
        } else {
          newSnake.pop();
        }
        setDirection(nextDirection);
        return newSnake;
      });
    };
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [gameOver, isPaused, nextDirection, food, speed, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cellSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food (Magenta Glitch Square)
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4);
    ctx.strokeStyle = '#00ffff';
    ctx.strokeRect(food.x * cellSize + 1, food.y * cellSize + 1, cellSize - 2, cellSize - 2);

    // Snake (Cyan Pixelated)
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#00aaaa';
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
      if (isHead) {
        ctx.fillStyle = '#000';
        ctx.fillRect(segment.x * cellSize + 4, segment.y * cellSize + 4, 2, 2);
        ctx.fillRect(segment.x * cellSize + cellSize - 6, segment.y * cellSize + 4, 2, 2);
      }
    });
  }, [snake, food]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-black border-2 border-cyan shadow-[8px_8px_0_#ff00ff]">
      <div className="flex justify-between w-full items-center border-b border-cyan/30 pb-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-magenta tracking-widest">SCORE_VAL</span>
          <span className="text-4xl font-black text-cyan leading-none">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-cyan tracking-widest">RECORD_HIGH</span>
          <span className="text-2xl font-black text-magenta leading-none">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black border border-cyan/50"
        />
        
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm transition-all duration-300">
            {gameOver ? (
              <>
                <h2 className="text-5xl font-black text-magenta mb-2 glitch-text" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
                <p className="text-cyan mb-8 text-sm tracking-widest">SCORE_RETAINED: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-8 py-2 bg-cyan text-black font-black uppercase hover:bg-magenta hover:text-white transition-colors border-b-4 border-r-4 border-magenta active:translate-y-1 active:translate-x-1 active:border-none"
                >
                  REBOOT_SYSTEM
                </button>
              </>
            ) : (
              <>
                <h2 className="text-5xl font-black text-cyan mb-8 glitch-text" data-text="SUSPENDED">SUSPENDED</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-10 py-4 bg-magenta text-white font-black uppercase hover:bg-cyan hover:text-black transition-colors border-b-4 border-r-4 border-cyan active:translate-y-1 active:translate-x-1 active:border-none"
                >
                  RESUME_SYNC
                </button>
                <p className="mt-6 text-[10px] text-cyan/40 tracking-[0.3em]">INPUT: [SPACE] TO TOGGLE</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mt-2">
        <div className="p-2 border border-cyan/30 flex items-center gap-3">
          <div className="w-8 h-8 border border-cyan flex items-center justify-center text-cyan text-xs">
            DIR
          </div>
          <span className="text-[10px] text-cyan/60 tracking-widest">ARROWS_TO_NAV</span>
        </div>
        <div className="p-2 border border-magenta/30 flex items-center gap-3">
          <div className="w-8 h-8 border border-magenta flex items-center justify-center text-magenta text-xs">
            CMD
          </div>
          <span className="text-[10px] text-magenta/60 tracking-widest">SPACE_TO_PAUSE</span>
        </div>
      </div>
    </div>
  );
}
