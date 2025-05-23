import { useState } from "react";
import { AppContext, type OpenApp } from "./AppContext";
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [openApps, setOpenApps] = useState<OpenApp[]>([]);

  const openApp = (name: string, path: string, icon: string) => {
    if (!openApps.some((app) => app.name === name)) {
      const maxZ = Math.max(0, ...openApps.map((app) => app.z));
      //console.log("open", name, "from", path);
      setOpenApps([...openApps, { name, path, icon: icon, z: maxZ + 1 }]);
    }
  };

  const closeApp = (name: string) => {
    setOpenApps(openApps.filter((app) => app.name !== name));
  };
  const bringToFront = (name: string) => {
    setOpenApps((prev) => {
      const maxZ = Math.max(...prev.map((app) => app.z));
      return prev.map((app) => {
        return app.name === name && app.z < maxZ
          ? { ...app, z: maxZ + 1 }
          : app;
      });
    });
  };
  return (
    <AppContext.Provider value={{ openApps, openApp, closeApp, bringToFront }}>
      {children}
    </AppContext.Provider>
  );
};
