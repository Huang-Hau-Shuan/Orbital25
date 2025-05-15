// bridge.jslib:

function sendToSimuNUS(channel, data) {
  /**
   * Universal message sender.
   * When electron message sender is available it sends message to electron backend (ipcMain)
   * Otherwise it posts message via window.postMessage (or window.parent.postMessage when in iframe)
   * @param {string} channel - The channel to send data
   * @param {any} data - The data to send
   */
  const message = { channel: channel, data: data };
  try {
    if (
      window.SimuNUS_API &&
      typeof window.SimuNUS_API.sendMessage === "function"
    ) {
      //send directly to backend (ipcMain) when embedded in webview
      window.SimuNUS_API.sendMessage(channel, data);
    } else if (window.parent && window.parent !== window) {
      //send to parent window when embedded in iframe
      window.parent.postMessage(message, "*");
    } else {
      //no of the above (?)
      window.postMessage(message, "*");
    }
  } catch (err) {
    console.warn("bridge.jslib, in sendMessage():", err);
  }
}

function onSimuNUSMessage(channel, callback) {
  /**
   * Universal message listener register function
   * When electron (ipcRenderer) onMessage is available it calls electron onMessage
   * it also calls window.addEventListener
   * @param {string} channel - The channel to receive data
   * @param {(any) => void} callback - The callback function that takes data as parameter
   */
  if (typeof callback !== "function") {
    console.warn(`bridge.jslib, in onMessage(): ${callback} is not callable`);
    return;
  }
  // Browser / iframe messages
  window.addEventListener("message", (event) => {
    const msg = event.data;
    if (msg && msg.channel == channel && typeof callback === "function") {
      callback(msg.data);
    }
  });

  // Electron preload-exposed API
  if (
    window.SimuNUS_API &&
    typeof window.SimuNUS_API.onMessage === "function"
  ) {
    window.SimuNUS_API.onMessage(channel, (data) => {
      if (typeof callback === "function") {
        callback(data);
      }
    });
  }
}

// Exported functions to Unity
mergeInto(LibraryManager.library, {
  SendDebugMessage: function (message) {
    if (typeof message !== "string") message = UTF8ToString(message);
    sendToSimuNUS("debug", message);
  },
  ExitGame: function () {
    sendToSimuNUS("exit", null);
  },

  SaveGame: function () {
    sendToSimuNUS("save", null);
  },

  LoadGame: function () {
    sendToSimuNUS("load", null);
  },

  ShowSimulatedDesktop: function () {
    sendToSimuNUS("showSim", null);
  },

  HideSimulatedDesktop: function () {
    sendToSimuNUS("hideSim", null);
  },

  RegisterUnityMessageHandler: function (
    channelName,
    gameObjectName,
    methodName,
    stringify
  ) {
    /**
     * Register a listener that forwards messages into Unity
     * @param {string} channelName - the name of the channel to listen over
     * @param {string} gameObjectName - the name of the gameObject (gameObject.name)
     * @param {string} methodName - the name of the callback method
     * @param {bool} stringify - whether using JSON to stringify the raw data
     */
    const channel =
      typeof channelName === "string" ? channel : UTF8ToString(channel);
    const gameObject =
      typeof gameObjectName === "string"
        ? gameObjectName
        : UTF8ToString(gameObjectName);
    const method =
      typeof methodName === "string" ? methodName : UTF8ToString(methodName);
    onSimuNUSMessage(channel, (data) => {
      const to_send = stringify ? JSON.stringify(data) : data;
      SendMessage(gameObject, method, to_send); //calls the C# callback
    });
  },
});
