import * as React from "react";
import { Page } from "../components/Page";
import { Container } from "../components/Container";
import { Heading, Body } from "../components/Text";
import { SectionHeader } from "../components/SectionHeader";
import { Card, CardContent } from "../components/Card";
import { ScreenHeader } from "../components/custom/ScreenHeader";
import { BottomNavBar, BOTTOM_NAV_HEIGHT } from "../components/custom/BottomNavBar";
import { CommunityPassCard } from "../components/custom/CommunityPassCard";
import { ActivityCard } from "../components/custom/ActivityCard";
import { FaqCallout } from "../components/custom/FaqCallout";
import { ChevronRightIcon, LockIcon } from "../components/Icons/Icons";
import { getCommunityPassProgress } from "../utils/communityPassProgress";
import { navigateTo, useCompletedOpenActivityIds, useLifetimePoints, useMemberStateId } from "../utils/appState";
import { MEMBER_NAME, MEMBER_STATES, OPEN_ACTIVITIES } from "../data/communityPassData";

export function CommunityHomePage() {
  const memberStateId = useMemberStateId();
  const lifetimePoints = useLifetimePoints();
  const progress = getCommunityPassProgress(lifetimePoints);
  const completedOpenActivityIds = useCompletedOpenActivityIds();
  const completedCount = MEMBER_STATES[memberStateId].completedActivities.length + completedOpenActivityIds.length;

  return (
    <Page title="Member's Mark Community" titleVisuallyHidden>
      <ScreenHeader title="Member's Mark Community" />

      <div style={{ paddingBottom: BOTTOM_NAV_HEIGHT + 24 }}>
        <Container>
          <div style={{ padding: "20px 16px 0" }}>
            <div
              style={{
                background: "var(--wcp-semantic-color-surface-overlay-brand-bold, #283645)",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <Heading as="h2" UNSAFE_style={{ margin: "0 0 4px", color: "#fff", fontSize: 24 }}>
                Welcome, {MEMBER_NAME}
              </Heading>
              <Body as="div" UNSAFE_style={{ margin: 0, color: "rgba(255,255,255,0.75)" }}>
                In the community since June 2026
              </Body>
              <button
                type="button"
                onClick={() => navigateTo("profile")}
                style={{
                  marginTop: 16,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 12px",
                  cursor: "pointer",
                }}
              >
                <Body as="span" UNSAFE_style={{ margin: 0, color: "#fff", fontWeight: 600 }}>
                  {completedCount} activities completed
                </Body>
                <ChevronRightIcon decorative style={{ color: "#fff" }} />
              </button>
            </div>
          </div>

          {/*
           * Phase 1B: the Community Pass goal module is its own bordered
           * card — it ends here. While the 250 benefit is still ahead,
           * "Ways to make progress" follows immediately below it (tighter
           * top padding than the page's other section transitions) so the
           * two read as connected by proximity and labeling rather than by
           * sharing one container. Once the benefit is unlocked there is no
           * active goal driving that connection, so the section recedes to
           * neutral "Open activities" framing at standard spacing — the
           * same neutral framing the Phase 1A control always uses.
           */}
          <div style={{ padding: "16px 16px 0" }}>
            <CommunityPassCard progress={progress} onView={() => navigateTo("communityPass")} />
          </div>

          <div style={{ padding: progress.firstBenefitUnlocked ? "24px 16px 0" : "12px 16px 0" }}>
            <SectionHeader
              title={progress.firstBenefitUnlocked ? "Open activities" : "Ways to make progress"}
              count={OPEN_ACTIVITIES.length}
              headingLevel="h3"
              divider
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
              {OPEN_ACTIVITIES.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  completed={completedOpenActivityIds.includes(activity.id)}
                  onStart={() => navigateTo("activity", activity.id)}
                />
              ))}
            </div>
          </div>

          {/*
           * What's New + Member Favorites: the actual 250-point benefit.
           * Foundational — gated identically in control and treatment, not
           * a Phase 1B behavior. Locked with a plain truthful notice below
           * 250 lifetime points; both modules become genuinely accessible
           * (not just described) once the member crosses the threshold.
           */}
          {progress.firstBenefitUnlocked ? (
            <>
              <div style={{ padding: "24px 16px 0" }}>
                <SectionHeader title="What's new" headingLevel="h3" divider />
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
                  <Card>
                    <CardContent>
                      <Heading as="h4" UNSAFE_style={{ margin: "0 0 4px", fontSize: 15 }}>
                        Fall flavor lineup is here
                      </Heading>
                      <Body as="div" UNSAFE_style={{ margin: 0, color: "var(--ld-semantic-color-text-subtle)" }}>
                        See what's new on Member's Mark shelves this season.
                      </Body>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Heading as="h4" UNSAFE_style={{ margin: "0 0 4px", fontSize: 15 }}>
                        From idea to club: snack packaging
                      </Heading>
                      <Body as="div" UNSAFE_style={{ margin: 0, color: "var(--ld-semantic-color-text-subtle)" }}>
                        See how member feedback shaped our newest packaging redesign.
                      </Body>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div style={{ padding: "24px 16px 0" }}>
                <SectionHeader title="Member Favorites" headingLevel="h3" divider />
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
                  <Card>
                    <CardContent>
                      <Heading as="h4" UNSAFE_style={{ margin: "0 0 4px", fontSize: 15 }}>
                        Your go-to snack picks
                      </Heading>
                      <Body as="div" UNSAFE_style={{ margin: 0, color: "var(--ld-semantic-color-text-subtle)" }}>
                        Based on items members like you buy often.
                      </Body>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Heading as="h4" UNSAFE_style={{ margin: "0 0 4px", fontSize: 15 }}>
                        Reordered the most this month
                      </Heading>
                      <Body as="div" UNSAFE_style={{ margin: 0, color: "var(--ld-semantic-color-text-subtle)" }}>
                        See what's trending among Member's Mark shoppers.
                      </Body>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: "24px 16px 0" }}>
              <SectionHeader title="What's New + Member Favorites" headingLevel="h3" divider />
              <div style={{ marginTop: 12 }}>
                <Card>
                  <CardContent>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <LockIcon decorative style={{ color: "var(--ld-semantic-color-text-subtle)", marginTop: 2 }} />
                      <Body as="div" UNSAFE_style={{ margin: 0, color: "var(--ld-semantic-color-text-subtle)" }}>
                        Unlocks at 250 lifetime points.
                      </Body>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div style={{ padding: "24px 16px 0" }}>
            <FaqCallout />
          </div>
        </Container>
      </div>

      <BottomNavBar active="home" onNavigate={navigateTo} />
    </Page>
  );
}
