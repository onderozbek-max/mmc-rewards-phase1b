import * as React from "react";
import { Page } from "../components/Page";
import { Container } from "../components/Container";
import { Heading, Body } from "../components/Text";
import { Tag } from "../components/Tag";
import { Button } from "../components/Button";
import { CheckCircleIcon } from "../components/Icons/Icons";
import { ScreenHeader } from "../components/custom/ScreenHeader";
import { MilestoneProgressBar } from "../components/custom/MilestoneProgressBar";
import { getCommunityPassProgress, formatPoints } from "../utils/communityPassProgress";
import { navigateTo, useLifetimePoints } from "../utils/appState";
import { MILESTONES } from "../data/communityPassData";

/**
 * Community Pass detail — the member's full progression story, told as one
 * coherent narrative rather than a stack of separate requirement-shaped
 * cards: what this is → where I am → what's next → what I get → what comes
 * after. Minimal containerization on purpose (see AGENTS.md discussion in
 * the PR/commit history) — hierarchy comes from typography and spacing, not
 * from nesting everything in its own bordered card.
 */
export function CommunityPassPage() {
  const lifetimePoints = useLifetimePoints();
  const progress = getCommunityPassProgress(lifetimePoints);
  const { firstBenefit, firstBenefitUnlocked, pointsRemainingToFirstBenefit } = progress;

  return (
    <Page title="Community Pass" titleVisuallyHidden>
      <ScreenHeader title="Community Pass" onBack={() => navigateTo("home")} />

      <div style={{ paddingBottom: 40 }}>
        <Container>
          {/* A. What this is */}
          <div style={{ padding: "20px 16px 0" }}>
            <Heading as="h2" UNSAFE_style={{ margin: "0 0 8px", fontSize: 24 }}>
              Community Pass
            </Heading>
            <Body as="div" UNSAFE_style={{ margin: 0, color: "var(--ld-semantic-color-text-subtle)" }}>
              Take part in Community activities and earn points. Your lifetime points move you toward benefit
              milestones.
            </Body>
          </div>

          {/* B. Where I am — one grouped block, no card chrome */}
          <div style={{ padding: "20px 16px 0" }}>
            <div
              style={{
                background: "var(--ld-semantic-color-fill-subtle, #f3f5f7)",
                borderRadius: 12,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>{formatPoints(lifetimePoints)}</span>
                <span style={{ fontSize: 14, color: "var(--ld-semantic-color-text-subtle)" }}>lifetime points</span>
              </div>

              {!firstBenefitUnlocked ? (
                <>
                  <MilestoneProgressBar
                    min={0}
                    max={firstBenefit.points}
                    value={lifetimePoints}
                    a11yLabel={`${formatPoints(lifetimePoints)} of ${formatPoints(firstBenefit.points)} lifetime points toward your next benefit`}
                  />
                  <div>
                    <Body as="div" UNSAFE_style={{ margin: 0, fontWeight: 700 }}>
                      Next benefit: {firstBenefit.benefit}
                    </Body>
                    <Body as="div" UNSAFE_style={{ margin: "2px 0 0", color: "var(--ld-semantic-color-text-subtle)" }}>
                      {formatPoints(pointsRemainingToFirstBenefit)} points remaining
                    </Body>
                  </div>
                  {/*
                   * Phase 1B: the action lives right where the goal is
                   * understood — not at the bottom of the page after two more
                   * informational sections. This is the natural next step
                   * after "here's my goal," not an unrelated button. Once the
                   * goal is fulfilled below, this CTA recedes — the single
                   * "see open activities" affordance moves to the neutral
                   * informational section at the bottom of the page instead.
                   */}
                  <Button variant="primary" size="medium" onClick={() => navigateTo("home")}>
                    Explore activities
                  </Button>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircleIcon decorative style={{ color: "var(--ld-semantic-color-text-positive)" }} />
                    <Body as="div" UNSAFE_style={{ margin: 0, fontWeight: 700 }}>
                      {formatPoints(firstBenefit.points)}-point milestone: Completed
                    </Body>
                  </div>
                  <Body as="div" UNSAFE_style={{ margin: 0, color: "var(--ld-semantic-color-text-subtle)" }}>
                    Benefit unlocked: {firstBenefit.benefit}
                  </Body>
                </>
              )}
            </div>
          </div>

          {/* C + D. The broader journey — one continuous accumulation path, not
              three disconnected reward cards. Already-unlocked / next-benefit
              status is represented here (truthfully, without celebration) so
              it isn't repeated in the block above. */}
          <div style={{ padding: "28px 16px 0" }}>
            <Heading as="h3" UNSAFE_style={{ margin: "0 0 4px", fontSize: 18 }}>
              Your benefit journey
            </Heading>
            <Body as="div" UNSAFE_style={{ margin: "0 0 16px", color: "var(--ld-semantic-color-text-subtle)" }}>
              As your lifetime points grow, more benefits become available. Points never reset.
            </Body>

            <div>
              {MILESTONES.map((m, i) => {
                // Only the first, operational milestone (250) has real
                // achieved/next semantics here. 1,000 and 3,000 are real
                // future milestones, but since no benefit is built for them
                // yet, they always render as a plain future entry — never
                // "achieved" or an active "next benefit" promise, no matter
                // how many lifetime points a member has (see
                // Milestone.operational).
                const isUnlocked = m.operational && lifetimePoints >= m.points;
                const isNext = m.operational && !isUnlocked;
                const isLast = i === MILESTONES.length - 1;
                const lineColor = isUnlocked
                  ? "var(--wcp-semantic-color-surface-overlay-brand-bold, #283645)"
                  : "var(--ld-semantic-color-separator, #d8dee3)";

                return (
                  <div key={m.points} style={{ position: "relative", paddingLeft: 32, paddingBottom: isLast ? 0 : 24 }}>
                    {!isLast ? (
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          left: 7,
                          top: 20,
                          bottom: -4,
                          width: 2,
                          background: lineColor,
                        }}
                      />
                    ) : null}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 2,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isUnlocked ? "var(--ld-semantic-color-fill-positive-subtle, #e3f5e9)" : "transparent",
                        border: isUnlocked ? "none" : `2px solid ${lineColor}`,
                      }}
                    >
                      {isUnlocked ? (
                        <CheckCircleIcon decorative size="small" style={{ color: "var(--ld-semantic-color-text-positive)" }} />
                      ) : null}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <Body as="span" UNSAFE_style={{ margin: 0, fontWeight: 700 }}>
                        {formatPoints(m.points)} points
                      </Body>
                      {isUnlocked ? (
                        <Tag color="positive" size="small">
                          Already unlocked
                        </Tag>
                      ) : isNext ? (
                        <Tag color="brand" size="small">
                          Next benefit
                        </Tag>
                      ) : !m.operational ? (
                        <Tag color="neutral" size="small">
                          Future milestone
                        </Tag>
                      ) : null}
                    </div>
                    <Body
                      as="div"
                      UNSAFE_style={{
                        margin: "2px 0 0",
                        color: isUnlocked ? "var(--ld-semantic-color-text)" : "var(--ld-semantic-color-text-subtle)",
                      }}
                    >
                      {m.benefit}
                    </Body>
                  </div>
                );
              })}
            </div>
          </div>

          {/*
           * How points are earned — informational. While the 250 goal is
           * still active, the single CTA to activities lives above in block
           * B ("Explore activities") — no duplicate button here. Once the
           * goal is fulfilled, block B no longer carries a CTA (there's no
           * active goal to explore toward), so this becomes the page's one
           * neutral affordance back to open activities.
           */}
          <div style={{ padding: "8px 16px 0" }}>
            <Heading as="h3" UNSAFE_style={{ margin: "0 0 8px", fontSize: 18 }}>
              How points are earned
            </Heading>
            <Body as="div" UNSAFE_style={{ margin: "0 0 12px", color: "var(--ld-semantic-color-text-subtle)" }}>
              Eligible Community activities show how many points you can earn before you start. Not every activity
              is points-eligible.
            </Body>
            {firstBenefitUnlocked ? (
              <Button variant="secondary" size="medium" onClick={() => navigateTo("home")}>
                See open activities
              </Button>
            ) : null}
          </div>
        </Container>
      </div>
    </Page>
  );
}
