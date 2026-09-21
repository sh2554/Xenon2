import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Code, Shield, Zap, ChevronDown, Check,
  Users, FolderGit2, Award, Terminal, ArrowRight,
  HelpCircle, Play, Eye, X, FileText, CheckCircle2
} from "lucide-react";

export default function HomeLanding({ onLogin, onSignup }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [claimUsername, setClaimUsername] = useState("");
  const [activeModal, setActiveModal] = useState(null); // 'terms' | 'privacy' | null
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [runSuccess, setRunSuccess] = useState(false);
  
  const laptopSectionRef = useRef(null);

  // Apple-grade 3D perspective scroll transform
  const { scrollYProgress } = useScroll({
    target: laptopSectionRef,
    offset: ["start end", "center center"],
  });

  const laptopRotateX = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const laptopScale = useTransform(scrollYProgress, [0, 1], [0.82, 1.02]);
  const laptopTranslateY = useTransform(scrollYProgress, [0, 1], [70, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.25, 0.85]);
  const shadowSpread = useTransform(scrollYProgress, [0, 1], [20, 60]);

  const handleClaim = (e) => {
    e?.preventDefault?.();
    onSignup?.();
  };

  const handleSimulateRun = () => {
    if (isRunningCode) return;
    setIsRunningCode(true);
    setRunSuccess(false);
    setTimeout(() => {
      setIsRunningCode(false);
      setRunSuccess(true);
    }, 600);
  };

  const FAQS = [
    {
      q: "What is Xenon Code?",
      a: "Xenon Code is a modern, lightweight in-browser Python IDE and GCSE Computer Science learning hub designed for UK students and teachers. It runs real Python code instantly via WebAssembly with zero installation required."
    },
    {
      q: "Is Xenon Code free?",
      a: "Yes! Xenon Code provides a completely free tier with core Python execution, project saving, and GCSE theory units. Optional lifetime upgrades are available for advanced revision tools and unlimited labs."
    },
    {
      q: "What can I do with Xenon Code?",
      a: "You can write, run, and debug Python code, practice line-ordering Parsons problems, take mock GCSE exams, challenge classmates in 1v1 coding battles, and track your classroom leaderboard ranking."
    },
    {
      q: "Why use Xenon Code over other platforms?",
      a: "Unlike heavy desktop IDEs or slow legacy websites, Xenon Code is built with modern web technologies, zero tracking bloat, instant cloud saving, and direct UK curriculum alignment (AQA, OCR, Edexcel)."
    },
    {
      q: "Is Xenon Code safe for UK schools?",
      a: "Yes. Xenon Code is designed with student safeguarding and privacy first. No advertising, strict classroom-code permission models, and minimal data retention."
    },
    {
      q: "How long does setup take?",
      a: "Zero seconds. Simply create a username and you are immediately inside your Python workspace with instant execution."
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-[#F3F3F3] selection:bg-[var(--accent)] selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ─── Floating Pill Navbar (guns.lol layout) ─── */}
      <header className="fixed top-5 inset-x-0 z-50 px-4">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-5 py-2.5 rounded-full bg-[#161616]/90 border border-[#262626] backdrop-blur-xl shadow-2xl">
          {/* Logo with Favicon */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 text-left group"
          >
            <img src="/favicon.svg" alt="Xenon Code" className="w-7 h-7 rounded-lg object-contain shadow-md shadow-[var(--accent)]/20" />
            <span className="font-bold text-sm tracking-tight text-white">xenon.code</span>
          </button>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-[#8E8E8E]">
            <a href="#stats" className="hover:text-white transition-colors">Curriculum</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <button onClick={onLogin} className="hover:text-white transition-colors">Login</button>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSignup}
              className="px-5 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all"
            >
              Sign Up Free
            </button>
          </div>
        </nav>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="pt-36 pb-16 px-4 text-center relative overflow-hidden">
        {/* Subtle Ambient Background Halo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[var(--accent)] opacity-15 blur-[150px] pointer-events-none rounded-full" />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.15]"
          >
            Everything you want, <br />right here.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 text-sm sm:text-base text-[#8E8E8E] max-w-xl mx-auto leading-relaxed"
          >
            xenon.code is your go-to for modern, feature-rich in-browser Python labs, real-time code execution, and GCSE Computer Science mastery.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <button
              onClick={onSignup}
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all"
            >
              Sign Up for Free
            </button>
            <a
              href="#pricing"
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors"
            >
              View Pricing
            </a>
          </motion.div>
        </div>

        {/* ─── Apple-Style Premium 3D Scrolling Laptop Showcase ─── */}
        <div ref={laptopSectionRef} className="mt-16 max-w-5xl mx-auto relative px-4 [perspective:2000px]">
          {/* Dynamic Ambient Underglow */}
          <motion.div 
            style={{ opacity: glowOpacity }}
            className="absolute -inset-6 bg-[var(--accent)]/15 blur-3xl pointer-events-none rounded-[50px]"
          />

          <motion.div
            style={{
              rotateX: laptopRotateX,
              scale: laptopScale,
              translateY: laptopTranslateY,
              transformStyle: "preserve-3d",
            }}
            className="relative mx-auto w-full transition-transform ease-out"
          >
            {/* ── Laptop Screen Lid (Space Gray Unibody Bezel) ── */}
            <div className="relative rounded-t-2xl sm:rounded-t-[28px] border-[1.5px] border-[#38383E] bg-gradient-to-b from-[#1C1C1F] via-[#141416] to-[#0F0F11] p-2.5 sm:p-3.5 shadow-[0_40px_100px_rgba(0,0,0,0.95)] overflow-hidden">
              
              {/* FaceTime Notch & Camera */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-4 sm:h-5 bg-[#0A0A0B] rounded-b-xl flex items-center justify-center gap-2 z-30 border-b border-[#2A2A2E]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#151518] ring-1 ring-white/15" />
                <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
              </div>

              {/* High-Resolution Screen Display */}
              <div className="rounded-xl bg-[#0C0C0E] border border-[#222226] overflow-hidden text-left font-mono relative">
                
                {/* macOS Window Controls & Tabs */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#121215] border-b border-[#1E1E22]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm cursor-pointer" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm cursor-pointer" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm cursor-pointer" />
                    
                    {/* Tabs */}
                    <div className="ml-5 flex items-center gap-1.5 text-xs font-sans">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#1B1B20] text-pink-300 font-medium border border-[#2B2B33]">
                        <Code className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>bubble_sort.py</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-[#66666F] hover:text-[#999] cursor-pointer">
                        <FileText className="w-3.5 h-3.5" />
                        <span>systems_architecture.py</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Toolbar Action */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSimulateRun}
                      disabled={isRunningCode}
                      className="px-3 py-1 rounded-md text-[11px] font-semibold font-sans bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] flex items-center gap-1.5 transition-all"
                    >
                      <Play className={`w-3 h-3 fill-current ${isRunningCode ? "animate-spin" : ""}`} />
                      <span>{isRunningCode ? "Running..." : "Run Code"}</span>
                    </button>
                    <span className="text-[10px] text-[#34D399] font-sans flex items-center gap-1 hidden sm:flex">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                      Python 3.11 WASM
                    </span>
                  </div>
                </div>

                {/* Code Window Area */}
                <div className="p-4 sm:p-6 text-xs sm:text-sm leading-relaxed overflow-x-auto text-[#E0E0E6] select-none">
                  <div className="flex gap-4">
                    {/* Line Numbers */}
                    <div className="text-[#3E3E48] select-none text-right font-mono text-xs hidden sm:block leading-relaxed">
                      1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11
                    </div>
                    {/* Python Code */}
                    <div className="font-mono leading-relaxed flex-1">
                      <p><span className="text-[#686875]"># GCSE Computer Science — Unit 2.1 Searching &amp; Sorting</span></p>
                      <p><span className="text-[var(--accent)] font-semibold">def</span> <span className="text-pink-300">bubble_sort</span>(dataset):</p>
                      <p className="pl-4">n = <span className="text-[var(--accent)]">len</span>(dataset)</p>
                      <p className="pl-4"><span className="text-[var(--accent)] font-semibold">for</span> i <span className="text-[var(--accent)] font-semibold">in</span> <span className="text-[var(--accent)]">range</span>(n):</p>
                      <p className="pl-8"><span className="text-[var(--accent)] font-semibold">for</span> j <span className="text-[var(--accent)] font-semibold">in</span> <span className="text-[var(--accent)]">range</span>(0, n - i - 1):</p>
                      <p className="pl-12"><span className="text-[var(--accent)] font-semibold">if</span> dataset[j] &gt; dataset[j + 1]:</p>
                      <p className="pl-16">dataset[j], dataset[j + 1] = dataset[j + 1], dataset[j]</p>
                      <p className="pl-4"><span className="text-[var(--accent)] font-semibold">return</span> dataset</p>
                      <p className="mt-1"><span className="text-[#686875]"># Run exam dataset</span></p>
                      <p>exam_scores = [64, 34, 25, 12, 22, 11, 90]</p>
                      <p><span className="text-[#34D399]">print</span>(<span className="text-[#FBBF24]">"Sorted Scores:"</span>, bubble_sort(exam_scores))<span className="inline-block w-2 h-4 bg-[var(--accent)] ml-1 animate-pulse" /></p>
                    </div>
                  </div>

                  {/* Terminal Execution Window */}
                  <div className="mt-5 pt-4 border-t border-[#1C1C22] font-mono text-xs">
                    <div className="flex items-center justify-between text-[#686875] mb-2 font-sans">
                      <span className="flex items-center gap-1.5 text-xs"><Terminal className="w-3.5 h-3.5 text-[var(--accent)]" /> Terminal Console</span>
                      <span className="text-[10px] text-[#34D399] font-medium">Execution: 18.2ms</span>
                    </div>
                    <div className="bg-[#070709] p-3 rounded-lg border border-[#18181F] text-[#A0A0B0] leading-relaxed">
                      <p className="text-[#34D399]">&gt;&gt;&gt; [Pyodide WASM] Executing bubble_sort.py...</p>
                      <p className="text-[#F3F3F3] mt-0.5">&gt;&gt;&gt; Sorted Scores: [11, 12, 22, 25, 34, 64, 90]</p>
                      <p className="text-[#686875] mt-1">&gt;&gt;&gt; 4 of 4 GCSE automated test assertions verified. Grade 9 target achieved.</p>
                      {runSuccess && (
                        <p className="text-[var(--accent)] font-semibold mt-1 animate-bounce-soft">&gt;&gt;&gt; Real-time rerun completed successfully in 16.4ms!</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Glossy Specular Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.025] to-transparent pointer-events-none" />
              </div>
            </div>

            {/* ── Laptop Chassis & Keyboard Base (Aluminum Silhouette) ── */}
            <div className="relative mx-auto h-4 sm:h-6 bg-gradient-to-b from-[#28282E] via-[#1E1E22] to-[#121215] rounded-b-2xl border-t border-[#3E3E48] shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex items-center justify-center">
              {/* Center Magnetic Opening Thumb Notch */}
              <div className="w-20 sm:w-24 h-1.5 bg-[#0C0C0E] rounded-b-md shadow-inner" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats & Social Proof (guns.lol Image 5) ─── */}
      <section id="stats" className="py-24 px-4 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Over <span className="text-white">2,340,000</span> people use xenon.code — What are you waiting for?
        </h2>
        <p className="mt-3 text-sm text-[#888888] max-w-xl mx-auto">
          Create feature-rich, customizable and modern Python labs, along with fast and secure school cloud sync, all with xenon.code.
        </p>

        {/* 4 Stat Cards in Clean Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "92,400,000+", label: "Code Executions", icon: Eye },
            { value: "2,340,000+", label: "Users", icon: Users },
            { value: "640,000+", label: "Projects Saved", icon: FolderGit2 },
            { value: "57,400+", label: "Subscribers", icon: Award },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-2xl bg-[#141414] border border-[#222222] text-left transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-[#777777]">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Pricing Section (guns.lol Image 2) ─── */}
      <section id="pricing" className="py-24 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Explore our exclusive plans and join 57,400+ subscribers
        </h2>

        <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl bg-[#141414] border border-[#222222] flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Free</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">0€</span>
                <span className="text-xs text-[#777777]">/ Lifetime</span>
              </div>
              <p className="mt-2 text-xs text-[#888888] leading-relaxed">
                For beginners, write and test Python in one fast browser workspace.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Basic Customization",
                  "Profile Analytics",
                  "In-Browser Python IDE",
                  "Core GCSE Theory Units",
                  "Community Support",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-xs text-[#CCCCCC]">
                    <Check className="w-3.5 h-3.5 text-[#C026D3] shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onSignup}
              className="mt-10 w-full py-2.5 rounded-full text-xs font-semibold bg-[#202020] text-white hover:bg-[#282828] transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Premium Plan */}
          <div className="p-8 rounded-2xl bg-[#161616] border border-[var(--accent)]/40 relative flex flex-col justify-between">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent)] text-white">
              Most Popular
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="text-lg font-bold text-white">Premium</h3>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">7,99€</span>
                <span className="text-xs text-[#777777]">/ Lifetime</span>
              </div>
              <p className="text-[10px] text-[var(--accent)] font-medium mt-0.5">Pay once, keep it forever.</p>
              <p className="mt-2 text-xs text-[#888888] leading-relaxed">
                The perfect plan to discover your creativity &amp; unlock GCSE excellence.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Exclusive Badge & Rank",
                  "Unlimited Saved Projects",
                  "GCSE Past Paper Walkthroughs",
                  "Real-Time 1v1 Battle Arena",
                  "Advanced Code Profiler",
                  "Metadata & School Customization",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-xs text-[#F0F0F0]">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onSignup}
              className="mt-10 w-full py-2.5 rounded-full text-xs font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* ─── Frequently Asked Questions (guns.lol Image 3) ─── */}
      <section id="faq" className="py-24 px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3 text-left">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-[#141414] border border-[#222222] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left text-xs sm:text-sm font-medium text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#888888] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[var(--accent)]" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-[#888888] leading-relaxed border-t border-[#1C1C1C]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Bottom Banner CTA ─── */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="relative rounded-3xl bg-[#141414] border border-[var(--border)] p-10 sm:p-14 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent)]/10 blur-[90px] pointer-events-none rounded-full" />

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white relative z-10">
            Everything you want, right here.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#A0A0A0] max-w-md mx-auto relative z-10 leading-relaxed">
            Join over 2,340,000+ people using xenon.code and become part of our large community.
          </p>

          <div className="mt-8 flex justify-center relative z-10">
            <button
              onClick={onSignup}
              className="px-8 py-3 rounded-full text-xs sm:text-sm font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* ─── Minimalist Footer (Clean & Functional: Privacy & Terms only) ─── */}
      <footer className="border-t border-[#1C1C1C] bg-[#0A0A0A] py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="Xenon Code" className="w-6 h-6 rounded-md object-contain" />
            <span className="font-bold text-sm tracking-tight text-white">xenon.code</span>
          </div>

          {/* Genuine Functional Policy Links */}
          <div className="flex items-center gap-6 text-xs text-[#777777]">
            <button 
              onClick={() => setActiveModal("terms")} 
              className="hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => setActiveModal("privacy")} 
              className="hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
          </div>

          {/* Copyright & School Attribution */}
          <div className="text-right text-xs text-[#555555]">
            <p>Copyright © 2026 xenon.code — All Rights Reserved.</p>
            <p className="text-[10px] text-[#444444] mt-0.5">Seven Kings School Educational Platform</p>
          </div>
        </div>
      </footer>

      {/* ─── Terms & Privacy Interactive Modal ─── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#141416] border border-[#2A2A2E] rounded-3xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#222226] mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {activeModal === "terms" ? "Terms of Service" : "Privacy Policy"}
                    </h3>
                    <p className="text-[11px] text-[#777777]">
                      {activeModal === "terms" ? "Last updated: September 2026" : "GDPR & UK Educational Data Compliance"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-full bg-[#1F1F24] text-[#888888] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="text-xs sm:text-sm text-[#A0A0A8] leading-relaxed space-y-4">
                {activeModal === "terms" ? (
                  <>
                    <p className="font-semibold text-white">1. Educational Platform Use</p>
                    <p>
                      Xenon Code is an educational browser environment built for computing students and instructors. By accessing or using the platform, you agree to use our IDE and curriculum resources solely for lawful learning, teaching, and revision activities.
                    </p>
                    <p className="font-semibold text-white">2. User Accounts &amp; Conduct</p>
                    <p>
                      You are responsible for safeguarding your account credentials. You must not use Xenon Code to execute malicious scripts, launch denial-of-service attempts, distribute harmful code, or infringe on the intellectual property of others.
                    </p>
                    <p className="font-semibold text-white">3. Code Ownership &amp; Licensing</p>
                    <p>
                      You retain full ownership of the Python code, projects, and assignments you create on Xenon Code. By saving projects to our cloud, you grant Xenon Code a limited license to store, sync, and execute your code in your browser runtime.
                    </p>
                    <p className="font-semibold text-white">4. Availability &amp; Liability</p>
                    <p>
                      While we strive for 99.9% uptime and zero data loss, Xenon Code is provided on an "as is" basis for educational convenience. We recommend exporting critical project code periodically.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-white">1. Minimalist Data Collection</p>
                    <p>
                      Xenon Code respects student privacy above all. We only store the minimal information necessary to provide the service: your email, username, classroom enrollment codes, and saved Python projects.
                    </p>
                    <p className="font-semibold text-white">2. Student Safeguarding &amp; No Ads</p>
                    <p>
                      We never sell your data, track you across the internet, or display commercial third-party advertisements. Data collected from students under 18 is strictly protected in accordance with UK GDPR and educational safeguarding guidelines.
                    </p>
                    <p className="font-semibold text-white">3. Code Security &amp; Local Execution</p>
                    <p>
                      Python code executed on Xenon Code runs locally inside your browser sandbox via WebAssembly (Pyodide). Your code execution is isolated and never sent to untrusted third parties.
                    </p>
                    <p className="font-semibold text-white">4. Data Access &amp; Erasure</p>
                    <p>
                      You may request the deletion of your account and all associated project files at any time through the platform settings or by contacting your classroom administrator.
                    </p>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-4 border-t border-[#222226] flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#222226] text-white hover:bg-[#2A2A30] transition-colors"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
