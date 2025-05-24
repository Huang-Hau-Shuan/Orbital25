import type { AppMeta } from "../apps/appRegistry";
import { useAppManager } from "./context/AppContext";

const DesktopIcon = ({ app, index }: { app: AppMeta; index: number }) => {
  const { openApp } = useAppManager();
  return (
    <div className="app-container" style={{ top: 40 + index * 100, left: 40 }}>
      <img src={app.icon} className="icon" onClick={() => openApp(app)} />
      <div className="icon-label">{app.name}</div>
    </div>
  );
};

export default DesktopIcon;
