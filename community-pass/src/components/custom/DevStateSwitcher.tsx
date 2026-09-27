import * as React from "react";
import { Button } from "../../components/Button";
import { DEFAULT_MEMBER_STATE_ID, MEMBER_STATES, type MemberStateId } from "../../data/communityPassData";
import { useMemberStateId, setMemberStateId } from "../../utils/appState";

interface Scenario {
  id: MemberStateId;
  label: string;
}

/**
 * The three named milestone-boundary scenarios Product/Design/Engineering
 * need to deterministically reach without completing an unrealistic number
 * of mock activities:
 *  - Normal progression (180 pts) — 250 not yet achieved.
 *  - Near milestone (240 pts) — 10 points from 250; the 30-point open
 *    activity is enough on its own to cross it (240 + 30 = 270).
 *  - First milestone achieved (270 pts) — 250 already achieved, both
 *    benefits accessible; the 10-point open activity is available to keep
 *    accumulating past it (270 + 10 = 280) without retriggering anything.
 *
 * Selecting a scenario is a full state re-initialization (see
 * `setMemberStateId`), not just a displayed-number change — it also clears
 * this session's activity completions, so both mock open activities always
 * come back "not yet completed," guaranteeing the +30 / +10 crossing
 * activities described above are available every time a scenario is chosen.
 * Home, Community Pass, and Profile all derive from that same reinitialized
 * state, so there is nothing else to keep in sync.
 */
const SCENARIOS: Scenario[] = [
  { id: "B", label: "Normal progression" },
  { id: "C", label: "Near milestone" },
  { id: "D", label: "First milestone achieved" },
];

/**
 * Additional representative states kept for broader QA coverage — not part
 * of the three named scenarios above. "F" is an edge-case-only state (220
 * pts) that exists purely to verify the exact 220 + 30 = 250 boundary; it
 * isn't a demonstration scenario.
 */
const OTHER_STATES: MemberStateId[] = ["A", "E", "F"];

/**
 * Design-review-only scenario harness. NOT part of the member experience —
 * visible only with `?dev=1` in the URL, so it's trivial to hide for a
 * stakeholder demo (just drop the query param) and impossible for a member
 * to stumble into. This is prototype tooling only: scenario switching,
 * point-total setup, and reset never appear inside the normal member
 * surfaces (Home, Community Pass, Profile, Activity) — they exist only in
 * this fixed dev-only overlay.
 */
export function DevStateSwitcher() {
  const [visible, setVisible] = React.useState(false);
  const current = useMemberStateId();

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setVisible(params.get("dev") === "1");
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Developer prototype scenario harness (not part of the member experience)"
      style={{
        position: "fixed",
        top: 8,
        right: 8,
        zIndex: 1000,
        background: "rgba(21,31,41,0.92)",
        borderRadius: 10,
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        maxWidth: 210,
      }}
    >
      <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", padding: "0 4px" }}>
        DEV — PROTOTYPE SCENARIOS
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {SCENARIOS.map((s) => (
          <Button
            key={s.id}
            size="small"
            variant={current === s.id ? "primary" : "tertiary"}
            onClick={() => setMemberStateId(s.id)}
          >
            {s.label}
          </Button>
        ))}
      </div>

      {/*
       * A distinct action from "Normal progression" above, even though both
       * currently resolve to the same representative state (B) — this is
       * the explicit "restore the default demonstration state" control the
       * scenario harness is required to offer, independent of whichever
       * scenario happens to map to the default.
       */}
      <Button size="small" variant="secondary" onClick={() => setMemberStateId(DEFAULT_MEMBER_STATE_ID)}>
        Reset
      </Button>

      <span style={{ color: "#cfd6dc", fontSize: 10, padding: "0 4px" }}>{MEMBER_STATES[current].devLabel}</span>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.15)",
          paddingTop: 4,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ color: "#9fb0bd", fontSize: 9, padding: "0 4px" }}>Other:</span>
        {OTHER_STATES.map((id) => (
          <Button
            key={id}
            size="small"
            variant={current === id ? "primary" : "tertiary"}
            onClick={() => setMemberStateId(id)}
          >
            {id}
          </Button>
        ))}
      </div>
    </div>
  );
}
