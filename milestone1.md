# SimuNUS

### Milestone 1: Ideation

2 June 2025

---

## Project Idea & Overview

### Motivation

Navigating around NUS’s and Singapore’s systems is difficult, especially for international
students. I am such one who previously knew nothing about Singapore and nobody in NUS, and having nobody to guide me I incurred actual financial costs. Although NUS did provide a checklist of what to do in `NUS Acceptance Guidelines.pdf`, it was very much incomplete: the checklist mentioned student pass application but did not specify
when and how. Additionally, a lot of critical procedures including Registration Part I, the guideline just said "more details will be emailed to you". This led to weeks of uncertainty. And it had finally arrived, it required me to complete everything in just a few days. To make matters worse, the checklist did not even mention residency application at all. Although there were tutorials to attend and online resources to search for, nobody could **demonstrate** how to finish all the steps. In the end, due to these unclear instructions, I missed the ICA off-site enrolment slots, which delayed my STP. Without it, I could not open a bank account for GIRO or PayNow and had to pay the tuition fee with international credit card, incurring a 1% fee and
losses from SGD appreciation in that month.  
Besides administration, way-finding inside the NUS campus itself is difficult. Each building could have completely different levels: one building’s B1 could be F2 of another, even though the two buildings are connected. I had got lost a lot of times, especially when rushing between classes.  
I seek to channel my past struggle into making a possible solution. My team and I want to create something that would make the administrative and navigation processes easier and smoother for future freshmen (not just international students!). This project gives us the opportunity to do so in the form of a game simulation.

### Aim

**SimuNUS** is an interactive NUS simulator that allows freshmen to explore and experience key administrative processes, campus navigation, and academic tasks (armed with advice from us and other seniors). Instead of guessing from incomplete instructions, search
for scattered online resources, or doing things by trial and error,our project will simulate these tasks in a game – from accepting the letter offer to health checkups, from bidding classes to navigating Canvas. We hope future users could engage in the app and gain confidence to complete the real-life tasks.

### Overview

In SimuNUS, players engage in an **RPG-style experience** where they complete realistic enrollment procedures, explore NUS campus and its buildings, and interact with simulated systems such as EduRec, Canvas, and many other registration systems through a **simulated desktop**.

The base game is built with Unity and deployed as a WebGL application. To simulate various online tasks, we also integrate a simulated desktop in which the player interacts with the simulated websites we created. Players can toggle between campus navigation and on-screen tasks by interacting (press the interact key) when they are next to the laptop in the game. This mimicks actual university tasks. For example, to complete Pre-Admission Medical Examination, the player needs to

1. register in simulated UHC website
2. complete part 1 of (simulated) NUS Medical form
3. take internal shuttle bus to UHC / Opp UHC
4. complete all the (simulated) procedures in UHC scene
5. (international students) upload the result to ICA

By simulating both on-screen and on-site tasks and integrating elements from RPG such as maps (including indoor maps and shuttle bus routes), quests, interactive scenarios, and NPC guides, our ultimate goal is for freshmen to get familiar with NUS while having fun. Hopefully after trying our simulator, they will be confident and fully prepared to take on university life.

## Key Features

The following features / systems form the core of the application:

### Game Features

- **Campus Map (Not Implemented as of Milestone 1):**
  Players can explore our 2D maps for different sites in NUS as well as some buildings. We plan to build maps for UHC, MPSH, PGP, COM 1-3
- **NUS Internal Shuttle Bus (ISB) Simulation:**
  An in-game bus system that simulates actual NUS shuttle bus lines: A1, A2, D1, D2, K, BTC (only in main campus), E. Player can take bus on any of the bus stops and go to another stop. All the bus stops and bus routes are the same as in real life
- **Simulated Desktop Interface:**
  A desktop built on react where player can open different applications that simulated real NUS systems like EduRec, Canvas. Tasks like registration or document uploads are completed through this interface.
- **Tasks and Time System:**
  All the enrollment procedures and academic events are wrapped as different tasks. Players receive tasks based on real onboarding steps. A in-game time systems keep tracks of the dates to trigger tasks and record deadlines. Every task has its own "rewards" upon completing, including some visual and sound effects, receiving comfirmation emails, unlock new apps on simulated desktop, etc.
