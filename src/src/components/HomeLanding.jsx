import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code, Shield, Zap, Globe, Sparkles, ChevronRight, 
  Menu, X, Check, Star, Users, Rocket, BarChart3, Clock,
  ArrowRight, BookOpen, Search, Play, Terminal, Database, FileText,
  GraduationCap, BookMarked, Save
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { THEORY_UNITS } from "../lib/theoryContent";

function TheoryHubPreview() {
  return (
    <div className="space-y-4 max-w-lg mx-auto lg:mx-0">
      <div className="xenon-panel p-8 relative overflow-hidden group border-none bg-gradient-to-br from-[#0d1726] to-[#07101a]">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <GraduationCap className="h-48 w-48" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="xenon-pill bg-blue-500/10 text-blue-500 text-[8px] px-3 py-1 border-none font-black uppercase tracking-widest">
              OCR · AQA · EDEXCEL
            </span>
            <span className="xenon-pill bg-sky-500/10 text-sky-500 text-[8px] px-3 py-1 border-none font-black uppercase tracking-widest">
              GCSE 2024
            </span>
          </div>
          
          <h4 className="text-3xl font-black tracking-tighter mb-2">Systems Architecture</h4>
          <p className="text-sm text-[var(--muted)] font-medium leading-relaxed line-clamp-2">
            The CPU (Central Processing Unit) is the hardware that executes programs and manages the rest of the hardware.
          </p>
          
          <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
            <div className="flex gap-6">
              <div>
                <p className="text-lg font-black tracking-tight">1.1</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)]">Unit</p>
              </div>
              <div>
                <p className="text-lg font-black tracking-tight">8</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)]">Sections</p>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent-soft)]">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mini search preview below it */}
      <div className="xenon-panel-muted p-4 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--muted)]">
          <Search className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="h-2 w-24 bg-white/10 rounded-full mb-1.5" />
          <div className="h-1.5 w-16 bg-white/5 rounded-full" />
        </div>
        <span className="text-[8px] font-black uppercase tracking-widest text-[var(--accent)]">Live Search</span>
      </div>
    </div>
  );
}

