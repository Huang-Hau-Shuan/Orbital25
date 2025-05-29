/*
 * Generated type guards for "gamedata.ts".
 * WARNING: Do not manually change this file.
 */
import type {
  EmailMeta,
  EmailContent,
  GameConfig,
  IGameSave,
} from "./gamedata";
import { TaskStatus } from "./tasks";

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

export function isEmailContent(obj: unknown): obj is EmailContent {
  const typedObj = obj as EmailContent;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["id"] === "string" &&
    typeof typedObj["file"] === "string" &&
    typeof typedObj["content"] === "string"
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

export function isIGameSave(obj: unknown): obj is IGameSave {
  const typedObj = obj as IGameSave;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["unitySave"] === "string" &&
    Array.isArray(typedObj["receivedEmails"]) &&
    typedObj["receivedEmails"].every((e: any) => isEmailMeta(e) as boolean) &&
    Array.isArray(typedObj["tasks"]) &&
    typedObj["tasks"].every(
      (e: any) =>
        ((e !== null && typeof e === "object") || typeof e === "function") &&
        typeof e["name"] === "string" &&
        Array.isArray(e["steps"]) &&
        e["steps"].every(
          (e: any) =>
            ((e !== null && typeof e === "object") ||
              typeof e === "function") &&
            (e["status"] === TaskStatus.NotStarted ||
              e["status"] === TaskStatus.Ongoing ||
              e["status"] === TaskStatus.Finished ||
              e["status"] === TaskStatus.Failed) &&
            Array.isArray(e["playerStepsStatus"]) &&
            e["playerStepsStatus"].every((e: any) => typeof e === "boolean")
        ) &&
        (e["status"] === TaskStatus.NotStarted ||
          e["status"] === TaskStatus.Ongoing ||
          e["status"] === TaskStatus.Finished ||
          e["status"] === TaskStatus.Failed) &&
        ((e["scheduled"] !== null && typeof e["scheduled"] === "object") ||
          typeof e["scheduled"] === "function") &&
        typeof e["scheduled"]["year"] === "number" &&
        typeof e["scheduled"]["month"] === "number" &&
        typeof e["scheduled"]["day"] === "number" &&
        typeof e["scheduled"]["hour"] === "number" &&
        typeof e["scheduled"]["minute"] === "number"
    ) &&
    Array.isArray(typedObj["unlockedApps"]) &&
    typedObj["unlockedApps"].every((e: any) => typeof e === "string")
  );
}
