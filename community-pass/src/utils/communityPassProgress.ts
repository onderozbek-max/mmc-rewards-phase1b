/**
 * Pure Community Pass progression math — no React, no state, easy to unit-reason about.
 *
 * Model: lifetime points never reset. Milestones are benefit thresholds a
 * member accumulates past, not tiers/levels. See MILESTONES in
 * `src/data/communityPassData.ts` for the canonical threshold list.
 */
import { FIRST_BENEFIT, MILESTONES, type Milestone } from "../data/communityPassData";

export interface CommunityPassProgress {
  lifetimePoints: number;
  /** Milestones already reached, in ascending order. */
  unlockedMilestones: Milestone[];
  /** The next milestone to work toward, or null if every defined milestone is unlocked. */
  nextMilestone: Milestone | null;
  /** Points still needed to reach `nextMilestone`. 0 when there is no next milestone. */
  pointsRemaining: number;
  /** Lower bound of the current progress interval (last unlocked milestone, or 0). */
  intervalFloor: number;
  /** Upper bound of the current progress interval (nextMilestone, or intervalFloor when maxed). */
  intervalCeiling: number;
  /**
   * This prototype operationalizes exactly one benefit: the 250-point
   * milestone. These fields are the single source of truth for "is the
   * member's real, running benefit unlocked" — they intentionally ignore
   * 1,000/3,000, which are future roadmap milestones with no built benefit
   * yet (see `Milestone.operational` in communityPassData.ts). Both the
   * Phase 1A control and the Phase 1B treatment must read from these same
   * fields so the underlying product truth never diverges between them.
   */
  firstBenefit: Milestone;
  firstBenefitUnlocked: boolean;
  pointsRemainingToFirstBenefit: number;
}

export function getCommunityPassProgress(lifetimePoints: number): CommunityPassProgress {
  const unlockedMilestones = MILESTONES.filter((m) => lifetimePoints >= m.points);
  const nextMilestone = MILESTONES.find((m) => lifetimePoints < m.points) ?? null;

  const intervalFloor = unlockedMilestones.length > 0 ? unlockedMilestones[unlockedMilestones.length - 1].points : 0;
  const intervalCeiling = nextMilestone ? nextMilestone.points : intervalFloor;

  const firstBenefitUnlocked = lifetimePoints >= FIRST_BENEFIT.points;

  return {
    lifetimePoints,
    unlockedMilestones,
    nextMilestone,
    pointsRemaining: nextMilestone ? nextMilestone.points - lifetimePoints : 0,
    intervalFloor,
    intervalCeiling,
    firstBenefit: FIRST_BENEFIT,
    firstBenefitUnlocked,
    pointsRemainingToFirstBenefit: firstBenefitUnlocked ? 0 : FIRST_BENEFIT.points - lifetimePoints,
  };
}

export function formatPoints(points: number): string {
  return points.toLocaleString("en-US");
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function formatMonthYear(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
