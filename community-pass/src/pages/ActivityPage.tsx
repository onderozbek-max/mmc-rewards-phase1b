import * as React from "react";
import { Page } from "../components/Page";
import { Container } from "../components/Container";
import { Heading, Body } from "../components/Text";
import { Card, CardContent } from "../components/Card";
import { FormGroup } from "../components/FormGroup";
import { Radio } from "../components/Radio";
import { Button } from "../components/Button";
import { Alert } from "../components/Alert";
import { Tag } from "../components/Tag";
import { ScreenHeader } from "../components/custom/ScreenHeader";
import { navigateTo, useActiveActivityId, markOpenActivityCompleted } from "../utils/appState";
import { OPEN_ACTIVITIES } from "../data/communityPassData";

const Q1_OPTIONS = ["Very likely", "Somewhat likely", "Not likely"];
const Q2_OPTIONS = ["Great", "Okay", "Not great"];

/**
 * Simulated RedJade-style survey activity. Phase 1A scope: a believable
 * complete/return loop, no rich post-completion earning feedback (that's
 * 1C). The member state does not change on completion — the activity card
 * simply flips to "Completed" for the rest of the session.
 */
export function ActivityPage() {
  const activityId = useActiveActivityId();
  const activity = OPEN_ACTIVITIES.find((a) => a.id === activityId) ?? OPEN_ACTIVITIES[0];
  const [q1, setQ1] = React.useState<string | null>(null);
  const [q2, setQ2] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  function handleReturn() {
    markOpenActivityCompleted(activity.id);
    navigateTo("home");
  }

  return (
    <Page title={activity.title} titleVisuallyHidden>
      <ScreenHeader title={activity.title} onBack={() => navigateTo("home")} />

      <div style={{ paddingBottom: 40 }}>
        <Container>
          <div style={{ padding: "20px 16px 0" }}>
            <Heading as="h2" UNSAFE_style={{ margin: "0 0 8px", fontSize: 20 }}>
              {activity.title}
            </Heading>
            <div style={{ marginBottom: 12 }}>
              <Tag color="brand" size="small">
                {activity.points} points
              </Tag>
            </div>
            <Alert variant="info">
              This activity is hosted by a Member's Mark research partner. Your responses help shape future
              products and experiences.
            </Alert>
          </div>

          <div style={{ padding: "20px 16px 0" }}>
            {submitted ? (
              <Card>
                <CardContent>
                  <div style={{ textAlign: "center", padding: "16px 8px" }}>
                    <Heading as="h3" UNSAFE_style={{ margin: "0 0 8px", fontSize: 18 }}>
                      Thanks for your feedback!
                    </Heading>
                    <Body as="div" UNSAFE_style={{ margin: "0 0 20px", color: "var(--ld-semantic-color-text-subtle)" }}>
                      Your response has been recorded.
                    </Body>
                    <Button variant="primary" size="medium" isFullWidth onClick={handleReturn}>
                      Return to Community
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <FormGroup label="How likely are you to recommend Member's Mark products to a friend?">
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {Q1_OPTIONS.map((option) => (
                          <Radio
                            key={option}
                            name="q1"
                            label={option}
                            value={option}
                            checked={q1 === option}
                            onChange={() => setQ1(option)}
                          />
                        ))}
                      </div>
                    </FormGroup>

                    <FormGroup label="How was your last shopping experience?">
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {Q2_OPTIONS.map((option) => (
                          <Radio
                            key={option}
                            name="q2"
                            label={option}
                            value={option}
                            checked={q2 === option}
                            onChange={() => setQ2(option)}
                          />
                        ))}
                      </div>
                    </FormGroup>

                    <Button
                      variant="primary"
                      size="medium"
                      isFullWidth
                      disabled={!q1 || !q2}
                      onClick={() => setSubmitted(true)}
                    >
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </div>
    </Page>
  );
}
