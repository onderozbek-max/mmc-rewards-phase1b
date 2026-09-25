import * as React from "react";
import { TabNavigation, TabNavigationItem } from "../../components/TabNavigation";
import { Icon } from "../../components/Icons/Icons";
import { RichSnackbar } from "../../components/RichSnackbar";
import type { ViewId } from "../../utils/appState";
import "./BottomNavBar.css";

export interface BottomNavBarProps {
  active: "home" | "profile";
  onNavigate: (view: ViewId) => void;
}

const INERT_TABS: Record<string, string> = {
  scan: "Scan & Go",
  reorder: "Reorder",
  services: "Services",
};

/**
 * Sam's Club app global bottom tab bar. Home and Account are wired into this
 * prototype's two real destinations; Scan & Go / Reorder / Services are part
 * of the wider Sam's Club app (out of scope here) and surface a short,
 * honest notice instead of silently doing nothing.
 */
export function BottomNavBar({ active, onNavigate }: BottomNavBarProps) {
  const [toastLabel, setToastLabel] = React.useState<string | null>(null);

  function handleInert(label: string) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      setToastLabel(label);
    };
  }

  return (
    <>
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          width: "100%",
          maxWidth: 430,
          transform: "translateX(-50%)",
          zIndex: 20,
          background: "var(--ld-semantic-color-topNav-fill, #fcf6f0)",
          borderTop: "1px solid var(--ld-semantic-color-separator, #e0e8ee)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <TabNavigation pattern="navigation" aria-label="Primary" UNSAFE_className="mmc-bottom-nav">
          <TabNavigationItem
            href="#home"
            leadingIcon={<Icon name="Home" decorative />}
            isCurrent={active === "home"}
            onClick={(e) => {
              e.preventDefault();
              onNavigate("home");
            }}
          >
            Home
          </TabNavigationItem>
          <TabNavigationItem
            href="#scan"
            leadingIcon={<Icon name="Camera" decorative />}
            onClick={handleInert(INERT_TABS.scan)}
          >
            Scan &amp; Go
          </TabNavigationItem>
          <TabNavigationItem
            href="#reorder"
            leadingIcon={<Icon name="Truck" decorative />}
            onClick={handleInert(INERT_TABS.reorder)}
          >
            Reorder
          </TabNavigationItem>
          <TabNavigationItem
            href="#account"
            leadingIcon={<Icon name="User" decorative />}
            isCurrent={active === "profile"}
            onClick={(e) => {
              e.preventDefault();
              onNavigate("profile");
            }}
          >
            Account
          </TabNavigationItem>
          <TabNavigationItem
            href="#services"
            leadingIcon={<Icon name="List" decorative />}
            onClick={handleInert(INERT_TABS.services)}
          >
            Services
          </TabNavigationItem>
        </TabNavigation>
      </nav>

      <RichSnackbar
        open={toastLabel !== null}
        message={toastLabel ? `${toastLabel} isn't part of this prototype.` : ""}
        duration={2200}
        position="bottom-center"
        onClose={() => setToastLabel(null)}
      />
    </>
  );
}

/** Height reserved so scrollable page content never sits under the fixed bar. */
export const BOTTOM_NAV_HEIGHT = 72;
