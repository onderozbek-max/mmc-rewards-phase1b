import * as React from "react";
import { Page } from "../components/Page";
import { Container } from "../components/Container";
import { Heading, Body } from "../components/Text";
import { Avatar } from "../components/Avatar";
import { Card, CardContent } from "../components/Card";
import { Divider } from "../components/Divider";
import { SectionHeader } from "../components/SectionHeader";
import { ChevronRightIcon } from "../components/Icons/Icons";
import { ScreenHeader } from "../components/custom/ScreenHeader";
import { BottomNavBar, BOTTOM_NAV_HEIGHT } from "../components/custom/BottomNavBar";
import { FaqCallout } from "../components/custom/FaqCallout";
import { formatDate, formatMonthYear, formatPoints } from "../utils/communityPassProgress";
import { navigateTo, useCompletedActivitiesForProfile, useLifetimePoints, useMemberStateId } from "../utils/appState";
import { MEMBER_NAME, MEMBER_STATES, MEMBER_TENURE_START } from "../data/communityPassData";

export function ProfilePage() {
  const memberStateId = useMemberStateId();
  const lifetimePoints = useLifetimePoints();
  const completedActivities = useCompletedActivitiesForProfile(MEMBER_STATES[memberStateId].completedActivities);

  return (
    <Page title="Profile" titleVisuallyHidden>
      <ScreenHeader title="Profile" onBack={() => navigateTo("home")} />

      <div style={{ paddingBottom: BOTTOM_NAV_HEIGHT + 24 }}>
        <Container>
          <div style={{ padding: "24px 16px 0", display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar name={MEMBER_NAME} size="large" color="brand" a11yLabel={`${MEMBER_NAME}'s profile photo`} />
            <div>
              <Heading as="h2" UNSAFE_style={{ margin: 0, fontSize: 22 }}>
                {MEMBER_NAME}
              </Heading>
              <Body as="div" UNSAFE_style={{ margin: 0, color: "var(--ld-semantic-color-text-subtle)" }}>
                In the community since {formatMonthYear(MEMBER_TENURE_START)}
              </Body>
            </div>
          </div>

          {/*
           * Deliberately NOT the full Community Pass card here. Profile's job
           * is Community identity + history, not a second progress dashboard.
           * Two compact rows keep the lifetime-points figure consistent with
           * Home/Community Pass without duplicating the progress bar or
           * distance-to-next-benefit copy.
           */}
          <div style={{ padding: "20px 16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
              <Body as="div" UNSAFE_style={{ margin: 0 }}>
                Lifetime points
              </Body>
              <Body as="div" UNSAFE_style={{ margin: 0, fontWeight: 700 }}>
                {formatPoints(lifetimePoints)}
              </Body>
            </div>
            <Divider />
            <button
              type="button"
              onClick={() => navigateTo("communityPass")}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                background: "none",
                border: "none",
                padding: "10px 0",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Body as="span" UNSAFE_style={{ margin: 0 }}>
                Community Pass
              </Body>
              <span style={{ display: "flex", alignItems: "center", gap: 2, color: "var(--ld-semantic-color-text-link, #0053e2)" }}>
                <Body as="span" UNSAFE_style={{ margin: 0, color: "inherit", fontWeight: 600 }}>
                  View
                </Body>
                <ChevronRightIcon decorative style={{ color: "inherit" }} />
              </span>
            </button>
            <Divider />
          </div>

          <div style={{ padding: "24px 16px 0" }}>
            <SectionHeader title="Completed Activities" count={completedActivities.length} headingLevel="h3" divider />
            <div style={{ marginTop: 12 }}>
            <Card>
              <CardContent>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {completedActivities.map((activity, i) => (
                    <React.Fragment key={activity.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0" }}>
                        <div>
                          <Body as="div" UNSAFE_style={{ margin: 0, fontWeight: 600 }}>{activity.title}</Body>
                          <Body as="div" UNSAFE_style={{ margin: "2px 0 0", fontSize: 13, color: "var(--ld-semantic-color-text-subtlest)" }}>
                            {formatDate(activity.date)}
                          </Body>
                        </div>
                        <Body as="div" UNSAFE_style={{ margin: 0, fontWeight: 700, whiteSpace: "nowrap" }}>
                          +{formatPoints(activity.points)} pts
                        </Body>
                      </div>
                      {i < completedActivities.length - 1 ? <Divider /> : null}
                    </React.Fragment>
                  ))}
                </div>
              </CardContent>
            </Card>
            </div>
          </div>

          <div style={{ padding: "24px 16px 0" }}>
            <FaqCallout />
          </div>
        </Container>
      </div>

      <BottomNavBar active="profile" onNavigate={navigateTo} />
    </Page>
  );
}
