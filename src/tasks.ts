import { randomInt } from "crypto";
import { dbgErr, normalizeTime } from "./utils";
import {
  defaultPlayerProfile,
  TaskStatus,
  type EmailMeta,
  type IGameSave,
  type PlayerProfile,
  type PlayerStep,
  type TaskCompletion,
  type TaskDetail,
  type TaskStep,
  type Time,
  type TimeValue,
} from "./types";

type PlayerStepFactory = (_: string) => PlayerStep;
const openApp: PlayerStepFactory = (app: string) => ({
  type: "click",
  id: "simdesktop-app-" + app.replace(" ", "-"),
});
const openEmail: PlayerStepFactory = (emailId: string) => ({
  type: "click",
  id: "email-" + emailId,
});
const goScene: PlayerStepFactory = (scene: string) => ({
  type: "goScene",
  scene,
});
const click: PlayerStepFactory = (id: string) => ({ type: "click", id });
const interact: PlayerStepFactory = (object: string) => ({
  type: "interact",
  object,
});

type ToTime1 = TimeValue | number | [number, number];
/**
 * Convert a time expression to type TimeValue, it can be a number, a time range or TimeValue
 * @param t - time expression to convert
 * @param default_timetype whether the time is absolute or relative when it is a number
 * @returns converted TimeValue
 */
const toTime1: (
  t: ToTime1,
  default_timetype: "absolute" | "relative"
) => TimeValue = (t, default_timetype) => {
  if (typeof t === "number") {
    return { type: default_timetype, value: t } as TimeValue;
  } else if (Array.isArray(t)) {
    return { type: "random", value: t };
  } else {
    return t;
  }
};
/**
 * Convert time expressions (year, month, day, hour, minute) to type Time.
 * each of them can be a number, a time range (from number1 to number2) or TimeValue
 * @param y - year
 * @param mo - month
 * @param d - day
 * @param h - hour
 * @param min - minute
 * @param relative_to - the start time related to receiving the message on this channel
 * @returns converted standard task time
 */
