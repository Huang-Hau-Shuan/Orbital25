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
  type PlayerProfile,
  type GameConfig,
  TaskStatus,
  type StepCompletion,
  type TaskCompletion,
  type IGameSave,
} from "./types";

export function isTimeValue(obj: unknown): obj is TimeValue {
  const typedObj = obj as TimeValue;
  return (
    (((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      typedObj["type"] === "random" &&
      Array.isArray(typedObj["value"]) &&
      typeof typedObj["value"][0] === "number" &&
      typeof typedObj["value"][1] === "number") ||
    (((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
      (typedObj["type"] === "absolute" || typedObj["type"] === "relative") &&
      typeof typedObj["value"] === "number")
  );
}

export function isTime(obj: unknown): obj is Time {
  const typedObj = obj as Time;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    (isTimeValue(typedObj["year"]) as boolean) &&
    (isTimeValue(typedObj["month"]) as boolean) &&
    (isTimeValue(typedObj["day"]) as boolean) &&
    (isTimeValue(typedObj["hour"]) as boolean) &&
    (isTimeValue(typedObj["minute"]) as boolean)
  );
}

export function isTaskTime(obj: unknown): obj is TaskTime {
  const typedObj = obj as TaskTime;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["relative_to"] === "string" &&
    (isTime(typedObj["time"]) as boolean)
  );
}

export function isPlayerStep(obj: unknown): obj is PlayerStep {
  const typedObj = obj as PlayerStep;
  return (
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
      typeof typedObj["object"] === "string")
  );
}

export function isTaskStep(obj: unknown): obj is TaskStep {
  const typedObj = obj as TaskStep;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    (typedObj["node"] === "main" ||
      typedObj["node"] === "unity" ||
      typedObj["node"] === "laptop") &&
    (typedObj["function"] === "showGameOver" ||
      typedObj["function"] === "sendEmail" ||
      typedObj["function"] === "unlockApp" ||
      typedObj["function"] === "jumpToScene") &&
    Array.isArray(typedObj["params"]) &&
    Array.isArray(typedObj["playerSteps"]) &&
    typedObj["playerSteps"].every((e: any) => isPlayerStep(e) as boolean) &&
    typeof typedObj["description"] === "string"
  );
}

export function isTaskDetail(obj: unknown): obj is TaskDetail {
  const typedObj = obj as TaskDetail;
  return (
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
    (isTaskTime(typedObj["timeout"]) as boolean)
  );
}

export function isEmailMeta(obj: unknown): obj is EmailMeta {
  const typedObj = obj as EmailMeta;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["id"] === "string" &&
    typeof typedObj["subject"] === "string" &&
    typeof typedObj["unread"] === "boolean"
  );
}

export function isPlayerProfile(obj: unknown): obj is PlayerProfile {
  const typedObj = obj as PlayerProfile;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["firstName"] === "string" &&
    typeof typedObj["lastName"] === "string" &&
    typeof typedObj["birthday"] === "string" &&
    (typedObj["gender"] === "Male" || typedObj["gender"] === "Female") &&
    typeof typedObj["firstNameBefore"] === "boolean" &&
    typeof typedObj["major"] === "string" &&
    typeof typedObj["studentID"] === "string" &&
    typeof typedObj["studentEmail"] === "string" &&
    typeof typedObj["passport"] === "string" &&
    typeof typedObj["nationality"] === "string" &&
    typeof typedObj["finOrNric"] === "string" &&
    typeof typedObj["isSingaporean"] === "boolean" &&
    typeof typedObj["mobile"] === "string" &&
    typeof typedObj["personalEmail"] === "string" &&
    typeof typedObj["emailPassword"] === "string"
  );
}

export function isGameConfig(obj: unknown): obj is GameConfig {
  const typedObj = obj as GameConfig;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["debug"] === "boolean" &&
    typeof typedObj["gameSavePath"] === "string" &&
    typeof typedObj["unityGameConfig"] === "string"
  );
}

export function isTaskStatus(obj: unknown): obj is TaskStatus {
  const typedObj = obj as TaskStatus;
  return (
    typedObj === TaskStatus.NotStarted ||
    typedObj === TaskStatus.Ongoing ||
    typedObj === TaskStatus.Finished ||
    typedObj === TaskStatus.Failed
  );
}

export function isStepCompletion(obj: unknown): obj is StepCompletion {
  const typedObj = obj as StepCompletion;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    (isTaskStatus(typedObj["status"]) as boolean) &&
    typeof typedObj["playerCurrentStep"] === "number"
  );
}

export function isTaskCompletion(obj: unknown): obj is TaskCompletion {
  const typedObj = obj as TaskCompletion;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["name"] === "string" &&
    Array.isArray(typedObj["steps"]) &&
    typedObj["steps"].every((e: any) => isStepCompletion(e) as boolean) &&
    (isTaskStatus(typedObj["status"]) as boolean) &&
    typeof typedObj["scheduled"] === "boolean" &&
    ((typedObj["scheduledTime"] !== null &&
      typeof typedObj["scheduledTime"] === "object") ||
      typeof typedObj["scheduledTime"] === "function") &&
    typeof typedObj["scheduledTime"]["year"] === "number" &&
    typeof typedObj["scheduledTime"]["month"] === "number" &&
    typeof typedObj["scheduledTime"]["day"] === "number" &&
    typeof typedObj["scheduledTime"]["hour"] === "number" &&
    typeof typedObj["scheduledTime"]["minute"] === "number"
  );
}

export function isIGameSave(obj: unknown): obj is IGameSave {
  const typedObj = obj as IGameSave;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["unitySave"] === "string" &&
    Array.isArray(typedObj["receivedEmails"]) &&
    typedObj["receivedEmails"].every((e: any) => isEmailMeta(e) as boolean) &&
    Array.isArray(typedObj["tasks"]) &&
    typedObj["tasks"].every((e: any) => isTaskCompletion(e) as boolean) &&
    Array.isArray(typedObj["unlockedApps"]) &&
    typedObj["unlockedApps"].every((e: any) => typeof e === "string") &&
    (isPlayerProfile(typedObj["playerProfile"]) as boolean) &&
    typeof typedObj["registrationData"] === "object"
  );
}
