import { BookOpen, Flame, Leaf, ArrowRight, Sparkles, Plus, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { ViewState, UserProfile } from '../types';
import { User } from '../types';
import GenerateDeckModal from './GenerateDeckModal';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
  user?: User;
  userProfile?: UserProfile | null;
}

const mockDecks = [
  { id: '1', title: 'Biology: Cell Structure', cardCount: 45, masteredCount: 30, color: 'bg-highland' },
  { id: '2', title: 'History: Battle of Adwa', cardCount: 20, masteredCount: 5, color: 'bg-gold' },
  { id: '3', title: 'Math: Inverse Functions', cardCount: 35, masteredCount: 12, color: 'bg-coffee' },
  { id: '4', title: 'Amharic Proverbs', cardCount: 50, masteredCount: 48, color: 'bg-[#8B4513]' },
];

export default function Dashboard({ onNavigate, user, userProfile }: DashboardProps) {
  const [isTreeHovered, setIsTreeHovered] = useState(false);
  const [activeBranch, setActiveBranch] = useState<string | null>(null);
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  const level = userProfile?.level || 1;
  const streak = userProfile?.streak || 0;
  const totalMastered = mockDecks.reduce((sum, deck) => sum + deck.masteredCount, 0);

  // Tree grows based on level
  const treeScale = Math.min(1 + (level - 1) * 0.05, 1.3);
  const leafCount = Math.min(8 + level * 2, 24);

  const branches = [
    { id: mockDecks[0].id, cx: 30, cy: 80, r: 35, baseClass: "fill-highland/80" },
    { id: mockDecks[1].id, cx: 170, cy: 80, r: 35, baseClass: "fill-highland/80" },
    { id: mockDecks[2].id, cx: 65, cy: 40, r: 45, baseClass: "fill-highland/90" },
    { id: mockDecks[3].id, cx: 135, cy: 40, r: 45, baseClass: "fill-highland/90" },
  ];

  const leafPositions = useMemo(() => {
    return [...Array(leafCount)].map(() => ({
      bottom: 120 + Math.random() * 100,
      marginLeft: -120 + Math.random() * 240,
    }));
  }, [leafCount]);

  return (
    <div 
      className="flex-1 p-6 md:p-10 overflow-y-auto bg-tibeb-pattern"
      onClick={() => setActiveBranch(null)}
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-coffee tracking-tight">Selam, {user?.displayName?.split(' ')[0] || 'Friend'}.</h1>
          <p className="text-coffee/70 mt-2 text-lg">Your knowledge is growing beautifully.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-parchment border border-earth px-4 py-2 rounded-2xl shadow-sm">
            <Flame className={`${streak > 0 ? 'text-orange-500' : 'text-earth'}`} size={24} />
            <div className="flex flex-col">
              <span className="text-xs text-coffee/60 font-medium uppercase tracking-wider">Streak</span>
              <span className="font-bold text-coffee leading-none">{streak} Days</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-parchment border border-earth px-4 py-2 rounded-2xl shadow-sm">
            <Award className="text-purple-500" size={24} />
            <div className="flex flex-col">
              <span className="text-xs text-coffee/60 font-medium uppercase tracking-wider">Level</span>
              <span className="font-bold text-coffee leading-none">{level}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-parchment border border-earth px-4 py-2 rounded-2xl shadow-sm">
            <Sparkles className="text-gold" size={24} />
            <div className="flex flex-col">
              <span className="text-xs text-coffee/60 font-medium uppercase tracking-wider">Mastered</span>
              <span className="font-bold text-coffee leading-none">{totalMastered} Cards</span>
            </div>
          </div>
        </div>
      </header>

      {/* The Warka Tree Dashboard */}
      <section className="bg-parchment border border-earth rounded-3xl p-8 mb-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-highland/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-2xl font-bold text-coffee flex items-center gap-2">
            <Leaf className="text-highland" />
            The Knowledge Tree
          </h2>
          {level >= 5 && (
            <span className="text-xs font-bold bg-gold/20 text-gold px-3 py-1 rounded-full border border-gold/30 flex items-center gap-1">
              <Sparkles size={12} /> Golden Canopy Unlocked
            </span>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          {/* Tree Visualization */}
          <div className="flex-1 w-full max-w-md">
            <div 
              className="relative h-72 flex items-end justify-center cursor-pointer"
              onMouseEnter={() => setIsTreeHovered(true)}
              onMouseLeave={() => setIsTreeHovered(false)}
            >
              <motion.svg 
                viewBox="0 0 200 200" 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 overflow-visible z-10"
                animate={{ scale: isTreeHovered && !activeBranch ? treeScale * 1.05 : treeScale }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Trunk and branches */}
                <motion.path 
                  d="M 70 200 Q 85 180 90 140 Q 40 130 20 90 Q 60 110 95 110 Q 85 60 60 20 Q 100 70 100 100 Q 100 70 140 20 Q 115 60 105 110 Q 140 110 180 90 Q 160 130 110 140 Q 115 180 130 200 Z" 
                  className="fill-coffee" 
                  animate={{ fill: isTreeHovered ? '#3E2723' : '#2C1A1D' }}
                />
                
                {/* Base Canopy */}
                <motion.circle initial={{ scale: 0 }} animate={{ scale: isTreeHovered ? 1.05 : 1 }} transition={{ duration: 0.8, delay: 0.5 }} cx="100" cy="20" r="55" className="fill-highland pointer-events-none" />

                {/* Interactive Branches */}
                {branches.map((branch, index) => {
                  const isHovered = hoveredBranch === branch.id;
                  const isActive = activeBranch === branch.id;
                  
                  let scale = 1;
                  if (isActive) scale = 1.25;
                  else if (isHovered) scale = 1.15;
                  else if (isTreeHovered) scale = 1.1;

                  return (
                    <motion.circle 
                      key={branch.id}
                      initial={{ scale: 0 }} 
                      animate={{ 
                        scale,
                        filter: isActive ? 'drop-shadow(0 0 24px rgba(212, 175, 55, 1))' : (isHovered ? 'drop-shadow(0 0 16px rgba(74, 93, 35, 0.9))' : 'drop-shadow(0 0 0px rgba(0,0,0,0))')
                      }} 
                      transition={{ duration: 0.4, delay: 0.1 * (index + 1) }} 
                      cx={branch.cx} 
                      cy={branch.cy} 
                      r={branch.r} 
                      className={`cursor-pointer transition-colors ${isActive ? 'fill-gold' : isHovered ? 'fill-highland' : branch.baseClass}`}
                      onMouseEnter={() => setHoveredBranch(branch.id)}
                      onMouseLeave={() => setHoveredBranch(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveBranch(isActive ? null : branch.id);
                      }}
                      style={{ transformOrigin: `${branch.cx}px ${branch.cy}px` }}
                    />
                  );
                })}
                
                {/* Gold accents (Mastery) */}
                <motion.circle 
                  initial={{ scale: 0 }} 
                  animate={{ 
                    scale: isTreeHovered ? 1.15 : 1,
                    filter: isTreeHovered ? 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.6))' : 'drop-shadow(0 0 0px rgba(212, 175, 55, 0))'
                  }} 
                  transition={{ duration: 0.8, delay: 0.6 }} 
                  cx="100" cy="20" r="38" className={`${level >= 5 ? 'fill-gold' : 'fill-gold/60'} pointer-events-none`} 
                />
                
                {/* Percentage Text */}
                <motion.text 
                  x="100" y="28" textAnchor="middle" 
                  className="fill-parchment font-bold text-2xl font-sans pointer-events-none"
                  animate={{ scale: isTreeHovered ? 1.1 : 1 }}
                  style={{ transformOrigin: '100px 28px' }}
                >
                  {Math.round((totalMastered / mockDecks.reduce((sum, d) => sum + d.cardCount, 0)) * 100)}%
                </motion.text>
              </motion.svg>

              {/* Tooltips Overlay */}
              {activeBranch && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 pointer-events-none z-30">
                  {branches.map(branch => {
                    if (branch.id !== activeBranch) return null;
                    const deck = mockDecks.find(d => d.id === branch.id)!;
                    const mastery = Math.round((deck.masteredCount / deck.cardCount) * 100);
                    
                    return (
                      <motion.div
                        key={`tooltip-${branch.id}`}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute z-40 bg-parchment border border-earth shadow-xl rounded-xl p-3 w-48 pointer-events-auto"
                        style={{
                          left: `${(branch.cx / 200) * 100}%`,
                          top: `${(branch.cy / 200) * 100}%`,
                          transform: 'translate(-50%, -100%)',
                          marginTop: `-${(branch.r / 200) * 256 + 10}px`
                        }}
                      >
                        <div className="text-xs font-bold text-coffee mb-2 leading-tight">{deck.title}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-coffee/70 font-medium">Mastery</span>
                          <span className="font-bold text-highland bg-highland/10 px-2 py-0.5 rounded-full">{mastery}%</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              
              {/* Floating Leaves */}
              {leafPositions.map((pos, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, opacity: 0, x: 0, rotate: 0 }}
                  animate={{ 
                    y: [-20, -150, -250],
                    x: [0, i % 2 === 0 ? 40 : -40, i % 2 === 0 ? -20 : 20],
                    rotate: [0, 180, 360],
                    opacity: [0, 0.8, 0.8, 0],
                    color: level >= 5 
                      ? ["#D4AF37", "#D4AF37", "#4A5D23", "#D4AF37"] // Gold -> Gold -> Green -> Gold
                      : ["#4A5D23", "#4A5D23", "#D4AF37", "#4A5D23"] // Green -> Green -> Gold -> Green
                  }}
                  transition={{ 
                    duration: isTreeHovered ? 15 + (i % 5) : 25 + (i % 5), 
                    repeat: Infinity,
                    ease: "linear",
                    delay: (i * 2.5) % 20
                  }}
                  className="absolute z-20 pointer-events-none"
                  style={{
                    bottom: '20%',
                    left: `${30 + (i % 5) * 10}%`,
                  }}
                >
                  <Leaf size={14 + (i % 3) * 2} />
                </motion.div>
              ))}
            </div>
            <p className="text-center mt-6 text-coffee/70 font-medium">
              {isTreeHovered ? "Keep growing, Abebe!" : "Your overall mastery is blossoming."}
            </p>
          </div>

          {/* Progress Stats */}
          <div className="flex-1 w-full space-y-6">
            {mockDecks.slice(0, 3).map((deck, idx) => (
              <div key={deck.id} className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-coffee">
                  <span>{deck.title}</span>
                  <span>{Math.round((deck.masteredCount / deck.cardCount) * 100)}%</span>
                </div>
                <div className="h-3 w-full bg-earth rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(deck.masteredCount / deck.cardCount) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 * idx }}
                    className={`h-full ${deck.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={() => onNavigate('study')}
              className="mt-4 w-full py-3 bg-coffee text-parchment rounded-2xl font-bold hover:bg-coffee/90 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              Continue Studying <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Recent Decks */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-coffee flex items-center gap-2">
            <BookOpen className="text-gold" />
            Recent Decks
          </h2>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsGenerateModalOpen(true)}
              className="text-sm font-bold bg-gold text-coffee px-4 py-2 rounded-full hover:bg-gold/90 transition-colors flex items-center gap-1 shadow-sm"
            >
              <Sparkles size={16} /> Generate AI Deck
            </button>
            <button 
              onClick={() => onNavigate('study')}
              className="text-sm font-bold text-highland hover:underline flex items-center"
            >
              View All
            </button>
          </div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
          {mockDecks.map((deck) => (
            <div 
              key={deck.id} 
              onClick={() => onNavigate('study')}
              className="min-w-[280px] bg-parchment border border-earth rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer snap-start group"
            >
              <div className={`w-12 h-12 ${deck.color} rounded-2xl mb-4 flex items-center justify-center text-parchment shadow-sm group-hover:scale-105 transition-transform`}>
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-coffee mb-1 line-clamp-1">{deck.title}</h3>
              <p className="text-coffee/60 text-sm mb-4">{deck.cardCount} Cards total</p>
              
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-highland">{deck.masteredCount} Mastered</span>
                <span className="text-coffee/40">{deck.cardCount - deck.masteredCount} Left</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {user && (
        <GenerateDeckModal 
          isOpen={isGenerateModalOpen} 
          onClose={() => setIsGenerateModalOpen(false)} 
          user={user} 
          onSuccess={() => {
            // Ideally we'd refresh the decks list here
            console.log("Deck generated successfully!");
          }} 
        />
      )}
    </div>
  );
}
