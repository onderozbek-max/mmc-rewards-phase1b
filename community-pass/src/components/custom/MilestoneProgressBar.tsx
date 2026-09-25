import * as React from "react";
import { Body } from "../../components/Text";
import { formatPoints } from "../../utils/communityPassProgress";

export interface MilestoneProgressBarProps {
  /** Lower bound of the current interval (last unlocked milestone, or 0). */
  min: number;
  /** Upper bound of the current interval (the next milestone). */
  max: number;
  /** Current lifetime points. */
  value: number;
  a11yLabel: string;
}

/**
 * Restrained current→target progress bar with explicit flanking numbers.
 *
 * Fixes a semantic bug from the first pass: the generic `ProgressIndicator`'s
 * `valueLabel` rendered the *current* value in the same emphasized spot a
 * reader expects the *target* to be, making 180 look like the destination
 * instead of 250. Showing both ends of the interval removes the ambiguity
 * without needing a "180 / 250" text label.
 */
export function MilestoneProgressBar({ min, max, value, a11yLabel }: MilestoneProgressBarProps) {
  const pct = max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 100;

  return (
    <div>
      <div
        role="progressbar"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={a11yLabel}
        style={{
          height: 6,
          borderRadius: 3,
          background: "var(--ld-semantic-color-fill-subtle, #e9edf1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 3,
            background: "var(--wcp-semantic-color-surface-overlay-brand-bold, #283645)",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <Body as="div" UNSAFE_style={{ margin: 0, fontSize: 12, color: "var(--ld-semantic-color-text-subtlest)" }}>
          {formatPoints(min)}
        </Body>
        <Body as="div" UNSAFE_style={{ margin: 0, fontSize: 12, color: "var(--ld-semantic-color-text-subtlest)" }}>
          {formatPoints(max)}
        </Body>
      </div>
    </div>
  );
}
