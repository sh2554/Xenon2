import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { getLevelProgress, getRankBadge } from "../lib/progression";

import { useAppStore } from "../store/useAppStore";
import UpgradeModal from "./UpgradeModal";
import { PLANS } from "../lib/planFeatures";
import PlanComparisonCards from "./PlanComparisonCards";
import ProfileThemePicker from "./ProfileThemePicker";
import ProfileAvatar from "./ProfileAvatar";
import { AchievementGrid } from "./AchievementsPanel";
import { 
  Trophy, Star, Shield, User, Link, Trash2, Key, 
  Palette, UserCircle, Zap, X, ChevronRight, Check,
  ExternalLink, LogOut, Bell, ShieldCheck, Sparkles
} from "lucide-react";


const themes = [
  { value: "xenon-dark", label: "Xenon Dark", colors: ["#0a1220", "#61c4ff", "#eef5ff"] },
  { value: "oled-black", label: "OLED Black", colors: ["#020202", "#00d8ff", "#f9fbff"] },
  { value: "classic-light", label: "Classic Light", colors: ["#f8f6f0", "#8b5e34", "#2a1f16"] },
  { value: "solarized", label: "Solarized", colors: ["#002b36", "#268bd2", "#839496"] },
  { value: "pink", label: "Pink", colors: ["#2d1b24", "#ec4899", "#fdf2f8"] },
  { value: "blue", label: "Blue", colors: ["#0f172a", "#3b82f6", "#f1f5f9"] },
];

const motionProps = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
  transition: { duration: 0.2, ease: "easeOut" }
};

function SettingsSidebar({
  activeSection,
  onSectionChange,
  navItems,
  currentPlan,
  redeemCode,
  setRedeemCode,
  redeemMessage,
  setRedeemMessage,
  redeemPlanCode,
  onUpgradeClick,
}) {
  return (
    <div className="flex flex-col gap-2 w-full lg:w-72 shrink-0">
      <div className="xenon-panel p-4 lg:p-6 space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-4 px-3">Categories</p>
        {navItems.map((item) => (
          !item.hidden && (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={clsx(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all group",
                activeSection === item.id
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--muted)] hover:bg-[var(--panel-soft)] hover:text-[var(--fg)]"
              )}
            >
              <item.icon className={clsx(
                "h-5 w-5 transition-transform group-hover:scale-110",
                activeSection === item.id ? "text-[var(--accent)]" : "text-[var(--muted)]"
              )} />
              <span className="flex-1 text-left">{item.label}</span>
              {activeSection === item.id && (
                <motion.div layoutId="active-pill" className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
              )}
            </button>
          )
        ))}
      </div>
      
      <div className="xenon-panel p-6 bg-gradient-to-br from-[var(--accent-soft)] to-transparent border-none">
        <div className="flex items-center gap-3 text-[var(--accent)] mb-3">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs font-black uppercase tracking-widest">Subscription Plan</span>
        </div>
        <p className="text-xs font-medium text-[var(--muted)] leading-relaxed">
          Current plan: <strong className="uppercase">{PLANS[currentPlan]?.label || currentPlan}</strong>
        </p>
        <p className="text-[10px] text-[var(--muted)] mt-1">{PLANS[currentPlan]?.tagline}</p>
        <p className="text-[10px] text-[var(--muted)] mt-2 leading-relaxed">
          <strong className="text-amber-300">Pro</strong> = student revision.{" "}
          <strong className="text-violet-300">Max</strong> = teacher tools (includes Pro).
        </p>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="PRO123, MAX456, or FREE"
            className="flex-1 px-2 py-1 border rounded"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
          />
          <button
            className="xenon-btn-subtle h-10 text-xs font-black"
            onClick={async () => {
              try {
                await redeemPlanCode(redeemCode);
                setRedeemMessage("Plan upgraded!");
                setRedeemCode("");
              } catch (err) {
                setRedeemMessage(err.message || "Failed to redeem.");
              }
            }}
          >Redeem</button>
        </div>
        {redeemMessage && <p className="mt-1 text-xs text-[var(--accent)]">{redeemMessage}</p>}
        <button
            className="mt-4 w-full xenon-btn-subtle h-10 text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all"
            onClick={onUpgradeClick}
          >
            Compare plans & upgrade
          </button>
      </div>
    </div>
  );
}

