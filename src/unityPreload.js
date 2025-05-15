const { contextBridge, ipcRenderer } = require("electron");
const { UNITY_SERVE_ORIGIN, DEBUG } = require("./index");

contextBridge.exposeInMainWorld("SimuNUS_API", {
  _DEBUG: DEBUG,
  sendMessage: (channel, data) => {
    // Validate channel (must be a non-empty string)
    if (typeof channel !== "string" || !channel.trim()) {
      console.error("Invalid channel:", channel);
      return;
    }
    // Verify the origin matches the Unity server
    if (window.location.origin === UNITY_SERVE_ORIGIN) {
      ipcRenderer.send(channel, data);
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
      ipcRenderer.on(channel, (event, data) => callback(data));
    } else {
      console.warn("Unauthorized origin:", window.location.origin);
    }
  }, //Allow unity to receive message from backend
});
