import * as React from "react";
import { Card } from "../../components/Card";
import { Heading, Body } from "../../components/Text";
import { Tag } from "../../components/Tag";
import { Button } from "../../components/Button";
import { CheckCircleIcon } from "../../components/Icons/Icons";
import { Illustration } from "../../utils/Illustration";
import { formatDate } from "../../utils/communityPassProgress";
import type { OpenActivity } from "../../data/communityPassData";

export interface ActivityCardProps {
  activity: OpenActivity;
  completed: boolean;
  onStart: () => void;
}

export function ActivityCard({ activity, completed, onStart }: ActivityCardProps) {
  return (
    <Card>
      <div style={{ display: "flex", gap: 16, padding: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
          <Heading as="h4" UNSAFE_style={{ margin: 0, fontSize: 16 }}>
            {activity.title}
          </Heading>
          <Body as="div" UNSAFE_style={{ margin: 0, color: "var(--ld-semantic-color-text-subtle)" }}>
            {activity.description}
          </Body>
          {/*
           * Points are supporting metadata, not a call to action — plain text
           * reads more clearly than a chip/tag, which visually implied a
           * tappable control here.
           *
           * Phase 1B: pre-participation, names the connection to Community
           * Pass ("toward Community Pass") so the member can read
           * participation as progress before starting, without a
           * projected-total calculation. Once completed, the forward-looking
           * "Earn" framing no longer applies — fall back to the neutral 1A
           * phrasing so the card doesn't read as still-pending.
           */}
          <Body as="div" UNSAFE_style={{ margin: 0, fontSize: 13, color: "var(--ld-semantic-color-text-subtlest)" }}>
            {completed
              ? `${activity.points} points`
              : `Earn ${activity.points} points toward Community Pass`}
            &nbsp;•&nbsp; Ends {formatDate(activity.endDate)}
          </Body>
          <div style={{ marginTop: 4 }}>
            {completed ? (
              <Tag color="positive" leading={<CheckCircleIcon decorative />}>
                Completed
              </Tag>
            ) : (
              <Button variant="primary" size="medium" onClick={onStart}>
                Start
              </Button>
            )}
          </div>
        </div>

        <div
          aria-hidden
          style={{
            width: 84,
            height: 84,
            flexShrink: 0,
            borderRadius: 12,
            background: "var(--ld-semantic-color-fill-brand-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Illustration type="mono-small" name={activity.illustrationName as never} size={44} title="" />
        </div>
      </div>
    </Card>
  );
}
