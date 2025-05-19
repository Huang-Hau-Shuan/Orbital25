const { contextBridge, ipcRenderer } = require("electron");
const { UNITY_SERVE_ORIGIN, DEBUG } = require("./SimuNUS_config");
contextBridge.exposeInMainWorld("SimuNUS_API", {
  _DEBUG: DEBUG,
  unity_embedded_mode: "iframe", //how to embed unity webGL build ("iframe", "webview", null)
  desktop_embedded_mode: "iframe", //how to embed simulated desktop ("iframe", "webview", null)
  unity_serve_origin: UNITY_SERVE_ORIGIN,
  sendMessage: (channel, data) => {
    if (typeof channel !== "string" || !channel.trim()) {
      console.error("Invalid channel:", channel);
      return;
    }
    ipcRenderer.send(channel, data);
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
    ipcRenderer.on(channel, (event, data) => callback(data));
  }, //Allow frontend to receive message from backend
});