function IDEShowcase() {
  const [code, setCode] = useState("");
  const fullCode = "def calculate_score(points):\n    bonus = 10\n    total = points + bonus\n    print(f'Total: {total}')\n\ncalculate_score(85)";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setCode(fullCode.slice(0, i));
      i++;
      if (i > fullCode.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="xenon-panel p-0 overflow-hidden shadow-2xl border-none bg-[#07101a] ring-1 ring-white/10">
      {/* IDE Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0d1726] border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/30" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/30" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/30" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--accent)]/10 text-[10px] font-black text-[var(--accent)] border border-[var(--accent)]/20">
            <FileText className="h-3 w-3" /> main.py
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center text-[var(--muted)]">
             <Save className="h-3.5 w-3.5" />
           </div>
           <button className="h-7 px-4 rounded-lg bg-[var(--accent)] text-white text-[10px] font-black flex items-center gap-2 shadow-lg shadow-[var(--accent-soft)]">
             <Play className="h-3.5 w-3.5 fill-current" /> RUN
           </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row h-[420px]">
        {/* Editor Area */}
        <div className="flex-1 p-8 font-mono text-[13px] leading-relaxed relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/20 border-r border-white/5 flex flex-col items-center py-8 text-[10px] text-white/20 select-none">
            {[1, 2, 3, 4, 5, 6, 7].map(n => <span key={n} className="h-[19.5px]">{n}</span>)}
          </div>
          <pre className="pl-8">
            <code className="text-blue-400">
              {code}
              <span className="animate-pulse border-l-2 border-[var(--accent)] ml-0.5" />
            </code>
          </pre>
        </div>
        
        {/* Variable Popout Simulation */}
        <div className="w-full md:w-56 bg-[#0d1726]/50 backdrop-blur-xl border-l border-white/5 p-5 flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-2">
                <Database className="h-3 w-3" /> Variables
              </p>
              <div className="h-4 w-4 rounded bg-green-500/20 flex items-center justify-center">
                 <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between group hover:border-[var(--accent)]/30 transition-colors">
                <span className="text-[10px] font-bold text-blue-300">points</span>
                <span className="text-[10px] font-black text-orange-400">85</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between group hover:border-[var(--accent)]/30 transition-colors">
                <span className="text-[10px] font-bold text-blue-300">bonus</span>
                <span className="text-[10px] font-black text-orange-400">10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between group hover:border-[var(--accent)]/30 transition-colors">
                <span className="text-[10px] font-bold text-blue-300">total</span>
                <span className="text-[10px] font-black text-orange-400">95</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-3 flex items-center gap-2">
              <Terminal className="h-3 w-3" /> Terminal
            </p>
            <div className="p-4 rounded-xl bg-black/60 font-mono text-[10px] text-green-400/90 leading-relaxed border border-white/5 shadow-inner">
              <span className="text-white/30">$ python main.py</span><br />
              Total: 95
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingSearchDemo({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const matches = [];
    THEORY_UNITS.forEach(unit => {
      if (unit.title.toLowerCase().includes(q) || unit.unit.toLowerCase().includes(q)) {
        matches.push({ type: 'unit', id: unit.id, title: unit.title, subtitle: unit.unit });
      }
      unit.notes.forEach(note => {
        if (note.heading.toLowerCase().includes(q)) {
          matches.push({ type: 'note', id: unit.id, title: note.heading, subtitle: unit.title });
        }
      });
    });
    setResults(matches.slice(0, 5));
  }, [query]);

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" />
        <input
          type="text"
          placeholder="Search topics (e.g. Memory)..."
          className="w-full h-14 rounded-2xl border-2 border-[var(--border)] bg-[var(--panel)] pl-12 pr-4 text-sm font-bold focus:border-[var(--accent)] focus:outline-none transition-all shadow-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-3 z-20 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/90 backdrop-blur-xl shadow-2xl overflow-hidden p-2"
          >
            {results.map((res, i) => (
              <button
                key={`${res.id}-${i}`}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--accent-soft)] transition-colors text-left group"
                onClick={onSelect}
              >
                <div>
                  <p className="text-sm font-black tracking-tight">{res.title}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{res.subtitle}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--muted)] group-hover:text-[var(--accent)] transition-all" />
              </button>
            ))}
            <div className="mt-2 border-t border-[var(--border)] p-2 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">Join to unlock full content</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PRICING_PLANS = [
  {
    id: "free",
    name: "Student",
    price: "0",
    description: "Perfect for students starting their Python journey.",
    features: [
      "Online Python IDE",
      "Save up to 10 Projects",
      "Classroom Participation",
      "Daily Coding Streaks",
      "Public Achievement Badges"
    ],
    cta: "Start Learning",
    popular: false,
    color: "var(--muted)"
  },
  {
    id: "premium",
    name: "Pro Student",
    price: "4.99",
    description: "Enhanced tools for serious independent learners.",
    features: [
      "Unlimited Projects",
      "In-built Error Translation",
      "Advanced Theory Hub",
      "Custom Profile Themes",
      "1v1 Friend Battles",
      "Priority Support"
    ],
    cta: "Go Pro",
    popular: true,
    color: "var(--accent)"
  },
  {
    id: "max",
    name: "School Max",
    price: "19.99",
    description: "The complete package for schools and teachers.",
    features: [
      "Up to 100 Students",
      "Classroom Management Tools",
      "Student Progress Analytics",
      "Auto-Graded Assignments",
      "School Leaderboards",
      "Dedicated Onboarding"
    ],
    cta: "Contact for Schools",
    popular: false,
    color: "#60a5fa"
  }
];

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Theory", href: "#theory" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" }
];

