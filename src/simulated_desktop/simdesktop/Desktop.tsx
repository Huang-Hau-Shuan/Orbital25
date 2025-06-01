import { useEffect, useState } from "react";
import { appRegistry, apps_array, type AppMeta } from "../apps/appRegistry";
import DesktopIcon from "./DesktopIcon";
import { SendToSimuNUS, onSimuNUSMessage } from "../MessageBridge";
const Desktop = () => {
  const [apps, setApps] = useState<AppMeta[]>([]);

  useEffect(() => {
    SendToSimuNUS("getUnlockedApps", {});
    onSimuNUSMessage("setUnlockedApps", (unlocked: unknown) => {
      if (unlocked == "*") {
        setApps(apps_array);
        return;
      } else if (Array.isArray(unlocked)) {
        if (unlocked.includes("*")) {
          setApps(apps_array);
          return;
        }
        const resolved = unlocked
          .filter((val) => val in appRegistry)
          .map((name) => appRegistry[name]);
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
