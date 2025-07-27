/*
 * Generated type guards for "types.ts".
 * WARNING: Do not manually change this file.
 */
import {
  type TimeValue,
  type Time,
  type StaticTime,
  type TaskTime,
  type PlayerStep,
  type TaskStep,
  type TaskDetail,
  type EmailMeta,
  type AddressEntry,
  type PhoneType,
  type PhoneEntry,
  type EmergencyContact,
  type PlayerProfile,
  type GameConfig,
  TaskStatus,
  type StepCompletion,
  type TaskCompletion,
  type ApplicationStatus,
  type DateRange,
  type NextOfKin,
  type HostelPreferences,
  type HostelApplicationForm,
  type HostelApplication,
  type IGameSave,
  type CompleteIndex,
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

export function isStaticTime(obj: unknown): obj is StaticTime {
  const typedObj = obj as StaticTime;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["year"] === "number" &&
    typeof typedObj["month"] === "number" &&
    typeof typedObj["day"] === "number" &&
    typeof typedObj["hour"] === "number" &&
    typeof typedObj["minute"] === "number"
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
      typedObj["type"] === "input" &&
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

export function isAddressEntry(obj: unknown): obj is AddressEntry {
  const typedObj = obj as AddressEntry;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["type"] === "string" &&
    Array.isArray(typedObj["lines"]) &&
    typedObj["lines"].every((e: any) => typeof e === "string") &&
    typeof typedObj["country"] === "string" &&
    typeof typedObj["postal"] === "string"
  );
}

export function isPhoneType(obj: unknown): obj is PhoneType {
  const typedObj = obj as PhoneType;
  return (
    typedObj === "Home" ||
    typedObj === "Mobile (Singapore)" ||
    typedObj === "Mobile (Overseas)" ||
    typedObj === "Office"
  );
}

export function isPhoneEntry(obj: unknown): obj is PhoneEntry {
  const typedObj = obj as PhoneEntry;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    (isPhoneType(typedObj["type"]) as boolean) &&
    typeof typedObj["number"] === "string" &&
    typeof typedObj["ext"] === "string" &&
    typeof typedObj["preferred"] === "boolean"
  );
}

export function isEmergencyContact(obj: unknown): obj is EmergencyContact {
  const typedObj = obj as EmergencyContact;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["name"] === "string" &&
    typeof typedObj["relationship"] === "string" &&
    typeof typedObj["phone"] === "string" &&
    typeof typedObj["ext"] === "string" &&
    typeof typedObj["isPrimary"] === "boolean" &&
    typeof typedObj["editing"] === "boolean"
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
    typeof typedObj["NUSNETID"] === "string" &&
    typeof typedObj["emailPassword"] === "string" &&
    typeof typedObj["passport"] === "string" &&
    typeof typedObj["nationality"] === "string" &&
    typeof typedObj["finOrNric"] === "string" &&
    typeof typedObj["isSingaporean"] === "boolean" &&
    typeof typedObj["mobile"] === "string" &&
    typeof typedObj["mobileExt"] === "string" &&
    typeof typedObj["personalEmail"] === "string"
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
    typedObj === TaskStatus.Waiting ||
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
    (isStaticTime(typedObj["scheduledTime"]) as boolean)
  );
}

export function isApplicationStatus(obj: unknown): obj is ApplicationStatus {
  const typedObj = obj as ApplicationStatus;
  return (
    typedObj === "In Progress" ||
    typedObj === "Application Completed" ||
    typedObj === "Offered" ||
    typedObj === "Offer Accepted" ||
    typedObj === "Successful" ||
    typedObj === "Unsuccessful" ||
    typedObj === "Offer Lapsed" ||
    typedObj === "Not Eligible" ||
    typedObj === "Application Rejected" ||
    typedObj === "Endorsed" ||
    typedObj === "Appeal Received" ||
    typedObj === "Appeal Unsuccessful"
  );
}

export function isDateRange(obj: unknown): obj is DateRange {
  const typedObj = obj as DateRange;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["startDate"] === "string" &&
    typeof typedObj["endDate"] === "string"
  );
}

export function isNextOfKin(obj: unknown): obj is NextOfKin {
  const typedObj = obj as NextOfKin;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["name"] === "string" &&
    typeof typedObj["relationship"] === "string" &&
    typeof typedObj["phone"] === "string" &&
    typeof typedObj["email"] === "string"
  );
}

export function isHostelPreferences(obj: unknown): obj is HostelPreferences {
  const typedObj = obj as HostelPreferences;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["preference1"] === "string" &&
    typeof typedObj["preference2"] === "string" &&
    typeof typedObj["preference3"] === "string"
  );
}

export function isHostelApplicationForm(
  obj: unknown
): obj is HostelApplicationForm {
  const typedObj = obj as HostelApplicationForm;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    (isNextOfKin(typedObj["nextOfKin"]) as boolean) &&
    typeof typedObj["healthDeclaration"] === "string" &&
    typeof typedObj["awards"] === "string" &&
    typeof typedObj["ccaPart1"] === "string" &&
    typeof typedObj["ccaPart2"] === "string" &&
    typeof typedObj["ccaPart3"] === "string" &&
    typeof typedObj["ccaPart4"] === "string" &&
    typeof typedObj["stayReason"] === "string" &&
    (isHostelPreferences(typedObj["hostelPreferences"]) as boolean) &&
    typeof typedObj["specialRequest"] === "string"
  );
}

export function isHostelApplication(obj: unknown): obj is HostelApplication {
  const typedObj = obj as HostelApplication;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["name"] === "string" &&
    (isApplicationStatus(typedObj["status"]) as boolean) &&
    (isDateRange(typedObj["stayPeriod"]) as boolean) &&
    typeof typedObj["applicationStartDate"] === "string" &&
    typeof typedObj["applicationSubmittedDate"] === "string" &&
    (isHostelApplicationForm(typedObj["form"]) as boolean) &&
    typeof typedObj["checkIn"] === "boolean"
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
    typeof typedObj["registrationData"] === "object" &&
    Array.isArray(typedObj["appointments"]) &&
    Array.isArray(typedObj["hostelData"]) &&
    typedObj["hostelData"].every((e: any) => isHostelApplication(e) as boolean)
  );
}

export function isCompleteIndex(obj: unknown): obj is CompleteIndex {
  const typedObj = obj as CompleteIndex;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["taskIndex"] === "number" &&
    typeof typedObj["stepIndex"] === "number" &&
    typeof typedObj["playerStepIndex"] === "number"
  );
}
