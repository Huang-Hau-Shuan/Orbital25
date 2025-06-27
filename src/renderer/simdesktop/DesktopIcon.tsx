import type { AppMeta } from "../apps/appRegistry";
import GuideButton from "../apps/GuideButton";
import { getSimuNUSContext } from "../context/AppContext";

const DesktopIcon = ({ app }: { app: AppMeta; index: number }) => {
  const { openApp } = getSimuNUSContext();
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
