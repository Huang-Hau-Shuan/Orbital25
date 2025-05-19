// bridge.jslib:

// Exported functions to Unity
mergeInto(LibraryManager.library, {
  // inside mergeInto can't use (...)=>{...}, must use fucntion(...){...}
  SendToSimuNUS: function (channel, data) {
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
        console.log(`SendToSimuNUS - channel: ${channel}, content: ${data}`);
      }
    } catch (err) {
      console.warn("bridge.jslib, in sendMessage():", err);
    }
  },

  onSimuNUSMessage: function (channel, callback) {
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
  },
  SendDebugMessage: function (message) {
    if (typeof message !== "string") message = UTF8ToString(message);
    _SendToSimuNUS("debug", message);
  },
  ExitGame: function () {
    _SendToSimuNUS("exit", null);
  },

  SaveGame: function () {
    _SendToSimuNUS("save", null);
  },

  LoadGame: function () {
    _SendToSimuNUS("load", null);
  },

  ShowSimulatedDesktop: function () {
    _SendToSimuNUS("showSim", null);
  },

  HideSimulatedDesktop: function () {
    _SendToSimuNUS("hideSim", null);
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
    _onSimuNUSMessage(channel, (data) => {
      const to_send = stringify ? JSON.stringify(data) : data;
      SendMessage(gameObject, method, to_send); //calls the C# callback
    });
  },
});
