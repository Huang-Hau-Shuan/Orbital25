import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import App from "./simdesktop/App.tsx";
import { AppProvider } from "./simdesktop/context/AppProvider.tsx";
import TaskPanel from "./task_panel/TaskPanel.tsx";
import PlayerProfile from "./profile/PlayerProfile.tsx";

createRoot(document.getElementById("simdesk-root")!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
    <TaskPanel></TaskPanel>
    <PlayerProfile />
  </StrictMode>
);
