const { contextBridge, ipcRenderer } = require("electron");
const { SERVE_ORIGIN, DEBUG } = require("./SimuNUS_config");
const DEBUG = true;
contextBridge.exposeInMainWorld("SimuNUS_API", {
  _DEBUG: DEBUG,
  sendMessage: (channel, ...args) => {
    // Validate channel (must be a non-empty string)
    if (typeof channel !== "string" || !channel.trim()) {
      console.error("Invalid channel:", channel);
      return;
    }
    // Verify the origin matches the Unity server
    if (window.location.origin === SERVE_ORIGIN) {
      ipcRenderer.send(channel, ...args);
    } else {
      console.warn("Unauthorized origin:", window.location.origin);
    }
  }, //Allow unity to send message to backend
  onMessage: (channel, callback) => {
    if (typeof channel !== "string" || !channel.trim()) {
      console.error("Invalid channel:", channel);
      return;
    }
    if (typeof callback !== "function") {
      console.error("Callback is not a function");
      return;
    }
    if (window.location.origin === UNITY_SERVE_ORIGIN) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    } else {
      console.warn("Unauthorized origin:", window.location.origin);
    }
  }, //Allow unity to receive message from backend
});
