import { BookOpen, Coffee, Leaf, ArrowRight, Sparkles, CheckCircle2, HelpCircle, Brain, Target, Zap, Users, Globe, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewState } from '../types';
import IntroAnimation from './ui/scroll-morph-hero';

interface LandingPageProps {
  onNavigate: (view: ViewState) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-parchment text-coffee font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-parchment/80 backdrop-blur-md border-b border-earth px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-highland font-display font-bold text-xl">
          <Leaf className="text-gold" />
          Tibeb.ai
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm">
          <a href="#features" className="hover:text-gold transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-gold transition-colors">How it works</a>
          <a href="#deep-dive" className="hover:text-gold transition-colors">Deep Dive</a>
          <a href="#comparison" className="hover:text-gold transition-colors">Compare</a>
          <a href="#pricing" className="hover:text-gold transition-colors">Pricing</a>
        </div>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="bg-coffee text-parchment px-5 py-2 rounded-2xl font-medium hover:bg-coffee/90 transition-colors flex items-center gap-2"
        >
          Start
          <ArrowRight size={16} />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center bg-tibeb-pattern">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full max-w-3xl h-auto">
            <path d="M 70 200 Q 85 180 90 140 Q 40 130 20 90 Q 60 110 95 110 Q 85 60 60 20 Q 100 70 100 100 Q 100 70 140 20 Q 115 60 105 110 Q 140 110 180 90 Q 160 130 110 140 Q 115 180 130 200 Z" className="fill-coffee" />
            <circle cx="100" cy="20" r="55" className="fill-highland" />
          </svg>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6 border border-gold/20">
            <Sparkles size={14} />
            <span>Ethiopian-Inspired Learning</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight">
            Grow your knowledge.<br />
            <span className="text-highland">One branch at a time.</span>
          </h1>
          <p className="text-lg md:text-xl text-coffee/70 mb-10 max-w-2xl mx-auto">
            Master any subject with our unique Wax & Gold flashcards, track your progress with the Warka Tree, and rest with a Buna Break.
          </p>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="bg-highland text-parchment px-8 py-4 rounded-2xl font-bold text-lg hover:bg-highland/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2 mx-auto"
          >
            Start Learning
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Rooted in Tradition. Powered by AI.</h2>
            <p className="text-coffee/70 max-w-2xl mx-auto">Discover a study method that combines modern cognitive science, rich cultural heritage, and cutting-edge artificial intelligence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div whileHover={{ y: -5 }} className="bg-parchment p-8 rounded-3xl border border-earth">
              <div className="w-14 h-14 bg-highland/10 rounded-2xl flex items-center justify-center text-highland mb-6">
                <Leaf size={28} />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Warka Tree</h3>
              <p className="text-coffee/70">Watch your knowledge grow visually. Every mastered card adds a leaf to your personal tree of wisdom.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-parchment p-8 rounded-3xl border border-earth">
              <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-6">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Wax & Gold Flashcards</h3>
              <p className="text-coffee/70">Learn the surface fact (Wax) and uncover the deeper meaning or context (Gold) for true comprehension.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-parchment p-8 rounded-3xl border border-earth">
              <div className="w-14 h-14 bg-coffee/10 rounded-2xl flex items-center justify-center text-coffee mb-6">
                <Coffee size={28} />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Buna Break</h3>
              <p className="text-coffee/70">Pace yourself with built-in Pomodoro timers inspired by the traditional Ethiopian coffee ceremony.</p>
            </motion.div>
          </div>

          {/* AI Features Row */}
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="bg-coffee text-parchment p-8 rounded-3xl border border-earth shadow-lg">
              <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center text-gold mb-6">
                <Brain size={28} />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">AI Tutor</h3>
              <p className="text-parchment/70">Stuck on a concept? Chat with our Gemini-powered AI tutor to get personalized explanations and context.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-coffee text-parchment p-8 rounded-3xl border border-earth shadow-lg">
              <div className="w-14 h-14 bg-highland/20 rounded-2xl flex items-center justify-center text-highland mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Auto-Generate Decks</h3>
              <p className="text-parchment/70">Instantly create comprehensive flashcard decks from any topic using advanced AI generation.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-coffee text-parchment p-8 rounded-3xl border border-earth shadow-lg">
              <div className="w-14 h-14 bg-parchment/20 rounded-2xl flex items-center justify-center text-parchment mb-6">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Voice Conversations</h3>
              <p className="text-parchment/70">Practice languages or discuss complex topics naturally with our real-time voice AI integration.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section className="py-24 bg-coffee overflow-hidden border-y border-earth/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-parchment mb-4">Explore the Tibeb Ecosystem</h2>
            <p className="text-parchment/60 max-w-2xl mx-auto">Hover over the panels to discover the depth of our AI-powered features.</p>
          </div>
          <div className="h-[600px] w-full">
            <IntroAnimation />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 bg-parchment border-t border-earth">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-16">How It Works</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-earth -z-10"></div>
            
