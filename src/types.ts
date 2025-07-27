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
export interface StaticTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
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
export interface AddressEntry {
  type: string;
  lines: string[];
  country: string;
  postal: string;
}
export type PhoneType =
  | "Home"
  | "Mobile (Singapore)"
  | "Mobile (Overseas)"
  | "Office";
export interface PhoneEntry {
  type: PhoneType;
  number: string;
  ext: string;
  preferred: boolean;
}
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  ext: string;
  isPrimary: boolean;
  editing: boolean;
}
export interface PlayerProfile {
  firstName: string;
  lastName: string;
  birthday: string; //dd/mm/yyyy
  gender: "Male" | "Female" | ""; // non-binary is not accepted in some forms. To properly simulate those, we only support m and f
  firstNameBefore: boolean; // if first name is before last name
  major: string;
  studentID: string; // generates in registration part one task, the id on the student card starting with A
  NUSNETID: string; // generates after registration part one task, the id for student email starting with E but without @u.nus.edu
  emailPassword: string;
  passport: string; // only needed if not singaporean
  nationality: string;
  finOrNric: string; // generates in game after getting STP
  isSingaporean: boolean; // Singapore citizen or PR
  mobile: string; //excluding country code
  mobileExt: string; //country code including the '+'
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
  Waiting,
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
  scheduledTime: StaticTime;
}
export type ApplicationStatus =
  | "In Progress"
  | "Application Completed"
  | "Offered"
  | "Offer Accepted"
  | "Successful"
  | "Unsuccessful"
  | "Offer Lapsed"
  | "Not Eligible"
  | "Application Rejected"
  | "Endorsed"
  | "Appeal Received"
  | "Appeal Unsuccessful";

export interface DateRange {
  startDate: string; // format: dd/mm/yyyy
  endDate: string; // format: dd/mm/yyyy
}

export interface NextOfKin {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface HostelPreferences {
  preference1: string;
  preference2: string;
  preference3: string;
}

export interface HostelApplicationForm {
  nextOfKin: NextOfKin;
  healthDeclaration: string;
  awards: string; // A. Awards/Scholarships/Bursaries
  ccaPart1: string; // B.1 University/Poly/JC/HS/Secondary + achievements
  ccaPart2: string; // B.2 Other Activities, External CCAs
  ccaPart3: string; // B.3 Community Involvement Projects
  ccaPart4: string; // B.4 Additional Skills
  stayReason: string; // C. Reason(s) for Stay
  hostelPreferences: HostelPreferences;
  specialRequest: string; // Special or Additional Housing Request
}

export interface HostelApplication {
  name: string;
  status: ApplicationStatus;
  stayPeriod: DateRange;
  applicationStartDate: string; // dd/mm/yyyy or empty
  applicationSubmittedDate: string; // dd/mm/yyyy or empty
  form: HostelApplicationForm;
  checkIn: boolean;
}
export const defaultHostelForm: HostelApplicationForm = {
  nextOfKin: {
    name: "",
    relationship: "",
    phone: "",
    email: "",
  },
  healthDeclaration: "",
  awards: "",
  ccaPart1: "",
  ccaPart2: "",
  ccaPart3: "",
  ccaPart4: "",
  stayReason: "",
  hostelPreferences: {
    preference1: "",
    preference2: "",
    preference3: "",
  },
  specialRequest: "",
};

export const defaultHostelpAplication: HostelApplication = {
  name: "2025-26 Semester 1 & 2",
  status: "Successful",
  stayPeriod: {
    startDate: "03/08/2025",
    endDate: "10/05/2026",
  },
  applicationStartDate: "",
  applicationSubmittedDate: "",
  form: defaultHostelForm,
  checkIn: false,
};

export interface IGameSave {
  unitySave: string;
  receivedEmails: EmailMeta[];
  tasks: TaskCompletion[];
  unlockedApps: string[];
  playerProfile: PlayerProfile;
  registrationData: object;
  appointments: unknown[];
  hostelData: HostelApplication[];
}

export const emptyPlayerProfile: PlayerProfile = {
  firstName: "",
  lastName: "",
  birthday: "",
  gender: "",
  firstNameBefore: true,
  major: "",
  studentID: "",
  NUSNETID: "",
  emailPassword: "",
  passport: "",
  finOrNric: "",
  isSingaporean: false,
  mobile: "",
  personalEmail: "",
  nationality: "",
  mobileExt: "",
};

export const defaultPlayerProfile: PlayerProfile = {
  firstName: "Abc",
  lastName: "Xyz",
  birthday: "01/01/2001",
  gender: "Female",
  firstNameBefore: true,
  major: "Computer Science",
  studentID: "",
  NUSNETID: "",
  emailPassword: "",
  passport: "E12345678",
  finOrNric: "",
  isSingaporean: true,
  mobile: "87654321",
  personalEmail: "myemail@example.com",
  nationality: "Singapore",
  mobileExt: "+65",
};

export const GetOfficialName = (profile: PlayerProfile) => {
  return profile.firstNameBefore
    ? `${profile.firstName} ${profile.lastName}`
    : `${profile.lastName} ${profile.firstName}`;
};
export interface CompleteIndex {
  taskIndex: number;
  stepIndex: number;
  playerStepIndex: number;
}
export const formatDateTime = ({
  year,
  month,
  day,
  hour,
  minute,
}: StaticTime) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(day)}/${pad(month)}/${year} ${pad(hour)}:${pad(minute)}`;
};
