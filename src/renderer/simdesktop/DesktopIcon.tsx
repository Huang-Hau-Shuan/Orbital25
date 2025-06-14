import type { AppMeta } from "../apps/appRegistry";
import GuideButton from "../apps/GuideButton";
import { useAppManager } from "./context/AppContext";

const DesktopIcon = ({ app, index }: { app: AppMeta; index: number }) => {
  const { openApp } = useAppManager();
  return (
    <GuideButton
      id={"simdesktop-app-" + app.name.replace(" ", "-")}
      className="app-container"
    >
      <img src={app.icon} className="icon" onClick={() => openApp(app)} />
      <div className="icon-label">{app.name}</div>
    </GuideButton>
  );
};

export default DesktopIcon;
