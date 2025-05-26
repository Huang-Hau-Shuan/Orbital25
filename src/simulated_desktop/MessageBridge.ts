type CallbackType = (data: unknown) => void;

declare global {
  interface Window {
    SimuNUS_API?: {
      sendMessage: (channel: string, data: unknown) => void;
      onMessage: (channel: string, callback: CallbackType) => void;
      removeListener: (channel: string, callback: CallbackType) => void;
      removeAllListener: (channel: string) => void;
    };
    messageBridgeReady: undefined | boolean;
  }
}
interface Message {
  channel: string;
  data: unknown;
}
const toSend: Message[] = [];
const registered: Record<string, CallbackType> = {};
export const SendToSimuNUS = function (channel: string, data: unknown) {
  try {
    const message = {
      channel: channel,
      data: data,
    };
    if (window.parent && window.parent !== window) {
      // send to parent window when embedded in iframe.
      // since the script register channels before creating iframe, it should be ready
      window.parent.postMessage(message, "*");
    } else if (window.messageBridgeReady === true) {
      {
        //not embedded and ready
        window.postMessage(message, "*");
      }
    } else {
      toSend.push(message);
    }
  } catch (err) {
    console.warn("MessageBridge.ts, in sendMessage():", err);
  }
};
export const onSimuNUSMessage = function (
  channel: string,
  callback: (data: unknown) => void,
  register_only_once: boolean = true
) {
  if (typeof callback !== "function") {
    console.error(
      `MessageBridge.ts, in onMessage(): ${callback} is not callable`
    );
    return;
  }
  //Register channel
  // SendToSimuNUS("register_message_handler", {
  //   source: "laptop",
  //   channel: channel,
  // });
  // Browser / iframe messages
  if (register_only_once) {
    if (channel in registered) {
      dbgLog(`Channel ${channel} is already registered`);
      if (
        window.SimuNUS_API &&
        typeof window.SimuNUS_API.removeAllListener === "function"
      ) {
        window.SimuNUS_API.removeAllListener(channel);
      } else {
        dbgErr("Failed to remove existing listeners for channel " + channel);
      }
    }
    registered[channel] = callback;
  }

  // Electron preload-exposed API
  if (
    window.SimuNUS_API &&
    typeof window.SimuNUS_API.onMessage === "function"
  ) {
    window.SimuNUS_API.onMessage(channel, callback);
  }
};
export const dbgLog = (data: unknown) => {
  if (
    window.SimuNUS_API &&
    typeof window.SimuNUS_API.sendMessage === "function"
  )
    window.SimuNUS_API.sendMessage("debug", data); //directly send to backend
  else SendToSimuNUS("debug", data);
};
export const dbgWarn = (data: unknown) => {
  if (
    window.SimuNUS_API &&
    typeof window.SimuNUS_API.sendMessage === "function"
  )
    window.SimuNUS_API.sendMessage("debug", data); //directly send to backend
  else SendToSimuNUS("warn", data);
};
export const dbgErr = (data: unknown) => {
  if (
    window.SimuNUS_API &&
    typeof window.SimuNUS_API.sendMessage === "function"
  )
    window.SimuNUS_API.sendMessage("debug", data); //directly send to backend
  else SendToSimuNUS("error", data);
};
onSimuNUSMessage("messageBridgeReady", () => {
  toSend.forEach((msg) => {
    SendToSimuNUS(msg.channel, msg.data);
  });
});
window.addEventListener("message", (event) => {
  const msg = event.data;
  for (const channel in registered)
    if (msg && msg.channel == channel) {
      registered[channel](msg.data);
    }
});
