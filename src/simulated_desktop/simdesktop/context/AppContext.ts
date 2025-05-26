import { createContext, useContext } from "react";
import type { AppMeta } from "../../apps/appRegistry";

export interface OpenApp {
  appmeta: AppMeta;
  z: number;
}

export interface AppContextType {
  openApps: OpenApp[];
  openApp: (appinfo: AppMeta) => void;
  closeApp: (appinfo: string | AppMeta | OpenApp) => void;
  bringToFront: (appinfo: string | AppMeta | OpenApp) => void;
}

export const AppContext = createContext<AppContextType>(null!);

export const useAppManager = () => useContext(AppContext);
