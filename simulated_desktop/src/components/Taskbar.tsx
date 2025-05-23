// components/Taskbar.tsx
import { useState } from "react";
import StartMenu from "./StartMenu";
import Clock from "./Clock";
import { useAppManager } from "../context/AppContext";

const Taskbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openApps, bringToFront } = useAppManager();

  return (
    <>
      <div id="taskbar">
        <div className="taskbar-left">
          <button
            className="start-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          {openApps.map((app) => (
            <button
              key={app.name}
              className="taskbar-app"
              title={app.name}
              onClick={() => bringToFront(app.name)}
            >
              <img src={app.icon} className="taskbar-icon" />
              <span className="taskbar-label">
                {app.name.charAt(0).toUpperCase() + app.name.slice(1)}
              </span>
            </button>
          ))}
        </div>

        <div className="taskbar-center"></div>

        <div className="taskbar-right">
          <Clock />
        </div>
      </div>

      {menuOpen && <StartMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
};

export default Taskbar;
