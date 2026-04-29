import { BookOpen, Coffee, Leaf, ArrowRight, Sparkles, CheckCircle2, Brain } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ViewState } from '../types';

interface LandingPageProps {
  onNavigate: (view: ViewState) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 250]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20, 
        mass: 1 
      } 
    }
  };

  return (
    <div className="min-h-screen bg-parchment text-coffee font-sans selection:bg-gold/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-parchment/80 backdrop-blur-xl border-b border-earth/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-highland font-display font-bold text-2xl tracking-tight">
            <Leaf className="text-gold" />
            Tibeb.ai
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-coffee/80">
            <a href="#features" className="hover:text-coffee transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-coffee transition-colors">Method</a>
            <a href="#pricing" className="hover:text-coffee transition-colors">Pricing</a>
          </div>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="bg-coffee text-parchment px-6 py-2.5 rounded-full font-medium hover:bg-coffee/90 transition-all flex items-center gap-2 text-sm"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="pt-20 relative overflow-hidden">
        {/* Parallax Background Elements */}
        <motion.div 
          style={{ y: y1, opacity }} 
          className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl -z-10"
        />
        <motion.div 
          style={{ y: y2, opacity }} 
          className="absolute top-40 right-10 w-96 h-96 bg-highland/10 rounded-full blur-3xl -z-10"
        />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earth/20 text-coffee text-sm font-medium mb-8 border border-earth/30 backdrop-blur-sm">
              <Sparkles size={16} className="text-gold" />
              <span>Ethiopian-Inspired Learning</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8 leading-[1.1]">
              Grow your knowledge.<br />
              <span className="text-highland">One branch at a time.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-coffee/70 mb-12 max-w-2xl mx-auto leading-relaxed">
              Master any subject with our unique Wax & Gold flashcards, track your progress with the Warka Tree, and rest with a Buna Break.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="bg-highland text-parchment px-8 py-4 rounded-full font-semibold text-lg hover:bg-highland/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Learning Free
                <ArrowRight size={20} />
              </button>
              <a 
                href="#features"
                className="bg-white text-coffee px-8 py-4 rounded-full font-semibold text-lg hover:bg-earth/20 transition-all border border-earth/50 flex items-center justify-center gap-2"
              >
                Explore Features
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">Rooted in Tradition.<br/>Powered by AI.</h2>
            <p className="text-xl text-coffee/70 max-w-2xl">Discover a study method that combines modern cognitive science, rich cultural heritage, and cutting-edge artificial intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Feature */}
            <motion.div whileHover={{ y: -4 }} className="md:col-span-2 bg-white p-10 rounded-[2.5rem] border border-earth/50 shadow-sm flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-8">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4">Wax & Gold Flashcards</h3>
                <p className="text-lg text-coffee/70 max-w-md">Learn the surface fact (Wax) and uncover the deeper meaning or context (Gold) for true comprehension.</p>
              </div>
              <div className="absolute right-0 bottom-0 w-2/3 h-2/3 bg-gradient-to-tl from-gold/10 to-transparent rounded-tl-full -z-0 group-hover:scale-110 transition-transform duration-700"></div>
            </motion.div>

            {/* Small Feature */}
            <motion.div whileHover={{ y: -4 }} className="bg-white p-10 rounded-[2.5rem] border border-earth/50 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-highland/10 rounded-2xl flex items-center justify-center text-highland mb-8">
                  <Leaf size={32} />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">Warka Tree</h3>
                <p className="text-coffee/70">Watch your knowledge grow visually. Every mastered card adds a leaf to your personal tree of wisdom.</p>
              </div>
            </motion.div>

            {/* Small Feature */}
            <motion.div whileHover={{ y: -4 }} className="bg-coffee text-parchment p-10 rounded-[2.5rem] border border-earth/50 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-parchment/10 rounded-2xl flex items-center justify-center text-parchment mb-8">
                  <Brain size={32} />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">AI Tutor</h3>
                <p className="text-parchment/70">Stuck on a concept? Chat with our Gemini-powered AI tutor to get personalized explanations and context.</p>
              </div>
            </motion.div>

            {/* Large Feature */}
            <motion.div whileHover={{ y: -4 }} className="md:col-span-2 bg-white p-10 rounded-[2.5rem] border border-earth/50 shadow-sm flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-coffee/10 rounded-2xl flex items-center justify-center text-coffee mb-8">
                  <Coffee size={32} />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4">Buna Break</h3>
                <p className="text-lg text-coffee/70 max-w-md">Pace yourself with built-in Pomodoro timers inspired by the traditional Ethiopian coffee ceremony.</p>
              </div>
              <div className="absolute right-0 bottom-0 w-2/3 h-2/3 bg-gradient-to-tl from-coffee/5 to-transparent rounded-tl-full -z-0 group-hover:scale-110 transition-transform duration-700"></div>
            </motion.div>
          </div>
        </section>

        {/* How It Works - Minimalist Steps */}
        <section id="how-it-works" className="py-32 px-6 md:px-12 bg-white border-y border-earth/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-8">The Path to Mastery</h2>
                <p className="text-xl text-coffee/70 mb-12">A structured approach to learning that respects your cognitive load and rewards consistency.</p>
                
                <div className="space-y-12">
                  {[
                    { num: "01", title: "Study", desc: "Review cards using the Wax & Gold method." },
                    { num: "02", title: "Grow", desc: "See your Warka tree flourish as you learn." },
                    { num: "03", title: "Master", desc: "Achieve deep understanding and retain knowledge." }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="text-3xl font-display font-bold text-earth/50">{step.num}</div>
                      <div>
                        <h4 className="text-2xl font-bold mb-2">{step.title}</h4>
                        <p className="text-coffee/70 text-lg">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-parchment rounded-[3rem] p-12 border border-earth/50 aspect-square flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)]"></div>
                 <Leaf className="text-highland w-48 h-48 opacity-80" />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">Simple, transparent pricing.</h2>
            <p className="text-xl text-coffee/70 max-w-2xl mx-auto">Start learning for free, upgrade when you need more power.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white p-12 rounded-[2.5rem] border border-earth/50 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Scholar</h3>
              <div className="text-6xl font-display font-bold tracking-tighter mb-6">Free</div>
              <p className="text-coffee/70 mb-10 text-lg">Perfect for students just getting started with the Wax & Gold method.</p>
              <ul className="space-y-5 mb-12 flex-1">
                <li className="flex items-center gap-4 text-lg"><CheckCircle2 className="text-highland" size={24} /> Up to 3 Decks</li>
                <li className="flex items-center gap-4 text-lg"><CheckCircle2 className="text-highland" size={24} /> Basic Warka Tree tracking</li>
                <li className="flex items-center gap-4 text-lg"><CheckCircle2 className="text-highland" size={24} /> Buna Break timer</li>
              </ul>
              <button onClick={() => onNavigate('dashboard')} className="w-full py-4 rounded-full border-2 border-coffee text-coffee font-bold text-lg hover:bg-coffee hover:text-parchment transition-colors">Start Free</button>
            </div>
            
            {/* Pro Tier */}
            <div className="bg-coffee text-parchment p-12 rounded-[2.5rem] border border-coffee shadow-2xl flex flex-col relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold text-coffee px-6 py-2 rounded-full text-sm font-bold tracking-wide uppercase">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Master</h3>
              <div className="text-6xl font-display font-bold tracking-tighter mb-6">$8<span className="text-2xl font-normal text-parchment/60 tracking-normal">/mo</span></div>
              <p className="text-parchment/70 mb-10 text-lg">For serious learners who want to master multiple subjects.</p>
              <ul className="space-y-5 mb-12 flex-1">
                <li className="flex items-center gap-4 text-lg"><CheckCircle2 className="text-gold" size={24} /> Unlimited Decks</li>
                <li className="flex items-center gap-4 text-lg"><CheckCircle2 className="text-gold" size={24} /> Advanced Warka Tree analytics</li>
                <li className="flex items-center gap-4 text-lg"><CheckCircle2 className="text-gold" size={24} /> Custom Buna Break durations</li>
                <li className="flex items-center gap-4 text-lg"><CheckCircle2 className="text-gold" size={24} /> Priority AI Support</li>
              </ul>
              <button onClick={() => onNavigate('dashboard')} className="w-full py-4 rounded-full bg-gold text-coffee font-bold text-lg hover:bg-gold/90 transition-colors shadow-lg">Upgrade to Master</button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 md:px-12 bg-highland text-parchment text-center rounded-t-[4rem]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-8">Ready to grow your knowledge?</h2>
            <p className="text-xl md:text-2xl text-parchment/80 mb-12 max-w-2xl mx-auto">Join thousands of students using the Wax & Gold method to master their subjects.</p>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="bg-gold text-coffee px-10 py-5 rounded-full font-bold text-xl hover:bg-gold/90 transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-1 inline-flex items-center gap-3"
            >
              Start Your Journey
              <ArrowRight size={24} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-coffee text-parchment py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-gold font-display font-bold text-2xl">
            <Leaf />
            Tibeb.ai
          </div>
          <p className="text-parchment/60 text-sm">Rooted in tradition. Built for the future.</p>
          <div className="flex gap-8 text-sm text-parchment/80 font-medium">
            <a href="#" className="hover:text-gold transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms</a>
            <a href="#" className="hover:text-gold transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
