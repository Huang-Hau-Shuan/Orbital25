import { app, BrowserWindow, ipcMain } from "electron";
import express from "express";
import path from "node:path";
import * as config from "./SimuNUS_config.js";
import fs from "fs";
import { dbgErr, dbgLog, dbgWarn } from "./utils.js";
import { handleGameSaveMessage } from "./gamedata.js";
const server = express();

//Register how to handle messages from SimuNUS
function handleMessage(mainWindow: BrowserWindow) {
  const sendMessage = (channel: string, ...args: unknown[]) =>
    mainWindow.webContents.send(channel, ...args);
  const to_register = new Set<string>(); // only register once for every channel
  const onMessage = (
    channel: string,
    callback: (...args: unknown[]) => void,
    register = true
  ) => {
    ipcMain.on(channel, (_event, ...args) => callback(...args));
    if (register) {
      to_register.add(channel);
    }
  };
  const forwardMessage = (channel: string) =>
    onMessage(channel, (data) => sendMessage(channel, data), false);
  if (config.DEBUG) {
    onMessage("debug", (data) => dbgLog("[DEBUG]", data));
    onMessage("error", (data) => dbgErr("[ERROR]", data));
    onMessage("warn", (data) => dbgWarn("[WARN]", data));
  }
  onMessage(
    "register_message_handler",
    (data) => {
      if (
        typeof data !== "object" ||
        data === null ||
        !("channel" in data) ||
        !("source" in data)
      ) {
        dbgWarn(
          "ipcMain received register_message_handler with invalid data",
          data
        );
        return;
      }
      if (typeof data.channel != "string") {
        dbgWarn(
          `Source ${data.source} registers an invalid channel to ipcMain: ${data.channel}`
        );
        return;
      }
      dbgLog(`Source ${data.source} registers ${data.channel} to ipcMain`);
      forwardMessage(data.channel);
      sendMessage("register_message_handler", data);
    },
    false
  );
  onMessage("exit", () => app.quit());
  if (config.DEBUG)
    onMessage("reload", () => {
      dbgWarn("Reloading SimuNUS");
      app.relaunch();
      app.exit(0);
    });
  handleGameSaveMessage(onMessage, sendMessage);
  forwardMessage("hideSim");
  forwardMessage("showSim");
  mainWindow.webContents.on("did-finish-load", () => {
    to_register.forEach((channel) => {
      sendMessage("register_message_handler", {
        source: "main",
        channel: channel,
      });
    });
    sendMessage("mainRegisterMessageComplete");
  });
}
const createWindow = () => {
  const serve_path = config.DEBUG
    ? config.VITE_SERVE_ORIGIN
    : config.SERVE_ORIGIN;
  if (config.NO_CACHE) {
    app.commandLine.appendSwitch("disable-http-cache");
  }
  // Create the browser window.
  const createMW = function () {
    const mw = new BrowserWindow({
      fullscreen: config.FULLSCREEN,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        webviewTag: true,
        sandbox: false,
        devTools: config.ENABLE_DEV,
        nodeIntegration: false,
        contextIsolation: true,
        webgl: true,
      },
      width: 1200,
      height: 800,
    });
    handleMessage(mw); // register message listeners
    return mw;
  };
  //clear unity service worker cache
  if (config.NO_CACHE) {
    const service_worker_cache_path = path.join(
      app.getPath("userData"),
      "Service Worker"
    );
    fs.rm(
      service_worker_cache_path,
      { recursive: true, force: true },
      (err) => {
        if (err) {
          dbgWarn("Failed to remove service worker cache:", err);
        } else if (config.DEBUG) {
          dbgLog("Unity Service Worker Folder removed");
        }
        const mainWindow = createMW();
        mainWindow.webContents.session.clearCache().then(() => {
          mainWindow.loadURL(serve_path, {
            extraHeaders: "pragma: no-cache\ncache-control: no-cache",
          });
        });
      }
    );
  } else {
    const mainWindow = createMW();
    mainWindow.loadURL(serve_path);
  }
};

server.use(
  config.UNITY_SERVE_PATH,
  express.static(config.UNITY_BUILD_PATH, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".br")) {
        res.setHeader("Content-Encoding", "br");
        if (filePath.endsWith(".wasm.br")) {
          res.setHeader("Content-Type", "application/wasm");
        } else if (filePath.endsWith(".js.br")) {
          res.setHeader("Content-Type", "application/javascript");
        } else if (filePath.endsWith(".data.br")) {
          res.setHeader("Content-Type", "application/octet-stream");
        } else {
          res.setHeader("Content-Type", "application/octet-stream"); // fallback
        }
      }

      // Handle gzip just in case
      if (filePath.endsWith(".gz")) {
        res.setHeader("Content-Encoding", "gzip");

        if (filePath.endsWith(".wasm.gz")) {
          res.setHeader("Content-Type", "application/wasm");
        } else if (filePath.endsWith(".js.gz")) {
          res.setHeader("Content-Type", "application/javascript");
        } else if (filePath.endsWith(".data.gz")) {
          res.setHeader("Content-Type", "application/octet-stream");
        } else {
          res.setHeader("Content-Type", "application/octet-stream");
        }
      }
    },
  })
);
server.use("/", express.static(config.SIMULATED_DESKTOP_BUILD_PATH));
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  server.listen(config.SERVE_PORT, () => {
    dbgLog("SimuNUS served at http://localhost:" + config.SERVE_PORT);
    createWindow();
  });

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
