import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useAppStore } from "../store/useAppStore";
import SiteFooter from "./SiteFooter";
import HomeLanding from "./HomeLanding";
import { Mail, Lock, User, Briefcase, ArrowRight, ArrowLeft, Sparkles, Code, BookOpen, Shield, Zap, Star } from "lucide-react";


const roleOptions = [
  { label: "Student", value: "student", icon: BookOpen, desc: "Join classes and practise Python" },
  { label: "Teacher", value: "teacher", icon: Shield, desc: "Create classes and track students" },
  { label: "None", value: "none", icon: Code, desc: "Just explore the platform" },
];

const features = [
  { icon: Zap, title: "Instant Python", desc: "Run code in the browser with zero setup." },
  { icon: BookOpen, title: "GCSE Aligned", desc: "Practice tasks built around the curriculum." },
  { icon: Shield, title: "Class Tools", desc: "Manage students, assignments, and progress." },
  { icon: Sparkles, title: "1v1 Battles", desc: "Challenge friends in real-time coding." },
];

const formVariants = {
  initial: { opacity: 0, x: 30, filter: "blur(6px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
  exit: { opacity: 0, x: -30, filter: "blur(6px)", transition: { duration: 0.25 } },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const childFade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function AuthGate({ initialMode = "landing" }) {
  const { signIn, signUp, signInWithGoogle } = useAppStore();
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    fullName: "",
    username: "",
    role: "none",
  });
  const [focusedField, setFocusedField] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      if (mode === "signin") {
        await signIn({ email: form.email, password: form.password });
        setMessage("Signed in successfully.");
      }
      if (mode === "signup") {
        if (!form.username.trim()) throw new Error("Username is required.");
        await signUp(form);
        setMessage("Account created.");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      // Improve error display: if it's an object (like a Supabase error), try to extract message or stringify carefully
      let errorMsg = "Authentication failed.";
      if (err?.message) {
        errorMsg = err.message;
      } else if (typeof err === "object") {
        try {
          // If it's a raw object that stringifies to {}, try to get internal properties
          errorMsg = err.error_description || err.error || JSON.stringify(err);
          if (errorMsg === "{}") errorMsg = "An unknown error occurred. Check your Supabase/SMTP settings.";
        } catch {
          errorMsg = "An unknown error occurred.";
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }

  };

  const onGoogleClick = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err?.message || "Google sign-in failed.");
      setLoading(false);
    }
  };

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (mode === "landing") {
    return (
      <div className="xenon-shell">
        <HomeLanding 
          onSignup={() => setMode("signup")} 
          onLogin={() => setMode("signin")} 
        />
        <SiteFooter 
          onSignup={() => setMode("signup")} 
          onLogin={() => setMode("signin")} 
        />
      </div>
    );
  }


  return (
    <div className="xenon-shell min-h-screen flex items-center justify-center px-4 py-8 md:px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(79,184,255,0.08) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[var(--accent)]"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
              opacity: 0.2,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-0 relative z-10">
        {/* Left Panel — Features / Branding */}
        <motion.div
          className="hidden lg:flex flex-col justify-center p-10 xl:p-14 rounded-l-3xl relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(79,184,255,0.08) 0%, rgba(14,165,233,0.04) 100%)",
            borderRight: "1px solid rgba(79,184,255,0.1)",
          }}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-[var(--accent)] opacity-[0.04] blur-3xl" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <img src="/xenon-logo.svg" alt="Xenon" className="h-12 w-12 rounded-2xl" />
              <div>
                <span className="text-xl font-black tracking-tight">XENON CODE</span>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] mt-0.5">Python IDE for Schools</p>
              </div>
            </div>

            <h2 className="text-3xl font-black tracking-tight leading-tight">
              The future of<br />
              <span className="bg-gradient-to-r from-[var(--accent)] to-sky-300 bg-clip-text text-transparent">
                classroom coding
              </span>
            </h2>

            <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed max-w-sm">
              Join thousands of students and teachers using Xenon Code to learn, teach, and master Python.
            </p>
          </motion.div>

          <motion.div 
            className="mt-10 space-y-4"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="flex items-start gap-4 group"
                variants={childFade}
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-10 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400/30" />
              ))}
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed italic">
              "Great alternative to Trinket."
            </p>
            <p className="text-[10px] font-bold text-[var(--accent)] mt-2 uppercase tracking-wider">— Year 10 Teacher</p>
          </motion.div>
        </motion.div>

        {/* Right Panel — Auth Form */}
        <motion.div
          className="flex flex-col justify-center p-8 sm:p-10 xl:p-14 rounded-3xl lg:rounded-l-none lg:rounded-r-3xl border border-[var(--border)] bg-[var(--panel)]"
          style={{ backdropFilter: "blur(20px)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <button 
              className="flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] transition-colors group"
              type="button" 
              onClick={() => setMode("landing")}
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <img src="/xenon-logo.svg" alt="Xenon" className="h-8 w-8 rounded-xl" />
              <span className="text-sm font-black tracking-tight">XENON</span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="mt-4 relative flex rounded-2xl p-1 bg-[var(--bg)]">
            <motion.div
              className="absolute top-1 bottom-1 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/20"
              style={{ width: "calc(50% - 4px)" }}
              animate={{ x: mode === "signin" ? 0 : "calc(100% + 4px)" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
            <button
              className={clsx(
                "relative z-10 flex-1 py-3 text-sm font-bold rounded-xl transition-colors",
                mode === "signin" ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--fg)]"
              )}
              type="button"
              onClick={() => { setMode("signin"); setError(""); setMessage(""); }}
            >
              Sign In
            </button>
            <button
              className={clsx(
                "relative z-10 flex-1 py-3 text-sm font-bold rounded-xl transition-colors",
                mode === "signup" ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--fg)]"
              )}
              type="button"
              onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
            >
              Sign Up
            </button>
          </div>

          {/* Form Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              className="mt-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-black tracking-tight">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {mode === "signin" ? "Sign in to continue coding." : "Start your Python journey today."}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Form Fields */}
          <form onSubmit={onSubmit} className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                className="space-y-3"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {mode === "signup" && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className={clsx("auth-input-wrap group", focusedField === "firstName" && "auth-input-focused")}>
                        <User className="auth-input-icon" />
                        <input
                          className="auth-input"
                          placeholder="First Name"
                          value={form.firstName}
                          onFocus={() => setFocusedField("firstName")}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        />
                      </div>
                      <div className={clsx("auth-input-wrap group", focusedField === "fullName" && "auth-input-focused")}>
                        <User className="auth-input-icon" />
                        <input
                          className="auth-input"
                          placeholder="Full Name"
                          value={form.fullName}
                          onFocus={() => setFocusedField("fullName")}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className={clsx("auth-input-wrap group", focusedField === "username" && "auth-input-focused")}>
                      <span className="auth-input-icon text-xs font-bold text-[var(--muted)]">@</span>
                      <input
                        className="auth-input"
                        placeholder="Username"
                        value={form.username}
                        onFocus={() => setFocusedField("username")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                      />
                    </div>

                    {/* Role Selection */}
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Choose your role</p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {roleOptions.map((role) => (
                          <motion.button
                            key={role.value}
                            type="button"
                            className={clsx(
                              "relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all",
                              form.role === role.value
                                ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-[0_0_20px_rgba(79,184,255,0.1)]"
                                : "border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--panel-soft)]",
                            )}
                            onClick={() => setForm({ ...form, role: role.value })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {form.role === role.value && (
                              <motion.div
                                className="absolute inset-0 rounded-2xl border-2 border-[var(--accent)]"
                                layoutId="role-ring"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                            )}
                            <role.icon className={clsx("h-5 w-5", form.role === role.value ? "text-[var(--accent)]" : "text-[var(--muted)]")} />
                            <div>
                              <p className={clsx("text-sm font-bold", form.role === role.value ? "text-[var(--accent)]" : "")}>{role.label}</p>
                              <p className="text-[10px] text-[var(--muted)] mt-0.5 leading-snug">{role.desc}</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-[var(--muted)]">Student and Teacher are locked after you choose them.</p>
                    </div>
                  </>
                )}

                <div className={clsx("auth-input-wrap group", focusedField === "email" && "auth-input-focused")}>
                  <Mail className="auth-input-icon" />
                  <input
                    className="auth-input"
                    placeholder="Email address"
                    type="email"
                    value={form.email}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className={clsx("auth-input-wrap group", focusedField === "password" && "auth-input-focused")}>
                  <Lock className="auth-input-icon" />
                  <input
                    className="auth-input"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                <div className="pt-2 grid gap-3 sm:grid-cols-2">
                  <motion.button
                    className="xenon-btn w-full h-12 flex items-center justify-center gap-2 text-sm font-bold"
                    disabled={loading}
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {loading ? (
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        {mode === "signin" ? "Sign In" : "Create Account"}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-white/[0.03] text-sm font-bold text-[var(--fg)] hover:bg-white/[0.06] transition-colors"
                    disabled={loading}
                    type="button"
                    onClick={onGoogleClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Messages */}
            <AnimatePresence>
              {message && (
                <motion.p
                  className="mt-4 text-sm text-green-400 font-medium p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {message}
                </motion.p>
              )}
              {error && (
                <motion.p
                  className="mt-4 text-sm text-red-400 font-medium p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </form>

          <p className="mt-6 text-center text-[10px] text-[var(--muted)] uppercase tracking-wider font-bold">
            Protected by Supabase Auth
          </p>
        </motion.div>
      </div>
    </div>
  );
}
