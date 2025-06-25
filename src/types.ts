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
  | { type: "input"; id: string } // player needs to complete the input with this id
  | { type: "interact"; object: string }; //player needs to interact with the object
export interface TaskStep {
  node: "main" | "unity" | "laptop";
  function?: "showGameOver" | "sendEmail" | "unlockApp" | "jumpToScene"; //the step that the system do
  params?: unknown[];
  playerSteps?: PlayerStep[];
  description?: string;
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
  birthday: string; //dd/mm/yyyy
  gender: "Male" | "Female"; // non-binary is not accepted in some forms. To properly simulate those, we only support m and f
  firstNameBefore: boolean; // if first name is before last name
  major: string;
  studentID: string; // generates in registration part one task
  studentEmail: string; // generates after registration part one task
  emailPassword: string;
  passport: string; // only needed if not singaporean
  nationality: string;
  finOrNric: string; // generates in game after getting STP
  isSingaporean: boolean; // Singapore citizen or PR
  mobile: string; //including country code
  personalEmail: string;
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
  scheduled: boolean;
  scheduledTime: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  };
}
export interface IGameSave {
  unitySave: string;
  receivedEmails: EmailMeta[];
  tasks: TaskCompletion[];
  unlockedApps: string[];
  playerProfile: PlayerProfile;
  registrationData: object;
}

export const defaultPlayerProfile: PlayerProfile = {
  firstName: "Abc",
  lastName: "Xyz",
  birthday: "01/01/2000",
  gender: "Male",
  firstNameBefore: true,
  major: "",
  studentID: "",
  studentEmail: "",
  emailPassword: "",
  passport: "",
  finOrNric: "",
  isSingaporean: false,
  mobile: "+6512345678",
  personalEmail: "123456789abc@example.com",
  nationality: "",
};
export const GetOfficialName = (profile: PlayerProfile) => {
  return profile.firstNameBefore
    ? `${profile.firstName} ${profile.lastName}`
    : `${profile.lastName} ${profile.firstName}`;
};