- **Guide systems (Not Implemented as of Milestone 1):**
  We plan to add a friendly virtual guide appears throughout scenes and all applications, as well as NPCs offering advice on some spots. They will offer navigation tips, detailed tutorial on how to complete the tasks, advice from seniors and other contextual help.
- **Save / Load System**
  Game states - including all tasks states and schedules - can be stored and reloaded.
- **Game Settings**
  We plan to add a settings panel to allow players set their preferred key bindings, virtual guide appearance, import and export game save, resolution and FPS, etc.

## System Design

SimuNUS is composed of three major components

### 1. Unity Game Base (Frontend)

- Built in **Unity**, deployed as **WebGL**.
- Roles:
  - 2D maps rendering and player control
  - ISB map that handles bus movement and switching maps
  - Triggers tasks based on interactions
  - Time system (in-game clock)
  - UI for menus, notifications, dialogs
- Communicates with the simulated desktop and backend through JavaScript bridge (`bridge.jslib`).
- wrapped inside a `<iframe>`

### 2. Simulated Desktop

- Essentially a Web App overlay on top of unity game canvas
- Build with **React + TypeScript**, in which each app is a react component
- Roles:
  - A desktop-like environment with taskbar (which also displays in game time) and draggable apps
  - Simulated versions of NUS systems (e.g. Canvas, EduRec)
- The simulated desktop and all apps are decoupled from unity and communicate with the other components of SimuNUS via `postMessage`

### 3. Main Controller (Backend + Entry Point)

- The starting point of the program that runs in Electron with vite plugin
- Roles:
  - Serves the **Unity WebGL build** and **Simulated Desktop** via `Express`
  - Creates the application window
  - Keeps track of tasks procedures and schedules
  - Acts as a central state manager for all non-visual game logic except the time system
  - Save and Load the game, including game configurations

### 4. Main Renderer (Central Message Broker)

The Main Renderer (Electron’s render process, or `index.html`) acts as a **central message broker** similar to Pub/Sub systems: All three components (Unity, Simulated Desktop, Backend) send messages to it, which redirects messages to appropriate recipients.

- To send messages
  - Unity: C# -> `bridge.jslib` -> `window.parent.PostMessage` (since it is embedded in an `<iframe>`)
  - Simulated Desktop and its apps: `window.postMessage`
  - Backend: `window.webContent.send`
- To listen for messages, all three components need to
  1. Register its interest in a channel by sending a special `"register_message_handler"` message with the channel name.
  2. Listens for messages
  - Unity & simulated desktop: `window.addEventListener('message', ...)`
  - Backend: `ipcMain.on(channel, callback)`
- The Main Renderer stores the registrations and delivers messages of that channel to all registered components.

## Develop plan

The updated, detailed and complete table can be found at https://docs.google.com/spreadsheets/d/1jvdNMGsKPCKg4VsxSEb0RdIZnZKi3kA1/

