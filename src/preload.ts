import { contextBridge, ipcRenderer } from "electron";
import { SERVE_ORIGIN, DEBUG, UNITY_SERVE_PATH } from "./SimuNUS_config.ts";
contextBridge.exposeInMainWorld("SimuNUS_API", {
  _DEBUG: DEBUG,
  unity_embedded_mode: "iframe", //how to embed unity webGL build ("iframe", "webview", null)
  origin: SERVE_ORIGIN,
  unity_serve_path: UNITY_SERVE_PATH,
  sendMessage: (channel: string, ...args: unknown[]) => {
    if (typeof channel !== "string" || !channel.trim()) {
      console.error("Invalid channel:", channel);
      return;
    }
    ipcRenderer.send(channel, ...args);
  }, //Allow frontend to send message to backend
  onMessage: (channel: string, callback: (...args: unknown[]) => void) => {
    if (typeof channel !== "string" || !channel.trim()) {
      console.error("Invalid channel:", channel);
      return;
    }
    if (typeof callback !== "function") {
      console.error("Callback is not a function");
      return;
    }
    ipcRenderer.on(channel, (_event, ...args) => callback(...args));
  }, //Allow frontend to receive message from backend
  removeListener: (channel: string, callback: (...args: unknown[]) => void) => {
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
  removeAllListener: (channel: string) => {
    if (typeof channel !== "string" || !channel.trim()) {
      console.error("Invalid channel:", channel);
      return;
    }
    ipcRenderer.removeAllListeners(channel);
  },
});
