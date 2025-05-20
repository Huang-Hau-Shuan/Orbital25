const { app, BrowserWindow, ipcMain } = require("electron");
const express = require("express");
const path = require("node:path");
const server = express();
const config = require("./SimuNUS_config.js");
const fs = require("fs");
var unity_loaded = false;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}
const dbgLog = (...args) => {
  if (config.DEBUG) {
    console.log(...args);
  }
};
const dbgWarn = (...args) => {
  if (config.DEBUG) {
    console.warn(...args);
  }
};
const dbgErr = (...args) => {
  if (config.DEBUG) {
    console.error(...args);
  }
};
//Register how to handle messages from SimuNUS
function handleMessage(mainWindow) {
  const sendMessage = (...args) => mainWindow.webContents.send(...args);
  const to_register = [];
  const onMessage = (channel, callback, register = true) => {
    ipcMain.on(channel, (_event, data) => callback(data));
    if (register) {
      to_register.push(channel);
    }
  };
  const forwardMessage = (channel) =>
    onMessage(channel, (data) => sendMessage(channel, data), false);
  if (config.DEBUG)
    onMessage("debug", (data) => console.log("Received Debug Message:", data));
  onMessage(
    "register_message_handler",
    (data) => {
      if (typeof data !== "object") {
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
  onMessage("save", (data) => {
    console.log("Game saved (placeholder)");
    //TODO: save game
  });
  onMessage("load", (data) => {
    console.log("Game loaded (placeholder)");
    //TODO: load game
  });
  //Test message flow
  onMessage("unity_hello", () => {
    if (config.DEBUG) {
      dbgLog("Unity Loaded");
    }
    unity_loaded = true;
    mainWindow.webContents.send("SimuNUS_hello", null);
  });
  forwardMessage("hideSim");
  forwardMessage("showSim");
  mainWindow.webContents.on("did-finish-load", () => {
    to_register.forEach((channel) => {
      sendMessage("register_message_handler", {
        source: "main",
        channel: channel,
      });
    });
  });
}
const createWindow = () => {
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
          console.warn("Failed to remove service worker cache:", err);
        } else if (config.DEBUG) {
          console.log("Unity Service Worker Folder removed");
        }
        const mainWindow = createMW();
        mainWindow.webContents.session.clearCache().then(() => {
          mainWindow.loadFile(path.join(__dirname, "index.html"), {
            extraHeaders: "pragma: no-cache\ncache-control: no-cache",
          });
        });
      }
    );
  } else {
    const mainWindow = createMW();
    mainWindow.loadFile(path.join(__dirname, "index.html"));
    mainWindow.addListener();
  }
};

server.use(
  "/",
  express.static(config.UNITY_BUILD_PATH, {
    setHeaders: (res, filePath) => {
      //console.log(filePath);
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  server.listen(config.UNITY_SERVE_PORT, () => {
    if (config.DEBUG)
      console.log(
        "Unity build served at http://localhost:" + config.UNITY_SERVE_PORT
      );
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
