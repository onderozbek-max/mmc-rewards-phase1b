import * as React from "react";
import { IconButton } from "../../components/IconButton";
import { ChevronLeftIcon } from "../../components/Icons/Icons";

/**
 * Mobile app top bar: optional back chevron + centered title.
 *
 * None of the catalog's header components (`Masthead`, `AppHeader`, `Header`)
 * render this specific "back chevron + centered screen title, no logo"
 * pattern used by the Sam's Club app's screen-level nav bars — they're built
 * for admin tools / full retail site headers / associate apps. This composes
 * existing primitives (`IconButton`, `ChevronLeftIcon`) rather than
 * hand-rolling a button, per the "build on top of existing components" rule.
 *
 * This is a *visual* header only — the page's real `<h1>` lives on the
 * `Page` component (usually visually hidden) per the a11y rules; pass the
 * same text to both so the accessible name matches what's on screen.
 */
export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  backLabel?: string;
}

export function ScreenHeader({ title, onBack, backLabel = "Back" }: ScreenHeaderProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "44px 1fr 44px",
        alignItems: "center",
        height: 56,
        padding: "0 4px",
        background: "var(--ld-semantic-color-topNav-fill, #fcf6f0)",
        borderBottom: "1px solid var(--ld-semantic-color-topNav-separator, #e0e8ee)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div>
        {onBack ? (
          <IconButton a11yLabel={backLabel} variant="ghost" onClick={onBack}>
            <ChevronLeftIcon decorative />
          </IconButton>
        ) : null}
      </div>
      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 16,
          color: "var(--ld-semantic-color-topNav-text-onFill, #151f29)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>
      <div />
    </div>
  );
}
