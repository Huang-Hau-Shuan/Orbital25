const path = require("node:path");
const UNITY_BUILD_PATH = path.join(__dirname, "../unity_build");
const SIMUATED_LAPTOP_BUILD_PATH = "./desktop";
const NO_CACHE = true;
const FULLSCREEN = false;
const ENABLE_DEV = true;
const UNITY_SERVE_PORT = 7224;
const UNITY_SERVE_ORIGIN = "http://localhost:" + UNITY_SERVE_PORT;
const DEBUG = true;
module.exports = {
  DEBUG,
  NO_CACHE,
  FULLSCREEN,
  ENABLE_DEV,
  UNITY_BUILD_PATH,
  UNITY_SERVE_PORT,
  UNITY_SERVE_ORIGIN,
  SIMUATED_LAPTOP_BUILD_PATH,
};