| Week | Date             | Learn                      | tasks                              | Important Dates                         |
| ---- | ---------------- | -------------------------- | ---------------------------------- | --------------------------------------- |
| 1    | 12 - 18 May      | git                        | Repository setup                   | Poster & Video Submission (19 May, 2pm) |
|      |                  | unity foundation           | Planning & task breakdown          | Mission Control #1 (17 May)             |
|      |                  | c#, javascript, typescript | Poster (due 19 May)                |                                         |
|      |                  | Web App: React (Part 1)    | Video (due 19 May)                 |                                         |
|      |                  | electron framework         | Unity setup (WebGL)                |                                         |
|      |                  |                            | NodeJS setup (Electron)            |                                         |
|      |                  |                            | Prototype of first scene           |                                         |
|      |                  |                            | Prototype of a player              |                                         |
|      |                  |                            | Prototype of interactive laptop    |                                         |
|      |                  |                            | Prototype of a campus map          |                                         |
| 2    | 19 - 25 May      | Web App: React (Part 2)    | Simulated desktop UI               | Mission Control #2 (24 May)             |
|      |                  | Game: Unity (Part 1)       | Email app                          |                                         |
|      |                  | unity tile system          | Applicant Portal simulation        |                                         |
|      |                  | nodejs filesystem          | Implement accept offer task        |                                         |
|      |                  | unity basics               | Task system draft                  |                                         |
|      |                  |                            | Design save data structure         |                                         |
|      |                  |                            | Implement save/load functions      |                                         |
|      |                  |                            | ISB route template                 |                                         |
|      |                  |                            | Implement the player               |                                         |
|      |                  |                            | switching map logic                |                                         |
| 3    | 26 May - 1 June  | Game: Unity (Part 2)       | Basic manual save/load UI          | Mission Control #3 (31 May)             |
|      |                  |                            | Submit Photograph task             |                                         |
|      |                  |                            | In game time system                |                                         |
|      |                  |                            | Basic frontpage, menu UI           |                                         |
|      |                  |                            | Selecting starting character UI    |                                         |
|      |                  |                            | Bus transpotation prototype        |                                         |
|      |                  |                            | Design hostel room                 |                                         |
|      |                  |                            | generate Milestone 1 README        |                                         |
| 4    | 2 - 8 June       |                            | Expand UI framework                | 2 June 2pm - Milestone 1 - Ideation     |
|      |                  |                            | Browser app simulation             |                                         |
|      |                  |                            | Begin housing/visa simulation UI   |                                         |
|      |                  |                            | Pre-arrival flow logic             |                                         |
|      |                  |                            | Implement Bus transpotation        |                                         |
|      |                  |                            | expand hostel map                  |                                         |
|      |                  |                            | Campus navigation prototype        |                                         |
| 5    | 9 - 15 June      |                            | Arriving at Singapore              | Mission Control #4 (9 June)             |
|      |                  |                            | expand visa application simulation |                                         |
|      |                  |                            | implement more bus routes          |                                         |
|      |                  |                            | expand UHMS simulation             |                                         |
|      |                  |                            | UHC map                            |                                         |
|      |                  |                            | Medical Examination appointment    |                                         |
| 6    | 16 - 22 June     |                            | Auto-save checkpoints              |                                         |
|      |                  |                            | expand campus navigation           |                                         |
|      |                  |                            | MPSH map                           |                                         |
|      |                  |                            | EduRec registration simulation     |                                         |
|      |                  |                            | Implement registration part 1      |                                         |
|      |                  |                            | Medical Examination                |                                         |
|      |                  |                            | polish sprites                     |                                         |
| 7    | 23 - 29 June     |                            | Registration (Part Two)            |                                         |
|      |                  |                            | Kent Ridge MRT map                 |                                         |
|      |                  |                            | International Students Orientation |                                         |
|      |                  |                            | hostel canteen map                 |                                         |
|      |                  |                            | Course registration simulation     |                                         |
|      |                  |                            | tuition fee payment simulation     |                                         |
|      |                  |                            | Integration testing                |                                         |
|      |                  |                            | polish UI for save/load            |                                         |
|      |                  |                            | generate Milestone 2 README        |                                         |
| 8    | 30 June - 6 July |                            | implement feedback collection      | 30 June 2pm - Milestone 2 - Prototyping |
|      |                  |                            | prepare for end-user testing       |                                         |
|      |                  |                            | COM3 map                           |                                         |
| 9    | 7 - 13 July      |                            | end-user testing                   |                                         |
|      |                  |                            | bug fix                            |                                         |
|      |                  |                            | document code                      |                                         |
| 10   | 14 - 20 July     |                            |                                    | Mission Control #5 (mid-July)           |
| 11   | 21 - 27 July     |                            |                                    |                                         |
| 12   | 28 July - 3 Aug  |                            | generate Milestone 3 README        | 28 July 2pm - Milestone 3 - Extension   |
| 13   | 4 - 10 Aug       |                            |                                    | 4 Aug - Week 0 of Y2S1                  |
| 14   | 11 - 17 Aug      |                            |                                    |                                         |
| 15   | 18 - 24 Aug      |                            |                                    | 27 August - Splashdown - Refinement     |

## Technologies

SimuNUS contains two major tech stacks, one for unity and the other for nodeJS (simulated desktop and main)

### Unity

- **Unity 6 (LTS)**: The engine for the game world, used to render 2D campus maps, simulate bus routes, interacts with in game objects, display dialog with NPCs and manage player movement
- **WebGL Build**: This specific platform allows calling js functions defined in a jslib from C#, thus enables communication between the unity game and the other nodeJS components.
- **C#**: The language to write script for unity. The C# scripts handles game logic and data, time system, player control, UI, visual and sound effects, notification and so on.
- **.jslib**: Unity’s native JavaScript plugin for WebGL build. Used to import JS functions to C#. In SimuNUS the major role of this plugin is to send message to main renderer. More complicated logic is handles elsewhere
- **Tile map**: Used to create 2D campus map
- **Spline**: Used to build bus route

