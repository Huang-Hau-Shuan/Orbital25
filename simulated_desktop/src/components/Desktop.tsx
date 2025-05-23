import { useEffect, useState } from "react";
import DesktopIcon from "./DesktopIcon";
import type { AppMeta } from "../types";

const Desktop = () => {
  const [apps, setApps] = useState<AppMeta[]>([]);

  useEffect(() => {
    fetch("/apps.json")
      .then((res) => res.json())
      .then((data) => setApps(data));
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