            <div className="bg-white p-6 rounded-3xl border border-earth w-full md:w-1/3 relative z-10 shadow-sm">
              <div className="w-10 h-10 bg-coffee text-parchment rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
              <h4 className="font-bold mb-2">Study</h4>
              <p className="text-sm text-coffee/70">Review cards using the Wax & Gold method.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-earth w-full md:w-1/3 relative z-10 shadow-sm">
              <div className="w-10 h-10 bg-gold text-coffee rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
              <h4 className="font-bold mb-2">Grow</h4>
              <p className="text-sm text-coffee/70">See your Warka tree flourish as you learn.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-earth w-full md:w-1/3 relative z-10 shadow-sm">
              <div className="w-10 h-10 bg-highland text-parchment rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
              <h4 className="font-bold mb-2">Master</h4>
              <p className="text-sm text-coffee/70">Achieve deep understanding and retain knowledge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Science Section */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-earth">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coffee/10 text-coffee text-sm font-medium mb-6">
                <Brain size={14} />
                <span>Cognitive Science</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Why Wax & Gold works.</h2>
              <p className="text-lg text-coffee/70 mb-6">
                Traditional flashcards rely on rote memorization. You see a prompt, you guess the answer. But true mastery requires context.
              </p>
              <p className="text-lg text-coffee/70 mb-8">
                The Wax & Gold method forces your brain to build connections. By separating the surface fact (Wax) from the deeper meaning (Gold), you engage in <strong className="text-coffee">elaborative interrogation</strong>—a proven cognitive strategy that dramatically increases long-term retention.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Active Recall strengthens neural pathways",
                  "Contextual learning prevents forgetting",
                  "Visual progression (Warka Tree) boosts dopamine"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-coffee/80 font-medium">
                    <CheckCircle2 className="text-highland" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-3xl -z-10 transform translate-x-10 translate-y-10"></div>
              <div className="bg-parchment border border-earth rounded-3xl p-8 shadow-xl relative">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-earth/50 mb-6 transform -rotate-2">
                  <div className="text-sm text-coffee/50 font-medium mb-2 uppercase tracking-wider">The Wax (Surface)</div>
                  <div className="text-xl font-bold text-coffee">What year was the Battle of Adwa?</div>
                </div>
                <div className="bg-highland text-parchment rounded-2xl p-6 shadow-sm transform rotate-1">
                  <div className="text-sm text-parchment/70 font-medium mb-2 uppercase tracking-wider">The Gold (Deep Meaning)</div>
                  <div className="text-lg">1896. It was a decisive victory that ensured Ethiopia's independence and became a symbol of Pan-Africanism.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-24 px-6 md:px-12 bg-parchment border-t border-earth">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Built for every kind of learner.</h2>
            <p className="text-coffee/70 max-w-2xl mx-auto">Whether you're studying for finals, learning a new language, or mastering your profession.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-earth shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-coffee/10 rounded-full flex items-center justify-center text-coffee mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Students</h3>
              <p className="text-coffee/70">Crush your exams by moving beyond simple memorization. Understand the 'why' behind the facts.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-earth shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-highland/10 rounded-full flex items-center justify-center text-highland mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Language Learners</h3>
              <p className="text-coffee/70">Master vocabulary by connecting words to cultural context, idioms, and real-world usage.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-earth shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-6">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Professionals</h3>
              <p className="text-coffee/70">Stay sharp in your field. Memorize complex frameworks, medical terms, or legal precedents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specific Use Cases */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-earth">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Master Any Subject</h2>
            <p className="text-coffee/70 max-w-2xl mx-auto">See how the Wax & Gold method applies to complex fields.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-parchment p-10 rounded-3xl border border-earth">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-coffee text-parchment rounded-full flex items-center justify-center">
                  <Target size={24} />
                </div>
                <h3 className="text-2xl font-bold">Medical Students</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-earth">
                  <span className="text-xs font-bold text-coffee/50 uppercase tracking-wider block mb-1">The Wax</span>
                  <p className="font-medium text-coffee">What is the function of the Mitochondria?</p>
                </div>
                <div className="bg-highland/10 p-4 rounded-xl border border-highland/20">
                  <span className="text-xs font-bold text-highland uppercase tracking-wider block mb-1">The Gold</span>
                  <p className="text-coffee">It generates most of the cell's supply of ATP, used as a source of chemical energy. It also plays a role in signaling, cellular differentiation, and cell death.</p>
                </div>
              </div>
            </div>

