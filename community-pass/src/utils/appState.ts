/**
 * App-level shared state for the Community Pass prototype, built on top of
 * `store.ts` (per the Living Design hard rule: cross-component state MUST go
 * through the shared store, not React context).
 *
 * Nothing here is persisted to localStorage. That's deliberate: a plain link
 * to the prototype must always open on the primary member state (State B),
 * never on whatever a previous reviewer last left it in.
 */
import { useStore, setStoreValue, getStoreValue } from "./store";
import {
  DEFAULT_MEMBER_STATE_ID,
  getLifetimePoints,
  PROTOTYPE_TODAY,
  type CompletedActivity,
  type MemberStateId,
  type OpenActivity,
} from "../data/communityPassData";

export type ViewId = "home" | "communityPass" | "profile" | "activity";

const VIEW_KEY = "cp:view";
const ACTIVE_ACTIVITY_KEY = "cp:activeActivityId";
const MEMBER_STATE_KEY = "cp:memberStateId";
/**
 * Eligible activities completed *this session*, keyed by member state so
 * switching representative states never leaks completions between them.
 * Not persisted to localStorage — a plain link always opens on the primary
 * state (State B) with nothing pre-completed, per the prototype's reset
 * behavior.
 */
const SESSION_COMPLETIONS_KEY = "cp:sessionCompletedActivities";
type SessionCompletions = Partial<Record<MemberStateId, CompletedActivity[]>>;

export function useView(): ViewId {
  return useStore<ViewId>(VIEW_KEY, "home");
}

export function navigateTo(view: ViewId, activityId?: string): void {
  if (activityId !== undefined) {
    setStoreValue<string | null>(ACTIVE_ACTIVITY_KEY, activityId);
  }
  setStoreValue<ViewId>(VIEW_KEY, view);
  // Every screen transition should land the member at the top of the new screen.
  if (typeof window !== "undefined") window.scrollTo(0, 0);
}

export function useActiveActivityId(): string | null {
  return useStore<string | null>(ACTIVE_ACTIVITY_KEY, null);
}

export function useMemberStateId(): MemberStateId {
  return useStore<MemberStateId>(MEMBER_STATE_KEY, DEFAULT_MEMBER_STATE_ID);
}

/**
 * Switching representative state is also the prototype's "reset" control —
 * picking a state (including the one already active) clears this session's
 * activity completions so the demo can be replayed from a clean baseline.
 */
export function setMemberStateId(id: MemberStateId): void {
  setStoreValue<MemberStateId>(MEMBER_STATE_KEY, id);
  setStoreValue<SessionCompletions>(SESSION_COMPLETIONS_KEY, {});
}

function getSessionCompletionsForState(stateId: MemberStateId): CompletedActivity[] {
  const all = getStoreValue<SessionCompletions>(SESSION_COMPLETIONS_KEY) ?? {};
  return all[stateId] ?? [];
}

/** Eligible activities completed *this session* for the given member state. */
export function useSessionCompletedActivities(stateId: MemberStateId): CompletedActivity[] {
  const all = useStore<SessionCompletions>(SESSION_COMPLETIONS_KEY, {});
  return all[stateId] ?? [];
}

/** IDs of open activities already completed this session, for the active member state. */
export function useCompletedOpenActivityIds(): string[] {
  const stateId = useMemberStateId();
  const completions = useSessionCompletedActivities(stateId);
  return completions.map((a) => a.id);
}

/**
 * The member's true current lifetime points: the static representative-state
 * total plus any eligible activities completed this session. This is the
 * single source every screen (Home, Community Pass, Profile) must read from
 * so a completed activity is reflected everywhere, immediately and
 * consistently — no screen may show a stale total. Identical in control and
 * treatment: this is foundational Phase 1A accounting, not a 1B behavior.
 */
export function useLifetimePoints(): number {
  const stateId = useMemberStateId();
  const sessionPoints = useSessionCompletedActivities(stateId).reduce((sum, a) => sum + a.points, 0);
  return getLifetimePoints(stateId) + sessionPoints;
}

/** Base (representative-state) history plus this session's completions, newest first. */
export function useCompletedActivitiesForProfile(baseActivities: CompletedActivity[]): CompletedActivity[] {
  const stateId = useMemberStateId();
  const sessionActivities = useSessionCompletedActivities(stateId);
  return [...baseActivities, ...sessionActivities].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Marks an eligible open activity as successfully completed and awards its
 * points to the member's underlying lifetime-point state. This is a plain
 * state update only — no completion sheet, progress animation, or
 * progress-delta message is shown (that explicit feedback is Phase 1C
 * scope). Idempotent: completing the same activity twice never awards
 * points twice. Identical in control and treatment.
 */
export function markOpenActivityCompleted(activity: OpenActivity): void {
  const stateId = getStoreValue<MemberStateId>(MEMBER_STATE_KEY) ?? DEFAULT_MEMBER_STATE_ID;
  const all = getStoreValue<SessionCompletions>(SESSION_COMPLETIONS_KEY) ?? {};
  const existing = all[stateId] ?? [];
  if (existing.some((a) => a.id === activity.id)) return; // already awarded — no double credit

  const record: CompletedActivity = {
    id: activity.id,
    title: activity.title,
    points: activity.points,
    date: PROTOTYPE_TODAY,
  };
  setStoreValue<SessionCompletions>(SESSION_COMPLETIONS_KEY, { ...all, [stateId]: [...existing, record] });
}
