import { newGameTaskCompletion } from "./tasks";

export type TimeValue =
  | { type: "random"; value: [number, number] }
  | { type: "absolute" | "relative"; value: number };
export interface Time {
  year: TimeValue;
  month: TimeValue;
  day: TimeValue;
  hour: TimeValue;
  minute: TimeValue;
}
export interface TaskTime {
  relative_to: string | undefined; //relative to the time when the system receives the message on this channel
  time: Time;
}
export type PlayerStep =
  | { type: "goScene"; scene: string } // player needs to go to this scene
  | { type: "click"; id: string } // player needs to click the element with this id
  | { type: "interact"; object: string }; //player needs to interact with the object
export interface TaskStep {
  node: "main" | "unity" | "laptop";
  function?: "showGameOver" | "sendEmail" | "unlockApp"; //the step that the system do
  params?: unknown[];
  playerSteps?: PlayerStep[];
}
export interface TaskDetail {
  name: string;
  description: string;
  guide: boolean;
  startTime: TaskTime;
  steps: TaskStep[];
  completedMessage: string;
  completedResult?: TaskStep[];
  failedMessage?: string | undefined;
  failedResult?: TaskStep[];
  timeout?: TaskTime;
}
export interface EmailMeta {
  id: string;
  subject: string;
  unread: boolean;
}

export interface PlayerProfile {
  firstName: string;
  lastName: string;
  firstNameBefore: boolean; // if first name is before last name
  major: string;
  studentID: string | undefined;
  studentEmail: string | undefined;
  passport: string | undefined;
  finOrNric: string | undefined;
  isSingaporean: boolean; // Singapore citizen or PR
  mobile: string;
}

export interface GameConfig {
  debug: boolean;
  gameSavePath: string;
  unityGameConfig: string;
}
export enum TaskStatus {
  NotStarted,
  Ongoing,
  Finished,
  Failed,
}
export interface StepCompletion {
  status: TaskStatus;
  playerCurrentStep: number; //the current step the user is
}

export interface TaskCompletion {
  name: string;
  steps: StepCompletion[];
  status: TaskStatus;
  scheduled:
    | {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
      }
    | undefined;
}
export interface IGameSave {
  unitySave: string;
  receivedEmails: EmailMeta[];
  tasks: TaskCompletion[];
  unlockedApps: string[];
  playerProfile: PlayerProfile;
}

export const defaultPlayerProfile: PlayerProfile = {
  firstName: "Abc",
  lastName: "Xyz",
  firstNameBefore: true,
  major: "Computer Engineering",
  studentID: undefined,
  studentEmail: undefined,
  passport: undefined,
  finOrNric: undefined,
  isSingaporean: false,
  mobile: "+6512345678",
};
export class GameSave implements IGameSave {
  unitySave: string = "";
  receivedEmails: EmailMeta[] = [];
  tasks: TaskCompletion[] = newGameTaskCompletion();
  unlockedApps: string[] = [];
  playerProfile: PlayerProfile = defaultPlayerProfile;
}
