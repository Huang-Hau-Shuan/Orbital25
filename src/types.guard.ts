/*
 * Generated type guards for "types.ts".
 * WARNING: Do not manually change this file.
 */
import {
  type TimeValue,
  type Time,
  type TaskTime,
  type PlayerStep,
  type TaskStep,
  type TaskDetail,
  type EmailMeta,
  type EmailContent,
  type GameConfig,
  TaskStatus,
  type StepCompletion,
  type TaskCompletion,
  type IGameSave,
} from "./types";
import { dbgWarn } from "./utils";
type evaluate_params = string | boolean;
function evaluate(...result: evaluate_params[]) {
  return result.every((res, idx) => {
    if (res === false) {
      dbgWarn(
        `[types.guard.ts] in ${
          result[result.length - 1]
        }, evalute result for ${idx} is false`
      );
      return false;
    }
    return true;
  });
}
export function isTimeValue(obj: unknown): obj is TimeValue {
  const typedObj = obj as TimeValue;
  return evaluate(
    (((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      typedObj["type"] === "random" &&
      Array.isArray(typedObj["value"]) &&
      typeof typedObj["value"][0] === "number" &&
      typeof typedObj["value"][1] === "number") ||
      (((typedObj !== null && typeof typedObj === "object") ||
        typeof typedObj === "function") &&
        (typedObj["type"] === "absolute" || typedObj["type"] === "relative") &&
        typeof typedObj["value"] === "number"),
    "isTimeValue"
  );
}

export function isTime(obj: unknown): obj is Time {
  const typedObj = obj as Time;
  return evaluate(
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      (isTimeValue(typedObj["year"]) as boolean) &&
      (isTimeValue(typedObj["month"]) as boolean) &&
      (isTimeValue(typedObj["day"]) as boolean) &&
      (isTimeValue(typedObj["hour"]) as boolean) &&
      (isTimeValue(typedObj["minute"]) as boolean),
    "isTime"
  );
}

export function isTaskTime(obj: unknown): obj is TaskTime {
  const typedObj = obj as TaskTime;
  return evaluate(
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      typeof typedObj["relative_to"] === "string" &&
      (isTime(typedObj["time"]) as boolean),
    "isTaskTime"
  );
}

export function isPlayerStep(obj: unknown): obj is PlayerStep {
  const typedObj = obj as PlayerStep;
  return evaluate(
    (((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      typedObj["type"] === "goScene" &&
      typeof typedObj["scene"] === "string") ||
      (((typedObj !== null && typeof typedObj === "object") ||
        typeof typedObj === "function") &&
        typedObj["type"] === "click" &&
        typeof typedObj["id"] === "string") ||
      (((typedObj !== null && typeof typedObj === "object") ||
        typeof typedObj === "function") &&
        typedObj["type"] === "interact" &&
        typeof typedObj["object"] === "string"),
    "isPlayerStep"
  );
}

export function isTaskStep(obj: unknown): obj is TaskStep {
  const typedObj = obj as TaskStep;
  return evaluate(
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      (typedObj["node"] === "main" ||
        typedObj["node"] === "unity" ||
        typedObj["node"] === "laptop") &&
      (typedObj["function"] === "showGameOver" ||
        typedObj["function"] === "sendEmail" ||
        typedObj["function"] === "unlockApp") &&
      Array.isArray(typedObj["params"]) &&
      Array.isArray(typedObj["playerSteps"]) &&
      typedObj["playerSteps"].every((e: any) => isPlayerStep(e) as boolean),
    "isTaskStep"
  );
}

export function isTaskDetail(obj: unknown): obj is TaskDetail {
  const typedObj = obj as TaskDetail;
  return evaluate(
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      typeof typedObj["name"] === "string" &&
      typeof typedObj["description"] === "string" &&
      typeof typedObj["guide"] === "boolean" &&
      (isTaskTime(typedObj["startTime"]) as boolean) &&
      Array.isArray(typedObj["steps"]) &&
      typedObj["steps"].every((e: any) => isTaskStep(e) as boolean) &&
      typeof typedObj["completedMessage"] === "string" &&
      Array.isArray(typedObj["completedResult"]) &&
      typedObj["completedResult"].every((e: any) => isTaskStep(e) as boolean) &&
      typeof typedObj["failedMessage"] === "string" &&
      Array.isArray(typedObj["failedResult"]) &&
      typedObj["failedResult"].every((e: any) => isTaskStep(e) as boolean) &&
      (isTaskTime(typedObj["timeout"]) as boolean),
    "isTaskDetail"
  );
}

export function isEmailMeta(obj: unknown): obj is EmailMeta {
  const typedObj = obj as EmailMeta;
  return evaluate(
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      typeof typedObj["id"] === "string" &&
      typeof typedObj["subject"] === "string" &&
      typeof typedObj["unread"] === "boolean",
    "isEmailMeta"
  );
}

export function isEmailContent(obj: unknown): obj is EmailContent {
  const typedObj = obj as EmailContent;
  return evaluate(
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      typeof typedObj["id"] === "string" &&
      typeof typedObj["file"] === "string" &&
      typeof typedObj["content"] === "string",
    "isEmailContent"
  );
}

export function isGameConfig(obj: unknown): obj is GameConfig {
  const typedObj = obj as GameConfig;
  return evaluate(
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      typeof typedObj["debug"] === "boolean" &&
      typeof typedObj["gameSavePath"] === "string" &&
      typeof typedObj["unityGameConfig"] === "string",
    "isGameConfig"
  );
}

export function isTaskStatus(obj: unknown): obj is TaskStatus {
  const typedObj = obj as TaskStatus;
  return evaluate(
    typedObj === TaskStatus.NotStarted ||
      typedObj === TaskStatus.Ongoing ||
      typedObj === TaskStatus.Finished ||
      typedObj === TaskStatus.Failed,
    "isTaskStatus"
  );
}

export function isStepCompletion(obj: unknown): obj is StepCompletion {
  const typedObj = obj as StepCompletion;
  return evaluate(
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      (isTaskStatus(typedObj["status"]) as boolean) &&
      typeof typedObj["playerCurrentStep"] === "number",
    "isStepCompletion"
  );
}

export function isTaskCompletion(obj: unknown): obj is TaskCompletion {
  const typedObj = obj as TaskCompletion;
  return evaluate(
    (typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function",
    typeof typedObj["name"] === "string",
    Array.isArray(typedObj["steps"]),
    typedObj["steps"].every((e: any) => isStepCompletion(e) as boolean),
    isTaskStatus(typedObj["status"]) as boolean,
    (((typedObj["scheduled"] !== null &&
      typeof typedObj["scheduled"] === "object") ||
      typeof typedObj["scheduled"] === "function") &&
      typeof typedObj["scheduled"]["year"] === "number" &&
      typeof typedObj["scheduled"]["month"] === "number" &&
      typeof typedObj["scheduled"]["day"] === "number" &&
      typeof typedObj["scheduled"]["hour"] === "number" &&
      typeof typedObj["scheduled"]["minute"] === "number") ||
      typeof typedObj["scheduled"] === "undefined",
    "isTaskCompletion"
  );
}

export function isIGameSave(obj: unknown): obj is IGameSave {
  const typedObj = obj as IGameSave;
  return evaluate(
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      typeof typedObj["unitySave"] === "string" &&
      Array.isArray(typedObj["receivedEmails"]) &&
      typedObj["receivedEmails"].every((e: any) => isEmailMeta(e) as boolean) &&
      Array.isArray(typedObj["tasks"]) &&
      typedObj["tasks"].every((e: any) => isTaskCompletion(e) as boolean) &&
      Array.isArray(typedObj["unlockedApps"]) &&
      typedObj["unlockedApps"].every((e: any) => typeof e === "string"),
    "isIGameSave"
  );
}
