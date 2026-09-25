import * as React from "react";
import { Body, Heading } from "../../components/Text";
import { ChevronRightIcon } from "../../components/Icons/Icons";
import { MilestoneProgressBar } from "./MilestoneProgressBar";
import { formatPoints, type CommunityPassProgress } from "../../utils/communityPassProgress";

export interface CommunityPassCardProps {
  progress: CommunityPassProgress;
  onView: () => void;
}

/**
 * Community Pass goal block on Community Home.
 *
 * Phase 1B revision: this no longer stands alone as its own bordered card.
 * It is the top compartment of a single shared panel — see
 * `CommunityHomePage` — that also contains the activities that can move the
 * member toward this goal, so the goal and the ways to act on it read as one
 * system instead of two separately-framed pieces of the page. This
 * component therefore renders no background/border of its own; it inherits
 * the panel's surface. The goal (points remaining + what it unlocks) leads
 * instead of the raw lifetime-points counter, so a member can register
 * "what I'm working toward" at a glance, without opening Community Pass.
 */
export function CommunityPassCard({ progress, onView }: CommunityPassCardProps) {
  const { lifetimePoints, nextMilestone, pointsRemaining, intervalFloor, intervalCeiling } = progress;

  return (
    <button
      type="button"
      onClick={onView}
      aria-label={
        nextMilestone
          ? `Community Pass — ${formatPoints(pointsRemaining)} points to your next benefit, ${nextMilestone.benefit}. ${formatPoints(lifetimePoints)} lifetime points.`
          : `Community Pass — ${formatPoints(lifetimePoints)} lifetime points`
      }
      style={{
        width: "100%",
        textAlign: "left",
        background: "transparent",
        border: "none",
        borderRadius: 8,
        padding: 0,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div aria-hidden style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Body as="div" UNSAFE_style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: "0.02em", color: "var(--ld-semantic-color-text-subtle)" }}>
          COMMUNITY PASS
        </Body>
        <ChevronRightIcon decorative style={{ color: "var(--ld-semantic-color-text-subtle)" }} />
      </div>

      <div aria-hidden style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {nextMilestone ? (
          <>
            <Heading
              as="h3"
              UNSAFE_style={{ margin: 0, fontSize: 17, color: "var(--wcp-semantic-color-surface-overlay-brand-bold, #283645)" }}
            >
              {formatPoints(pointsRemaining)} points to your next benefit
            </Heading>
            <Body as="div" UNSAFE_style={{ margin: 0, fontSize: 13, color: "var(--ld-semantic-color-text-subtle)" }}>
              {nextMilestone.benefit}
            </Body>
            <MilestoneProgressBar min={intervalFloor} max={intervalCeiling} value={lifetimePoints} a11yLabel="" />
            <Body as="div" UNSAFE_style={{ margin: 0, fontSize: 13, color: "var(--ld-semantic-color-text-subtle)" }}>
              {formatPoints(lifetimePoints)} lifetime points
            </Body>
          </>
        ) : (
          <>
            <Heading as="h3" UNSAFE_style={{ margin: 0, fontSize: 17 }}>
              Community Pass
            </Heading>
            <Body as="div" UNSAFE_style={{ margin: 0, fontSize: 13, color: "var(--ld-semantic-color-text-subtle)" }}>
              You've unlocked every benefit milestone we've defined so far. {formatPoints(lifetimePoints)} lifetime
              points.
            </Body>
          </>
        )}
      </div>
    </button>
  );
}
