/* eslint-disable @typescript-eslint/no-explicit-any */
// data/appRegistry.ts
import Email from "./Email";
import NotImplemented from "../apps/NotImplemented";
import Browser from "./Browser";

export interface AppMeta {
  name: string;
  icon: string;
  component: React.FC<any>;
  props?: Record<string, any>;
}
const apps_array: AppMeta[] = [
  {
    name: "Email",
    icon: "icon/email.svg",
    component: Email,
  },
  {
    name: "Canvas",
    icon: "icon/canvas.png",
    component: NotImplemented,
  },
  {
    name: "EduRec",
    icon: "icon/nus.png",
    component: NotImplemented,
  },
  {
    name: "Browser",
    icon: "icon/chrome.svg",
    component: Browser,
    props: { path: "https://html.duckduckgo.com/html/" },
  },
  {
    name: "NUSMods",
    icon: "icon/nusmods.png",
    component: Browser,
    props: { path: "https://nusmods.com/" },
  },
];
export const appRegistry: Record<string, AppMeta> = {};
apps_array.forEach((app) => {
  appRegistry[app.name] = app;
});
