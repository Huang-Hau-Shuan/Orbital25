import { app, BrowserWindow, ipcMain } from "electron";
import express from "express";
import path from "node:path";
import config from "./SimuNUS_config.js";
import fs from "fs";
import { dbgErr, dbgLog, dbgWarn } from "./utils.js";
const server = express();
var unity_loaded = false;
const email_content = [];
const email_meta = [];
const game_save = {
  unity_save: null,
  received_emails: [],
  tasks: [],
};
fs.readFile(
  path.join(config.EMAIL_PATH, "index.json"),
  "utf-8",
  (err, data) => {
    if (err) {
      dbgErr(err);
      return;
    }
    JSON.parse(data).forEach((email, index) => {
      if (true) {
        email_content.push({ id: index.toString(), ...email });
        email_meta.push({
          id: index.toString(),
          subject: email.subject,
          unread: true,
        });
      }
    });
  }
);

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
  if (config.DEBUG) {
    onMessage("debug", (data) => dbgLog("[DEBUG]", data));
    onMessage("error", (data) => dbgErr("[ERROR]", data));
    onMessage("warn", (data) => dbgWarn("[WARN]", data));
  }
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
    dbgLog("Saving game data: ", data);
    fs.writeFile(config.SAVE_PATH, data, "utf-8", () => {
      sendMessage("gameSaved");
    });
  });
  onMessage("load", () => {
    if (fs.existsSync(config.SAVE_PATH)) {
      fs.readFile(config.SAVE_PATH, "utf-8", (err, data) => {
        if (err) {
          dbgErr("Failed to load game:", err);
          return;
        }
        sendMessage("setGameData", data);
      });
    } else {
      dbgErr("Failed to load game: no game save");
    }
  });
  onMessage("getGameConfig", () => {
    dbgLog("Unity Loaded");
    unity_loaded = true;
    sendMessage("setGameConfig", { debug: true }); //TODO: implement game config
  });
  onMessage("getUnlockedApps", () => {
    dbgLog("set unlock");
    //TODO: implement unlock apps
    sendMessage("setUnlockedApps", [
      "Email",
      "Browser",
      "Canvas",
      "EduRec",
      "NUSMods",
    ]);
  });
  onMessage("getEmailList", () => {
    //TODO: filter with whether the player has received the email
    sendMessage("setEmailList", email_meta);
  });
  onMessage("markEmailRead", (id) => {
    for (let i = 0; i < email_meta.length; i++) {
      if (email_meta[i].id === id) {
        email_meta[i].unread = false;
        dbgLog("Read email:", email_meta[i].subject);
        break;
      }
    }
    sendMessage(
      "setHasNewMessage",
      email_meta.some((email) => email.unread)
    );
  });
  onMessage("getEmailBody", (id) => {
    const email = email_content.find((email) => email.id === id);
    let email_body = null;
    if ("body" in email) {
      sendMessage("setEmailBody", {
        id: id,
        body:
          typeof email_body === "string"
            ? email_body
            : "The requested email does not exist",
      });
    } else if ("file" in email) {
      fs.readFile(
        path.join(config.EMAIL_PATH, email.file),
        "utf-8",
        (err, data) => {
          if (err) {
            dbgErr(err);
            return;
          }
          sendMessage("setEmailBody", {
            id: id,
            body: data,
          });
        }
      );
    } else {
      sendMessage("setEmailBody", {
        id: id,
        body: "[this email has no content]",
      });
    }
    sendMessage("setEmailBody", {
      id: id,
      body:
        email_body != undefined
          ? email_body
          : "The requested email does not exist",
    });
  });
  onMessage("getHasNewMessage", () => {
    sendMessage(
      "setHasNewMessage",
      email_meta.some((email) => email.unread)
    );
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
        preload: path.join(import.meta.dirname, "preload.js"),
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
if (!config.DEBUG)
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
