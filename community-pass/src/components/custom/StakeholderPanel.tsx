import * as React from "react";
import "./StakeholderPanel.css";

/**
 * Stakeholder-review panel.
 *
 * This is prototype metadata for reviewers opening the GitHub Pages link —
 * NOT part of the Member's Mark Community product experience. It exists
 * beside the simulated mobile app on wide (desktop) viewports only, in space
 * the mobile-app frame never occupies, and is completely absent at mobile
 * widths so the on-device experience stays exactly the MMC prototype.
 *
 * Deliberately does NOT use Living Design components or WCP/MMC design
 * tokens (--wcp-*, --ld-*) — plain system typography and neutral grays keep
 * it unmistakably a review artifact, not a screen a member could see.
 */
const SYSTEM_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#5c5c5c",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.5, color: "#2b2b2b" }}>{children}</div>
    </div>
  );
}

type ProgressionStatus = "done" | "current" | "upcoming";

interface ProgressionRowProps {
  code: string;
  name: string;
  status: ProgressionStatus;
  last?: boolean;
}

function ProgressionRow({ code, name, status, last }: ProgressionRowProps) {
  const dotColor =
    status === "done" ? "#2b2b2b" : status === "current" ? "#111111" : "#c9c9c9";
  const textColor = status === "upcoming" ? "#6b6b6b" : "#1a1a1a";
  const fontWeight = status === "current" ? 700 : 500;

  return (
    <div style={{ position: "relative", paddingLeft: 22, paddingBottom: last ? 0 : 14 }}>
      {!last ? (
        <div
          aria-hidden
          style={{ position: "absolute", left: 5, top: 16, bottom: -2, width: 2, background: "#e3e3e3" }}
        />
      ) : null}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 3,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: status === "upcoming" ? "#ffffff" : dotColor,
          border: status === "upcoming" ? "2px solid #c9c9c9" : "none",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight, color: textColor }}>
          {code} {name}
        </span>
        {status === "current" ? (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#ffffff",
              background: "#111111",
              borderRadius: 4,
              padding: "2px 6px",
            }}
          >
            Current · Experiment
          </span>
        ) : status === "done" ? (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#3d3d3d",
              background: "#e7e7e7",
              borderRadius: 4,
              padding: "2px 6px",
            }}
          >
            Complete
          </span>
        ) : null}
      </div>
    </div>
  );
}

interface NotBuiltItem {
  code: string;
  name: string;
  description: string;
}

const NOT_BUILT_YET: NotBuiltItem[] = [
  { code: "1C", name: "Earn & Progress Feedback", description: "explicit participate → earn → changed-progress feedback." },
  { code: "1D", name: "Milestone Achievement Experience", description: "milestone achievement experience." },
  { code: "1E", name: "Full Milestone & Benefit Expansion", description: "full 250 / 1,000 / 3,000 operational benefit architecture." },
  { code: "1F", name: "Historical Reconciliation & Full Population Rollout", description: "historical reconciliation and full-population rollout." },
];

export function StakeholderPanel() {
  return (
    <div
      className="mmc-stakeholder-panel"
      aria-label="Prototype review notes"
      tabIndex={0}
      style={{ fontFamily: SYSTEM_FONT_STACK }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #d9d9d9",
          borderRadius: 10,
          padding: "24px 28px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#5c5c5c",
            marginBottom: 10,
          }}
        >
          Prototype review — not part of the product
        </div>

        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#111111" }}>
          Phase 1B — Progress Motivation
        </h2>
        <span
          style={{
            display: "inline-block",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#ffffff",
            background: "#111111",
            borderRadius: 4,
            padding: "3px 7px",
          }}
        >
          Initiative type · Experiment
        </span>

        <Section title="Foundation">
          Phase 1A already provides a truthful working progression system: eligible participation updates lifetime
          points; reachable milestones update correctly; the 250 benefit actually becomes available.
        </Section>

        <Section title="What 1B adds">
          1B does not add rewards functionality. It tests whether making progress toward the next meaningful benefit
          more prominent and connecting that goal to available participation increases repeat engagement.
        </Section>

        <Section title="Control">Complete Phase 1A functional progression.</Section>

        <Section title="Treatment">
          The same product truth and benefit, plus: next benefit → current progress → ways to make progress →
          available activities.
        </Section>

        <Section title="What to evaluate">
          Does this motivational-progress strategy increase repeat participation beyond functional progression?
        </Section>

        <Section title="Post-250 behavior">
          When the member completes the active 250-point goal, the benefit actually unlocks in both control and
          treatment. The motivational treatment then recedes until another meaningful operational benefit
          destination exists. It does not manufacture a 1,000-point goal.
        </Section>

        <Section title="What is not built yet">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {NOT_BUILT_YET.map((item) => (
              <div key={item.code}>
                <strong style={{ color: "#111111" }}>
                  {item.code} — {item.name}:
                </strong>{" "}
                {item.description}
              </div>
            ))}
          </div>
        </Section>

        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#5c5c5c",
              marginBottom: 12,
            }}
          >
            Phase progression
          </div>
          <ProgressionRow code="1A" name="Progression Foundation" status="done" />
          <ProgressionRow code="1B" name="Progress Motivation" status="current" />
          <ProgressionRow code="1C" name="Earn & Progress Feedback" status="upcoming" />
          <ProgressionRow code="1D" name="Milestone Achievement Experience" status="upcoming" />
          <ProgressionRow code="1E" name="Full Milestone & Benefit Expansion" status="upcoming" />
          <ProgressionRow code="1F" name="Historical Reconciliation & Full Population Rollout" status="upcoming" last />
        </div>
      </div>
    </div>
  );
}