export default function SettingsPanel() {
  const profile = useAppStore((s) => s.profile);
  const enrolledClass = useAppStore((s) => s.enrolledClass);
  const theme = useAppStore((s) => s.theme);
  const achievements = useAppStore((s) => s.achievements);
  const showUpgradePrompt = useAppStore((s) => s.showUpgradePrompt);
  const setShowUpgradePrompt = useAppStore((s) => s.setShowUpgradePrompt);
  const getPlan = useAppStore((s) => s.getPlan);
  const profilePlan = useAppStore((s) => s.profile?.plan);
  const redeemPlanCode = useAppStore((s) => s.redeemPlanCode);
  const currentPlan = typeof getPlan === "function" ? getPlan() : (profilePlan || "free");
  const [redeemCode, setRedeemCode] = useState("");
  const [redeemMessage, setRedeemMessage] = useState("");
  const friends = useAppStore((s) => s.friends) || [];
  const incomingFriendRequests = useAppStore((s) => s.incomingFriendRequests) || [];
  const outgoingFriendRequests = useAppStore((s) => s.outgoingFriendRequests) || [];
  
  // Actions
  const setTheme = useAppStore((s) => s.setTheme);
  const updateRole = useAppStore((s) => s.updateRole);
  const joinClassByCode = useAppStore((s) => s.joinClassByCode);
  const leaveCurrentClass = useAppStore((s) => s.leaveCurrentClass);
  const loadProfile = useAppStore((s) => s.loadProfile);
  const changePassword = useAppStore((s) => s.changePassword);
  const saveProfileCustomizations = useAppStore((s) => s.saveProfileCustomizations);
  const searchStudentProfiles = useAppStore((s) => s.searchStudentProfiles);
  const sendFriendRequest = useAppStore((s) => s.sendFriendRequest);
  const loadFriendNetwork = useAppStore((s) => s.loadFriendNetwork);
  const respondToFriendRequest = useAppStore((s) => s.respondToFriendRequest);
  const removeFriendship = useAppStore((s) => s.removeFriendship);
  const loadAchievementsForUser = useAppStore((s) => s.loadAchievementsForUser);

  const [activeSection, setActiveSection] = useState("profile");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [headline, setHeadline] = useState("");
  const [favoriteTopic, setFavoriteTopic] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [previewAchievements, setPreviewAchievements] = useState([]);

  useEffect(() => {
    if (!profile) loadProfile();
  }, [profile, loadProfile]);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name || "");
    setUsername(profile.username || "");
    setAvatarUrl(profile.avatar_url || "");
    setHeadline(profile.headline || "");
    setFavoriteTopic(profile.favorite_topic || "");
    setAboutMe(profile.about_me || "");
    setProfileVisibility(profile.profile_visibility ?? true);
  }, [profile]);

  useEffect(() => {
    if (profile?.role === "student") {
      loadFriendNetwork().catch(() => {});
    }
  }, [profile?.role, loadFriendNetwork]);

  const existingRelationships = useMemo(() => {
    const map = new Map();
    if (Array.isArray(friends)) friends.forEach((entry) => entry?.friend?.id && map.set(entry.friend.id, "Friends"));
    if (Array.isArray(incomingFriendRequests)) incomingFriendRequests.forEach((entry) => entry?.friend?.id && map.set(entry.friend.id, "Pending"));
    if (Array.isArray(outgoingFriendRequests)) outgoingFriendRequests.forEach((entry) => entry?.friend?.id && map.set(entry.friend.id, "Requested"));
    return map;
  }, [friends, incomingFriendRequests, outgoingFriendRequests]);

  const saveProfile = async () => {
    setStatus("");
    setError("");
    setSavingProfile(true);
    try {
      await saveProfileCustomizations({
        fullName,
        username,
        avatarUrl,
        headline,
        favoriteTopic,
        aboutMe,
        profileVisibility,
      });
      setStatus("Profile saved.");
    } catch (err) {
      setError(err?.message || "Could not save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const openProfilePreview = async (studentProfile, useOwnAchievements = false) => {
    if (!studentProfile) return;
    setPreviewProfile(studentProfile);
    setPreviewAchievements([]);
    if (useOwnAchievements) {
      setPreviewAchievements(achievements || []);
      return;
    }
    try {
      const rows = await loadAchievementsForUser(studentProfile.id);
      setPreviewAchievements(rows || []);
    } catch (err) {
      console.error("Failed to load achievements for preview:", err);
    }
  };

  const connectClass = async () => {
    setStatus("");
    setError("");
    try {
      await joinClassByCode(code);
      setStatus("Connected to class.");
      setCode("");
    } catch (err) {
      setError(err?.message || "Invalid class code.");
    }
  };

  const leaveClass = async () => {
    if (window.confirm("Are you sure you want to leave this class? All class progress will be hidden.")) {
      try {
        await leaveCurrentClass();
        setStatus("Left class.");
      } catch (err) {
        setError("Could not leave class.");
      }
    }
  };

  const submitPassword = async () => {
    setStatus("");
    setError("");
    if (!password) return setError("Enter a new password.");
    try {
      await changePassword(password);
      setStatus("Password updated.");
      setPassword("");
    } catch (err) {
      setError(err?.message || "Could not update password.");
    }
  };

  const runSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const results = await searchStudentProfiles(search);
      setSearchResults(results || []);
    } catch {
      setError("Search failed.");
    } finally {
      setSearching(false);
    }
  };

  const addFriend = async (friendId) => {
    try {
      await sendFriendRequest(friendId);
      setStatus("Friend request sent.");
    } catch (err) {
      setError(err?.message || "Could not send request.");
    }
  };

  const answerRequest = async (id, action) => {
    try {
      await respondToFriendRequest(id, action);
      setStatus(action === "accept" ? "Friend request accepted!" : "Request declined.");
    } catch {
      setError("Could not respond to request.");
    }
  };

  const removeFriend = async (id) => {
    if (window.confirm("Remove this friend?")) {
      try {
        await removeFriendship(id);
        setStatus("Friend removed.");
      } catch {
        setError("Could not remove friend.");
      }
    }
  };

  const navItems = [
    { id: "profile", label: "My Profile", icon: UserCircle },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "class", label: "Classroom", icon: Shield, hidden: profile?.role !== "student" && profile?.role !== "teacher" },
    { id: "social", label: "Friends", icon: User, hidden: profile?.role !== "student" },
    { id: "account", label: "Account", icon: Key },
  ];

  const rankBadge = getRankBadge(enrolledClass?.rank);

  if (!profile) {
    return (
      <div className="xenon-panel p-10 text-center">
        <p className="text-sm font-bold text-[var(--muted)]">Loading settings…</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <SettingsSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
          navItems={navItems}
          currentPlan={currentPlan}
          redeemCode={redeemCode}
          setRedeemCode={setRedeemCode}
          redeemMessage={redeemMessage}
          setRedeemMessage={setRedeemMessage}
          redeemPlanCode={redeemPlanCode}
          onUpgradeClick={() => setShowUpgradePrompt(true)}
        />

        <div className="flex-1 min-w-0 pb-20">
          <AnimatePresence mode="wait">
            {activeSection === "profile" && (
              <motion.div key="profile" {...motionProps} className="space-y-6">
                <div className="xenon-panel p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <UserCircle className="h-32 w-32" />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                    <ProfileAvatar name={profile?.full_name || profile?.username} avatarUrl={profile?.avatar_url} size="xl" className="shadow-2xl ring-4 ring-white/10" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black tracking-tight">{profile?.first_name || "Coder"}</h2>
                        <span className="xenon-badge bg-[var(--accent-soft)] text-[var(--accent)] border-none">Level {profile?.level || 1}</span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-[var(--muted)] uppercase tracking-widest">@{profile?.username || "unknown"}</p>
                      
                      <div className="mt-6 flex flex-wrap gap-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Rank</span>
                          <span className="xenon-badge">
                            <Trophy className="h-3 w-3 text-amber-400" /> {rankBadge?.label || "Unranked"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Experience</span>
                          <span className="xenon-badge">
                            <Zap className="h-3 w-3 text-sky-400" /> {profile?.experience_points || 0} XP
                          </span>
                        </div>
                        <button 
                          className="mt-auto xenon-btn-subtle h-8 px-4 text-[10px] font-black" 
                          onClick={() => openProfilePreview(profile, true)}
                        >
                          Preview Public Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="xenon-panel p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                      <h3 className="text-xl font-black tracking-tight">Public Profile</h3>
                      <p className="mt-1 text-sm text-[var(--muted)] font-medium">Control how other students see you in the community.</p>
                    </div>
                    <button className="xenon-btn px-8 h-12 shadow-lg shadow-[var(--accent-soft)]" disabled={savingProfile} onClick={saveProfile}>
                      {savingProfile ? "Saving..." : "Update Profile"}
                    </button>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Display Name</label>
                      <input className="xenon-input h-12 font-bold" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Username</label>
                      <input className="xenon-input h-12 font-bold" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Avatar Image URL</label>
                      <input className="xenon-input h-12" placeholder="https://..." value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Headline</label>
                      <input className="xenon-input h-12 font-bold" placeholder="E.g. Aspiring Python Developer" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">About Section</label>
                      <textarea className="xenon-input min-h-[120px] resize-none py-4 font-medium" placeholder="Tell your story..." value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} />
                    </div>
                  </div>

                  <label className="mt-8 flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] p-4 cursor-pointer hover:border-[var(--accent)] transition-colors">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-[var(--border)] bg-white overflow-hidden">
                      <input 
                        type="checkbox" 
                        className="h-full w-full accent-[var(--accent)] cursor-pointer" 
                        checked={profileVisibility} 
                        onChange={(e) => setProfileVisibility(e.target.checked)} 
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black">Discoverable Profile</p>
                      <p className="text-xs text-[var(--muted)] font-medium">Allow classmates to find and view your progress.</p>
                    </div>
                  </label>
                </div>
              </motion.div>
            )}

            {activeSection === "appearance" && (
              <motion.div key="appearance" {...motionProps} className="space-y-6">
                {/* Portal Theme Selection */}
                <div className="xenon-panel p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                      <Palette className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight">Portal Theme</h3>
                      <p className="mt-1 text-sm text-[var(--muted)] font-medium">Personalize your Xenon Code workspace.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {themes.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={clsx(
                          "group relative flex flex-col items-center justify-center rounded-2xl border-2 p-6 transition-all",
                          theme === t.value ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] hover:border-[var(--muted)]"
                        )}
                      >
                        <div className="flex gap-1.5 mb-4">
                          {t.colors.map((c, i) => (
                            <div key={i} className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <span className={clsx("text-sm font-black", theme === t.value ? "text-[var(--accent)]" : "text-[var(--fg)]")}>{t.label}</span>
                        {theme === t.value && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-4 w-4 text-[var(--accent)]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {profile?.role === "student" && (
                  <div className="xenon-panel p-6 sm:p-8">
                    <ProfileThemePicker />
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === "class" && (
              <motion.div key="class" {...motionProps} className="space-y-6">
                <div className="xenon-panel p-6 sm:p-8">
                  <h3 className="text-xl font-black tracking-tight">Classroom Connection</h3>
                  <p className="mt-1 text-sm text-[var(--muted)] font-medium mb-8">Join a class to participate in leaderboards and assignments.</p>
                  
                  {enrolledClass ? (
                    <div className="xenon-panel-muted p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-l-4 border-[var(--accent)]">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                          <Shield className="h-8 w-8" />
                        </div>
                        <div>
                          <p className="text-lg font-black">{enrolledClass.name}</p>
                          <p className="text-sm font-bold text-[var(--accent)] opacity-80 uppercase tracking-widest">Class Code: {enrolledClass.class_code}</p>
                        </div>
                      </div>
                      <button className="xenon-btn-subtle bg-red-500/10 text-red-500 border-none px-6 h-12 font-black" onClick={leaveClass}>Leave Class</button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted)]" />
                        <input 
                          className="xenon-input h-16 pl-12 font-black uppercase text-lg tracking-widest" 
                          placeholder="ENTER CLASS CODE" 
                          value={code} 
                          onChange={(e) => setCode(e.target.value.toUpperCase())} 
                        />
                      </div>
                      <button className="xenon-btn px-10 h-16 shadow-xl shadow-[var(--accent-soft)]" onClick={connectClass}>Connect</button>
                    </div>
                  )}
                </div>

                <div className="xenon-panel p-6 sm:p-8">
                  <h3 className="text-xl font-black tracking-tight">Portal Rank</h3>
                  <p className="mt-1 text-sm text-[var(--muted)] font-medium mb-6">Your standing within the Xenon Code community.</p>
                  
                  <div className="xenon-panel-muted p-8 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-5">
                      <Trophy className="h-24 w-24" />
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="h-16 w-16 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
                        <Trophy className={clsx(
                          "h-8 w-8",
                          enrolledClass?.rank === 1 ? "text-amber-400" : enrolledClass?.rank === 2 ? "text-slate-400" : "text-orange-400"
                        )} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] mb-1">Global Achievement</p>
                        <p className="text-3xl font-black tracking-tight">{rankBadge?.label || "Unranked"}</p>
                      </div>
                    </div>
                    {enrolledClass?.rank && (
                      <div className="text-right relative z-10">
                        <p className="text-4xl font-black text-[var(--accent)] tracking-tighter">#{enrolledClass.rank}</p>
                        <p className="text-[10px] font-bold text-[var(--muted)] uppercase">In Class</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "social" && (
              <motion.div key="social" {...motionProps} className="space-y-6">
                <div className="xenon-panel p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-black tracking-tight">Friend Network</h3>
                      <p className="mt-1 text-sm text-[var(--muted)] font-medium">Keep track of your classmates and their progress.</p>
                    </div>
                    <span className="xenon-badge bg-blue-500/10 text-blue-500 border-none px-4 h-8 font-black">{friends.length} Active Friends</span>
                  </div>

                  <div className="flex gap-3 mb-8">
                    <div className="relative flex-1">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                      <input className="xenon-input h-14 pl-12 font-bold" placeholder="Search students by username..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <button className="xenon-btn px-8 h-14" disabled={searching} onClick={runSearch}>
                      {searching ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Zap className="h-4 w-4" /></motion.div> : "Search"}
                    </button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="grid gap-3 animate-in fade-in slide-in-from-top-2">
                      {searchResults.map((result) => {
                        const relationship = existingRelationships.get(result.id);
                        return (
                          <div key={result.id} className="xenon-panel-muted flex items-center justify-between p-4 rounded-2xl hover:border-[var(--accent)] transition-all">
                            <div className="flex items-center gap-4">
                              <ProfileAvatar name={result.full_name || result.username} avatarUrl={result.avatar_url} size="md" />
                              <div>
                                <p className="font-black text-sm">{result.full_name || result.username}</p>
                                <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Level {result.level || 1} · {result.headline || "Explorer"}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="xenon-btn-subtle h-9 px-4 text-xs font-black" onClick={() => openProfilePreview(result)}>Profile</button>
                              <button className="xenon-btn h-9 px-4 text-xs font-black" disabled={Boolean(relationship)} onClick={() => addFriend(result.id)}>
                                {relationship || "Add Friend"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {friends.length > 0 && (
                  <div className="xenon-panel p-6 sm:p-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-6">My Connections</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {friends.map((friendship) => (
                        <div key={friendship.id} className="xenon-panel-muted group flex items-center justify-between p-4 rounded-2xl hover:bg-white/40 transition-colors">
                          <div className="flex items-center gap-3">
                            <ProfileAvatar name={friendship.friend.full_name || friendship.friend.username} avatarUrl={friendship.friend.avatar_url} size="md" />
                            <div>
                              <p className="font-black text-sm">{friendship.friend.full_name || friendship.friend.username}</p>
                              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Lvl {friendship.friend.level || 1}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="h-9 w-9 rounded-xl bg-[var(--panel-soft)] flex items-center justify-center hover:text-[var(--accent)] transition-colors" onClick={() => openProfilePreview(friendship.friend)} title="View Profile">
                              <User className="h-5 w-5" />
                            </button>
                            <button className="h-9 w-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all" onClick={() => removeFriend(friendship.id)} title="Remove Friend">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {incomingFriendRequests.length > 0 && (
                  <div className="xenon-panel p-6 sm:p-8 border-blue-500/30 bg-blue-500/5">
                    <div className="flex items-center gap-3 mb-6 text-blue-500">
                      <Bell className="h-5 w-5" />
                      <h3 className="text-xs font-black uppercase tracking-widest">Incoming Requests</h3>
                    </div>
                    <div className="space-y-3">
                      {incomingFriendRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between bg-white/60 p-4 rounded-2xl border border-blue-500/10">
                          <div className="flex items-center gap-3">
                            <ProfileAvatar name={request.friend.full_name || request.friend.username} avatarUrl={request.friend.avatar_url} size="sm" />
                            <p className="font-black text-sm">{request.friend.full_name || request.friend.username}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="xenon-btn h-9 px-6 text-xs font-black" onClick={() => answerRequest(request.id, "accept")}>Accept</button>
                            <button className="xenon-btn-subtle h-9 px-6 text-xs font-black bg-white/50 border-none" onClick={() => answerRequest(request.id, "decline")}>Decline</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === "account" && (
              <motion.div key="account" {...motionProps} className="space-y-6">
                <div className="xenon-panel p-6 sm:p-8">
                  <h3 className="text-xl font-black tracking-tight">Subscription & redemption</h3>
                  <p className="mt-1 text-sm text-[var(--muted)] font-medium mb-6">
                    Upgrade with a code until Stripe billing is enabled. Current plan: <strong className="uppercase">{currentPlan}</strong>.
                  </p>
                  <PlanComparisonCards currentPlan={currentPlan} compact />
                  <div className="flex flex-wrap gap-2 max-w-md">
                    <input
                      className="xenon-input flex-1 min-w-[140px]"
                      placeholder="PRO123, MAX456, or FREE"
                      value={redeemCode}
                      onChange={(e) => setRedeemCode(e.target.value)}
                    />
                    <button
                      className="xenon-btn"
                      type="button"
                      onClick={async () => {
                        try {
                          await redeemPlanCode(redeemCode);
                          setRedeemMessage("Plan upgraded!");
                          setRedeemCode("");
                        } catch (err) {
                          setRedeemMessage(err.message || "Invalid code.");
                        }
                      }}
                    >
                      Redeem
                    </button>
                  </div>
                  {redeemMessage && <p className="text-xs text-[var(--accent)] mt-2">{redeemMessage}</p>}
                </div>

                <div className="xenon-panel p-6 sm:p-8">
                  <h3 className="text-xl font-black tracking-tight">Account Security</h3>
                  <p className="mt-1 text-sm text-[var(--muted)] font-medium mb-8">Keep your account safe and your credentials up to date.</p>
                  
                  <div className="space-y-6 max-w-md">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Change Password</label>
                      <div className="flex gap-3">
                        <input className="xenon-input h-14 font-medium" type="password" placeholder="New Secret Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button className="xenon-btn px-8 h-14" onClick={submitPassword}>Update</button>
                      </div>
                      <p className="text-[10px] text-[var(--muted)] font-medium">Use at least 8 characters with a mix of letters and numbers.</p>
                    </div>
                  </div>
                </div>

                <div className="xenon-panel p-6 sm:p-8 border-red-500/20 bg-red-500/5">
                  <h3 className="text-xl font-black tracking-tight text-red-500">Danger Zone</h3>
                  <p className="mt-1 text-sm text-[var(--muted)] font-medium mb-8">Permanent actions regarding your Xenon Code account.</p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-red-500/20 bg-white/40">
                    <div>
                      <p className="font-black">Sign Out of All Devices</p>
                      <p className="text-xs text-[var(--muted)] font-medium">You will be required to log in again on all platforms.</p>
                    </div>
                    <button className="xenon-btn-subtle h-12 px-8 bg-red-500/10 text-red-500 border-none font-black" onClick={() => useAppStore.getState().signOut()}>
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Status Notifications */}
      <AnimatePresence>
        {status && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 right-10 z-[100]">
            <div className="xenon-panel bg-[var(--success)] text-white border-none px-6 py-3 shadow-2xl flex items-center gap-3">
              <Check className="h-5 w-5" />
              <p className="text-sm font-black">{status}</p>
              <button onClick={() => setStatus("")} className="ml-2 hover:opacity-70"><X className="h-4 w-4" /></button>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 right-10 z-[100]">
            <div className="xenon-panel bg-red-500 text-white border-none px-6 py-3 shadow-2xl flex items-center gap-3">
              <X className="h-5 w-5" />
              <p className="text-sm font-black">{error}</p>
              <button onClick={() => setError("")} className="ml-2 hover:opacity-70"><X className="h-4 w-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Preview Modal */}
      <AnimatePresence>
        {previewProfile && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4 md:p-8 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="xenon-panel w-full max-w-3xl max-h-full overflow-y-auto shadow-2xl xenon-scroll"
            >
              <div className="h-32 bg-gradient-to-r from-[var(--accent)] to-sky-400 relative">
                <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/20 text-white backdrop-blur flex items-center justify-center hover:bg-black/40 transition-colors" onClick={() => setPreviewProfile(null)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="px-8 pb-10">
                <div className="relative -mt-16 mb-6">
                  <ProfileAvatar name={previewProfile.full_name || previewProfile.username} avatarUrl={previewProfile.avatar_url} size="xl" className="shadow-2xl ring-8 ring-[var(--panel)]" />
                </div>
                
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">{previewProfile.full_name || previewProfile.username}</h2>
                    <p className="text-[var(--muted)] font-bold uppercase tracking-widest text-sm mt-1">@{previewProfile.username}</p>
                    <p className="mt-4 text-lg font-medium max-w-lg leading-relaxed">{previewProfile.headline || "A dedicated Python student exploring the world of code."}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="xenon-panel-muted px-6 py-3 text-center">
                      <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-1">Level</p>
                      <p className="text-2xl font-black">{previewProfile.level || 1}</p>
                    </div>
                    <div className="xenon-panel-muted px-6 py-3 text-center">
                      <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-1">Rank</p>
                      <p className="text-2xl font-black">#{previewProfile.rank || "--"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-10 border-t border-[var(--border)]">
                  <AchievementGrid achievements={previewAchievements} compact />
                </div>

                {previewProfile.about_me && (
                  <div className="mt-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-3">About Me</p>
                    <p className="text-sm text-[var(--muted)] leading-relaxed font-medium bg-[var(--panel-soft)] p-6 rounded-2xl">{previewProfile.about_me}</p>
                  </div>
                )}
                
                <div className="mt-10 flex justify-end gap-3">
                  <button className="xenon-btn-subtle px-8 h-12 font-black" onClick={() => setPreviewProfile(null)}>Close Profile</button>
                  {existingRelationships.get(previewProfile.id) === undefined && previewProfile.id !== profile?.id && (
                    <button className="xenon-btn px-8 h-12 shadow-xl shadow-[var(--accent-soft)]" onClick={() => addFriend(previewProfile.id)}>Add Friend</button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {showUpgradePrompt && (
        <UpgradeModal onClose={() => setShowUpgradePrompt(false)} />
      )}
    </>
  );
}
