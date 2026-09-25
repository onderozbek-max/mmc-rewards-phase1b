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
import { ChevronRightIcon } from "../components/Icons/Icons";
import { getCommunityPassProgress } from "../utils/communityPassProgress";
import {
  navigateTo,
  useCompletedOpenActivityIds,
  useLifetimePoints,
  useMemberStateId,
  useSessionCompletedActivities,
} from "../utils/appState";
import { MEMBER_NAME, MEMBER_STATES, OPEN_ACTIVITIES } from "../data/communityPassData";

export function CommunityHomePage() {
  const memberStateId = useMemberStateId();
  const lifetimePoints = useLifetimePoints();
  const progress = getCommunityPassProgress(lifetimePoints);
  const completedOpenActivityIds = useCompletedOpenActivityIds();
  const sessionCompletedActivities = useSessionCompletedActivities();
  const completedCount = MEMBER_STATES[memberStateId].completedActivities.length + sessionCompletedActivities.length;

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
           * card — it ends here. "Ways to make progress" is a distinct
           * section immediately below it (tighter top padding than the
           * page's other section transitions), so the two read as connected
           * by proximity and labeling rather than by sharing one container.
           */}
          <div style={{ padding: "16px 16px 0" }}>
            <CommunityPassCard progress={progress} onView={() => navigateTo("communityPass")} />
          </div>

          <div style={{ padding: "12px 16px 0" }}>
            <SectionHeader title="Ways to make progress" count={OPEN_ACTIVITIES.length} headingLevel="h3" divider />
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
            <FaqCallout />
          </div>
        </Container>
      </div>

      <BottomNavBar active="home" onNavigate={navigateTo} />
    </Page>
  );
}
