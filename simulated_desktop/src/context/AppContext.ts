import { createContext, useContext } from "react";

export interface OpenApp {
  name: string;
  path: string;
  icon: string;
  z: number;
}

export interface AppContextType {
  openApps: OpenApp[];
  openApp: (name: string, path: string, icon:string) => void;
  closeApp: (name: string) => void;
  bringToFront: (name: string) =>void
}

export const AppContext = createContext<AppContextType>(null!);

export const useAppManager = () => useContext(AppContext);
