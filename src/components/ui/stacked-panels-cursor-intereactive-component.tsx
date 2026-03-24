import { useRef, useCallback } from "react";
import { motion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { Leaf, BookOpen, Coffee, Brain, Zap, HelpCircle, Sparkles, GraduationCap, Languages, Search, Mic, History } from "lucide-react";

const PANEL_COUNT = 12;
const WAVE_SPRING = { stiffness: 160, damping: 22, mass: 0.6 };
const SCENE_SPRING = { stiffness: 80, damping: 22, mass: 1 };
const Z_SPREAD = 50;
const SIGMA = 2.8;

const TIBEB_FEATURES = [
  { icon: Leaf, color: "#2D5A27", label: "Warka Tree" },
  { icon: BookOpen, color: "#D4AF37", label: "Wax & Gold" },
  { icon: Coffee, color: "#3E2723", label: "Buna Break" },
  { icon: Brain, color: "#D4AF37", label: "AI Tutor" },
  { icon: Zap, color: "#2D5A27", label: "Auto-Gen" },
  { icon: Mic, color: "#3E2723", label: "Voice AI" },
  { icon: Sparkles, color: "#D4AF37", label: "Gemini" },
  { icon: GraduationCap, color: "#2D5A27", label: "Mastery" },
  { icon: Languages, color: "#3E2723", label: "Amharic" },
  { icon: Search, color: "#D4AF37", label: "Grounding" },
  { icon: History, color: "#2D5A27", label: "Heritage" },
  { icon: HelpCircle, color: "#3E2723", label: "Support" },
];

function Panel({
  index,
  total,
  waveY,
  scaleY,
}: {
  index: number;
  total: number;
  waveY: any;
  scaleY: any;
}) {
  const t = index / (total - 1);
  const baseZ = (index - (total - 1)) * Z_SPREAD;

  const w = 220 + t * 60;
  const h = 300 + t * 80;

  const opacity = 0.3 + t * 0.7;
  const feature = TIBEB_FEATURES[index % TIBEB_FEATURES.length];
  const Icon = feature.icon;

  return (
    <motion.div
      className="absolute rounded-2xl pointer-events-none overflow-hidden border border-white/10"
      style={{
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        translateZ: baseZ,
        y: waveY,
        scaleY,
        transformOrigin: "bottom center",
        opacity,
        background: `linear-gradient(135deg, ${feature.color}dd 0%, #1a1a1a 100%)`,
        boxShadow: `0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px ${feature.color}44`,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
        <div className="mb-4 p-4 rounded-full bg-white/10 backdrop-blur-sm">
          <Icon size={48} strokeWidth={1.5} />
        </div>
        <span className="text-lg font-display font-bold tracking-wider uppercase opacity-80">
          {feature.label}
        </span>
      </div>
      
      {/* Aesthetic glass highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
    </motion.div>
  );
}

export default function StackedPanels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  const waveYSprings = Array.from({ length: PANEL_COUNT }, () =>
    useSpring(0, WAVE_SPRING)
  );

  const scaleYSprings = Array.from({ length: PANEL_COUNT }, () =>
    useSpring(1, WAVE_SPRING)
  );

  const rotY = useSpring(-35, SCENE_SPRING);
  const rotX = useSpring(15, SCENE_SPRING);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      isHovering.current = true;

      const cx = (e.clientX - rect.left) / rect.width;
      const cy = (e.clientY - rect.top) / rect.height;

      rotY.set(-35 + (cx - 0.5) * 15);
      rotX.set(15 + (cy - 0.5) * -12);

      const cursorCardPos = cx * (PANEL_COUNT - 1);

      waveYSprings.forEach((spring, i) => {
        const dist = Math.abs(i - cursorCardPos);
        const influence = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
        spring.set(-influence * 80);
      });

      scaleYSprings.forEach((spring, i) => {
        const dist = Math.abs(i - cursorCardPos);
        const influence = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
        spring.set(0.4 + influence * 0.6);
      });
    },
    [rotY, rotX, waveYSprings, scaleYSprings]
  );

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    rotY.set(-35);
    rotX.set(15);
    waveYSprings.forEach((s) => s.set(0));
    scaleYSprings.forEach((s) => s.set(1));
  }, [rotY, rotX, waveYSprings, scaleYSprings]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[600px] flex items-center justify-center select-none overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        style={{
          rotateY: rotY,
          rotateX: rotX,
          transformStyle: "preserve-3d",
          position: "relative",
          width: 0,
          height: 0,
        }}
      >
        {Array.from({ length: PANEL_COUNT }).map((_, i) => (
          <Panel
            key={i}
            index={i}
            total={PANEL_COUNT}
            waveY={waveYSprings[i]}
            scaleY={scaleYSprings[i]}
          />
        ))}
      </motion.div>
    </div>
  );
}