### Simulated Desktop (Web App)

- **React**: A frontend framework for us to build user interfaces out of individual pieces called components. Each simulated application, as well the the simulated desktop itself, are react all components
- **TypeScript**: A strongly typed language that ensures type safety at compile type.
- **HTML/CSS**: Used to create the layout and styles for the app window and simulated NUS websites
- **Vite**: Lightweight, fast bundler and dev server for React and TS projects. It provides hot module reload (HMR) in develop phase and optimizes the build

### Backend

- **Electron**: The framework to creates browser windows and manages the overall app lifecycle. It also provides `ipcMain` and `ipcRenderer` to communicate between frontend and backend.
- **electron-forge with vite plugin**: The tool to build the whole app.
- **Express**: The library to serve the unity build. It allows customized headers that allows the browser to automatically unzip `*.br` in unity build
- **Chalk**: A library for customized CLI output. It helps us debug.
- **Json**: The game save is serialized using json format and stored on local machine

## Technical proof of concept

To demonstrate the technical feasibility of SimuNUS, we built a prototype integrating all major components:

- (All the videos, source code and release can be found [here]())

### Demo Video

A short [video]() showcasing:

- Unity WebGL game loading and running
- Open simulated desktop by intracting with the laptop
- Finishing the first task - accept NUS offer with guide
- Taking NUS internal shuttle bus

### Release ([Windows]())

- Download the release zip file
- Unzip it
- Open SimuNUS.exe and try it out yourself

### Build SimuNUS yourself from [Source Code]()

#### Repository Structure

```
SimuNUS
├─public # Assets for the simulated desktop
│  ├─background # background imaged for simulated desktop and its apps
│  ├─emails # the content of the email
│  └─icon # icons on simulated desktop and its apps
├─src
│  └─simulated_desktop # Source code for the simulated desktop
│      ├─apps # Source code for all the apps
│      │  ├─ApplicantPortal
│      │  └─css # styles for the apps
│      └─simdesktop # Source code for the desktop itself
│          └─context # React context for desktop
└─unity # the unity project
    ├─Assets
    │  ├─2D NUS MAP # Assets for map
    │  ├─images # background for UI interfaces
    │  ├─prefabs # reusable unity prefabs
    │  ├─Scenes # scenes for main menu, player's room and campus maps
    │  ├─scripts # the C# scripts and jslib plugin
    │  ├─Settings
    │  │  └─Scenes
    │  ├─Sprites # sprite assets for the game
    │  │  ├─campus map
    │  │  ├─furnitures
    │  │  └─tiles
    ├─Packages
    └─ProjectSettings
```

#### Build Instructions

- Prerequisites
  - Node.js (We use v22.15.0)
  - Unity (6 with WebGL build support)

