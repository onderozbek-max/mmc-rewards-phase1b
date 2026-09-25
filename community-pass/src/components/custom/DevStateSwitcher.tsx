import * as React from "react";
import { Button } from "../../components/Button";
import { MEMBER_STATES, type MemberStateId } from "../../data/communityPassData";
import { useMemberStateId, setMemberStateId } from "../../utils/appState";

const STATE_ORDER: MemberStateId[] = ["A", "B", "C", "D", "E"];

/**
 * Design-review-only member-state switcher. NOT part of the member
 * experience — visible only with `?dev=1` in the URL, so it's trivial to
 * hide for a stakeholder demo (just drop the query param) and impossible
 * for a member to stumble into.
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
      aria-label="Developer state switcher (not part of the member experience)"
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
        gap: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", padding: "0 4px" }}>
        DEV — MEMBER STATE
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        {STATE_ORDER.map((id) => (
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
      <span style={{ color: "#cfd6dc", fontSize: 10, padding: "0 4px", maxWidth: 160 }}>
        {MEMBER_STATES[current].devLabel}
      </span>
    </div>
  );
}
