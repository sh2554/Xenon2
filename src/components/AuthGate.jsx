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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const formVariants = {
  initial: { opacity: 0, x: 30, filter: "blur(4px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
  exit: { opacity: 0, x: -30, filter: "blur(4px)", transition: { duration: 0.25 } },
};

export default function AuthGate({ initialMode = "landing" }) {
  const { signIn, signUp, signInWithGoogle, resendVerificationEmail } = useAppStore();
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    fullName: "",
    username: "",
    role: "none",
  });
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (!form.email) {
      setError("Please provide your email address to resend confirmation.");
      return;
    }
    setResendLoading(true);
    setResendMessage("");
    setError("");
    try {
      if (resendVerificationEmail) {
        await resendVerificationEmail(form.email);
      }
      setResendMessage("Verification email resent! Check your inbox.");
      setResendCooldown(60);
    } catch (err) {
      setError(err?.message || "Failed to resend confirmation email.");
    } finally {
      setResendLoading(false);
    }
  };

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
        const data = await signUp(form);
        if (data?.session?.user) {
          setMessage("Account created! Entering workspace...");
        } else {
          setMode("verify-email");
        }
      }
    } catch (err) {
      console.error("Auth Error:", err);
      const rawMsg = String(err?.message || err?.error_description || err?.error || "").toLowerCase();
      if (rawMsg.includes("email not confirmed") || rawMsg.includes("not confirmed") || rawMsg.includes("verification")) {
        setMode("verify-email");
        return;
      }
      let errorMsg = "Authentication failed.";
      if (err?.message) {
        errorMsg = err.message;
      } else if (typeof err === "object") {
        try {
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
      <HomeLanding 
        onSignup={() => setMode("signup")} 
        onLogin={() => setMode("signin")} 
      />
    );
  }

  // Claude.ai inspired Check Your Emails screen
  if (mode === "verify-email") {
    return (
      <div className="xenon-shell min-h-screen flex items-center justify-center px-4 py-12 relative bg-transparent">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px] pointer-events-none" />

        <motion.div
          className="w-full max-w-lg mx-auto text-center relative z-10 px-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* Top Logo Mark (Claude AI style) */}
          <div className="flex justify-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-[var(--accent)] flex items-center justify-center shadow-xl shadow-[var(--accent-glow)]">
              <span className="font-mono font-bold text-white text-xl tracking-tight">XC</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)] mb-8">
            Sign in to Xenon Code
          </h1>

          {/* Claude-style dark center card */}
          <div className="w-full bg-[#141414] border border-white/10 rounded-2xl p-7 sm:p-9 shadow-2xl mb-7 relative overflow-hidden">
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-mono text-[var(--accent-light)] mb-3 max-w-full truncate">
              <Mail className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              <span className="truncate">{form.email || "Verification Link Sent"}</span>
            </div>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">
              Check your emails
            </p>
          </div>

          {/* Subtext matching Claude */}
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-md mx-auto mb-8">
            Click the temporary confirmation link sent to your email to sign in. If you didn't try to sign in, you can safely ignore this email.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs mx-auto mb-8">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || resendLoading}
              className="w-full py-2.5 px-5 rounded-lg bg-[var(--accent)] text-white font-medium text-xs hover:brightness-110 transition-all disabled:opacity-50 shadow-md shadow-[var(--accent-glow)]"
            >
              {resendLoading ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend email"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setMessage("");
              }}
              className="w-full py-2.5 px-5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-xs font-medium text-[var(--text)] transition-all"
            >
              Back to Sign In
            </button>
          </div>

          {resendMessage && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[#34d399] mb-6 font-medium"
            >
              {resendMessage}
            </motion.p>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[#ef4444] mb-6 font-medium"
            >
              {error}
            </motion.p>
          )}

          {/* Footer - Anthropic style */}
          <div className="pt-8 border-t border-white/5 text-center">
            <div className="font-mono text-xs font-bold tracking-[0.25em] text-[var(--muted)]/60 uppercase">
              XENON CODE
            </div>
            <div className="mt-2 text-xs text-[var(--muted)]/50 flex items-center justify-center gap-2">
              <span>xenoncode.xyz</span>
              <span>•</span>
              <span>Python IDE</span>
              <span>•</span>
              <span>Schools</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="xenon-shell min-h-screen flex items-center justify-center px-4 py-12 md:px-6 relative bg-transparent">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent)] opacity-[0.03] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-12 border border-[var(--border)] bg-[var(--panel)] shadow-xl rounded-xl relative z-10 overflow-hidden">
        {/* Left Panel - Features / Branding (5 Cols) */}
        <motion.div
          className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 xl:p-12 border-r border-[var(--border)] bg-[var(--panel-muted)] relative overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Subtle glow behind panel */}
          <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-[var(--accent)] opacity-[0.05] blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            <motion.div 
              className="flex items-center gap-3 mb-10 cursor-pointer group"
              onClick={() => setMode("landing")}
              whileHover={{ x: -2 }}
            >
              <img src="/favicon.svg" alt="Xenon Code" className="h-10 w-10 rounded-xl shadow-lg shadow-[var(--accent-glow)] group-hover:shadow-[0_0_25px_var(--accent-glow)] transition-shadow object-contain" />
              <div>
                <span className="text-base font-bold tracking-tight">Xenon Code</span>
                <p className="text-[10px] font-medium text-[var(--muted)]">School Environment</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold tracking-tight leading-tight">
                High-Fidelity<br />
                <span className="text-[var(--accent)]">Classroom Labs.</span>
              </h2>
              <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
                Join thousands of students mastering Python programming through real-time labs and GCSE theory.
              </p>
            </motion.div>
          </div>

          <motion.div 
            className="space-y-5 border-t border-[var(--border)] pt-8 mt-10 relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((f) => (
              <motion.div key={f.title} className="flex items-start gap-4 group" variants={itemVariants}>
                <div className="h-8 w-8 rounded-lg bg-[var(--panel)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent-soft)] group-hover:border-[var(--accent)] transition-all shrink-0">
                  <f.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold">{f.title}</p>
                  <p className="text-[11px] text-[var(--muted)] leading-snug mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="pt-8 border-t border-[var(--border)] mt-8 text-[10px] font-medium text-[var(--muted)] relative z-10">
            Xenon Code - 2026
          </div>
        </motion.div>

        {/* Right Panel - Auth Form (7 Cols) */}
        <motion.div
          className="lg:col-span-7 flex flex-col justify-center p-8 sm:p-12 bg-[var(--panel)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between gap-3 mb-6">
            <motion.button 
              className="flex items-center gap-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              type="button" 
              onClick={() => setMode("landing")}
              whileHover={{ x: -3 }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to site
            </motion.button>
            <div className="flex items-center gap-2 lg:hidden">
              <img src="/favicon.svg" alt="Xenon Code" className="h-6 w-6 rounded-lg object-contain" />
              <span className="text-xs font-bold tracking-tight">Xenon Code</span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[var(--bg-soft)] p-1 rounded-lg border border-[var(--border)] mb-6">
            <button
              className={clsx(
                "flex-1 py-2.5 text-xs font-semibold rounded-md transition-all",
                mode === "signin" 
                  ? "bg-[var(--accent)] text-white shadow-sm" 
                  : "text-[var(--muted)] hover:text-[var(--text)] bg-transparent"
              )}
              type="button"
              onClick={() => { setMode("signin"); setError(""); setMessage(""); }}
            >
              Sign In
            </button>
            <button
              className={clsx(
                "flex-1 py-2.5 text-xs font-semibold rounded-md transition-all",
                mode === "signup" 
                  ? "bg-[var(--accent)] text-white shadow-sm" 
                  : "text-[var(--muted)] hover:text-[var(--text)] bg-transparent"
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
              className="mb-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-bold tracking-tight">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {mode === "signin" ? "Sign in to continue coding." : "Start your Python journey today."}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Google Sign In */}
          <motion.button
            className="w-full mb-4 glass-card border border-[var(--border)] hover:border-[var(--accent)] py-2.5 rounded-lg flex items-center justify-center gap-3 transition-all group"
            disabled={loading}
            type="button"
            onClick={onGoogleClick}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-medium">Continue with Google</span>
          </motion.button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[var(--panel)] px-3 text-[var(--muted)]">Or continue with email</span>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={onSubmit}>
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
                      <div>
                        <label className="block text-xs font-medium text-[var(--muted)] mb-1">First Name</label>
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
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--muted)] mb-1">Full Name</label>
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
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--muted)] mb-1">Username</label>
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
                    </div>

                    {/* Role Selection */}
                    <div>
                      <p className="mb-2 text-xs font-medium text-[var(--muted)]">Choose your role</p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {roleOptions.map((role) => (
                          <motion.button
                            key={role.value}
                            type="button"
                            className={clsx(
                              "relative flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all",
                              form.role === role.value
                                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                                : "border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--panel-soft)]",
                            )}
                            onClick={() => setForm({ ...form, role: role.value })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {form.role === role.value && (
                              <motion.div
                                className="absolute inset-0 rounded-lg border-2 border-[var(--accent)]"
                                layoutId="role-ring"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                            )}
                            <role.icon className={clsx("h-5 w-5", form.role === role.value ? "text-[var(--accent)]" : "text-[var(--muted)]")} />
                            <div>
                              <p className={clsx("text-sm font-semibold", form.role === role.value ? "text-[var(--accent)]" : "")}>{role.label}</p>
                              <p className="text-[10px] text-[var(--muted)] mt-0.5 leading-snug">{role.desc}</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-[var(--muted)]">Student and Teacher are locked after you choose them.</p>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">Email</label>
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
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">Password</label>
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
                </div>

                <motion.button
                  className="xenon-btn w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold mt-2 rounded-lg"
                  disabled={loading}
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
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
              </motion.div>
            </AnimatePresence>

            {/* Messages */}
            <AnimatePresence>
              {message && (
                <motion.p
                  className="mt-4 text-sm text-[var(--success)] font-medium p-3 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {message}
                </motion.p>
              )}
              {error && (
                <motion.p
                  className="mt-4 text-sm text-[var(--danger)] font-medium p-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20 animate-shake"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </form>

          <p className="mt-6 text-center text-[10px] text-[var(--muted)] font-medium">
            Protected by Supabase Auth
          </p>
        </motion.div>
      </div>
    </div>
  );
}
