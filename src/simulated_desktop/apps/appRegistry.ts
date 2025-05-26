/* eslint-disable @typescript-eslint/no-explicit-any */
// data/appRegistry.ts
import Email from "./Email";
import NotImplemented from "./NotImplemented";
import Browser from "./Browser";
import ApplicantPortal from "./ApplicantPortal/ApplicantPortal";

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
  {
    name: "Applicant Portal",
    icon: "icon/nus.png",
    component: ApplicantPortal,
  },
];
export const appRegistry: Record<string, AppMeta> = {};
apps_array.forEach((app) => {
  appRegistry[app.name] = app;
});
