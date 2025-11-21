import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import { GameState } from './types';
import { MousePointer2, Hand, Play, RefreshCcw } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [finalScore, setFinalScore] = useState(0);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [inputMode, setInputMode] = useState<'hand' | 'mouse'>('hand');

  const handleGameOver = (score: number, message: string) => {
    setFinalScore(score);
    setGameOverMessage(message);
  };

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden relative font-sans selection:bg-white selection:text-black">
      
      {/* Game Layer */}
      <div className="absolute inset-0 z-0">
        <GameCanvas 
            gameState={gameState} 
            setGameState={setGameState} 
            onScoreUpdate={setScore}
            onLevelUpdate={setLevel}
            onGameOver={handleGameOver}
            inputMode={inputMode}
        />
      </div>

      {/* Top Navigation / HUD */}
      <div className="absolute top-0 left-0 w-full z-10 p-6 flex justify-between items-start pointer-events-none">
        {/* Mode Toggle */}
        <div className="flex gap-1 pointer-events-auto bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
            <button 
                onClick={() => setInputMode('hand')}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
                    inputMode === 'hand' ? 'bg-white text-black' : 'text-white hover:bg-white/10'
                }`}
            >
                <Hand size={14} />
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">Hand</span>
            </button>
            <button 
                onClick={() => setInputMode('mouse')}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
                    inputMode === 'mouse' ? 'bg-white text-black' : 'text-white hover:bg-white/10'
                }`}
            >
                <MousePointer2 size={14} />
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">Mouse</span>
            </button>
        </div>

        {/* Score & Level Display */}
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/50">System Active</span>
            </div>
            <div className="flex items-baseline gap-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Level {level}</div>
                <div className="text-4xl font-light tracking-tight tabular-nums">
                    {score.toString().padStart(3, '0')}
                </div>
            </div>
        </div>
      </div>

      {/* Start Screen Overlay */}
      {(gameState === 'start' || gameState === 'loading_model') && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="max-w-md w-full flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="space-y-2 text-center">
                <h1 className="text-5xl font-light tracking-tighter">ZEN SLICE</h1>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Gesture Recognition Protocol</p>
            </div>

            {gameState === 'loading_model' ? (
               <div className="flex flex-col items-center gap-3">
                   <div className="h-1 w-24 bg-white/20 overflow-hidden rounded-full">
                       <div className="h-full bg-white w-full animate-[shimmer_1s_infinite_translateX(-100%)]" />
                   </div>
                   <span className="text-xs text-white/50 uppercase tracking-widest">Initializing Vision...</span>
               </div>
            ) : (
                <button 
                  onClick={() => setGameState('playing')}
                  className="group relative px-8 py-4 bg-white text-black rounded-full overflow-hidden transition-transform active:scale-95 hover:scale-105"
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <Play size={16} className="fill-current" />
                    <span className="text-sm font-bold tracking-widest uppercase">Initialize</span>
                  </div>
                </button>
            )}
            
            <div className="grid grid-cols-3 gap-8 text-center text-white/30">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">1</div>
                    <span className="text-[10px] uppercase tracking-wider">Engage</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">2</div>
                    <span className="text-[10px] uppercase tracking-wider">Slice</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">3</div>
                    <span className="text-[10px] uppercase tracking-wider">Survive</span>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-md">
           <div className="max-w-lg w-full p-12 flex flex-col items-center text-center space-y-8 border border-white/10 bg-black rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-500">

              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.3em] text-red-500">Sequence Terminated</p>
                <h2 className="text-6xl font-light">{finalScore}</h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Level {level} Reached</p>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="space-y-2 max-w-xs">
                 <p className="text-[10px] uppercase tracking-widest text-white/40">Analysis</p>
                 <p className="text-sm leading-relaxed text-white/80 font-light italic">
                    "{gameOverMessage}"
                 </p>
              </div>

              <button
                  onClick={() => setGameState('playing')}
                  className="mt-4 px-8 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors flex items-center gap-3 group"
              >
                  <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-xs uppercase tracking-widest font-semibold">Restart Sequence</span>
              </button>
           </div>
        </div>
      )}

      {/* Credit */}
      <div className="absolute bottom-4 right-4 z-10">
        <a
          href="https://bitcreate.studio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white/60 transition-colors"
        >
          by Sambit Biswas
        </a>
      </div>

    </div>
  );
}

export default App;