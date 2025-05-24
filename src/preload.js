const { contextBridge, ipcRenderer } = require("electron");
const { SERVE_ORIGIN, DEBUG, UNITY_SERVE_PATH } = require("./SimuNUS_config");
contextBridge.exposeInMainWorld("SimuNUS_API", {
  _DEBUG: DEBUG,
  unity_embedded_mode: "iframe", //how to embed unity webGL build ("iframe", "webview", null)
  origin: SERVE_ORIGIN,
  unity_serve_path: UNITY_SERVE_PATH,
  sendMessage: (channel, ...args) => {
    if (typeof channel !== "string" || !channel.trim()) {
      console.error("Invalid channel:", channel);
      return;
    }
    ipcRenderer.send(channel, ...args);
  }, //Allow frontend to send message to backend
  onMessage: (channel, callback) => {
    if (typeof channel !== "string" || !channel.trim()) {
      console.error("Invalid channel:", channel);
      return;
    }
    if (typeof callback !== "function") {
      console.error("Callback is not a function");
      return;
    }
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  }, //Allow frontend to receive message from backend
  removeListener: (channel, callback) => {
    if (typeof channel !== "string" || !channel.trim()) {
      console.error("Invalid channel:", channel);
      return;
    }
    if (typeof callback !== "function") {
      console.error("Callback is not a function");
      return;
    }
    ipcRenderer.removeListener(channel, callback);
  },
  removeAllListener: (channel) => {
    if (typeof channel !== "string" || !channel.trim()) {
      console.error("Invalid channel:", channel);
      return;
    }
    ipcRenderer.removeAllListeners(channel);
  },
});
