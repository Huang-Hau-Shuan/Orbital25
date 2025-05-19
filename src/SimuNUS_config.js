const path = require("node:path");
const UNITY_BUILD_PATH = path.join(__dirname, "../unity_build");
const NO_CACHE = true;
const FULLSCREEN = false;
const OPEN_DEV = false;
const UNITY_SERVE_PORT = 7224;
const UNITY_SERVE_ORIGIN = "http://localhost:" + UNITY_SERVE_PORT;
const DEBUG = true;
module.exports = {
  UNITY_BUILD_PATH,
  UNITY_SERVE_PORT,
  UNITY_SERVE_ORIGIN,
  DEBUG,
  NO_CACHE,
  FULLSCREEN,
  OPEN_DEV,
};
