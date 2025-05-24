// components/Taskbar.tsx
import { useRef, useState } from "react";
import StartMenu from "./StartMenu";
import Clock from "./Clock";
import { useAppManager } from "./context/AppContext";

const Taskbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ bottom: 0, left: 0 });
  const { openApps, bringToFront } = useAppManager();
  const taskbarRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => {
    if (!menuOpen && taskbarRef.current) {
      const rect = taskbarRef.current.getBoundingClientRect();
      setMenuPos({
        bottom: window.innerHeight - rect.top + 2, // height of the menu or offset
        left: rect.left + 2,
      });
    }
    setMenuOpen(!menuOpen);
  };
  return (
    <>
      <div id="taskbar" ref={taskbarRef}>
        {menuOpen && (
          <StartMenu position={menuPos} onClose={() => setMenuOpen(false)} />
        )}

        <div className="taskbar-left">
          <button className="start-button" onClick={toggleMenu}>
            ☰
          </button>
          {openApps.map((app) => (
            <button
              key={app.appmeta.name}
              className="taskbar-app"
              title={app.appmeta.name}
              onClick={() => bringToFront(app)}
            >
              <img src={app.appmeta.icon} className="taskbar-icon" />
              <span className="taskbar-label">{app.appmeta.name}</span>
            </button>
          ))}
        </div>

        <div className="taskbar-center"></div>
        <div className="taskbar-right">
          <Clock />
        </div>
      </div>
    </>
  );
};

export default Taskbar;
