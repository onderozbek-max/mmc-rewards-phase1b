import * as React from "react";
import { Body, Heading } from "../../components/Text";
import { ChevronRightIcon, CheckCircleIcon } from "../../components/Icons/Icons";
import { MilestoneProgressBar } from "./MilestoneProgressBar";
import { formatPoints, type CommunityPassProgress } from "../../utils/communityPassProgress";

export interface CommunityPassCardProps {
  progress: CommunityPassProgress;
  onView: () => void;
}

/**
 * Community Pass goal module on Community Home — the Phase 1B EXPERIMENT
 * treatment. Underlying value (points, threshold, benefit) is identical to
 * the Phase 1A control; only presentation differs here.
 *
 * While the operational (250-point) benefit is still ahead, this card leads
 * with the goal itself — points remaining + the specific benefit it unlocks
 * — so a member registers "what I'm working toward" at a glance. Once that
 * benefit is truthfully unlocked, the treatment gracefully recedes to a
 * plain completed/unlocked state (mirrors the Phase 1A foundation's
 * completed-state treatment) instead of manufacturing a new active goal
 * toward 1,000 — that benefit isn't operationalized in this prototype.
 */
export function CommunityPassCard({ progress, onView }: CommunityPassCardProps) {
  const { lifetimePoints, firstBenefit, firstBenefitUnlocked, pointsRemainingToFirstBenefit } = progress;

  return (
    <button
      type="button"
      onClick={onView}
      aria-label={
        firstBenefitUnlocked
          ? `Community Pass — ${formatPoints(firstBenefit.points)}-point benefit unlocked, ${firstBenefit.benefit}. ${formatPoints(lifetimePoints)} lifetime points.`
          : `Community Pass — ${formatPoints(pointsRemainingToFirstBenefit)} points to your next benefit, ${firstBenefit.benefit}. ${formatPoints(lifetimePoints)} lifetime points.`
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
        {!firstBenefitUnlocked ? (
          <>
            <Heading
              as="h3"
              UNSAFE_style={{ margin: 0, fontSize: 17, color: "var(--wcp-semantic-color-surface-overlay-brand-bold, #283645)" }}
            >
              {formatPoints(pointsRemainingToFirstBenefit)} points to your next benefit
            </Heading>
            <Body as="div" UNSAFE_style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--ld-semantic-color-text)" }}>
              {firstBenefit.benefit}
            </Body>
            <MilestoneProgressBar min={0} max={firstBenefit.points} value={lifetimePoints} a11yLabel="" />
            <Body as="div" UNSAFE_style={{ margin: 0, fontSize: 13, color: "var(--ld-semantic-color-text-subtle)" }}>
              {formatPoints(lifetimePoints)} lifetime points
            </Body>
          </>
        ) : (
          <>
            {/*
             * The 250 goal is complete — the motivational treatment recedes
             * to a truthful completed/unlocked state instead of continuing
             * to point at 1,000 (not an operationalized benefit here).
             */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircleIcon decorative size="small" style={{ color: "var(--ld-semantic-color-text-positive)" }} />
              <Heading as="h3" UNSAFE_style={{ margin: 0, fontSize: 17 }}>
                {formatPoints(firstBenefit.points)}-point benefit unlocked
              </Heading>
            </div>
            <Body as="div" UNSAFE_style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--ld-semantic-color-text)" }}>
              {firstBenefit.benefit}
            </Body>
            <Body as="div" UNSAFE_style={{ margin: 0, fontSize: 13, color: "var(--ld-semantic-color-text-subtle)" }}>
              {formatPoints(lifetimePoints)} lifetime points
            </Body>
          </>
        )}
      </div>
    </button>
  );
}
