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
  OPEN_ACTIVITIES,
  PROTOTYPE_TODAY,
  getLifetimePoints,
  type CompletedActivity,
  type MemberStateId,
  type OpenActivity,
} from "../data/communityPassData";

export type ViewId = "home" | "communityPass" | "profile" | "activity";

const VIEW_KEY = "cp:view";
const ACTIVE_ACTIVITY_KEY = "cp:activeActivityId";
const MEMBER_STATE_KEY = "cp:memberStateId";
/**
 * Composite "stateId:activityId" strings, scoped per representative member
 * state. Session-completed activities silently update that state's
 * underlying lifetime points (Phase 1B correction) — scoping per state keeps
 * switching the dev state switcher from leaking one state's completions
 * (and points) into another's.
 */
const COMPLETED_OPEN_ACTIVITIES_KEY = "cp:completedOpenActivityIds";

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

export function setMemberStateId(id: MemberStateId): void {
  setStoreValue<MemberStateId>(MEMBER_STATE_KEY, id);
}

function compositeActivityId(stateId: MemberStateId, activityId: string): string {
  return `${stateId}:${activityId}`;
}

/**
 * Activity ids the member's *current representative state* has completed
 * this session (not persisted). Scoped per state, so switching the dev
 * state switcher never carries one state's completions into another's.
 */
export function useCompletedOpenActivityIds(): string[] {
  const stateId = useMemberStateId();
  const composite = useStore<string[]>(COMPLETED_OPEN_ACTIVITIES_KEY, []);
  const prefix = `${stateId}:`;
  return composite.filter((id) => id.startsWith(prefix)).map((id) => id.slice(prefix.length));
}

/**
 * Phase 1B correction: completing an eligible activity silently updates the
 * member's underlying Community Pass state (this was always a Phase 1A-level
 * capability — it was never actually deferred to 1C). What Phase 1C still
 * owns is the dedicated post-completion feedback moment, not the accounting.
 */
export function markOpenActivityCompleted(stateId: MemberStateId, activityId: string): void {
  const key = compositeActivityId(stateId, activityId);
  // Read the current value directly (not via the hook) to avoid a stale closure.
  const existing = getStoreValue<string[]>(COMPLETED_OPEN_ACTIVITIES_KEY) ?? [];
  const next = existing.includes(key) ? existing : [...existing, key];
  setStoreValue<string[]>(COMPLETED_OPEN_ACTIVITIES_KEY, next);
}

/** The open activities the member's current state has completed this session. */
export function useCompletedOpenActivities(): OpenActivity[] {
  const ids = useCompletedOpenActivityIds();
  return OPEN_ACTIVITIES.filter((activity) => ids.includes(activity.id));
}

/**
 * Lifetime points = the state's static historical baseline + any eligible
 * activities completed this session. This is the single source of truth
 * every screen (Home, Community Pass detail, Profile) must read from so the
 * corrected total is always consistent and never double-counted.
 */
export function useLifetimePoints(): number {
  const stateId = useMemberStateId();
  const base = getLifetimePoints(stateId);
  const sessionExtra = useCompletedOpenActivities().reduce((sum, activity) => sum + activity.points, 0);
  return base + sessionExtra;
}

/** Session completions reshaped as `CompletedActivity` records for Profile's history list. */
export function useSessionCompletedActivities(): CompletedActivity[] {
  return useCompletedOpenActivities().map((activity) => ({
    id: activity.id,
    title: activity.title,
    points: activity.points,
    date: PROTOTYPE_TODAY,
  }));
}
