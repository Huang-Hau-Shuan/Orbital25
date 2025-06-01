import fs from "fs";
import { CONFIG_PATH, DEBUG, EMAIL_PATH, SAVE_PATH } from "./SimuNUS_config";
import path from "node:path";
import { dbgErr, dbgLog, dbgWarn, deserializeFromJsonFile } from "./utils.js";
import {
  isImmediate,
  newGameTaskCompletion,
  taskDetails,
  toTime,
} from "./tasks.js";
import { isGameConfig, isIGameSave } from "./types.guard.js";
import {
  TaskStatus,
  type EmailContent,
  type EmailMeta,
  type GameConfig,
  type IGameSave,
  type TaskCompletion,
  type TaskStep,
} from "./types.js";

class GameSave implements IGameSave {
  unitySave: string = "";
  receivedEmails: EmailMeta[] = [];
  tasks: TaskCompletion[] = newGameTaskCompletion();
  unlockedApps: string[] = [];
}
const emailContent: EmailContent[] = [];
const emailMeta: EmailMeta[] = [];
let gameSave: GameSave = new GameSave();
let gameConfig: GameConfig = {
  debug: DEBUG,
  gameSavePath: SAVE_PATH,
  unityGameConfig: "",
};
fs.readFile(path.join(EMAIL_PATH, "index.json"), "utf-8", (err, _data) => {
  if (err) {
    dbgErr("Failed to load emails:", err);
    return;
  }
  const data = JSON.parse(_data);
  if (!Array.isArray(data)) {
    dbgErr("Invalid emails in ", path.join(EMAIL_PATH, "index.json"));
    return;
  }
  data.forEach((email: unknown, index: number) => {
    if (true) {
      //todo: check if read
      if (typeof email === "object" && email != null) {
        emailContent.push({ id: index.toString(), ...email });
        const subject =
          "subject" in email && typeof email.subject === "string"
            ? email.subject
            : "[No subject]";
        emailMeta.push({
          id: index.toString(),
          subject: subject,
          unread: true,
        });
      } else {
        dbgErr("Invalid Email: ", email);
      }
    }
  });
});
deserializeFromJsonFile(CONFIG_PATH, isGameConfig, (data) => {
  gameConfig = data;
  gameConfig.gameSavePath = fs.existsSync(gameConfig.gameSavePath)
    ? gameConfig.gameSavePath
    : "";
});
type OnMessageType = (
  channel: string,
  callback: (...args: unknown[]) => void,
  register?: boolean
) => void;
export const handleGameSaveMessage = (
  onMessage: OnMessageType,
  sendMessage: (channel: string, ...args: unknown[]) => void,
  onceMessage: OnMessageType
) => {
  const updateHasNewEmail = () => {
    sendMessage(
      "setHasNewMessage",
      gameSave.receivedEmails.some((email) => email.unread)
    );
  };
  /**
   * Send an email to the player
   * @param {string} id - the id of the email
   */
  const sendEmail = (id: string) => {
    const email = emailMeta.find((e) => e.id === id);
    if (typeof email === "undefined") {
      dbgErr("Cannot find email with id", id);
      return;
    }
    email.unread = true;
    gameSave.receivedEmails.push(email);
    updateHasNewEmail();
    sendMessage("setEmailList", gameSave.receivedEmails);
    sendMessage("newEmail", email.id); //notify unity that there's a new email
  };
  const unlockApp = (...name: string[]) => {
    dbgLog("unlockApp:", ...name);
    gameSave.unlockedApps.push(...name);
    sendMessage("setUnlockedApps", gameSave.unlockedApps);
  };
  onMessage("save", (data: unknown) => {
    // handle save command from unity
    const _data = typeof data === "string" ? data : JSON.stringify(data);
    gameSave.unitySave = _data;
    if (gameConfig.gameSavePath == "") {
      gameConfig.gameSavePath = SAVE_PATH;
    }
    const _gameSave = JSON.stringify(gameSave);
    const _gameConfig = JSON.stringify(gameConfig);
    dbgLog("saving game data:", _gameSave);
    fs.writeFile(gameConfig.gameSavePath, _gameSave, "utf-8", () => {
      fs.writeFile(CONFIG_PATH, _gameConfig, "utf-8", () => {
        dbgLog("saving game config:", _gameConfig);
        sendMessage("gameSaved");
      });
    });
  });
  onMessage("load", () => {
    deserializeFromJsonFile(gameConfig.gameSavePath, isIGameSave, (data) => {
      gameSave = data;
      dbgLog("Read game data:", gameSave);
      sendMessage("setGameData", gameSave.unitySave);
      sendMessage("setUnlockedApps", gameSave.unlockedApps);
      sendMessage("setEmailList", gameSave.receivedEmails);
    });
  });
  onMessage("newGame", () => {
    dbgLog("new game");
    gameSave = new GameSave();
    // if (gameConfig.debug) {
    //   unlockApp("*"); //unlock all apps to debug
    // }
  });
  onMessage("getGameConfig", () => {
    dbgLog("Unity Loaded");
    sendMessage("setGameConfig", gameConfig);
  });
  onMessage("getUnlockedApps", () => {
    dbgLog("set unlock");
    sendMessage("setUnlockedApps", gameSave.unlockedApps);
  });
  onMessage("getEmailList", () => {
    sendMessage("setEmailList", gameSave.receivedEmails);
  });
  onMessage("markEmailRead", (id: unknown) => {
    if (id === "0") {
      //mark task 0 as complete
      sendMessage("offerEmailRead");
    }
    for (let i = 0; i < gameSave.receivedEmails.length; i++) {
      if (gameSave.receivedEmails[i].id === id) {
        gameSave.receivedEmails[i].unread = false;
        dbgLog("Read email:", gameSave.receivedEmails[i].subject);
        break;
      }
    }
    sendMessage(
      "setHasNewMessage",
      gameSave.receivedEmails.some((email) => email.unread)
    );
  });
  onMessage("getEmailBody", (id: unknown) => {
    const email = emailContent.find((email) => email.id === id);
    if (email === undefined) {
      dbgWarn("Cannot find email with id", id);
      return;
    }
    if ("body" in email) {
      sendMessage("setEmailBody", {
        id: id,
        body:
          typeof email.body === "string"
            ? email.body
            : "The requested email does not exist",
      });
    } else if ("file" in email && typeof email.file === "string") {
      fs.readFile(path.join(EMAIL_PATH, email.file), "utf-8", (err, data) => {
        if (err) {
          dbgErr(`Failed to set read email body from ${email.file}`, err);
          return;
        }
        sendMessage("setEmailBody", {
          id: id,
          body: data,
        });
      });
    } else {
      sendMessage("setEmailBody", {
        id: id,
        body: "[this email has no content]",
      });
    }
  });
  onMessage("getHasNewMessage", updateHasNewEmail);

  //DEAL WITH TASKS
  type CompleteIndex = {
    taskIndex: number;
    stepIndex: number;
    playerStepIndex: number;
  };
  //whether the result of completing a task has already shown
  const task_completed_result_shown = gameSave.tasks.map(
    (task) => task.status === TaskStatus.Finished
  );
  const performStaticStep = (step: TaskStep) => {
    switch (step.node) {
      case "main":
        {
          switch (step.function) {
            case "sendEmail":
              {
                if (step.params) {
                  step.params.forEach((e) => {
                    if (typeof e === "string") sendEmail(e);
                    else dbgErr("invalid email id:", e);
                  });
                }
              }
              break;
            case "showGameOver":
              {
                /* TODO: Add a game over scene */
                dbgErr("GAME OVER !!!!!!!!!!");
              }
              break;
            case "unlockApp":
              {
                if (step.params) {
                  step.params.forEach((e) => {
                    if (typeof e === "string") unlockApp(e);
                    else dbgErr("invalid app name:", e);
                  });
                }
              }
              break;
            default: {
              dbgErr("Invalid task step function:", step.function);
            }
          }
        }
        break;
      case "unity":
        {
          if (step.function) {
            sendMessage(step.function, step.params);
          }
        }
        break;
      case "laptop":
        {
          if (step.function) {
            sendMessage(step.function, step.params);
          }
        }
        break;
      default: {
        dbgErr("Invalid task step node:", step.node);
      }
    }
  };
  const setComplete = (
    taskIndex: number,
    stepIndex?: number,
    playerStepIndex?: number
  ) => {
    if (taskIndex >= taskDetails.length) {
      dbgErr(
        "setComplete: taskIndex",
        taskIndex,
        "out of range, total task number is",
        taskDetails.length
      );
    }
    const completeTask = () => {
      //set a task to be completed
      if (gameSave.tasks[taskIndex].status === TaskStatus.Finished) {
        dbgLog(`Task ${taskDetails[taskIndex].name} is already completed`);
        return;
      }
      dbgLog(`Task ${taskDetails[taskIndex].name} completed!`);
      if (task_completed_result_shown[taskIndex] === false) {
        taskDetails[taskIndex].completedResult?.forEach(performStaticStep);
      }
      gameSave.tasks[taskIndex].status = TaskStatus.Finished;
      sendMessage("taskComplete", taskDetails[taskIndex].name); //notify unity the task is completed
    };
    if (stepIndex !== undefined) {
      const step_length = taskDetails[taskIndex].steps.length;
      if (stepIndex >= step_length) {
        if (stepIndex > step_length) {
          dbgWarn(
            `setComplete: Task ${taskDetails[taskIndex].name}: `,
            `stepIndex ${stepIndex} is strictly greater than total steps ${step_length}`
          );
        }
        dbgLog(`Task ${taskDetails[taskIndex].name} all steps completed`);
        completeTask();
      }
      const completeStep = () => {
        //set a step to be completed
        dbgLog(
          `Task ${taskDetails[taskIndex].name}, step ${stepIndex} completed!`
        );
        gameSave.tasks[taskIndex].steps[stepIndex].status = TaskStatus.Finished;
        if (stepIndex < step_length - 1) {
          //start next step
          performStep(taskIndex, stepIndex + 1);
        } else {
          //no next step, last step done
          completeTask();
        }
      };
      if (playerStepIndex !== undefined) {
        //Set a specific playerStep to be completed
        if (!taskDetails[taskIndex].steps[stepIndex].playerSteps) {
          dbgErr(
            `setComplete: task ${taskDetails[taskIndex].name}, step ${stepIndex} has no playerSteps`
          );
          return;
        }
        const player_step_length =
          taskDetails[taskIndex].steps[stepIndex].playerSteps.length;
        if (playerStepIndex >= player_step_length - 1) {
          if (playerStepIndex > player_step_length) {
            dbgWarn(
              `setComplete: task ${taskDetails[taskIndex].name}, step ${stepIndex}: `,
              `playerStepIndex ${playerStepIndex} is strictly greater then total steps ${player_step_length}`
            );
          }
          completeStep();
        }
        if (
          gameSave.tasks[taskIndex].steps[stepIndex].playerCurrentStep >
          playerStepIndex
        ) {
          //the current step is already completed
          return;
        }
        gameSave.tasks[taskIndex].steps[stepIndex].playerCurrentStep =
          playerStepIndex + 1;
      } else {
        completeStep();
      }
    } else {
      completeTask();
    }
  };
  const listenButtons: Record<string, CompleteIndex> = {};
  const checkOngoing = (index: CompleteIndex, callback: () => void) => {
    const taskIndex = index.taskIndex;
    const stepIndex = index.stepIndex;
    const playerStepIndex = index.playerStepIndex;
    const task_complete = gameSave.tasks[taskIndex];
    if (task_complete.status === TaskStatus.Ongoing) {
      const step_completion = task_complete.steps[stepIndex];
      if (step_completion.status === TaskStatus.Ongoing) {
        if (step_completion.playerCurrentStep <= playerStepIndex) {
          callback();
        }
      }
    }
  };
  onMessage("buttonMounted", (id) => {
    if (typeof id !== "string") return;
    if (id in listenButtons) {
      checkOngoing(listenButtons[id], () => {
        dbgLog(`Button #${id} mounted, guiding user to click it`);
        sendMessage("guideClick_" + id);
      });
    } else {
      //dbgLog("Untracked button mounted:", id);
    }
  });
  onMessage("buttonClicked", (id) => {
    if (typeof id !== "string") return;
    if (id in listenButtons) {
      checkOngoing(listenButtons[id], () => {
        dbgLog(`Button #${id} clicked, set ${listenButtons[id]} complete`);
        setComplete(
          listenButtons[id].taskIndex,
          listenButtons[id].stepIndex,
          listenButtons[id].playerStepIndex
        );
      });
    }
  });
  //perform a certain taskstep that requires player engagement
  const performStep = (taskidx: number, stepidx: number) => {
    if (taskidx >= taskDetails.length) {
      dbgErr(`performStep: task index (${taskidx}) out of range`);
      return;
    }
    const task = taskDetails[taskidx];
    if (stepidx >= task.steps.length) {
      dbgErr(`performStep: step index (${stepidx}) out of range`);
      return;
    }
    const step = task.steps[stepidx];
    if (gameSave.tasks[taskidx].status !== TaskStatus.Ongoing) {
      dbgWarn(
        `performStep is called for not ongoing task "${task.name}", return`
      );
      return;
    }
    if (
      gameSave.tasks[taskidx].steps[stepidx].status === TaskStatus.NotStarted
    ) {
      if (stepidx === 0) {
        dbgLog(`task "${task.name}" has a total of ${task.steps.length} steps`);
      }
      dbgLog(`Start on task "${task.name}", step ${stepidx}`);
      gameSave.tasks[taskidx].steps[stepidx].status = TaskStatus.Ongoing;
    } else if (
      gameSave.tasks[taskidx].steps[stepidx].status === TaskStatus.Failed
    ) {
      //this step has failed
      dbgWarn(`Task "${task.name}" has already failed, return`);
      return;
    } else {
      //this step is completed
      dbgWarn(`Task "${task.name}" has already completed, return`);
      return;
    }
    const checkPlayerNextSteps = () => {
      if (!step.playerSteps) return;
      const playerNextSteps = step.playerSteps.filter((_step, index) => {
        return (
          index >= gameSave.tasks[taskidx].steps[stepidx].playerCurrentStep
        );
      });
      if (playerNextSteps.length === 0) {
        //completed
        dbgLog(
          `checkPlayerNextSteps: Task "${task.name}" step ${stepidx}, all ${playerNextSteps.length} steps done`
        );
        setComplete(taskidx, stepidx);
        return;
      }
      return playerNextSteps;
    };
    switch (step.node) {
      case "main":
        {
          performStaticStep(step);
          setComplete(taskidx, stepidx);
        }
        break;
      case "unity":
        {
          if (step.playerSteps) {
            //ask unity to help guide the user
            dbgLog(`Task "${task.name}" next step will on Unity`);
            if (step.playerSteps === undefined) {
              dbgWarn(
                `Task "${task.name}" step ${stepidx} is an empty Unity task, skipping`
              );
              setComplete(taskidx, stepidx);
            }
            const ns = checkPlayerNextSteps();
            if (ns === undefined) {
              return;
            }

            const last_step = step.playerSteps[step.playerSteps.length - 1];
            if (last_step.type === "interact" && last_step.object === "desk") {
              dbgLog(
                "Typical go to laptop task, register general message callback"
              );
              sendMessage("getSimStatus");
              onceMessage("simStatus", (s) => {
                if (s === true) {
                  dbgLog("laptop shown, skipping unity steps");
                  setComplete(taskidx, stepidx);
                } else {
                  sendMessage("setUnityPlayerNextSteps", {
                    steps: checkPlayerNextSteps(),
                    taskIndex: taskidx,
                    stepIndex: stepidx,
                  });
                }
              });
              onceMessage("showSim", () => {
                setComplete(taskidx, stepidx);
              });
            }
          }
        }
        break;
      case "laptop":
        {
          if (step.playerSteps) {
            const current_step_index =
              gameSave.tasks[taskidx].steps[taskidx].playerCurrentStep;
            if (current_step_index >= step.playerSteps.length) {
              //already completed all steps
              dbgLog(
                `Task "${task.name}" step ${stepidx}, player already all ${step.playerSteps.length} steps, skipping`
              );
              setComplete(taskidx, stepidx);
            }
            step.playerSteps.forEach((step, index) => {
              if (index < current_step_index) return; // exclude completed tasks
              if (step.type !== "click") {
                dbgErr("Invalid laptop task type:", step.type);
                return;
              }
              dbgLog(
                `Task "${task.name}" step ${stepidx}, Listens for button ${step.id} reaction`
              );
              //guide user to click all buttons
              sendMessage("guideClick_" + step.id);
              listenButtons[step.id] = {
                taskIndex: taskidx,
                stepIndex: stepidx,
                playerStepIndex: index,
              };
            });
          } else {
            dbgWarn(
              `Task "${task.name}" step ${stepidx} is an empty laptop task, skipping`
            );
            setComplete(taskidx, stepidx);
          }
        }
        break;
      default: {
        dbgErr("Invalid task step node:", step.node);
      }
    }
  };
  //perform a static taskstep that does not require player engagement nor update gamesave

  onMessage("playerCompletedUnitySteps", (data) => {
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    if (
      typeof data === "object" &&
      data != null &&
      "taskIndex" in data &&
      "stepIndex" in data
    ) {
      if (
        !(
          typeof data.taskIndex === "number" &&
          data.taskIndex < taskDetails.length
        )
      ) {
        dbgErr(
          "Invalid task index from unity message on playerCompletedUnitySteps:",
          data.taskIndex
        );
        return;
      }
      if (
        !(
          typeof data.stepIndex === "number" &&
          data.stepIndex < taskDetails[data.taskIndex].steps.length
        )
      ) {
        dbgErr(
          "Invalid step index from unity message on playerCompletedUnitySteps:",
          data.stepIndex
        );
        return;
      }
      setComplete(data.taskIndex, data.stepIndex);
    } else {
      dbgErr(
        "Invalid data from unity message on playerCompletedUnitySteps:",
        data
      );
    }
  });
  //register tasks
  taskDetails.forEach((task, idx) => {
    //ignore failed or completed tasks
    if (
      gameSave.tasks[idx].status == TaskStatus.Failed ||
      gameSave.tasks[idx].status == TaskStatus.Finished
    )
      return;
    const startTask = () => {
      gameSave.tasks[idx].status = TaskStatus.Ongoing;
      performStep(idx, 0);
    };
    if (gameSave.tasks[idx].status == TaskStatus.NotStarted) {
      //need to register message and time
      if (gameSave.tasks[idx].scheduled) {
        //already scheduled
        sendMessage("scheduleTaskStart", {
          taskID: idx,
          time: toTime(
            gameSave.tasks[idx].scheduled.year,
            gameSave.tasks[idx].scheduled.month,
            gameSave.tasks[idx].scheduled.day,
            gameSave.tasks[idx].scheduled.hour,
            gameSave.tasks[idx].scheduled.minute
          ),
        });
      }
      if (task.startTime.relative_to) {
        //relative to the time receiving a certain message
        onMessage(task.startTime.relative_to, () => {
          if (isImmediate(task.startTime.time)) {
            //immediately happen
            startTask();
          }
          //ask unity in game time manager to schedule this event
          sendMessage("scheduleTaskStart", {
            taskID: idx,
            time: task.startTime.time,
          });
        });
      } else {
        //schedule absolute time
        sendMessage("scheduleTaskStart", {
          taskID: idx,
          time: task.startTime.time,
        });
      }
      onMessage("startTask", (taskid) => {
        if (taskid === idx) startTask();
      });
    }
    //register completed message
    onMessage(task.completedMessage, () => {
      dbgLog(
        `Received complete message ${task.completedMessage} for task ${task.name}`
      );
      setComplete(idx);
    });
  });
};
