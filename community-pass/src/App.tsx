import * as React from "react";
import { useInitializeTheming } from "./utils/Theming";
import { useInitializeStore } from "./utils/store";
import { A11yAnnouncementProvider } from "./components/A11yAnnouncement";
import { A11yDevAssertions } from "./components/A11yDevAssertions";
import { CommunityHomePage } from "./pages/CommunityHomePage";
import { CommunityPassPage } from "./pages/CommunityPassPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ActivityPage } from "./pages/ActivityPage";
import { DevStateSwitcher } from "./components/custom/DevStateSwitcher";
import { useView, setMemberStateId } from "./utils/appState";
import type { MemberStateId } from "./data/communityPassData";

const VALID_STATE_IDS: MemberStateId[] = ["A", "B", "C", "D", "E"];

export default function App() {
  // Member's Mark Community is Sam's Club private-label branded.
  useInitializeTheming("Member's Mark", ["Member's Mark"] as const);

  useInitializeStore();

  // Optional `?state=A..E` lets a reviewer share a direct link to a specific
  // representative member state. Intentionally NOT persisted — a plain link
  // (no query string) always opens on the primary state (State B).
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const requested = new URLSearchParams(window.location.search).get("state");
    if (requested && (VALID_STATE_IDS as string[]).includes(requested)) {
      setMemberStateId(requested as MemberStateId);
    }
  }, []);

  const view = useView();

  return (
    <A11yAnnouncementProvider>
      <A11yDevAssertions />
      {/*
       * MMC only exists as a Sam's Club mobile app screen — never a desktop
       * site. On phone-width viewports this frame is invisible (full width,
       * no neutral margin). On wider browser windows it keeps the product at
       * a fixed mobile width, centered in quiet neutral space, instead of
       * stretching cards/nav/hero across a desktop-width layout.
       */}
      <div
        style={{
          minHeight: "100vh",
          background: "#e4e4e4",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 430,
            minHeight: "100vh",
            overflowX: "hidden",
            background: "var(--ld-semantic-color-topNav-fill, #fcf6f0)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
          }}
        >
          {view === "communityPass" ? (
            <CommunityPassPage />
          ) : view === "profile" ? (
            <ProfilePage />
          ) : view === "activity" ? (
            <ActivityPage />
          ) : (
            <CommunityHomePage />
          )}
        </div>
      </div>
      <DevStateSwitcher />
    </A11yAnnouncementProvider>
  );
}
