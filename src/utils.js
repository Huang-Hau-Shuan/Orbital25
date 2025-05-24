import chalk from "chalk"; //newest chalk only support es6, but electron only supports commonjs
import { DEBUG } from "./SimuNUS_config.js";
export const dbgLog = (...args) => {
  if (DEBUG) {
    console.log(chalk.grey(...args));
  }
};
export const dbgWarn = (...args) => {
  if (DEBUG) {
    console.warn(chalk.hex("#FFA500")(...args));
  }
};
export const dbgErr = (...args) => {
  if (DEBUG) {
    console.error(chalk.red(...args));
  }
};
