/**
 * Community Pass — Phase 1A prototype data.
 *
 * Everything here is local/mock data for the prototype. There is no backend —
 * `MEMBER_STATES` stands in for a member record the app would otherwise fetch.
 *
 * PRODUCT RULES BAKED INTO THIS FILE (do not casually edit without re-reading
 * the product spec):
 *  - Milestones are BENEFIT THRESHOLDS, not tiers/levels/status. There is no
 *    member-facing name for "a member who has passed 250 points."
 *  - Lifetime points never reset after crossing a milestone.
 *  - `lifetimePoints` for every member state is always the exact sum of that
 *    state's `completedActivities` — the two must never be authored separately.
 */

export interface CompletedActivity {
  id: string;
  title: string;
  points: number;
  /** ISO date string (yyyy-mm-dd) */
  date: string;
}

export interface OpenActivity {
  id: string;
  title: string;
  description: string;
  points: number;
  endDate: string;
  illustrationType: "spot";
  illustrationName: string;
}

export interface Milestone {
  points: number;
  benefit: string;
}

/** Benefit unlock thresholds, in lifetime points. Order matters. */
export const MILESTONES: Milestone[] = [
  { points: 250, benefit: "Early access to select Member's Mark opportunities" },
  { points: 1000, benefit: "Additional Community benefits" },
  { points: 3000, benefit: "More Community benefits" },
];

/** Today, fixed for prototype determinism (matches the environment date). */
export const PROTOTYPE_TODAY = "2026-09-24";

export const MEMBER_NAME = "Onder";
export const MEMBER_TENURE_START = "2026-06-01"; // "In the community since June 2026"

// ---------------------------------------------------------------------------
// Open activities — shown on Community Home regardless of member state.
// ---------------------------------------------------------------------------

export const OPEN_ACTIVITIES: OpenActivity[] = [
  {
    id: "shape-products",
    title: "See how members help shape products",
    description: "Follow feedback from idea to club.",
    points: 30,
    endDate: "2026-11-01",
    illustrationType: "spot",
    illustrationName: "Community&Giving",
  },
  {
    id: "tell-us",
    title: "Tell us what you think",
    description: "Share your take on products and experiences.",
    points: 10,
    endDate: "2026-10-15",
    illustrationType: "spot",
    illustrationName: "Featured",
  },
];

// ---------------------------------------------------------------------------
// Completed-activity generation
// ---------------------------------------------------------------------------

const TITLE_POOL = [
  "Welcome to the community!",
  "Welcome aboard!",
  "Tell us what you think",
  "See how members help shape products",
  "Share your pantry favorites",
  "Rate your last shopping trip",
  "Product testing feedback: snacks",
  "Community check-in: summer edition",
  "Help shape our next Member's Mark launch",
  "Quick poll: weekend shopping habits",
  "Tell us about your last visit",
  "Vote on new flavor ideas",
  "Share feedback on packaging",
  "Help us improve the app",
  "Year-end community reflection",
];

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Splits `totalPoints` into a plausible sequence of completed activities that
 * sum to EXACTLY `totalPoints`. Dates are spaced between `sinceIso` and
 * `PROTOTYPE_TODAY`. Deterministic — no randomness — so state math is stable
 * across renders and screenshots.
 */
function buildCompletedActivities(totalPoints: number, sinceIso: string): CompletedActivity[] {
  const chunks: number[] = [];
  let remaining = totalPoints;
  while (remaining > 0) {
    let chunk: number;
    if (remaining >= 200) chunk = 100;
    else if (remaining >= 100) chunk = 50;
    else if (remaining >= 50) chunk = 30;
    else if (remaining >= 30) chunk = 20;
    else chunk = remaining;
    chunks.push(chunk);
    remaining -= chunk;
  }

  const since = new Date(sinceIso + "T00:00:00").getTime();
  const today = new Date(PROTOTYPE_TODAY + "T00:00:00").getTime();
  const totalDays = Math.max(1, Math.round((today - since) / (1000 * 60 * 60 * 24)));
  const step = Math.max(1, Math.floor(totalDays / Math.max(1, chunks.length)));

  return chunks.map((points, i) => ({
    id: `activity-${i}`,
    title: TITLE_POOL[i % TITLE_POOL.length],
    points,
    date: addDays(sinceIso, Math.min(totalDays, i * step)),
  }));
}

// ---------------------------------------------------------------------------
// Primary member state (State B) — authored by hand for realism/polish.
// Sums to exactly 180, dated June–September 2026.
// ---------------------------------------------------------------------------

const PRIMARY_COMPLETED_ACTIVITIES: CompletedActivity[] = [
  { id: "p1", title: "Welcome to the community!", points: 10, date: "2026-06-03" },
  { id: "p2", title: "Welcome aboard!", points: 10, date: "2026-06-03" },
  { id: "p3", title: "See how members help shape products", points: 20, date: "2026-06-12" },
  { id: "p4", title: "Tell us what you think", points: 10, date: "2026-06-20" },
  { id: "p5", title: "Share your pantry favorites", points: 30, date: "2026-07-03" },
  { id: "p6", title: "Rate your last shopping trip", points: 15, date: "2026-07-18" },
  { id: "p7", title: "Product testing feedback: snacks", points: 25, date: "2026-08-02" },
  { id: "p8", title: "Community check-in: summer edition", points: 20, date: "2026-08-21" },
  { id: "p9", title: "Help shape our next Member's Mark launch", points: 30, date: "2026-09-06" },
  { id: "p10", title: "Quick poll: weekend shopping habits", points: 10, date: "2026-09-19" },
];

export type MemberStateId = "A" | "B" | "C" | "D" | "E";

export interface MemberState {
  id: MemberStateId;
  /** Internal dev-tool label only — never rendered as member-facing identity. */
  devLabel: string;
  completedActivities: CompletedActivity[];
}

function sumPoints(activities: CompletedActivity[]): number {
  return activities.reduce((total, a) => total + a.points, 0);
}

export const MEMBER_STATES: Record<MemberStateId, MemberState> = {
  A: {
    id: "A",
    devLabel: "Early progress (50 pts)",
    completedActivities: buildCompletedActivities(50, MEMBER_TENURE_START),
  },
  B: {
    id: "B",
    devLabel: "Primary (180 pts)",
    completedActivities: PRIMARY_COMPLETED_ACTIVITIES,
  },
  C: {
    id: "C",
    devLabel: "Just below first milestone (240 pts)",
    completedActivities: buildCompletedActivities(240, MEMBER_TENURE_START),
  },
  D: {
    id: "D",
    devLabel: "First benefit unlocked (300 pts)",
    completedActivities: buildCompletedActivities(300, MEMBER_TENURE_START),
  },
  E: {
    id: "E",
    devLabel: "Higher progress (1,200 pts)",
    completedActivities: buildCompletedActivities(1200, MEMBER_TENURE_START),
  },
};

export const DEFAULT_MEMBER_STATE_ID: MemberStateId = "B";

/** Single source of truth: lifetime points are always derived, never stored twice. */
export function getLifetimePoints(stateId: MemberStateId): number {
  return sumPoints(MEMBER_STATES[stateId].completedActivities);
}
