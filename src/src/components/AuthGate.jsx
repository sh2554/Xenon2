import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useAppStore } from "../store/useAppStore";
import SiteFooter from "./SiteFooter";
import HomeLanding from "./HomeLanding";


const roleOptions = [
  { label: "Student", value: "student" },
  { label: "Teacher", value: "teacher" },
  { label: "None", value: "none" },
];

const featureHighlights = [
  {
    title: "Run Python Instantly",
    description: "Start coding in the browser straight away with no installs, downloads, or setup problems.",
  },
  {
    title: "Practise Core Skills",
    description: "Build confidence with structured Python practise tasks designed for classroom learning.",
  },
  {
    title: "Save Real Progress",
    description: "Keep projects, return to them later, and build a record of your coding work over time.",
  },
  {
    title: "Track Class Progress",
    description: "Teachers can manage classes while students climb the leaderboard through practise and projects.",
  },
];

const journeySteps = [
  "Create an account and choose whether you are a student or teacher.",
  "Write Python in the built-in IDE, run it instantly, and save your work.",
  "Join a class, complete practise tasks, and build progress over time.",
];

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
    <div className="xenon-shell px-4 py-6 md:px-6">
      <motion.form className="xenon-panel mx-auto min-h-[calc(100vh-14rem)] w-full max-w-xl self-center p-6 sm:p-8" onSubmit={onSubmit} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/xenon-logo.svg" alt="Xenon Code logo" className="h-11 w-11 rounded-2xl" />
              <div>
                <h2 className="text-2xl font-semibold">{mode === "signin" ? "Sign In" : "Create Account"}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {mode === "signin" ? "Welcome back." : "Start using Xenon Code."}
                </p>
              </div>
            </div>
          </div>
          <button className="xenon-btn-subtle" type="button" onClick={() => setMode("landing")}>
            Back
          </button>
        </div>

        <div className="mt-5 flex gap-2">
          <button className="xenon-tab flex-1" data-active={mode === "signin"} type="button" onClick={() => setMode("signin")}>
            Sign In
          </button>
          <button className="xenon-tab flex-1" data-active={mode === "signup"} type="button" onClick={() => setMode("signup")}>
            Sign Up
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {mode === "signup" && (
            <>
              <input className="xenon-input" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              <input className="xenon-input" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              <input className="xenon-input" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              <div>
                <p className="mb-2 text-sm font-medium">Choose your role</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      className={clsx(
                        "rounded-xl border px-4 py-3 text-sm",
                        form.role === role.value ? "border-[var(--border-strong)] bg-[var(--accent-soft)]" : "border-[var(--border)]",
                      )}
                      onClick={() => setForm({ ...form, role: role.value })}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">Student and Teacher are locked after you choose them.</p>
              </div>
            </>
          )}

          <input className="xenon-input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="xenon-input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button className="xenon-btn w-full" disabled={loading} type="submit">
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
          <button className="xenon-btn-ghost w-full" disabled={loading} type="button" onClick={onGoogleClick}>
            Google
          </button>
        </div>

        {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </motion.form>
      <SiteFooter />
    </div>
  );
}
