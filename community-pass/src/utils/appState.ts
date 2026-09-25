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
import { DEFAULT_MEMBER_STATE_ID, type MemberStateId } from "../data/communityPassData";

export type ViewId = "home" | "communityPass" | "profile" | "activity";

const VIEW_KEY = "cp:view";
const ACTIVE_ACTIVITY_KEY = "cp:activeActivityId";
const MEMBER_STATE_KEY = "cp:memberStateId";
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

/** Activities the member has completed *this session* (not persisted). */
export function useCompletedOpenActivityIds(): string[] {
  return useStore<string[]>(COMPLETED_OPEN_ACTIVITIES_KEY, []);
}

export function markOpenActivityCompleted(id: string): void {
  // Read the current value directly (not via the hook) to avoid a stale closure.
  const existing = getStoreValue<string[]>(COMPLETED_OPEN_ACTIVITIES_KEY) ?? [];
  const next = existing.includes(id) ? existing : [...existing, id];
  setStoreValue<string[]>(COMPLETED_OPEN_ACTIVITIES_KEY, next);
}