            <div className="bg-parchment p-10 rounded-3xl border border-earth">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold text-coffee rounded-full flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-bold">Law Students</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-earth">
                  <span className="text-xs font-bold text-coffee/50 uppercase tracking-wider block mb-1">The Wax</span>
                  <p className="font-medium text-coffee">What is the holding in Marbury v. Madison?</p>
                </div>
                <div className="bg-gold/10 p-4 rounded-xl border border-gold/20">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-1">The Gold</span>
                  <p className="text-coffee">It established the principle of judicial review in the United States, meaning that American courts have the power to strike down laws, statutes, and some government actions that contravene the U.S. Constitution.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Features */}
      <section id="deep-dive" className="py-24 px-6 md:px-12 bg-white border-t border-earth">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Everything you need to succeed.</h2>
          </div>
          
          <div className="space-y-24">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
              <div className="md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">The Warka Tree</h3>
                <p className="text-lg text-coffee/70 mb-6">
                  In Ethiopia, the Warka tree is a symbol of community, gathering, and growth. In Tibeb.ai, it represents your mind.
                </p>
                <p className="text-lg text-coffee/70">
                  Every time you master a flashcard, your tree grows. Branches extend, leaves sprout, and eventually, they turn a brilliant gold. It's a visual, tangible representation of your hard work.
                </p>
              </div>
              <div className="md:w-1/2 bg-parchment rounded-3xl p-12 border border-earth flex justify-center relative overflow-hidden h-80 group">
                <div className="absolute bottom-0 w-64 h-64">
                  <motion.svg 
                    viewBox="0 0 200 200" 
                    className="w-full h-full drop-shadow-xl overflow-visible"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Trunk and branches */}
                    <motion.path 
                      d="M 70 200 Q 85 180 90 140 Q 40 130 20 90 Q 60 110 95 110 Q 85 60 60 20 Q 100 70 100 100 Q 100 70 140 20 Q 115 60 105 110 Q 140 110 180 90 Q 160 130 110 140 Q 115 180 130 200 Z" 
                      className="fill-coffee" 
                      initial={{ fill: '#2C1A1D' }}
                      whileHover={{ fill: '#3E2723' }}
                    />
                    
                    {/* Base Canopy */}
                    <motion.circle 
                      initial={{ scale: 0 }} 
                      whileInView={{ scale: 1 }} 
                      transition={{ duration: 0.8, delay: 0.2 }} 
                      viewport={{ once: true }}
                      cx="100" cy="20" r="55" className="fill-highland/40 pointer-events-none" 
                    />
                    
                    {/* Interactive Branches (Visual only for landing) */}
                    <motion.circle 
                      initial={{ scale: 0 }} 
                      whileInView={{ scale: 1 }} 
                      transition={{ duration: 0.4, delay: 0.3 }} 
                      viewport={{ once: true }}
                      cx="30" cy="90" r="25" className="fill-highland/80" 
                    />
                    <motion.circle 
                      initial={{ scale: 0 }} 
                      whileInView={{ scale: 1 }} 
                      transition={{ duration: 0.4, delay: 0.4 }} 
                      viewport={{ once: true }}
                      cx="170" cy="90" r="25" className="fill-highland/80" 
                    />
                    <motion.circle 
                      initial={{ scale: 0 }} 
                      whileInView={{ scale: 1 }} 
                      transition={{ duration: 0.4, delay: 0.5 }} 
                      viewport={{ once: true }}
                      cx="60" cy="30" r="30" className="fill-highland" 
                    />
                    <motion.circle 
                      initial={{ scale: 0 }} 
                      whileInView={{ scale: 1 }} 
                      transition={{ duration: 0.4, delay: 0.6 }} 
                      viewport={{ once: true }}
                      cx="140" cy="30" r="30" className="fill-highland" 
                    />
                    
                    {/* Gold accents (Mastery) */}
                    <motion.circle 
                      initial={{ scale: 0 }} 
                      whileInView={{ scale: 1 }} 
                      whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.6))' }}
                      transition={{ duration: 0.8, delay: 0.7 }} 
                      viewport={{ once: true }}
                      cx="100" cy="20" r="38" className="fill-gold pointer-events-none" 
                    />
                    
                    {/* Percentage Text */}
                    <motion.text 
                      x="100" y="28" textAnchor="middle" 
                      className="fill-parchment font-bold text-2xl font-sans pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      viewport={{ once: true }}
                    >
                      100%
                    </motion.text>
                  </motion.svg>

                  {/* Floating Leaves (Simplified for landing) */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 0, opacity: 0, x: 0, rotate: 0 }}
                      animate={{ 
                        y: [-10, -80, -150],
                        x: [0, i % 2 === 0 ? 20 : -20, i % 2 === 0 ? -10 : 10],
                        rotate: [0, 180, 360],
                        opacity: [0, 0.6, 0.6, 0],
                      }}
                      transition={{ 
                        duration: 8 + i, 
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 2
                      }}
                      className="absolute z-20 pointer-events-none text-highland"
                      style={{
                        bottom: '20%',
                        left: `${20 + i * 15}%`,
                      }}
                    >
                      <Leaf size={12} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">Buna Breaks</h3>
                <p className="text-lg text-coffee/70 mb-6">
                  Burnout is the enemy of learning. Inspired by the traditional Ethiopian coffee ceremony (Buna), we've built a timer that respects your energy.
                </p>
                <p className="text-lg text-coffee/70">
                  Study in focused 25-minute bursts, then take a 5-minute Buna Break. The interface shifts to a calming dark mode, encouraging you to step away, stretch, and let the knowledge settle.
                </p>
              </div>
              <div className="md:w-1/2 bg-[#1A1A1A] rounded-3xl p-12 border border-earth flex justify-center items-center h-80">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full border-4 border-gold flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 border-4 border-gold/30 rounded-full animate-ping"></div>
                    <Coffee className="text-gold" size={40} />
                  </div>
                  <div className="text-4xl font-display font-bold text-[#F9F7F2]">05:00</div>
                  <div className="text-gold mt-2 font-medium">Take a breath.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-24 px-6 md:px-12 bg-parchment border-t border-earth">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why choose Tibeb.ai?</h2>
            <p className="text-coffee/70 max-w-2xl mx-auto">See how we stack up against traditional study tools.</p>
          </div>
          
          <div className="overflow-x-auto pb-8">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-4 border-b-2 border-earth font-display font-bold text-lg w-1/3">Feature</th>
                  <th className="p-4 border-b-2 border-gold bg-gold/5 font-display font-bold text-lg text-gold w-1/3 rounded-t-xl">Tibeb.ai</th>
                  <th className="p-4 border-b-2 border-earth font-display font-bold text-lg text-coffee/50 w-1/3">Traditional Apps</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-earth/50">
                  <td className="p-4 font-medium">Learning Method</td>
                  <td className="p-4 bg-gold/5 text-coffee font-medium">Wax & Gold (Contextual)</td>
                  <td className="p-4 text-coffee/60">Rote Memorization</td>
                </tr>
                <tr className="border-b border-earth/50">
                  <td className="p-4 font-medium">Progress Tracking</td>
                  <td className="p-4 bg-gold/5 text-coffee font-medium">Visual Warka Tree</td>
                  <td className="p-4 text-coffee/60">Boring Charts & Graphs</td>
                </tr>
                <tr className="border-b border-earth/50">
                  <td className="p-4 font-medium">Study Pacing</td>
                  <td className="p-4 bg-gold/5 text-coffee font-medium">Built-in Buna Breaks</td>
                  <td className="p-4 text-coffee/60">Endless Scrolling</td>
                </tr>
                <tr className="border-b border-earth/50">
                  <td className="p-4 font-medium">Design & Vibe</td>
                  <td className="p-4 bg-gold/5 text-coffee font-medium">Calm, Cultural, Organic</td>
                  <td className="p-4 text-coffee/60">Clinical, Stressful</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium rounded-bl-xl">Retention Rate</td>
                  <td className="p-4 bg-gold/5 text-coffee font-bold rounded-b-xl">High (Deep Understanding)</td>
                  <td className="p-4 text-coffee/60 rounded-br-xl">Low (Cramming)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section id="story" className="py-24 px-6 md:px-12 bg-coffee text-parchment border-t border-earth">
        <div className="max-w-4xl mx-auto text-center">
          <Leaf className="text-gold mx-auto mb-8" size={48} />
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">The Story of Tibeb</h2>
          <p className="text-lg text-parchment/80 mb-6 leading-relaxed">
            "Tibeb" (ጥበብ) means wisdom in Amharic. We built Tibeb.ai because we were tired of study tools that treated the human brain like a hard drive. Learning isn't just about storing data; it's about growing wisdom.
          </p>
          <p className="text-lg text-parchment/80 mb-12 leading-relaxed">
            By combining the ancient Ethiopian poetic tradition of Wax & Gold (Sem-ena-Worq) with modern spaced repetition algorithms, we created a tool that respects your time, your energy, and your intellect.
          </p>
          <div className="inline-flex items-center gap-4 text-gold font-display font-bold text-xl">
            <span>Rooted in tradition.</span>
            <span className="w-2 h-2 rounded-full bg-highland"></span>
            <span>Built for the future.</span>
          </div>
        </div>
      </section>

      {/* AI Deep Dive Section */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-earth">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
                <Sparkles size={14} />
                <span>Powered by Gemini</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Your Personal AI Tutor.</h2>
              <p className="text-lg text-coffee/70 mb-6">
                Learning shouldn't be a solitary journey. With Tibeb.ai, you have a brilliant, patient tutor available 24/7.
              </p>
              <p className="text-lg text-coffee/70 mb-8">
                Our AI doesn't just give you the answers. It guides you to the "Gold" by asking probing questions, providing real-world examples, and explaining complex topics in a way that makes sense to you.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Real-time voice conversations for language practice",
                  "Instant deck generation from any text or topic",
                  "Search grounding for up-to-date, accurate information"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-coffee/80 font-medium">
                    <CheckCircle2 className="text-gold" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-coffee/5 rounded-full blur-3xl -z-10 transform -translate-x-10 translate-y-10"></div>
              <div className="bg-parchment border border-earth rounded-3xl p-8 shadow-xl relative">
                <div className="flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-earth/50 self-end max-w-[80%]">
                    <p className="text-coffee">I'm having trouble understanding the concept of entropy.</p>
                  </div>
                  <div className="bg-coffee text-parchment rounded-2xl p-4 shadow-sm self-start max-w-[80%]">
                    <p className="text-parchment/90">Think of entropy as a measure of disorder. Imagine a clean room (low entropy). Over time, without effort, it gets messy (high entropy). In physics, systems naturally move towards higher entropy.</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-earth/50 self-end max-w-[80%]">
                    <p className="text-coffee">Ah, so it's like my desk!</p>
                  </div>
                  <div className="bg-coffee text-parchment rounded-2xl p-4 shadow-sm self-start max-w-[80%] flex items-center gap-2">
                    <Sparkles size={16} className="text-gold" />
                    <p className="text-parchment/90">Exactly! That's a perfect analogy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 md:px-12 bg-parchment border-t border-earth">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Simple, transparent pricing.</h2>
            <p className="text-coffee/70 max-w-2xl mx-auto">Start learning for free, upgrade when you need more power.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-earth shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Scholar</h3>
              <div className="text-4xl font-display font-bold mb-6">Free</div>
              <p className="text-coffee/70 mb-8">Perfect for students just getting started with the Wax & Gold method.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-highland" size={20} /> Up to 3 Decks</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-highland" size={20} /> Basic Warka Tree tracking</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-highland" size={20} /> Buna Break timer</li>
              </ul>
              <button onClick={() => onNavigate('dashboard')} className="w-full py-3 rounded-xl border-2 border-coffee text-coffee font-bold hover:bg-coffee/5 transition-colors">Start Free</button>
            </div>
            
            <div className="bg-coffee text-parchment p-8 rounded-3xl border border-coffee shadow-xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-coffee px-4 py-1 rounded-full text-sm font-bold">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Master</h3>
              <div className="text-4xl font-display font-bold mb-6">$8<span className="text-lg font-normal text-parchment/60">/mo</span></div>
              <p className="text-parchment/70 mb-8">For serious learners who want to master multiple subjects.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-gold" size={20} /> Unlimited Decks</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-gold" size={20} /> Advanced Warka Tree analytics</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-gold" size={20} /> Custom Buna Break durations</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-gold" size={20} /> Priority support</li>
              </ul>
              <button onClick={() => onNavigate('dashboard')} className="w-full py-3 rounded-xl bg-gold text-coffee font-bold hover:bg-gold/90 transition-colors shadow-lg">Upgrade to Master</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-earth">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Loved by Students</h2>
            <p className="text-coffee/70 max-w-2xl mx-auto">See how Tibeb.ai is changing the way people learn and retain information.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Kaleb M.", role: "University Student", text: "The Wax & Gold method completely changed how I study for history. I don't just memorize dates anymore; I understand the context." },
              { name: "Sara T.", role: "High School Senior", text: "Watching my Warka tree grow keeps me motivated every single day. The Buna Breaks are perfectly timed to keep me focused." },
              { name: "Dawit A.", role: "Language Learner", text: "I've tried many flashcard apps, but the cultural touch and the beautiful interface of Tibeb.ai make learning Amharic a joy." }
            ].map((testimonial, i) => (
              <div key={i} className="bg-parchment p-8 rounded-3xl border border-earth shadow-sm">
                <div className="flex text-gold mb-4">
                  {[...Array(5)].map((_, j) => <Sparkles key={j} size={16} className="mr-1" />)}
                </div>
                <p className="text-coffee/80 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <h4 className="font-bold text-coffee">{testimonial.name}</h4>
                  <p className="text-sm text-coffee/60">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-12 bg-parchment border-t border-earth">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {[
              { q: "What is the Wax & Gold method?", a: "Wax & Gold (Sem-ena-Worq) is a traditional Ethiopian poetic form. We adapt this for learning: the 'Wax' is the surface-level fact you need to memorize, and the 'Gold' is the deeper context or explanation that helps you truly understand it." },
              { q: "How does the Warka Tree work?", a: "The Warka Tree is your visual progress tracker. As you master more flashcards in your decks, your tree grows new branches and leaves, turning gold as you achieve high mastery levels." },
              { q: "What is a Buna Break?", a: "Inspired by the Ethiopian coffee ceremony, a Buna Break is our built-in Pomodoro timer. It encourages you to study in focused bursts and take meaningful, refreshing breaks to prevent burnout." },
              { q: "Is Tibeb.ai free to use?", a: "Yes! The core features of Tibeb.ai, including creating decks, the Warka Tree, and Buna Breaks, are completely free to use." }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-earth shadow-sm">
                <h3 className="text-lg font-bold text-coffee mb-2 flex items-start gap-3">
                  <HelpCircle className="text-highland shrink-0 mt-1" size={20} />
                  {faq.q}
                </h3>
                <p className="text-coffee/70 ml-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12 bg-highland text-parchment text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to grow your knowledge?</h2>
          <p className="text-lg text-parchment/80 mb-10">Join thousands of students using the Wax & Gold method to master their subjects.</p>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="bg-gold text-coffee px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gold/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2"
          >
            Start Your Journey
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-coffee text-parchment py-12 px-6 md:px-12 text-center">
        <div className="flex items-center justify-center gap-2 text-gold font-display font-bold text-2xl mb-6">
          <Leaf />
          Tibeb.ai
        </div>
        <p className="text-parchment/60 text-sm mb-8">Rooted in tradition. Built for the future.</p>
        <div className="flex justify-center gap-6 text-sm text-parchment/80">
          <a href="#" className="hover:text-gold transition-colors">Privacy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms</a>
          <a href="#" className="hover:text-gold transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
