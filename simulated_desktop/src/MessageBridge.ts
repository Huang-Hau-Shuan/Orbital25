declare global {
  interface Window {
    SimuNUS_API?: {
      sendMessage: (channel: string, data: unknown) => void;
      onMessage: (channel: string, callback: (data: unknown) => void) => void;
    };
  }
}

export const SendToSimuNUS = function (channel: string, data: unknown) {
  const message = {
    channel: channel,
    data: data,
  };
  try {
    /*if (
      window.SimuNUS_API &&
      typeof window.SimuNUS_API.sendMessage === "function"
    ) {
      //send directly to backend (ipcMain) when embedded in webview
      window.SimuNUS_API.sendMessage(channel, data);
    } else */if (window.parent && window.parent !== window) {
      //send to parent window when embedded in iframe
      window.parent.postMessage(message, "*");
    } else {
      //no of the above (?)
      window.postMessage(message, "*");
    }
  } catch (err) {
    console.warn("bridge.jslib, in sendMessage():", err);
  }
};
export const onSimuNUSMessage = function (
  channel: string,
  callback: (data: unknown) => void
) {
  if (typeof callback !== "function") {
    console.error(`MessageBridge.ts, in onMessage(): ${callback} is not callable`);
    return;
  }
  //Register channel
  // SendToSimuNUS("register_message_handler", {
  //   source: "laptop",
  //   channel: channel,
  // });
  // Browser / iframe messages
  window.addEventListener("message", (event) => {
    const msg = event.data;
    if (msg && msg.channel == channel) {
      callback(msg.data);
    }
  });

  // Electron preload-exposed API
  if (
    window.SimuNUS_API &&
    typeof window.SimuNUS_API.onMessage === "function"
  ) {
    window.SimuNUS_API.onMessage(channel, callback);
  }
};
