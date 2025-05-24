const path = require("node:path");
const { app } = require("electron");
const UNITY_BUILD_PATH = path.join(__dirname, "../unity_build");
const SIMULATED_DESKTOP_BUILD_PATH = path.join(__dirname, "../web_build");
const NO_CACHE = true;
const FULLSCREEN = false;
const ENABLE_DEV = true;
const SERVE_PORT = 7224;
const SERVE_ORIGIN = "http://localhost:" + SERVE_PORT;
const UNITY_SERVE_PATH = "/unity";
const DEBUG = process.env.npm_lifecycle_event === "start";
const VITE_SERVE_ORIGIN = "http://localhost:5173/";
//workaround for importing from preload.js "app is not defined"
const _app = app ? app : { getPath: (_) => "" };
const SAVE_PATH = path.join(_app.getPath("userData"), "simunus_save.json");
const EMAIL_PATH = path.join(__dirname, "../static");
module.exports = {
  DEBUG,
  NO_CACHE,
  FULLSCREEN,
  ENABLE_DEV,
  UNITY_BUILD_PATH,
  SERVE_PORT,
  SERVE_ORIGIN,
  SIMULATED_DESKTOP_BUILD_PATH,
  UNITY_SERVE_PATH,
  VITE_SERVE_ORIGIN,
  SAVE_PATH,
  EMAIL_PATH,
};
