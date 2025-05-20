const { contextBridge, ipcRenderer } = require("electron");
const {
  UNITY_SERVE_ORIGIN,
  DEBUG,
  SIMUATED_LAPTOP_BUILD_PATH,
} = require("./SimuNUS_config");
contextBridge.exposeInMainWorld("SimuNUS_API", {
  _DEBUG: DEBUG,
  unity_embedded_mode: "iframe", //how to embed unity webGL build ("iframe", "webview", null)
  desktop_embedded_mode: "iframe", //how to embed simulated desktop ("iframe", "webview", null)
  unity_serve_origin: UNITY_SERVE_ORIGIN,
  simulated_laptop_path: SIMUATED_LAPTOP_BUILD_PATH,
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
});
