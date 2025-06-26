/* eslint-disable @typescript-eslint/no-explicit-any */
import Email from "./Email";
import NotImplemented from "./NotImplemented";
import Browser from "./Browser";
import ApplicantPortalLogin from "./ApplicantPortal/login";
import ApplicantPortalMain from "./ApplicantPortal/main";
import PhotoVerificationLogin from "./PhotoVerification/login";
import PhotoVerificationMain from "./PhotoVerification/main";
import NUSApp from "./NUSApp";
import MainMenuPage from "./RegistrationPart1/MainMenuPage";
import MainPage from "./WebMail/MainPage";
import UHCLogin from "./UHC/login";
import UHCMain from "./UHC/main";

export interface AppMeta {
  name: string;
  icon: string;
  component: React.FC<any>;
  props?: Record<string, any>;
}
export const apps_array: AppMeta[] = [
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
    component: NUSApp,
    props: {
      loginPage: ApplicantPortalLogin,
      mainPage: ApplicantPortalMain,
      appName: "Applicant Portal",
    },
  },
  {
    name: "Photo Verification",
    icon: "icon/nus.png",
    component: NUSApp,
    props: {
      loginPage: PhotoVerificationLogin,
      mainPage: PhotoVerificationMain,
      appName: "Photo Verification",
    },
  },
  {
    name: "Registration Part One",
    icon: "icon/nus.png",
    component: MainMenuPage,
  },
  {
    name: "NUS Web Mail",
    icon: "icon/nus.png",
    component: MainPage,
  },
  {
    name: "UHC Appointment",
    icon: "icon/nus.png",
    component: NUSApp,
    props: {
      loginPage: UHCLogin,
      mainPage: UHCMain,
      appName: "UHC Appointment",
    },
  },
];
export const appRegistry: Record<string, AppMeta> = {};
apps_array.forEach((app) => {
  appRegistry[app.name] = app;
});