1. Clone the repository (since in orbital the github project is set to be private, you can download it [here]())
2. Build the unity project (Alternatively, if you don't have unity 6 installed, you can download it [here]() and unzip it under /public/unity_build)
   - Set build target to WebGL
   - Build the project to /public/unity_build (it may take more than 10 minutes)
3. Run SimuNUS
   ```bash
   npm install
   npm run start
   ```
   alternatively, run `npm run make` to build the project, the build will be under `/out/SimuNUS-win32-x64` for windows

## Technical Detail & Implementations

### 1. Main

1. `src/main.ts`: the **entry point** of the SimuNUS Electron application

   1. Create Browser Window
      - Configured via `BrowserWindow` with settings for:
      - WebGL support
      - Preload script (`preload.js`)
      - Context isolation set to true and node integration to false to ensure security
      - import `src/SimuNUS_config.ts` as `config` to conditionally enable fullscreen, dev tools, or no-cache
      - Automatically reloads Unity if `NO_CACHE` is enabled by clearing service worker cache (critical for debugging)
   2. Setup Local Server
      - Uses `express` to serve files from `config.SERVER_ROOT`
      - Adds correct headers for `.br` and `.gz` compressed assets so that the browser in electron can automatically unzip the compressed unity build
      - Supports WebAssembly MIME types (e.g. `.wasm.br`, `.wasm.gz`)
      - listens on `config.SERVE_PORT`
   3. Message Handling - Defines `sendMessage`, `onMessage`, `onceMessage`, and `forwardMessage` utilities. These functions will be used for in all parts of backend.

      - For `onMessage` and `onceMessage`, we add a parameter to determine whether sending register message to main renderer:

      ```json
      {
        "type": "register_message_handler",
        "source": "main",
        "channel": "example_channel"
      }
      ```

      - It stored these registrations in to_register and actually register them after the main window (main renderer) finishes loading `did-finish-loading`

   4. Handles App level commands: `exit`, `reload` (in debug mode)
   5. Call handleGameSaveMessage() defined in `gamedata.ts` and pass `sendMessage`, `onMessage`, `onceMessage` to it to.

2. `src/gamedata.ts`: manages **game state**, **tasks**, **save/load**. It implements most of the features for handling game data.

   1. Save/Load System
      - Uses `GameSave` class to store:
        - `unitySave`: serialized string from Unity
        - `receivedEmails`: email metadata. The contents of the email are defined separately and loaded on demand in simulated desktop
        - `tasks`: array of taskStatus, stored the task states
        - `unlockedApps`: which desktop apps are available
      - `onMessage("save")` serializes `gameSave` and writes to file
      - `onMessage("load")` deserializes and updates Unity and desktop via `sendMessage`. Here we also checks if the deserialized object matches the type to ensure type safety. The checking functions are defined in `src/types.guard.ts`
      - the game save location is configurable in `src/SimuNUS_config.ts`
      - All the `sendMessage`, `onMessage`, `onceMessage` are passed from `src/main.ts`
      - **All the data types, including all interfaces, enums for email system, unlock apps, tasks system are defined in `src/types.ts`**
   2. Email system
      - Loads email metadata (`emailMeta`) and body content (`emailContent`) from local files
      - `sendEmail(id)` to add an email to `gameSave.receivedEmails` and notify Unity
      - `getEmailList`: get the list of emails in `gameSave.receivedEmails`
      - `getEmailBody`: get the body (content) of a specific email. The email is loaded from local files
      - `markEmailRead`: set the unread attribute of an email to `false`
      - `getHasNewMessage`: check and send whether any email is unread
      - All the `get...` callback will send the result to channel `set...`
   3. Task system
      - Manages tasks defined in `src/tasks.ts`
      - Handles task lifecycle (`NotStarted`, `Ongoing`, `Finished`, `Failed`) and the state of each step of the task
      - Task Scheduling
        - Tasks are registered at runtime and scheduled via messages. (since in game time system is implemented in Unity) However, once a task is registered, the sceduled time will be stored in game save, thus reloading won't change the date and status of a task
        - At startup, tasks are registered based on status:
          1. Absolute start time → schedule directly
          2. Relative time (relative to the time when receiving a message, such as the completion message of the previous task) → listen for trigger message, then schedule
      - Task Excution
        - Tasks consist of **steps** (`TaskStep`), and some steps have **playerSteps** (`PlayerStep[]`) while others are solely the instructions of what the system do: send email, unlock app, etc.
        - Each step is assigned to one of: `"main"`, `"unity"`, `"laptop"`
        - Different implementations for static steps (no player action required) from interactive ones
        - Tasks on unity are implemented in unity, here it sends the instructions to `setUnityPlayerNextSteps` and listens `playerCompletedUnitySteps` for completion. However, if the prequisite for the next task is already satified, it may skip this task.
      - Task Guide
        - The guide for on-screen tasks are triggured here
        - For each step the player needs to do, it sends message to simulated desktop, which will then highlight the components that the player needs to interact with. For example, to guide a user to click a button, it sends out `guideClick_<id>`.
      - Task Completion
        - There are 2 ways of completing a task
          1. All of its steps are done
          2. Receives the completion message
        - Upon completing a task, it sends `taskComplete` and perform all the static tasks in `completedResult`
        - The completion message will triggers notification and a cheerful sound in unity. It may also unlock the next tasks
      - Task Failure
        - The players may fail a task if they
          1. Interact with the wrong components ~~(e.g. click the button to reject the NUS offer)~~
          2. Failed to meet the deadline
        - Upon failing a task, it sends `taskFail` and perform all the static tasks in `failedResult`, which may includes jumping to the game over scene

3. `src/tasks.ts`: Defined the structure, timing, and progression of tasks and the utility functions to create tasks. The excution of the task system is implemented in `src/gamedata.ts`

   1. Task Structure - Each task is defined as a `TaskDetail`
      - `name` and `description`: the name and description of the task
      - `startTime`: When to trigger the task (absolute, relative or random)
      - `steps`: An array of `TaskStep`s
        1. `node`: Defined where the task should be executed - `"main"`, `"unity"`, or `"laptop"`.
        2. optional `function` and `params` that defines what the system should do. e.g. `sendEmail`, `unlockApp`
        3. optional `playerSteps` for interactive tasks requiring user action
      - `completedMessage` / `failedMessage` (optional): The channel name of trigger messages to mark task as complete or failure
      - `completedResult` / `failedResult` (optional): Steps to execute upon success/failure. They are static TaskStep[] that will be executed immediately after the task is done
   2. Time Utility Functions
      - `toTime1(...)`: Converts numeric values to `TimeValue` (absolute, relative, or random)
      - `toTime(...)`: Converts all year/month/day/hour/minute inputs into a full `Time` object (where all year/month/day/hour/minute are of type `TimeValue`)
      - `getExactTime(...)`: Get the absolyte time of the task according to a `Time` object and the current in-game date and time. Alternatively is the type of the `TimeValue` is set to random it generates a random value in the range. Once a absolute time is generated, it should be stored in game save so reloading won't change its time.
      - `isImmediate`: Check if a task should happen immediately. It may skip scheduling and directly start a task if this function return true
   3. PlayerTask Utility functions
      - Convert simplified inputs into standard `PlayerStep`s:
      ```ts
      openApp(appName);
      openEmail(emailID);
      goScene(sceneName);
      click(buttonID);
      interact(gameObjectName);
      ```
   4. Task Initialization:
      - `newGameTaskCompletion()`: it creates a new `TaskCompletion` object with all states of all tasks and their steps to `NotStarted`, currentPlayerStep to `0`

4. `src/types.ts`: defines all the types in main
   1. Time & Scheduling Types
      - `TimeValue`: A flexible time descriptor which can be:
      ```ts
      { type: "random"; value: [number, number] } |
      { type: "absolute" | "relative"; value: number };
      ```
      - `Time`: An object that has `TimeValue` for each of: `year`, `month`, `day`, `hour`, `minute`.
      - `TaskTime`: Includes a `Time` object and optional `relative_to` which is the name of the channel of the message that the task is relative to
   2. Tasks Details (definitions)
      - `TaskStatus`: an enum representing the task state
        ```ts
        enum TaskStatus {
          NotStarted,
          Ongoing,
          Finished,
          Failed,
        }
        ```
      - `PlayerStep`: a player interaction. It is also the smallest structure of a task
        - `goScene`: switch to a Unity scene
        - `click`: click an element by id
        - `interact`: interact with an gameObject in unity
      - `TaskStep`: Defines a single step in a task:
        - `node`: where to execute (`"main"`, `"unity"`, `"laptop"`)
        - `function`: optional function (`sendEmail`, `unlockApp`, `showGameOver`) for the system to execute
        - `params`: arguments for the function
        - `playerSteps`: optional interactions from the player
      - `TaskDetail`: A full task:
        - `name`, `description`
        - `guide`: a boolean indicating whether enabling guide for this task
        - `startTime`: when the task start
        - `steps`: an array of `TaskStep`s
        - `completedMessage`: string message to mark completion
        - `completedResult`, `failedMessage`, `failedResult`: optional outcomes
        - `timeOut`: optional deadline. it is also a `Time` object
   3. Email Types
      - `EmailMeta`: Stores info for each email. It contains a unique string `id`, `subject` of the email as well as if it is `unread`.
      - `EmailContent`: the content of the email. We separate it from `EmailMeta` so that the simulated desktop can load email on demand, thus reducing memory usage
        - `id`: email ID
        - `file`: optional file to load from disk
        - `content`: optional inline string
   4. Game Data & Configuration
      - `GameConfig`: Stores configuration for the game:
        - `debug`: a boolean of whether enabling debug mode
        - `gameSavePath`: path to save file
        - `unityGameConfig`: serialized string Unity config, including key bindin, UI setting, etc.
      - `StepCompletion`: The progress of a single step
        - `status`: `TaskStatus`
        - `playerCurrentStep`: The index of step that the player is at in the `TaskStep.playerSteps`
        - `TaskCompletion`: The progress of a full task
          - `name`: `string`
          - `steps`: `StepCompletion[]`
          - `status`: `TaskStatus`
          - `scheduled`: optional, if the task is scheduled but yet to happen, its absulute time will be stored here
      - `IGameSave`: Full game state interface (its implementation is in `class GameSave` gamedata.ts)
        - `unitySave`: serialized string of Unity game state
        - `receivedEmails`: email metadata array
        - `tasks`: task completion array
        - `unlockedApps`: list of unlocked apps on simulated desktop

### 2. Simulated Desktop

1. `src/simulated_desktop/main.tsx`: The entry point of the simulated desktop.

   - Render the React App Component into the DOM element with ID `simdesk-root` with:
     - `StrictMode`
     - `AppProvider`: React context that stores openned applications (see `context/AppProvider.tsx`)

2. `src/simulated_desktop/simdesktop/App.tsx`
   1. Control when the simulated desktop is shown. It listens for `hideSim` and `showSim` to show and hide the desktop; `getSimStatus` responds with whether the desktop is shown
      - It implements this feature with `useState(showSimDesktop)`
      - When clicking outside of the desktop, it also hides it so that the player can easily switch back to game
   2. Render desktop components: wallpaper, taskbar, and app windows (one for each app)
      ```html
      <div id="desktop-container" onClick="hideDesktop">
        <div class="sim-desktop" onClick="stopPropagation">
          <Desktop />
          <Taskbar />
          <!-- One for each open app -->
          <AppWindow ... />
        </div>
      </div>
      ```
3. `src/simulated_desktop/simdesktop/context/AppProvider.tsx` and `src/simulated_desktop/simdesktop/context/AppContext.ts`: the context for simulated desktop

   1. This React context stores and manages **app window state** (open/close/focus) in the simulated desktop.
      - `openApps`: list of all open apps
   2. Provide methods to:
      - `openApp(appMeta)`: Open a new app
      - `closeApp(app | name | "*")`: Close an app or all apps
      - `bringToFront(app)`: Bring an app to the front (set its `z-index` to be the highest)
   3. Export the `AppContext` via `AppContext.ts` (in vite, and tsx/jsx file should only contains one component in order to hot reload)
   4. Usage:
      ```tsx
      <AppProvider>...</AppProvider>
      ```

4. `src/simulated_desktop/apps/appRegistry.ts`: registers all apps that in simulated desktop

   1. Centralized definition of all apps as an `AppMeta` object(including unimplemented ones)

   ```ts
   interface AppMeta {
     name: string; // Display name and unique id
     icon: string; // Path to icon image. the icons are stored in public/icons
     component: React.FC<any>; // React component to render in AppWindow
     props?: Record<string, any>; // Optional props to pass to the component
   }
   ```

   2. `app_array` (`AppMeta[]`): This is a list of all apps. it is exported as appRegistry (`Record<string, AppMeta>`) to facilitate look up

   ```js
   apps_array.forEach((app) => {
     appRegistry[app.name] = app;
   });
   ```

   - This design enables creating window for all different types via the context system. It also helps the desktop and taskbar component to render the name and icon of the app.
   - It also makes our life easier by making adding apps as simple as putting it to apps_array without changing the rest of the code.

5. `src/simulated_desktop/simdesktop/AppWindow.tsx`: App Window Component

   1. Renders a title bar that the player can drag, focus or close the app
      - `onClick`: Calls `bringToFront(app)` to raise the window to the top
      - `onMouseDown`: Initiates dragging
      - `mousemove`: Updates `position.top` and `position.left` to move the window aligned with the cursor
      - `mouseup`: Stop dragging
      - The `x` button inside the title bar calls `closeApp(app)` from AppContext
   2. Read the z-index from appContext to position the app correctly
   3. When dragging, it adds an overlay to prevent the inner app from capturing the mouse movement message (when `<iframe>` and `<webview>` captures the message, the parent window cannot receive it)
   4. Render the inner app
      - Uses `position: absolute` to manually place the window and enable dragging
      - Renders the app's React component from `app.appmeta.component`
      - Optinally pass the props from `app.appmeta.props` to the app

   - Simplied DOM

   ```tsx
   <div class="window" style="[Set the z-index and position]">
     <div class="titlebar" onMouseDown="startDrag">
       {app.appmeta.name}
       <div class="close-btn">x</div>
     </div>
     <div style={{ flex: 1, overflow: "overlay" }}>
       <app.appmeta.component {...app.appmeta.props} />
     </div>
     <Overlay visible="{dragging}" />
   </div>
   ```

6. `src/simulated_desktop/simdesktop/Desktop.tsx`

   1. Request the list of unlocked apps from the backend and listens for unlocked apps

      - On mount (`useEffect`):

      1. apps and setApps are defined using `useState`
      2. Registers a listener for `setUnlockedApps` to receive the unlocked app list
      3. Sends `getUnlockedApps`
      4. Filters and maps unlocked names to actual `AppMeta` according to `appRegistry`
      5. Call `setApps` to set the apps

   2. render one `DesktopIcon` for each unlocked app

      ```tsx
      <div id="desktop">
        {apps.map((app, index) => (
          <DesktopIcon key={app.name} app={app} index={index} />
        ))}
      </div>
      ```

7. `src/simulated_desktop/simdesktop/DesktopIcon.tsx`:App Icon Component

   1. Display the icon and name of an app using prop `AppMeta`
   2. Call `openApp(app)` defined in AppContext when clicked
   3. Uses `GuideButton` to highlight the app when the player is guided to do so

   - example DOM structure

   ```html
   <GuideButton id="simdesktop-app-Email" class="app-container">
     <img src="icon/email.svg" class="icon" />
     <div class="icon-label">Email</div>
   </GuideButton>
   ```

8. `src/simulated_desktop/apps/GuideButton.tsx`

   - allows components (desktop icons and buttons) to be highlighted from backend message, and sends back message when it is clicked. It helps tracking task progress

   1. Message flow

      - Inform the backend when it is mounted: sends `buttonMounted` message to the backend, indicating the button is ready to interact
      - Listens to `guideClick_<id>` messages. When it receives messages from this channel, it highlight it self
      - When clicked, it Logs the click and optinally calls `onClick` if it is passed as props. Then it sends `buttonClicked` to backend with its `id`. Finally it stops highlighting itself.

   2. Highlight implementation

      - defines `highlighted` and `setHighlighted` using `useState`
      - when highlighted is set to true, it add a `guide-button-highlight`

   3. Usage

      - Wrap any clickable element inside `GuideButton`, or
      - Replace `<button>` with `<GuideButton>` while keeping all of its original classes

9. `src\simulated_desktop\MessageBridge.ts`: Provides functions to send and listen for messages from main renderer

   1. `SendToSimuNUS(channel: string, data: unknown)`

      - Send messages to main renderer, which will then redirect the message to unity or backend
      - It handles both when simulated desktop is embedded inside a `<iframe>` or not
      - Push messages to `toSend()` if the message bridge is not ready (i.e. the main renderer have not registered all channels) and sends them on `messageBridgeReady`

   2. `onSimuNUSMessage(channel: string, callback: (data)=>void)`

      - Add the callback functions to `registered` and `window.SimuNUS_API.onMessage` (which is actually `ipcRenderer.on` exposed from `preload.js`)
      - the callback functions will be called when receiving the message no matter from the backend or from unity
      - if running inside an `<iframe>`, is also sends `register_message_handler` to main renderer

   3. Debug utilities

      - Three functions to directly send the debug message to backend to log them so that they will appear in the terminal and we don't need to open dev tool to view them

      ```ts
      dbgLog(data: unknown)
      dbgWarn(data: unknown)
      dbgErr(data: unknown)
      ```

10. `src\simulated_desktop\apps` Simulated Apps Components

    1. Email: A simulated app to receive emails from NUS
    1. Applicant Portal: simulated NUS [applicant portal](https://myaces.nus.edu.sg/applicantPortal/)
       - used for accepting offer task
    1. Browser: The app to open external links like NUSMods

    **(Below are the apps that have not been implemented in milestone 1)**

    1. Photo Submission Portal
    1. Registration Portal
    1. UHC Appointment Portal
    1. UHMS
    1. Canvas
    1. EduRec
    1. Student Pass Application Portal
