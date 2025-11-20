import React, { useEffect, useRef } from 'react';
import { detectHands, initializeHandLandmarker } from '../services/visionService';
import { Fruit, Particle, Point, TrailPoint, GameState } from '../types';
import { generateSenseiFeedback } from '../services/geminiService';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onScoreUpdate: (score: number) => void;
  onLevelUpdate: (level: number) => void;
  onGameOver: (score: number, message: string) => void;
  inputMode: 'hand' | 'mouse';
}

// Difficulty Configuration
const LEVEL_CONFIG: Record<number, { spawnRate: number; gravity: number; bombChance: number; speedMult: number }> = {
  1: { spawnRate: 60, gravity: 0.2, bombChance: 0.1, speedMult: 1.0 },
  2: { spawnRate: 50, gravity: 0.25, bombChance: 0.15, speedMult: 1.1 },
  3: { spawnRate: 40, gravity: 0.3, bombChance: 0.2, speedMult: 1.25 },
  4: { spawnRate: 30, gravity: 0.35, bombChance: 0.25, speedMult: 1.4 },
  5: { spawnRate: 20, gravity: 0.4, bombChance: 0.3, speedMult: 1.6 },
};

const TRAIL_LENGTH = 8;

// Monochrome Palette
const COLORS = {
  apple: '#ffffff',       // Pure white
  orange: '#d4d4d4',      // Light gray
  watermelon: '#737373',  // Dark gray
  bomb: '#171717'         // Near black
};

interface FloatingText {
  text: string;
  x: number;
  y: number;
  life: number;
  size: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, setGameState, onScoreUpdate, onLevelUpdate, onGameOver, inputMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number>();
  const mousePos = useRef<Point>({ x: 0, y: 0 });
  
  // Game State Refs
  const fruits = useRef<Fruit[]>([]);
  const particles = useRef<Particle[]>([]);
  const floatingTexts = useRef<FloatingText[]>([]);
  const handTrail = useRef<TrailPoint[]>([]);
  
  const score = useRef(0);
  const currentLevel = useRef(1);
  const lives = useRef(3);
  const frameCount = useRef(0);
  const lastHandPos = useRef<Point | null>(null);
  const isVideoReady = useRef(false);
  
