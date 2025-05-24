import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./simdesktop/App.tsx";
import { AppProvider } from "./simdesktop/context/AppProvider.tsx";
import "./main.css";
createRoot(document.getElementById("simdesk-root")!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
