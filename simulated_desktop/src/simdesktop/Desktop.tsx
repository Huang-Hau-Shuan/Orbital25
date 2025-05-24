import { useEffect, useState } from "react";
import { appRegistry, type AppMeta } from "../apps/appRegistry";
import DesktopIcon from "./DesktopIcon";
import { SendToSimuNUS, onSimuNUSMessage } from "../MessageBridge";
const Desktop = () => {
  const [apps, setApps] = useState<AppMeta[]>([]);

  useEffect(() => {
    SendToSimuNUS("getUnlockedApps", {});
    onSimuNUSMessage("setUnlockedApps", (unlocked: unknown) => {
      if (Array.isArray(unlocked)) {
        const resolved = unlocked.map((name) => appRegistry[name]);
        setApps(resolved);
      }
    });
  }, []);

  return (
    <div id="desktop">
      {apps.map((app, index) => (
        <DesktopIcon key={app.name} app={app} index={index} />
      ))}
    </div>
  );
};

export default Desktop;