  // Setup Input Listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (inputMode === 'mouse') {
            mousePos.current = { x: e.clientX, y: e.clientY };
        }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [inputMode]);

  // Camera setup
  useEffect(() => {
    const startCamera = async () => {
      if (!videoRef.current || inputMode === 'mouse') return;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640,
            height: 480,
            facingMode: 'user' 
          } 
        });
        
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await new Promise<void>((resolve) => {
                if(videoRef.current) {
                    videoRef.current.onloadeddata = () => {
                        isVideoReady.current = true;
                        resolve();
                    };
                }
            });
            videoRef.current.play();
        }
        
        if (gameState === 'start') {
            setGameState('loading_model');
            await initializeHandLandmarker();
            setGameState('start');
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    if (inputMode === 'hand') {
        startCamera();
    } else {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            isVideoReady.current = false;
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMode]);

  const getLevelFromScore = (s: number) => {
      if (s >= 500) return 5;
      if (s >= 300) return 4;
      if (s >= 150) return 3;
      if (s >= 50) return 2;
      return 1;
  };

  const resetGame = () => {
    fruits.current = [];
    particles.current = [];
    floatingTexts.current = [];
    score.current = 0;
    currentLevel.current = 1;
    lives.current = 3;
    handTrail.current = [];
    onScoreUpdate(0);
    onLevelUpdate(1);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      resetGame();
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // --- PHYSICS HELPERS ---

  const spawnFruit = (width: number, height: number) => {
    const config = LEVEL_CONFIG[currentLevel.current];
    
    const isBomb = Math.random() < config.bombChance; 
    const typeKey = isBomb ? 'bomb' : (['apple', 'orange', 'watermelon'] as const)[Math.floor(Math.random() * 3)];
    
    const x = Math.random() * (width - 100) + 50;
    // Adjust velocity based on level
    const speedMultiplier = config.speedMult;
    const vx = ((width / 2 - x) * 0.01 + (Math.random() - 0.5) * 2) * speedMultiplier; 
    const vy = -(Math.random() * 4 + 11) * speedMultiplier; 

    fruits.current.push({
      id: Math.random().toString(36).substr(2, 9),
      x,
      y: height + 50,
      vx,
      vy,
      radius: isBomb ? 30 : 40,
      color: COLORS[typeKey],
      type: typeKey,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      sliced: false,
      scale: 1
    });
  };

  const createParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 8; i++) {
      particles.current.push({
        id: Math.random().toString(),
        x,
        y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 1.0,
        color: color,
        size: Math.random() * 4 + 2
      });
    }
  };

  const createFloatingText = (text: string, x: number, y: number, size: number = 20) => {
    floatingTexts.current.push({
        text,
        x,
        y,
        life: 1.0,
        size
    });
  };

  const lineIntersectsCircle = (p1: Point, p2: Point, circle: {x: number, y: number, r: number}) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lenSq = dx * dx + dy * dy;
    const t = ((circle.x - p1.x) * dx + (circle.y - p1.y) * dy) / lenSq;
    
    let closestX, closestY;
    if (t < 0) { closestX = p1.x; closestY = p1.y; }
    else if (t > 1) { closestX = p2.x; closestY = p2.y; }
    else { closestX = p1.x + t * dx; closestY = p1.y + t * dy; }
    
    const distSq = (circle.x - closestX) ** 2 + (circle.y - closestY) ** 2;
    return distSq < circle.r * circle.r;
  };

  // --- GAME LOOP ---

  const gameLoop = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = LEVEL_CONFIG[currentLevel.current];

    // 1. Input Processing
    let currentHandPos: Point | null = null;
    
    if (inputMode === 'hand' && video && isVideoReady.current) {
        const detections = detectHands(video);
        if (detections && detections.landmarks.length > 0) {
            const hand = detections.landmarks[0];
            const indexTip = hand[8]; 
            currentHandPos = {
            x: (1 - indexTip.x) * canvas.width,
            y: indexTip.y * canvas.height
            };
        }
    } else if (inputMode === 'mouse') {
        currentHandPos = mousePos.current;
    }

    // 2. Update Trail
    if (currentHandPos) {
      handTrail.current.push({ x: currentHandPos.x, y: currentHandPos.y, age: 0 });
    }
    handTrail.current.forEach(p => p.age++);
    handTrail.current = handTrail.current.filter(p => p.age < TRAIL_LENGTH);

    // 3. Clear & Draw Background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Video in Grayscale if hand mode
    if (inputMode === 'hand' && video && isVideoReady.current) {
        ctx.save();
        ctx.filter = 'grayscale(100%) brightness(0.4)';
        ctx.scale(-1, 1); 
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    // 4. Spawn Logic
    frameCount.current++;
    if (frameCount.current % config.spawnRate === 0) {
      spawnFruit(canvas.width, canvas.height);
    }

    // 5. Update & Draw Fruits
    for (let i = fruits.current.length - 1; i >= 0; i--) {
      const fruit = fruits.current[i];
      
      fruit.x += fruit.vx;
      fruit.y += fruit.vy;
      fruit.vy += config.gravity;
      fruit.rotation += fruit.rotationSpeed;

      // Out of bounds
      if (fruit.y > canvas.height + 100) {
        if (!fruit.sliced && fruit.type !== 'bomb') {
            lives.current--;
            if (lives.current <= 0) {
               handleGameOver(false);
               return; 
            }
        }
        fruits.current.splice(i, 1);
        continue;
      }

      // Collision
      let hit = false;
      if (currentHandPos && lastHandPos.current && !fruit.sliced) {
         const speed = Math.hypot(currentHandPos.x - lastHandPos.current.x, currentHandPos.y - lastHandPos.current.y);
         const threshold = inputMode === 'mouse' ? 10 : 15;
         
         if (speed > threshold) { 
            if (lineIntersectsCircle(lastHandPos.current, currentHandPos, {x: fruit.x, y: fruit.y, r: fruit.radius})) {
                hit = true;
            }
         }
      }

      if (hit) {
        if (fruit.type === 'bomb') {
            handleGameOver(true);
            return; 
        }
        
        fruit.sliced = true;
        score.current += 10;
        
        // Level Check
        const nextLevel = getLevelFromScore(score.current);
        if (nextLevel > currentLevel.current) {
            currentLevel.current = nextLevel;
            onLevelUpdate(nextLevel);
            createFloatingText("LEVEL UP", canvas.width / 2, canvas.height / 3, 40);
        }

        onScoreUpdate(score.current);
        createParticles(fruit.x, fruit.y, fruit.color);
        fruits.current.splice(i, 1); 
        continue;
      }

      // Draw Fruit (Minimalist)
      ctx.save();
      ctx.translate(fruit.x, fruit.y);
      ctx.rotate(fruit.rotation);
      
      ctx.beginPath();
      if (fruit.type === 'bomb') {
          ctx.arc(0, 0, fruit.radius, 0, Math.PI * 2);
          ctx.fillStyle = fruit.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(-10, -10);
          ctx.lineTo(10, 10);
          ctx.moveTo(10, -10);
          ctx.lineTo(-10, 10);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

      } else {
          ctx.arc(0, 0, fruit.radius, 0, Math.PI * 2);
          ctx.fillStyle = fruit.color;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();
      }
      
      ctx.restore();
    }

    // 6. Particles (Square pixels)
    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += config.gravity;
      p.life -= 0.02;

      if (p.life <= 0) {
        particles.current.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
      ctx.restore();
    }

    // 7. Floating Texts
    for (let i = floatingTexts.current.length - 1; i >= 0; i--) {
        const ft = floatingTexts.current[i];
        ft.life -= 0.01;
        ft.y -= 1;

        if (ft.life <= 0) {
            floatingTexts.current.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.globalAlpha = ft.life;
        ctx.fillStyle = '#ffffff';
        ctx.font = `${ft.size}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
    }

    // 8. Draw Trail
    if (handTrail.current.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.moveTo(handTrail.current[0].x, handTrail.current[0].y);
      for (let i = 1; i < handTrail.current.length; i++) {
          const p = handTrail.current[i];
          ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Cursor
    if (currentHandPos) {
        ctx.beginPath();
        ctx.arc(currentHandPos.x, currentHandPos.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(currentHandPos.x, currentHandPos.y, 12, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    // Lives
    const livesGap = 15;
    const startX = 30;
    const startY = canvas.height - 30;
    for(let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(startX + i * livesGap, startY, 4, 0, Math.PI * 2);
        ctx.fillStyle = i < lives.current ? '#ffffff' : '#333333';
        ctx.fill();
    }

    lastHandPos.current = currentHandPos;
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const handleGameOver = async (bombHit: boolean) => {
    setGameState('gameover');
    const finalScore = score.current;
    const slicedCount = Math.floor(finalScore / 10);
    
    onGameOver(finalScore, "Consulting the void..."); 
    const message = await generateSenseiFeedback(finalScore, slicedCount, bombHit);
    onGameOver(finalScore, message);
  };

  return (
    <div className={`relative w-full h-full flex justify-center items-center bg-black ${inputMode === 'mouse' ? 'no-cursor' : ''}`}>
      <video 
        ref={videoRef} 
        className="absolute opacity-0 pointer-events-none"
        playsInline
        muted
        autoPlay
      />
      
      <canvas 
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="block"
      />
    </div>
  );
};

export default GameCanvas;