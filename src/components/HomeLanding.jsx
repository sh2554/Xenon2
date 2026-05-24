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
import { PRICING_PLANS } from "../lib/planFeatures";

function TheoryHubPreview() {
  return (
    <div className="space-y-3 max-w-lg mx-auto lg:mx-0">
      <div className="xenon-panel p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="xenon-pill text-[10px]">OCR · AQA · EDEXCEL</span>
          <span className="xenon-badge text-[10px]">GCSE 2024</span>
        </div>

        <h4 className="text-xl font-semibold mb-2">Systems Architecture</h4>
        <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
          The CPU (Central Processing Unit) is the hardware that executes programs and manages the rest of the hardware.
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div className="flex gap-5">
            <div>
              <p className="text-base font-semibold">1.1</p>
              <p className="text-[10px] text-[var(--muted)] uppercase tracking-wide">Unit</p>
            </div>
            <div>
              <p className="text-base font-semibold">8</p>
              <p className="text-[10px] text-[var(--muted)] uppercase tracking-wide">Sections</p>
            </div>
          </div>
          <div className="h-8 w-8 rounded-md bg-[var(--accent)] flex items-center justify-center text-white">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Mini search preview below it */}
      <div className="xenon-panel-muted p-3 flex items-center gap-3">
        <div className="h-7 w-7 rounded-md bg-[var(--panel-soft)] flex items-center justify-center text-[var(--muted)]">
          <Search className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1">
          <div className="h-2 w-24 bg-[var(--border)] rounded mb-1" />
          <div className="h-1.5 w-16 bg-[var(--border)] rounded" />
        </div>
        <span className="text-[10px] font-medium text-[var(--accent)]">Live Search</span>
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
    <div className="xenon-panel p-0 overflow-hidden border border-[var(--border)]">
      {/* IDE Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--panel-soft)] border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--accent-soft)] text-[10px] font-medium text-[var(--accent)]">
            <FileText className="h-3 w-3" /> main.py
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="h-6 w-6 rounded bg-[var(--panel-muted)] flex items-center justify-center text-[var(--muted)]">
             <Save className="h-3 w-3" />
           </div>
           <button className="h-6 px-3 rounded bg-[var(--accent)] text-white text-[10px] font-medium flex items-center gap-1.5">
             <Play className="h-3 w-3 fill-current" /> RUN
           </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row h-[380px]">
        {/* Editor Area */}
        <div className="flex-1 p-6 font-mono text-[13px] leading-relaxed relative overflow-hidden bg-[var(--code-bg)]">
          <div className="absolute left-0 top-0 bottom-0 w-10 border-r border-[var(--border)] flex flex-col items-center py-6 text-[10px] text-[var(--muted)] select-none">
            {[1, 2, 3, 4, 5, 6, 7].map(n => <span key={n} className="h-[19.5px]">{n}</span>)}
          </div>
          <pre className="pl-6">
            <code className="text-[var(--accent)]">
              {code}
              <span className="animate-pulse border-l-2 border-[var(--accent)] ml-0.5" />
            </code>
          </pre>
        </div>

        {/* Variable Popout Simulation */}
        <div className="w-full md:w-52 bg-[var(--panel-soft)] border-l border-[var(--border)] p-4 flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)] flex items-center gap-1.5">
                <Database className="h-3 w-3" /> Variables
              </p>
              <div className="h-3.5 w-3.5 rounded bg-green-100 flex items-center justify-center">
                 <div className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="p-2 rounded bg-[var(--panel)] border border-[var(--border)] flex justify-between">
                <span className="text-[10px] font-medium text-[var(--accent)]">points</span>
                <span className="text-[10px] font-semibold text-[var(--warning)]">85</span>
              </div>
              <div className="p-2 rounded bg-[var(--panel)] border border-[var(--border)] flex justify-between">
                <span className="text-[10px] font-medium text-[var(--accent)]">bonus</span>
                <span className="text-[10px] font-semibold text-[var(--warning)]">10</span>
              </div>
              <div className="p-2 rounded bg-[var(--panel)] border border-[var(--border)] flex justify-between">
                <span className="text-[10px] font-medium text-[var(--accent)]">total</span>
                <span className="text-[10px] font-semibold text-[var(--warning)]">95</span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)] mb-2 flex items-center gap-1.5">
              <Terminal className="h-3 w-3" /> Terminal
            </p>
            <div className="p-3 rounded bg-[var(--code-bg)] font-mono text-[10px] text-[var(--success)] leading-relaxed border border-[var(--border)]">
              <span className="text-[var(--muted)]">$ python main.py</span><br />
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
        <input
          type="text"
          placeholder="Search topics (e.g. Memory)..."
          className="xenon-input pl-10 pr-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full left-0 right-0 mt-2 z-20 rounded-lg border border-[var(--border)] bg-[var(--panel)] shadow-md overflow-hidden p-1"
          >
            {results.map((res, i) => (
              <button
                key={`${res.id}-${i}`}
                className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-[var(--accent-soft)] transition-colors text-left"
                onClick={onSelect}
              >
                <div>
                  <p className="text-sm font-medium">{res.title}</p>
                  <p className="text-[10px] text-[var(--muted)]">{res.subtitle}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-[var(--muted)]" />
              </button>
            ))}
            <div className="mt-1 border-t border-[var(--border)] p-2 text-center">
              <p className="text-[10px] font-medium text-[var(--accent)]">Join to unlock full content</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const REVIEWS = [
  {
    name: "Shahzain Jehangiri",
    role: "Year 10 Student",
    school: "Seven Kings School",
    text: "This app is perfect and one of a kind. I have not seen both theory and programming in one app.",
    stars: 5,
    tag: "Unique Concept",
    avatar: "SJ"
  },
  {
    name: "Izzah Khalid",
    role: "Year 10 Student",
    school: "Seven Kings School",
    text: "This app is wonderful and easy to help me revise for my GCSE Computer Science.",
    stars: 5,
    tag: "Student Favorite",
    avatar: "IK"
  },
  {
    name: "Jai Patel Mendonca",
    role: "Year 10 Student",
    school: "Seven Kings School",
    text: "A highly intuitive online Python workspace. Extremely helpful for practicing practical programming tasks.",
    stars: 5,
    tag: "Highly Recommended",
    avatar: "JM"
  }
];

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#reviews" },
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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-200 ${
          scrolled
            ? "bg-[var(--panel)] border-b border-[var(--border)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behaviour: "smooth" })}>
            <div className="h-8 w-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <img src="/xenon-logo.svg" alt="Xenon" className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold">Xenon Code</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={onLogin} className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors px-3 py-1.5">
              Sign In
            </button>
            <button onClick={onSignup} className="xenon-btn text-sm">
              Get Started
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-[90] bg-[var(--panel)] pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium text-[var(--text)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-[var(--border)] my-3" />
              <button onClick={onLogin} className="xenon-btn-ghost text-sm">Sign In</button>
              <button onClick={onSignup} className="xenon-btn text-sm">Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center lg:text-left lg:grid lg:grid-cols-2 lg:items-center gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]"
            >
              <Sparkles className="h-3 w-3" />
              <span>The Ultimate Computer Science Companion</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl font-bold leading-tight sm:text-5xl"
            >
              Master Python<br />
              <span className="text-[var(--accent)]">GCSE & Beyond.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-base text-[var(--muted)] leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              A high-performance student portal combining a live Python IDE with a full GCSE Theory Hub. Save your labs, track your curriculum progress, and compete on your class leaderboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3"
            >
              <button onClick={onSignup} className="xenon-btn px-6 py-2.5">
                Join Your Class <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
              <button onClick={onLogin} className="xenon-btn-ghost px-6 py-2.5">
                Student Login
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 lg:mt-0"
          >
            <IDEShowcase />
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-[var(--panel-soft)]/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)]">Professional Tools</h2>
            <p className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Built for the Modern Classroom.</p>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {[
              { icon: Code, title: "High-Fidelity IDE", desc: "A professional-grade coding environment with real-time variable tracking, terminal output, and full project persistence." },
              { icon: Shield, title: "Instructor Center", desc: "Complete classroom management with real-time student monitoring, assignment deployment, and performance analytics." },
              { icon: Zap, title: "Theory Hub", desc: "A comprehensive database covering OCR, AQA, and Edexcel GCSE specifications with interactive search and flashcards." }
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

      {/* Reviews Section */}
      <section id="reviews" className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[var(--accent)] opacity-[0.02] blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)]">Real Feedback</h2>
            <p className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Loved by Teachers & Students.</p>
            <p className="mt-4 text-base text-[var(--muted)] font-medium max-w-xl mx-auto">
              See how schools are using Xenon Code to streamline lesson delivery and build student confidence.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {REVIEWS.map((review, i) => (
              <div 
                key={i} 
                className="xenon-panel p-8 relative flex flex-col justify-between hover:translate-y-[-8px] transition-all duration-300 border-none bg-gradient-to-b from-[#0d1726]/40 to-[#07101a]/40 backdrop-blur shadow-xl hover:shadow-2xl hover:shadow-[var(--accent-soft)]"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.stars)].map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-[var(--warning)]" />
                    ))}
                  </div>
                  
                  <p className="text-sm text-[var(--fg)] font-medium leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)]/20 flex items-center justify-center text-xs font-black text-[var(--accent)]">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-black leading-tight">{review.name}</p>
                      <p className="text-[10px] font-bold text-[var(--muted)] mt-1">{review.role}</p>
                      <p className="text-[9px] font-medium text-[var(--muted)] opacity-80">{review.school}</p>
                    </div>
                  </div>
                  <span className="xenon-pill text-[8px] bg-[var(--accent-soft)] text-[var(--accent)] font-black uppercase tracking-widest border-none px-2.5 py-1">
                    {review.tag}
                  </span>
                </div>
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
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)]">Interactive Curriculum</h2>
            <h3 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">The Theory Hub</h3>
            <p className="mt-8 text-lg text-[var(--muted)] font-medium leading-relaxed">
              Ditch the textbooks. Our Theory Hub is built directly into your workspace, featuring real-time search across all GCSE units and interactive knowledge checks.
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
            { label: "Active Learners", val: "2,500+", icon: Users },
            { label: "Lab Submissions", val: "15K+", icon: Code },
            { label: "Schools Enrolled", val: "40+", icon: Shield },
            { label: "System Uptime", val: "100%", icon: Rocket }
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
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)]">Flexible Plans</h2>
            <p className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Powering Every CS Student.</p>
            <p className="mt-6 text-lg text-[var(--muted)] font-medium">Whether you're an independent learner or a lead teacher, we have you covered.</p>
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
                  {plan.alsoIncludes && (
                    <p className="mt-3 text-[11px] font-bold text-[var(--accent)]">{plan.alsoIncludes}</p>
                  )}
                </div>
                
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)] mb-3">
                  {plan.exclusiveLabel || "Includes"}
                </p>
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
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">The Next Generation Student Portal.</h2>
          <p className="mt-8 text-xl text-[var(--muted)] font-medium leading-relaxed">
            We believe that learning Computer Science should be immersive, social, and efficient. Xenon Code removes the friction of local environments and physical textbooks, giving students and teachers a unified space to write code and master theory.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="xenon-panel-muted p-6">
              <p className="text-2xl font-black text-[var(--accent)]">Unified</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">IDE & Theory Hub</p>
            </div>
            <div className="xenon-panel-muted p-6">
              <p className="text-2xl font-black text-[var(--accent)]">Instant</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Teacher Insights</p>
            </div>
            <div className="xenon-panel-muted p-6 col-span-2 md:col-span-1">
              <p className="text-2xl font-black text-[var(--accent)]">GCSE</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Spec Compliant</p>
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
                Join a growing community of students and teachers who are already using Xenon Code to master Python.
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
