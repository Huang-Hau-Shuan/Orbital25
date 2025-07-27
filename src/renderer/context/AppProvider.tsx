import { useEffect, useState } from "react";
import { SimuNUSContext, type OpenApp } from "./AppContext";
import type { AppMeta } from "../apps/appRegistry";
import {
  dbgErr,
  dbgLog,
  onSimuNUSMessage,
  SendToSimuNUS,
} from "../MessageBridge";
import { emptyPlayerProfile, type PlayerProfile } from "../../types";
import { isPlayerProfile } from "../../types.guard";
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [openApps, setOpenApps] = useState<OpenApp[]>([]);
  const [playerProfile, setPlayerProfile] =
    useState<PlayerProfile>(emptyPlayerProfile);
  useEffect(() => {
    onSimuNUSMessage("setPlayerProfile", (p) => {
      if (isPlayerProfile(p)) setPlayerProfile(p);
      else dbgErr(`setPlayerProfile: Received invalid player profile ${p}`);
    });
    SendToSimuNUS("getPlayerProfile");
  }, []);
  const _getName = (appinfo: string | AppMeta | OpenApp) => {
    return typeof appinfo === "string"
      ? appinfo
      : "name" in appinfo
      ? appinfo.name
      : appinfo.appmeta.name;
  };
  const openApp = (appinfo: AppMeta) => {
    if (!openApps.some((app) => app.appmeta.name === appinfo.name)) {
      const maxZ = Math.max(0, ...openApps.map((app) => app.z));
      dbgLog(`Open app: ${appinfo.name}`);
      setOpenApps([...openApps, { appmeta: appinfo, z: maxZ + 1 }]);
    }
  };

  const closeApp = (appinfo: string | AppMeta | OpenApp) => {
    if (appinfo === "*") {
      console.log("CLOSE ALL");
      setOpenApps([]);
      return;
    }
    setOpenApps(
      openApps.filter((app) => app.appmeta.name !== _getName(appinfo))
    );
  };
  const bringToFront = (appinfo: string | AppMeta | OpenApp) => {
    setOpenApps((prev) => {
      const maxZ = Math.max(...prev.map((app) => app.z));
      return prev.map((app) => {
        return app.appmeta.name === _getName(appinfo) && app.z < maxZ
          ? { ...app, z: maxZ + 1 }
          : app;
      });
    });
  };
  return (
    <SimuNUSContext.Provider
      value={{ openApps, openApp, closeApp, bringToFront, playerProfile }}
    >
      {children}
    </SimuNUSContext.Provider>
  );
};
