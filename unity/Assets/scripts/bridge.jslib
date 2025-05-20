// bridge.jslib:

// Exported functions to Unity
mergeInto(LibraryManager.library, {
  // inside mergeInto can't use (...)=>{...}, must use fucntion(...){...}
  // calling other functions in mergeInto must add _ in front of it because unity compile it that way
  /**
   * Universal message sender.
   * When electron message sender is available it sends message to electron backend (ipcMain)
   * Otherwise it posts message via window.postMessage (or window.parent.postMessage when in iframe)
   * @param {string} channel - The channel to send data
   * @param {any} data - The data to send
   */
  SendToSimuNUS: function (channel, data) {
    channel = typeof channel === "string" ? channel : UTF8ToString(channel);
    const message = {
      channel: channel,
      data: data,
    };
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
  /**
   * Register a listener that forwards messages into Unity
   * @param {string} channelName - the name of the channel to listen over
   * @param {string} gameObjectName - the name of the gameObject (gameObject.name)
   * @param {string} methodName - the name of the callback method
   * @param {bool} stringify - whether using JSON to stringify the raw data
   */
  RegisterUnityMessageHandler: function (
    channelName,
    gameObjectName,
    methodName,
    stringify
  ) {
    const channel =
      typeof channelName === "string" ? channelName : UTF8ToString(channelName);
    const gameObject =
      typeof gameObjectName === "string"
        ? gameObjectName
        : UTF8ToString(gameObjectName);
    const method =
      typeof methodName === "string" ? methodName : UTF8ToString(methodName);
    const onSimuNUSMessage = function (channel, callback) {
      if (typeof callback !== "function") {
        console.error(
          `bridge.jslib, in onMessage(): ${callback} is not callable`
        );
        return;
      }
      //Register channel
      _SendToSimuNUS("register_message_handler", {
        source: "unity",
        channel: channel,
      });
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
    onSimuNUSMessage(channel, (data) => {
      try {
        var to_send = stringify ? JSON.stringify(data) : data.toString();
      } catch (err) {
        console.log("Cannot Stringify Message to send:", data, err);
      }
      SendMessage(gameObject, method, to_send); //calls the C# callback
    });
  },
});
