import { createContext, useContext } from "react";
import type { AppMeta } from "../apps/appRegistry";
import type { PlayerProfile } from "../../types";

export interface OpenApp {
  appmeta: AppMeta;
  z: number;
}

export interface SimuNUSContextType {
  openApps: OpenApp[];
  openApp: (appinfo: AppMeta) => void;
  closeApp: (appinfo: string | AppMeta | OpenApp) => void;
  bringToFront: (appinfo: string | AppMeta | OpenApp) => void;
  playerProfile: PlayerProfile;
}

export const SimuNUSContext = createContext<SimuNUSContextType>(null!);

export const getSimuNUSContext = () => useContext(SimuNUSContext);
