import path from "node:path";
import { app } from "electron";
export const DEBUG =
  process.env.npm_lifecycle_event === "start" ||
  process.env.npm_lifecycle_event === "dev";
export const SERVER_ROOT =
  DEBUG || typeof MAIN_WINDOW_VITE_NAME === "undefined"
    ? __dirname
    : path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}`);
export const UNITY_BUILD_PATH = path.join(SERVER_ROOT, "unity_build");
export const SIMULATED_DESKTOP_BUILD_PATH = path.join(SERVER_ROOT, "web_build");
export const EMAIL_PATH = path.join(SERVER_ROOT, "emails");
export const NO_CACHE = true;
export const FULLSCREEN = false;
export const ENABLE_DEV = true;
export const SERVE_PORT = 7224;
export const SERVE_ORIGIN = "http://localhost:" + SERVE_PORT;
export const UNITY_SERVE_PATH = "/unity";
export const VITE_SERVE_ORIGIN =
  typeof MAIN_WINDOW_VITE_DEV_SERVER_URL === "string"
    ? MAIN_WINDOW_VITE_DEV_SERVER_URL
    : "http://localhost:5173/";
export const DATA_PATH =
  typeof app !== "undefined" ? app.getPath("userData") : "";
export const CONFIG_PATH = path.join(DATA_PATH, "simunus_config.json");
export const SAVE_PATH = path.join(DATA_PATH, "simunus_save.json");
