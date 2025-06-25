import { Chalk } from "chalk";
import { DEBUG } from "./SimuNUS_config.js";
import { existsSync, readFile } from "node:fs";

const chalk = new Chalk({ level: 3 });
export const dbgLog = (...args: unknown[]) => {
  args = args.map((value) => {
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  });
  if (DEBUG) {
    console.log(chalk.grey(...args));
  }
};
export const dbgWarn = (...args: unknown[]) => {
  if (DEBUG) {
    console.warn(chalk.hex("#FFA500")(...args));
  }
};
export const dbgErr = (...args: unknown[]) => {
  if (DEBUG) {
    console.error(chalk.red(...args));
  }
};
export const deserializeFromJsonFile = <T>(
  path: string,
  isT: (obj: unknown) => obj is T,
  callback: (data: T) => void,
  typename?: string
) => {
  if (!existsSync(path)) {
    dbgLog(`File does not exist: ${path}`);
    return;
  }
  readFile(path, "utf-8", (err, content) => {
    if (err) {
      dbgErr(`Failed to read file: ${path}`, err);
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      dbgErr(`Invalid JSON in file: ${path}`, err);
      return;
    }
    if (isT(parsed)) {
      callback(parsed);
    } else {
      dbgErr(
        `JSON structure is invalid for expected type ${
          typename ? typename : ""
        } in file: ${path}`
      );
      dbgErr(content);
    }
  });
};

export function clamp(number: number, min: number, max: number) {
  return Math.min(Math.max(number, min), max);
}
export function normalizeTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
) {
  // JavaScript months are 0-based (0 = Jan, 11 = Dec)
  const date = new Date(year, month - 1, day, hour, minute);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // convert back to 1-based
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}
export const calculateNUSMatricNumber = function (id: string) {
  var matches = id.toUpperCase().match(/^A\d{7}|U\d{6,7}/);
  if (matches) {
    var match = matches[0];

    // Discard 3rd digit from U-prefixed NUSNET ID
    if (match[0] === "U" && match.length === 8) {
      match = match.slice(0, 3) + match.slice(4);
    }

    var weights = {
      U: [0, 1, 3, 1, 2, 7],
      A: [1, 1, 1, 1, 1, 1],
    }[match[0]];
    if (weights === undefined) return;

    for (var i = 0, sum = 0, digits = match.slice(-6); i < 6; i++) {
      sum += weights[i] * Number(digits[i]);
    }

    return match + "YXWURNMLJHEAB"[sum % 13];
  }
};
export const generateRandomString = (
  length: number,
  characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
export const generateRamdomPassword = (length: number = 12) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = `~!@#$%^&*_+-=\`|\\(){}[]:;\"'<>,.?/`;
  const allSets = [upper, lower, digits, special];
  let passwordChars: string[] = [];
  //pick one char from each set
  for (let charSet of allSets) {
    const char = charSet[Math.floor(Math.random() * charSet.length)];
    passwordChars.push(char);
  }
  //select other chars
  const allChars = allSets.join();
  while (passwordChars.length < length) {
    const char = allChars[Math.floor(Math.random() * allChars.length)];
    passwordChars.push(char);
  }

  // Shuffle the result
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
};