export default function HomeLanding({ onLogin, onSignup }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePurchaseClick = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  return (
    <div className="min-h-screen text-[var(--fg)] selection:bg-[var(--accent-soft)] selection:text-[var(--accent)]">
      {/* Sticky Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled 
            ? "bg-[var(--panel)]/80 backdrop-blur-xl border-b border-[var(--border)] py-3 shadow-lg" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-sky-400 p-0.5 shadow-lg group-hover:scale-110 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[var(--panel)]">
                <img src="/xenon-logo.svg" alt="Xenon" className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xl font-black tracking-tighter">XENON CODE</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a 
                key={link.label} 
                href={link.href} 
                className="text-sm font-bold text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={onLogin} className="text-sm font-bold text-[var(--muted)] hover:text-[var(--accent)] transition-colors px-4 py-2">
              Sign In
            </button>
            <button onClick={onSignup} className="xenon-btn h-11 px-6 text-sm">
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-[var(--muted)]" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[var(--panel)] pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map(link => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className="text-2xl font-black text-[var(--fg)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-[var(--border)] my-4" />
              <button onClick={onLogin} className="xenon-btn-ghost h-14 text-lg">Sign In</button>
              <button onClick={onSignup} className="xenon-btn h-14 text-lg">Get Started Free</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-40 pb-20 lg:pt-52 lg:pb-32">
        <div className="absolute top-0 right-0 -m-20 h-[500px] w-[500px] rounded-full bg-[var(--accent)] opacity-[0.05] blur-[120px]" />
        <div className="absolute bottom-0 left-0 -m-20 h-[500px] w-[500px] rounded-full bg-sky-500 opacity-[0.05] blur-[120px]" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center lg:text-left lg:grid lg:grid-cols-2 lg:items-center gap-16">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-4 py-1.5 text-xs font-black text-[var(--accent)] border border-[var(--accent-soft)]"
            >
              <Sparkles className="h-3 w-3" />
              <span>THE FUTURE OF CLASSROOM CODING</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8 text-5xl font-black leading-[1.1] tracking-tight sm:text-7xl"
            >
              Master Python <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-sky-400">Right in your Browser.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-lg font-medium text-[var(--muted)] leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Xenon Code is a high-performance student portal designed to make Python learning fast, social, and rewarding. Save projects, track streaks, and climb the class leaderboard.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <button onClick={onSignup} className="xenon-btn h-14 px-10 text-base shadow-xl shadow-[var(--accent-soft)] group">
                Join Your Class <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={onLogin} className="xenon-btn-ghost h-14 px-10 text-base">
                Student Login
              </button>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-20 lg:mt-0 lg:scale-110 lg:translate-x-12"
          >
            <IDEShowcase />
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-[var(--panel-soft)]/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)]">Everything you need</h2>
            <p className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Built for Students and Teachers.</p>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {[
              { icon: Code, title: "Online IDE", desc: "Write, run, and debug Python code directly in your browser with our high-performance editor." },
              { icon: Shield, title: "Class Tracking", desc: "Teachers can monitor student progress, set assignments, and manage class leaderboards." },
              { icon: Zap, title: "Daily Streaks", desc: "Stay motivated with daily coding goals, experience points, and achievement badges." }
            ].map((feature, i) => (
              <div key={i} className="xenon-panel p-8 hover:translate-y-[-8px] transition-transform duration-300">
                <div className="h-14 w-14 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] mb-6 shadow-inner">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-4 text-[var(--muted)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Theory Section */}
      <section id="theory" className="py-20 md:py-32 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-2 lg:items-center gap-20">
          <div className="order-2 lg:order-1">
            <TheoryHubPreview />
          </div>
          <div className="order-1 lg:order-2 mt-16 lg:mt-0">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-sky-500">Interactive Preview</h2>
            <h3 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">The Theory Hub</h3>
            <p className="mt-8 text-lg text-[var(--muted)] font-medium leading-relaxed">
              Experience the power of our curriculum search. Try searching for "CPU", "RAM", or "Cyber" below to see how we organize GCSE knowledge.
            </p>
            
            <div className="mt-10">
              <LandingSearchDemo onSelect={onSignup} />
            </div>

            <button onClick={onSignup} className="mt-10 xenon-btn h-14 px-10">Start Learning Now</button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-[var(--border)] bg-[var(--panel)]/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 md:grid-cols-4 text-center">
          {[
            { label: "Students", val: "10K+", icon: Users },
            { label: "Lines Coded", val: "2M+", icon: Code },
            { label: "Schools", val: "150+", icon: Shield },
            { label: "Uptime", val: "99.9%", icon: Rocket }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <stat.icon className="h-6 w-6 mx-auto text-[var(--muted)]" />
              <p className="text-4xl font-black tracking-tight">{stat.val}</p>
              <p className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[var(--accent)] opacity-[0.03] blur-[150px]" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)]">Pricing Plans</h2>
            <p className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Choose the right plan for you.</p>
            <p className="mt-6 text-lg text-[var(--muted)] font-medium">From individual students to entire schools, we have a plan that fits.</p>
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div 
                key={plan.id} 
                className={`xenon-panel relative flex flex-col p-8 transition-all duration-300 ${
                  plan.popular ? "border-[var(--accent)] shadow-2xl scale-105 z-10" : "hover:border-[var(--muted)]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-lg font-black uppercase tracking-widest" style={{ color: plan.color }}>{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-black tracking-tighter">£{plan.price}</span>
                    <span className="ml-1 text-sm font-bold text-[var(--muted)]">/mo</span>
                  </div>
                  <p className="mt-4 text-sm font-medium text-[var(--muted)] leading-relaxed">{plan.description}</p>
                </div>
                
                <ul className="mb-10 space-y-4 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium">
                      <Check className="h-5 w-5 shrink-0 text-[var(--success)]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={plan.id === "free" ? onSignup : handlePurchaseClick}
                  className={`h-14 w-full rounded-2xl font-black transition-all ${
                    plan.popular 
                      ? "bg-[var(--accent)] text-white shadow-xl shadow-[var(--accent-soft)] hover:brightness-110" 
                      : "bg-[var(--panel-soft)] text-[var(--fg)] hover:bg-[var(--border)]"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg mb-8">
            <Rocket className="h-8 w-8" />
          </div>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">The Modern Alternative to Trinket.</h2>
          <p className="mt-8 text-xl text-[var(--muted)] font-medium leading-relaxed">
            Trinket changed the game, but the modern classroom needs more. Xenon Code was built from the ground up to be faster, more social, and better integrated with teacher tools. We've taken the simplicity of browser-based coding and added the power of a professional workspace.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="xenon-panel-muted p-6">
              <p className="text-2xl font-black text-[var(--accent)]">3x</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Faster Execution</p>
            </div>
            <div className="xenon-panel-muted p-6">
              <p className="text-2xl font-black text-[var(--accent)]">Zero</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Setup Required</p>
            </div>
            <div className="xenon-panel-muted p-6 col-span-2 md:col-span-1">
              <p className="text-2xl font-black text-[var(--accent)]">100%</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Student Focused</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="xenon-hero-panel relative overflow-hidden p-8 sm:p-12 md:p-20 text-center">
            <div className="relative z-10">
              <h2 className="text-4xl font-black tracking-tight sm:text-6xl">Ready to start coding?</h2>
              <p className="mt-8 text-lg font-medium text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
                Join thousands of students and teachers who are already using Xenon Code to master Python.
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <button onClick={onSignup} className="xenon-btn h-16 px-12 text-lg">Create Free Account</button>
                <button onClick={onLogin} className="xenon-btn-ghost h-16 px-12 text-lg">Visit Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Toast */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-10 inset-x-0 z-[200] flex justify-center px-6 pointer-events-none"
          >
            <div className="xenon-panel bg-[var(--accent)] text-white border-none px-8 py-5 shadow-2xl flex flex-col items-center justify-center text-center gap-3 w-full max-w-md pointer-events-auto">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-black leading-tight">Purchase Coming Soon</p>
                <p className="mt-1 text-sm font-medium opacity-90">Try the Student plan for free today!</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
