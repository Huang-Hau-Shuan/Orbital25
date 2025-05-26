import fs from "fs";
import { CONFIG_PATH, DEBUG, EMAIL_PATH, SAVE_PATH } from "./SimuNUS_config";
import path from "node:path";
import { dbgErr, dbgLog, dbgWarn, deserializeFromJsonFile } from "./utils.js";
import { isGameConfig, isGameSave } from "./gamedata.guard.js";
export interface EmailMeta {
  id: string;
  subject: string;
  unread: boolean;
}
export interface EmailContent {
  id: string;
  file?: string;
  content?: string;
}
export enum TaskStatus {
  NotStarted,
  Ongoing,
  Finished,
  Failed,
}
export interface TaskProcedure {
  description: string;
  status: TaskStatus;
}
export interface GameConfig {
  debug: boolean;
  gameSavePath: string;
  unityGameConfig: string;
}
export interface SubTask {
  platform: "unity" | "laptop";
  procedures: TaskProcedure[];
  status: TaskStatus;
}
export interface Task {
  id: string;
  name: string;
  steps: SubTask[];
  status: TaskStatus;
}
export interface IGameSave {
  unitySave: string;
  receivedEmails: EmailMeta[];
  tasks: Task[];
  unlockedApps: string[];
}
class GameSave implements IGameSave {
  unitySave: string = "";
  receivedEmails: EmailMeta[] = [];
  tasks: Task[] = [];
  unlockedApps: string[] = [];
}
const emailContent: EmailContent[] = [];
const emailMeta: EmailMeta[] = [];
let gameSave: GameSave = new GameSave();
let gameConfig: GameConfig = {
  debug: DEBUG,
  gameSavePath: SAVE_PATH,
  unityGameConfig: "",
};
fs.readFile(path.join(EMAIL_PATH, "index.json"), "utf-8", (err, _data) => {
  if (err) {
    dbgErr("Failed to load emails:", err);
    return;
  }
  const data = JSON.parse(_data);
  if (!Array.isArray(data)) {
    dbgErr("Invalid emails in ", path.join(EMAIL_PATH, "index.json"));
    return;
  }
  data.forEach((email: unknown, index: number) => {
    if (true) {
      //todo: check if read
      if (typeof email === "object" && email != null) {
        emailContent.push({ id: index.toString(), ...email });
        const subject =
          "subject" in email && typeof email.subject === "string"
            ? email.subject
            : "[No subject]";
        emailMeta.push({
          id: index.toString(),
          subject: subject,
          unread: true,
        });
      } else {
        dbgErr("Invalid Email: ", email);
      }
    }
  });
});
deserializeFromJsonFile(CONFIG_PATH, isGameConfig, (data) => {
  gameConfig = data;
  gameConfig.gameSavePath = fs.existsSync(gameConfig.gameSavePath)
    ? gameConfig.gameSavePath
    : "";
});

export const handleGameSaveMessage = (
  onMessage: (
    channel: string,
    callback: (...args: unknown[]) => void,
    register?: boolean
  ) => void,
  sendMessage: (channel: string, ...args: unknown[]) => void
) => {
  const updateHasNewEmail = () => {
    sendMessage(
      "setHasNewMessage",
      gameSave.receivedEmails.some((email) => email.unread)
    );
  };
  /**
   * Send an email to the player
   * @param {string} id - the id of the email
   */
  const sendEmail = (id: string) => {
    const email = emailMeta.find((e) => e.id === id);
    if (typeof email === "undefined") {
      dbgErr("Cannot find email with id", id);
      return;
    }
    email.unread = true;
    gameSave.receivedEmails.push(email);
    updateHasNewEmail();
    sendMessage("setEmailList", gameSave.receivedEmails);
  };
  const unlockApp = (...name: string[]) => {
    gameSave.unlockedApps.push(...name);
    sendMessage("setUnlockedApps", gameSave.unlockedApps);
  };
  onMessage("save", (data: unknown) => {
    // handle save command from unity
    const _data = typeof data === "string" ? data : JSON.stringify(data);
    gameSave.unitySave = _data;
    if (gameConfig.gameSavePath == "") {
      gameConfig.gameSavePath = SAVE_PATH;
    }
    const _gameSave = JSON.stringify(gameSave);
    const _gameConfig = JSON.stringify(gameConfig);
    dbgLog("saving game data:", _gameSave);
    fs.writeFile(gameConfig.gameSavePath, _gameSave, "utf-8", () => {
      fs.writeFile(CONFIG_PATH, _gameConfig, "utf-8", () => {
        dbgLog("saving game config:", _gameConfig);
        sendMessage("gameSaved");
      });
    });
  });
  onMessage("load", () => {
    deserializeFromJsonFile(gameConfig.gameSavePath, isGameSave, (data) => {
      gameSave = data;
      dbgLog("Read game data:", gameSave);
      sendMessage("setGameData", gameSave.unitySave);
      sendMessage("setUnlockedApps", gameSave.unlockedApps);
      sendMessage("setEmailList", gameSave.receivedEmails);
    });
  });
  onMessage("newGame", () => {
    dbgLog("new game");
    gameSave = new GameSave();
    if (gameConfig.debug)
      //unlock all apps to debug
      unlockApp(
        "Email",
        "Browser",
        "Canvas",
        "EduRec",
        "NUSMods",
        "Applicant Portal"
      );
    else unlockApp("Email", "Browser");
    setTimeout(() => {
      gameSave = new GameSave();
      sendEmail("0");
    }, 1000);
  });
  onMessage("getGameConfig", () => {
    dbgLog("Unity Loaded");
    sendMessage("setGameConfig", { debug: true }); //TODO: implement game config
  });
  onMessage("getUnlockedApps", () => {
    dbgLog("set unlock");
    sendMessage("setUnlockedApps", gameSave.unlockedApps);
  });
  onMessage("getEmailList", () => {
    sendMessage("setEmailList", gameSave.receivedEmails);
  });
  onMessage("markEmailRead", (id: unknown) => {
    for (let i = 0; i < gameSave.receivedEmails.length; i++) {
      if (gameSave.receivedEmails[i].id === id) {
        gameSave.receivedEmails[i].unread = false;
        dbgLog("Read email:", gameSave.receivedEmails[i].subject);
        break;
      }
    }
    sendMessage(
      "setHasNewMessage",
      gameSave.receivedEmails.some((email) => email.unread)
    );
  });
  onMessage("getEmailBody", (id: unknown) => {
    const email = emailContent.find((email) => email.id === id);
    if (email === undefined) {
      dbgWarn("Cannot find email with id", id);
      return;
    }
    if ("body" in email) {
      sendMessage("setEmailBody", {
        id: id,
        body:
          typeof email.body === "string"
            ? email.body
            : "The requested email does not exist",
      });
    } else if ("file" in email && typeof email.file === "string") {
      fs.readFile(path.join(EMAIL_PATH, email.file), "utf-8", (err, data) => {
        if (err) {
          dbgErr(`Failed to set read email body from ${email.file}`, err);
          return;
        }
        sendMessage("setEmailBody", {
          id: id,
          body: data,
        });
      });
    } else {
      sendMessage("setEmailBody", {
        id: id,
        body: "[this email has no content]",
      });
    }
  });
  onMessage("getHasNewMessage", updateHasNewEmail);
};
