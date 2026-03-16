import { ArrowLeft, Coffee, Pause, Play, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ViewState } from '../types';

interface BunaBreakProps {
  onNavigate: (view: ViewState) => void;
  onThemeChange: (isDark: boolean) => void;
}

export default function BunaBreak({ onNavigate, onThemeChange }: BunaBreakProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(5 * 60); // 5 min break
        onThemeChange(true); // Switch to dark mode for break
      } else {
        setIsBreak(false);
        setTimeLeft(25 * 60);
        onThemeChange(false);
        setIsActive(false);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, onThemeChange]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive && !isBreak) {
      // Optional: change theme when studying starts? No, prompt says "When the break starts, change the theme to dark mode"
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
    onThemeChange(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100 
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 h-full overflow-hidden transition-colors duration-1000 bg-tibeb-pattern">
      <header className="flex justify-between items-center mb-8">
        <button 
          onClick={() => {
            onThemeChange(false);
            onNavigate('dashboard');
          }}
          className="flex items-center gap-2 text-coffee/70 hover:text-coffee transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-coffee">
            {isBreak ? 'Buna Break' : 'Focus Session'}
          </h1>
          <p className="text-coffee/70 text-lg">
            {isBreak ? 'Time to recharge with some coffee.' : 'Deep work. No distractions.'}
          </p>
        </div>

        {/* Timer Circle */}
        <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className="text-earth"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={isBreak ? 'var(--color-gold)' : 'var(--color-highland)'}
              strokeWidth="6"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center">
            {isBreak ? (
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mb-2 text-gold"
              >
                <Coffee size={40} />
              </motion.div>
            ) : (
              <div className="text-5xl font-bold font-mono tracking-tighter mb-2 text-coffee">
                {formatTime(timeLeft)}
              </div>
            )}
            {isBreak && (
              <div className="text-3xl font-bold font-mono tracking-tighter text-coffee">
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button 
            onClick={resetTimer}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-earth/50 hover:bg-earth transition-colors text-coffee"
          >
            <RotateCcw size={24} />
          </button>
          <button 
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
              isBreak ? 'bg-gold text-parchment' : 'bg-highland text-parchment'
            }`}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
          </button>
          <button 
            onClick={() => {
              setIsBreak(!isBreak);
              setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
              onThemeChange(!isBreak);
              setIsActive(false);
            }}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-earth/50 hover:bg-earth transition-colors text-sm font-bold uppercase tracking-wider text-coffee"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
