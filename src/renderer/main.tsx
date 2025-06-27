import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import SimDesktopRoot from "./simdesktop/App.tsx";
import { AppProvider } from "./context/AppProvider.tsx";
import TaskPanel from "./task_panel/TaskPanel.tsx";
import PlayerProfile from "./profile/PlayerProfile.tsx";
import FloatingMessageStack from "./message.tsx";

createRoot(document.getElementById("simdesk-root")!).render(
  <StrictMode>
    <AppProvider>
      <SimDesktopRoot />
    </AppProvider>
    <TaskPanel></TaskPanel>
    <PlayerProfile />
    <FloatingMessageStack />
  </StrictMode>
);
