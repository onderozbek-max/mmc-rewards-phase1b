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
 * Compact Community Pass entry point on Community Home.
 *
 * Phase 1B: still an ORIENTATION + ENTRY POINT, not a rewards dashboard —
 * but the goal (points remaining + what it unlocks) now leads instead of
 * the raw lifetime-points counter, so a member can register "what I'm
 * working toward" at a glance, without opening Community Pass. Open
 * Activities — the primary reason members come to Home — still reads as
 * materially more prominent than this single card.
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
