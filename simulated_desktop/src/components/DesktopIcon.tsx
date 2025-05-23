import type { AppMeta } from "../types";
import { useAppManager } from "../context/AppContext";

const DesktopIcon = ({ app, index }: { app: AppMeta; index: number }) => {
  const { openApp } = useAppManager();
  return (
    <div className="app-container" style={{ top: 40 + index * 100, left: 40 }}>
      <img
        src={app.icon}
        className="icon"
        onClick={() => openApp(app.name, app.path, app.icon)}
      />
      <div className="icon-label">
        {app.name.charAt(0).toUpperCase() + app.name.slice(1)}
      </div>
    </div>
  );
};

export default DesktopIcon;
