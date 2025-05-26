/*
 * Generated type guards for "gamedata.ts".
 * WARNING: Do not manually change this file.
 */
import {
  type EmailMeta,
  type EmailContent,
  TaskStatus,
  type TaskProcedure,
  type GameConfig,
  type SubTask,
  type Task,
  type IGameSave,
} from "./gamedata";
import { dbgErr } from "./utils";
function evaluate(
  isCorrect: boolean,
  varName: string,
  expected: string,
  actual: any
): boolean {
  if (!isCorrect) {
    dbgErr(`${varName} type mismatch, expected: ${expected}, found:`, actual);
  }
  return isCorrect;
}

export function isEmailMeta(
  obj: unknown,
  argumentName: string = "emailMeta"
): obj is EmailMeta {
  const typedObj = obj as EmailMeta;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    evaluate(
      typeof typedObj["id"] === "string",
      `${argumentName}["id"]`,
      "string",
      typedObj["id"]
    ) &&
    evaluate(
      typeof typedObj["subject"] === "string",
      `${argumentName}["subject"]`,
      "string",
      typedObj["subject"]
    ) &&
    evaluate(
      typeof typedObj["unread"] === "boolean",
      `${argumentName}["unread"]`,
      "boolean",
      typedObj["unread"]
    )
  );
}

export function isEmailContent(
  obj: unknown,
  argumentName: string = "emailContent"
): obj is EmailContent {
  const typedObj = obj as EmailContent;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    evaluate(
      typeof typedObj["id"] === "string",
      `${argumentName}["id"]`,
      "string",
      typedObj["id"]
    ) &&
    evaluate(
      typeof typedObj["file"] === "string",
      `${argumentName}["file"]`,
      "string",
      typedObj["file"]
    ) &&
    evaluate(
      typeof typedObj["content"] === "string",
      `${argumentName}["content"]`,
      "string",
      typedObj["content"]
    )
  );
}

export function isTaskStatus(
  obj: unknown,
  _argumentName: string = "taskStatus"
): obj is TaskStatus {
  const typedObj = obj as TaskStatus;
  return (
    typedObj === TaskStatus.NotStarted ||
    typedObj === TaskStatus.Ongoing ||
    typedObj === TaskStatus.Finished ||
    typedObj === TaskStatus.Failed
  );
}

export function isTaskProcedure(
  obj: unknown,
  argumentName: string = "taskProcedure"
): obj is TaskProcedure {
  const typedObj = obj as TaskProcedure;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    evaluate(
      typeof typedObj["description"] === "string",
      `${argumentName}["description"]`,
      "string",
      typedObj["description"]
    ) &&
    evaluate(
      isTaskStatus(typedObj["status"]) as boolean,
      `${argumentName}["status"]`,
      'import("./src/gamedata").TaskStatus',
      typedObj["status"]
    )
  );
}

export function isGameConfig(
  obj: unknown,
  argumentName: string = "gameConfig"
): obj is GameConfig {
  const typedObj = obj as GameConfig;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    evaluate(
      typeof typedObj["debug"] === "boolean",
      `${argumentName}["debug"]`,
      "boolean",
      typedObj["debug"]
    ) &&
    evaluate(
      typeof typedObj["gameSavePath"] === "string",
      `${argumentName}["game_save_path"]`,
      "false",
      typedObj["gameSavePath"]
    ) &&
    evaluate(
      typeof typedObj["unityGameConfig"] === "string",
      `${argumentName}["unity_game_config"]`,
      "string",
      typedObj["unityGameConfig"]
    )
  );
}

export function isSubTask(
  obj: unknown,
  argumentName: string = "subTask"
): obj is SubTask {
  const typedObj = obj as SubTask;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    evaluate(
      typedObj["platform"] === "unity" || typedObj["platform"] === "laptop",
      `${argumentName}["platform"]`,
      '"unity" | "laptop"',
      typedObj["platform"]
    ) &&
    evaluate(
      Array.isArray(typedObj["procedures"]) &&
        typedObj["procedures"].every((e: any) => isTaskProcedure(e) as boolean),
      `${argumentName}["procedures"]`,
      'import("./src/gamedata").TaskProcedure[]',
      typedObj["procedures"]
    ) &&
    evaluate(
      isTaskStatus(typedObj["status"]) as boolean,
      `${argumentName}["status"]`,
      'import("./src/gamedata").TaskStatus',
      typedObj["status"]
    )
  );
}

export function isTask(
  obj: unknown,
  argumentName: string = "task"
): obj is Task {
  const typedObj = obj as Task;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    evaluate(
      typeof typedObj["id"] === "string",
      `${argumentName}["id"]`,
      "string",
      typedObj["id"]
    ) &&
    evaluate(
      typeof typedObj["name"] === "string",
      `${argumentName}["name"]`,
      "string",
      typedObj["name"]
    ) &&
    evaluate(
      Array.isArray(typedObj["steps"]) &&
        typedObj["steps"].every((e: any) => isSubTask(e) as boolean),
      `${argumentName}["steps"]`,
      'import("./src/gamedata").SubTask[]',
      typedObj["steps"]
    ) &&
    evaluate(
      isTaskStatus(typedObj["status"]) as boolean,
      `${argumentName}["status"]`,
      'import("./src/gamedata").TaskStatus',
      typedObj["status"]
    )
  );
}

export function isGameSave(
  obj: unknown,
  argumentName: string = "gameSave"
): obj is IGameSave {
  const typedObj = obj as IGameSave;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    evaluate(
      typeof typedObj["unitySave"] === "string",
      `${argumentName}["unity_save"]`,
      "string",
      typedObj["unitySave"]
    ) &&
    evaluate(
      Array.isArray(typedObj["receivedEmails"]) &&
        typedObj["receivedEmails"].every((e: any) => isEmailMeta(e) as boolean),
      `${argumentName}["received_emails"]`,
      'import("./src/gamedata").EmailMeta[]',
      typedObj["receivedEmails"]
    ) &&
    evaluate(
      Array.isArray(typedObj["tasks"]) &&
        typedObj["tasks"].every((e: any) => isTask(e) as boolean),
      `${argumentName}["tasks"]`,
      'import("./src/gamedata").Task[]',
      typedObj["tasks"]
    ) &&
    evaluate(
      Array.isArray(typedObj["unlockedApps"]) &&
        typedObj["unlockedApps"].every((e: any) => typeof e === "string"),
      `${argumentName}["unlockedApps"]`,
      "string",
      typedObj["unlockedApps"]
    )
  );
}
