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
            Current phase
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
            Foundational
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function StakeholderPanel() {
  return (
    <div className="mmc-stakeholder-panel" aria-label="Prototype review notes" style={{ fontFamily: SYSTEM_FONT_STACK }}>
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

        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#111111" }}>
          Phase 1B — Progress Motivation
        </h2>
        <div style={{ fontSize: 13, color: "#5c5c5c" }}>Builds on Phase 1A</div>

        <Section title="What this adds">
          Progress becomes an engagement mechanism. The next benefit is framed as an active goal, and available
          activities are explicitly connected to making progress toward it.
        </Section>

        <Section title="What to evaluate">
          Does connecting a meaningful progress goal to available participation opportunities create a stronger
          reason to participate again?
        </Section>

        <Section title="Not built yet">
          Completing an activity does not update points or progress in this prototype. The participate → earn →
          updated progress feedback loop is introduced in Phase 1C.
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
            Progression
          </div>
          <ProgressionRow code="1A" name="Rewards Journey" status="done" />
          <ProgressionRow code="1B" name="Progress Motivation" status="current" />
          <ProgressionRow code="1C" name="Earn & Progress Feedback" status="upcoming" />
          <ProgressionRow code="1D" name="Milestone Achievement & Unlocks" status="upcoming" last />
        </div>
      </div>
    </div>
  );
}
