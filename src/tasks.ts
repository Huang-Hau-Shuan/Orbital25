import { randomInt } from "crypto";
import { normalizeTime } from "./utils";

export type TimeValue =
  | { type: "random"; value: [number, number] } //either from number 1 to number 2 or no limit
  | { type: "absolute" | "relative"; value: number };
export interface Time {
  year: TimeValue;
  month: TimeValue;
  day: TimeValue;
  hour: TimeValue;
  minute: TimeValue;
}
export interface TaskTime {
  relative_to?: string;
  time: Time;
}
export type PlayerStep =
  | { type: "openApp"; app: string } // player needs to open an app on simulated desktop
  | { type: "goScene"; scene: string } // player needs to go to this scene
  | { type: "click"; selector: string } // player needs to click the element with selector (like .class or #id)
  | { type: "interact"; object: string }; //player needs to interact with the object
const openApp = (app: string) => ({ type: "openApp", app } as PlayerStep);
const goScene = (scene: string) => ({ type: "goScene", scene } as PlayerStep);
const click = (selector: string) => ({ type: "click", selector } as PlayerStep);
const interact = (object: string) =>
  ({ type: "interact", object } as PlayerStep);
export interface TaskStep {
  node: "main" | "unity" | "laptop";
  function?: string;
  params?: unknown[];
  playerSteps?: PlayerStep[];
}
export interface TaskDetail {
  name: string;
  description: string;
  startTime: TaskTime;
  steps: TaskStep[];
  completedMessage: string;
  completedResult: TaskStep[];
  failedMessage: string | undefined;
  failedResult: TaskStep[];
}
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
 * @param relative_to - the start time related to receiving the message
 * @returns converted standard task time
 */
const toTime = (
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
const GAME_OVER_RESULT: TaskStep[] = [
  {
    node: "unity",
    function: "jump to scene",
    params: ["GameOver"],
  },
];
const sendEmailTask: (emailId: string) => TaskStep = (emailId) => {
  return {
    node: "main",
    function: "send email",
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
export const taskDetails: TaskDetail[] = [
  {
    name: "Accept Offer",
    description: "Login to applicant portal to accept NUS offer",
    startTime: toTime(0, 0, 0, 0, 1, "newGame"), //1 second after starting new game
    steps: [
      sendEmailTask("0"), //"0" is the id of the offer email
      ...finishOnLaptopTask(
        openApp("Applicant Portal"),
        click(".login-btn"),
        click("#applicant-portal-admission"),
        click(".admission-inquiry"),
        click("applicant-portal-accept")
      ),
    ],
    completedMessage: "offerAccepted",
    completedResult: [],
    failedMessage: "offerRejected",
    failedResult: GAME_OVER_RESULT,
  },
  {
    name: "Upload Photo",
    description: "Upload the photo for Student Card",
    startTime: toTime(0, 0, 0, 0, 0, "offerAccepted"),
    steps: [...finishOnLaptopTask(/* TODO */)],
    completedMessage: "photoUploaded",
    completedResult: [],
    failedMessage: undefined, //only if the player did not upload the photo in time
    failedResult: GAME_OVER_RESULT,
  },
];
