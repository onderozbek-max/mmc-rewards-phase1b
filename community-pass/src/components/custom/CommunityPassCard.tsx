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
 * Community Pass goal module on Community Home.
 *
 * Phase 1B: a self-contained card that ends before "Ways to make progress"
 * begins — the goal and the ways to act on it are two distinct, bordered
 * pieces of the page, not one shared container. The causal relationship
 * between them comes from proximity and the "Ways to make progress" label
 * immediately below (see `CommunityHomePage`), not from sharing a border.
 * Inside the module, the goal (points remaining + what it unlocks) leads
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
        background: "var(--ld-semantic-color-surface, #ffffff)",
        border: "1px solid var(--ld-semantic-color-separator, #e0e8ee)",
        borderRadius: 12,
        padding: "14px 16px",
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
            {/*
             * Named benefit ("what") — bumped from subtle-gray caption weight
             * to full text color + medium weight so it reads as the specific
             * reward being worked toward, not decorative supporting copy.
             * The headline above already carries "how far" (points
             * remaining); this line and the bar below it carry "what" and
             * "how far, visually," respectively. No copy changed.
             */}
            <Body as="div" UNSAFE_style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--ld-semantic-color-text)" }}>
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