export const toTime = (
  y: ToTime1,
  mo: ToTime1,
  d: ToTime1,
  h: ToTime1,
  min: ToTime1,
  relative_to?: string
) => {
  const default_timetype =
    typeof relative_to === "string" ? "relative" : "absolute";
  const time: Time = {
    year: toTime1(y, default_timetype),
    month: toTime1(mo, default_timetype),
    day: toTime1(d, default_timetype),
    hour: toTime1(h, default_timetype),
    minute: toTime1(min, default_timetype),
  };
  return {
    relative_to: relative_to,
    time: time,
  };
};
export const getExactTime = (
  taskTime: Time,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
) => {
  const getExactTime1 = (
    time: TimeValue,
    current: number,
    min: number,
    max: number
  ) => {
    if (time.type === "absolute") return time.value;
    if (time.type === "relative") return time.value + current;
    return randomInt(min, max);
  };
  return normalizeTime(
    getExactTime1(taskTime.year, year, 2025, 2029),
    getExactTime1(taskTime.month, month, 1, 12),
    getExactTime1(taskTime.day, day, 1, 30),
    getExactTime1(taskTime.hour, hour, 0, 60),
    getExactTime1(taskTime.minute, minute, 0, 60)
  );
};
export const extractExactTime = (t: Time) => {
  if (
    t.day.type === "absolute" &&
    t.year.type === "absolute" &&
    t.month.type === "absolute" &&
    t.hour.type === "absolute" &&
    t.minute.type === "absolute"
  ) {
    return {
      year: t.year.value,
      month: t.month.value,
      day: t.day.value,
      hour: t.hour.value,
      minute: t.minute.value,
    };
  } else {
    dbgErr(`extractExactTime: ${t} is not exact time`);
  }
};
const gameOverResult: (message: string, fiy: string) => TaskStep = (
  message,
  fiy
) => {
  return {
    node: "main",
    function: "showGameOver",
    params: [message, fiy],
  };
};
const sendEmailTask: (emailId: string) => TaskStep = (emailId) => {
  return {
    node: "main",
    function: "sendEmail",
    params: [emailId],
  };
};
const finishOnLaptopTask: (...playerStep: PlayerStep[]) => TaskStep[] = (
  ...playerStep: PlayerStep[]
) => {
  return [
    {
      node: "unity",
      playerSteps: [goScene("Room"), interact("desk")],
    },
    {
      node: "laptop",
      playerSteps: playerStep,
    },
  ];
};
const unlockApp: (...appNames: string[]) => TaskStep = (...appNames) => {
  return {
    node: "main",
    function: "unlockApp",
    params: appNames,
  };
};
export const taskDetails: TaskDetail[] = [
  {
    name: "Read Offer Email",
    description: "Open the laptop and read the NUS offer email",
    guide: true,
    startTime: toTime(0, 0, 0, 0, 1, "newGame"),
    steps: [
      sendEmailTask("offer"),
      unlockApp("Email", "Browser"),
      ...finishOnLaptopTask(openApp("Email"), openEmail("offer")),
    ], //"0" is the id of the offer email
    completedMessage: "offerEmailRead",
    completedResult: [unlockApp("Applicant Portal")],
  },
  {
    name: "Accept Offer",
    description: "Login to applicant portal to accept NUS offer",
    guide: true,
    startTime: toTime(0, 0, 0, 0, 0, "offerEmailRead"),
    steps: [
      ...finishOnLaptopTask(
        openApp("Applicant Portal"),
        click("applicant-portal-current-student-login-btn"),
        click("applicant-portal-admission"),
        click("admission-inquiry"),
        click("applicant-portal-accept")
      ),
    ],
    completedMessage: "offerAccepted",
    completedResult: [unlockApp("Photo Verification")],
    failedMessage: "offerRejected",
    failedResult: [
      gameOverResult(
        "What has NUS done to make you reject the offer",
        `In real life, it is more complecated to accept / reject NUS offer. 
Singapore-Cambridge GCE A-Level, Polytechnic, IB Diploma, NUS High School students 
indicate their decisions on Joint Acceptance Portal (JAP) while 
International Students / Singapore Citizens / Permanent Residents with International Qualifications
indicate their decisions independently. International students can only take 
one offer from any Singapore's universities to obtain student pass`
      ),
    ],
  },
  {
    name: "Upload Photo",
    description: "Upload the photo for Student Card",
    guide: true,
    startTime: toTime(0, 0, 0, 0, 0, "offerAccepted"),
    timeout: toTime(0, 0, 2, 0, 0, "offerAccepted"),
    steps: [
      ...finishOnLaptopTask(
        openApp("Photo Verification"),
        click("photo-varification-undergraduate-login-btn"),
        click("upload-photo-input"),
        click("photo-submit-btn")
      ),
    ],
    completedMessage: "photoUploaded",
    failedResult: [
      gameOverResult(
        "You should submit your photo in time",
        `In real life, failure to submit a photograph that meets the requirements is not Game Over but
may result in delays in processing your student card and registration formalities. 
Therefore it is still highly recommended that you submit your photo as soon as you accept your offer
Besides, the photo you submit in this step will  It will be appear on your physical Student
Card, e-student card in the uNivUS app, Canvas, Undergraduate concession card, etc.
so do pick your most satisfying photo`
      ),
    ],
  },
  {
    name: "Arrive in NUS",
    description: "Arrive in NUS",
    guide: false,
    startTime: toTime(0, 0, 0, 0, 0, "depart"),
    steps: [
      {
        node: "unity",
        function: "jumpToScene",
        params: ["Singapore"],
      },
    ],
    completedMessage: "arriveInNUS",
    completedResult: [
      {
        node: "unity",
        function: "jumpToScene",
        params: ["Campus Map"],
      },
    ],
  },
];

export const newGameTaskCompletion: () => TaskCompletion[] = () =>
  taskDetails.map((task) => {
    return {
      name: task.name,
      steps: task.steps.map((_step) => {
        return {
          status: TaskStatus.NotStarted,
          playerCurrentStep: 0,
        };
      }),
      status: TaskStatus.NotStarted,
      scheduled: false,
      scheduledTime: { year: 0, month: 0, day: 0, hour: 0, minute: 0 },
    };
  });
export const isImmediate: (t: Time | TimeValue) => boolean = (t) => {
  if ("type" in t) {
    //t: TimeValue
    return t.type === "relative" && t.value === 0;
  }
  //t: Time
  return (
    isImmediate(t.year) &&
    isImmediate(t.month) &&
    isImmediate(t.day) &&
    isImmediate(t.hour) &&
    isImmediate(t.minute)
  );
};
export class GameSave implements IGameSave {
  unitySave: string = "";
  receivedEmails: EmailMeta[] = [];
  tasks: TaskCompletion[] = newGameTaskCompletion();
  unlockedApps: string[] = [];
  playerProfile: PlayerProfile = defaultPlayerProfile;
}
