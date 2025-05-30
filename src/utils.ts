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
