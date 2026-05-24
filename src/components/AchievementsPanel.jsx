import { 
  Code, School, Star, Award, Trophy, 
  Flame, Zap, Medal, Crown 
} from "lucide-react";

export const ACHIEVEMENT_DEFS = {
  first_project: { icon: <Code className="h-5 w-5" />, label: "First Project", desc: "Saved your first project" },
  joined_class: { icon: <School className="h-5 w-5" />, label: "Class Member", desc: "Joined a class" },
  skills_5: { icon: <Star className="h-5 w-5 text-[var(--warning)]" />, label: "Getting Started", desc: "5 practice questions correct" },
  skills_25: { icon: <Star className="h-5 w-5 text-[var(--accent)]" />, label: "Practice Pro", desc: "25 practice questions correct" },
  skills_100: { icon: <Trophy className="h-5 w-5 text-[var(--warning)]" />, label: "Master Coder", desc: "100 practice questions correct" },
  streak_3: { icon: <Flame className="h-5 w-5 text-[var(--warning)]" />, label: "On a Roll", desc: "3-day login streak" },
  streak_7: { icon: <Zap className="h-5 w-5 text-[var(--accent)]" />, label: "Week Warrior", desc: "7-day login streak" },
  top_3: { icon: <Award className="h-5 w-5 text-[var(--muted)]" />, label: "Top 3", desc: "Reached top 3 in your class" },
  top_1: { icon: <Crown className="h-5 w-5 text-[var(--warning)]" />, label: "Class Champion", desc: "Reached rank #1 in your class" },
  rank_1: { icon: <Medal className="h-5 w-5 text-[var(--warning)]" />, label: "Gold Badge", desc: "Finished 1st in your class" },
  rank_2: { icon: <Medal className="h-5 w-5 text-[var(--muted)]" />, label: "Silver Badge", desc: "Finished 2nd in your class" },
  rank_3: { icon: <Medal className="h-5 w-5 text-[var(--warning)]" />, label: "Bronze Badge", desc: "Finished 3rd in your class" },
};


export function AchievementGrid({ achievements = [], warning = "", compact = false }) {
  const earnedKeys = new Set((achievements || []).map((entry) => entry.achievement_key));
  const allAchievements = Object.entries(ACHIEVEMENT_DEFS);

  return (
    <div>
      <p className="xenon-kicker mb-3">Achievements ({earnedKeys.size}/{allAchievements.length})</p>
      {warning ? <p className="mb-3 text-sm text-[var(--warning)]">{warning}</p> : null}
      <div className={`grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"}`}>
        {allAchievements.map(([key, def]) => {
          const earned = earnedKeys.has(key);
          return (
            <div
              key={key}
              className="achievement-card xenon-panel-muted p-4 text-center"
              data-earned={earned}
              title={earned ? `Earned: ${def.desc}` : `Locked: ${def.desc}`}
            >
              <span className="achievement-icon" aria-hidden="true">
                {def.icon}
              </span>
              <p className="mt-3 text-xs font-semibold leading-tight">{def.label}</p>
              <p className="mt-1 text-xs leading-tight text-[var(--muted)]">{def.desc}</p>
              {earned ? <span className="mt-2 inline-flex text-xs font-bold text-[var(--accent)]">Earned</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AchievementsPanel({ achievements = [], warning = "", title = "Achievements", subtitle = "", compact = false }) {
  return (
    <section className="xenon-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p> : null}
        </div>
      </div>
      <div className="mt-5">
        <AchievementGrid achievements={achievements} warning={warning} compact={compact} />
      </div>
    </section>
  );
}
