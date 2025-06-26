import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  type AlertColor,
  IconButton,
  Stack,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { onSimuNUSMessage } from "./MessageBridge";

interface Message {
  id: number;
  type: MessageType;
  customText?: string;
}

type MessageType = "newEmail" | "save" | "taskComplete" | "showNotification";

let globalMessageId = 0;

const getMessageContent = (
  type: MessageType,
  customText?: string
): { text: string; severity: AlertColor } => {
  switch (type) {
    case "newEmail":
      return { text: "You've received a new email!", severity: "info" };
    case "save":
      return { text: "Game saved successfully.", severity: "success" };
    case "taskComplete":
      return { text: "Task completed!", severity: "success" };
    default:
      return { text: customText ?? "Notification", severity: "info" };
  }
};

const MAX_MESSAGES = 5;
const MESSAGE_SHOW_TIME_MS = 3000;

const FloatingMessageStack: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const timers = useRef<Record<number, NodeJS.Timeout>>({});

  const pushMessage = (type: MessageType, customText?: string) => {
    setMessages((prev) => {
      const next = [
        ...prev.filter((v) => v.type !== type || v.type === "showNotification"),
        { id: globalMessageId++, type, customText },
      ];
      if (next.length > MAX_MESSAGES) {
        const removed = next.shift();
        if (removed && timers.current[removed.id]) {
          clearTimeout(timers.current[removed.id]);
          delete timers.current[removed.id];
        }
      }
      return next;
    });
  };

  const handleClose = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  };

  useEffect(() => {
    // Set up timeouts for new messages
    messages.forEach((msg) => {
      if (!timers.current[msg.id]) {
        timers.current[msg.id] = setTimeout(() => {
          handleClose(msg.id);
        }, MESSAGE_SHOW_TIME_MS);
      }
    });
  }, [messages]);

  useEffect(() => {
    const channels: MessageType[] = [
      "newEmail",
      "save",
      "taskComplete",
      "showNotification",
    ];

    for (const channel of channels) {
      onSimuNUSMessage(channel, (data) => {
        const msgText =
          channel === "showNotification" && typeof data === "string"
            ? data
            : undefined;
        pushMessage(channel, msgText);
      });
    }
  }, []);

  return (
    <Stack
      spacing={1}
      sx={{
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1400,
        maxWidth: "80%",
        minWidth: "500px",
      }}
    >
      {messages.map(({ id, type, customText }) => {
        const { text, severity } = getMessageContent(type, customText);
        return (
          <Slide key={id} direction="down" in mountOnEnter unmountOnExit>
            <Alert
              severity={severity}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => handleClose(id)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ minWidth: 500 }}
            >
              {text}
            </Alert>
          </Slide>
        );
      })}
    </Stack>
  );
};

export default FloatingMessageStack;
