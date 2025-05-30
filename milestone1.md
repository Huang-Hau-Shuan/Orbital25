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
| Week | Date | Learn | tasks | Important Dates |
|------|------------------|----------------------------|------------------------------------|-----------------------------------------|
| 1 | 12 - 18 May | git | Repository setup | Poster & Video Submission (19 May, 2pm) |
| | | unity foundation | Planning & task breakdown | Mission Control #1 (17 May) |
| | | c#, javascript, typescript | Poster (due 19 May) | |
| | | Web App: React (Part 1) | Video (due 19 May) | |
| | | electron framework | Unity setup (WebGL) | |
| | | | NodeJS setup (Electron) | |
| | | | Prototype of first scene | |
| | | | Prototype of a player | |
| | | | Prototype of interactive laptop | |
| | | | Prototype of a campus map | |
| 2 | 19 - 25 May | Web App: React (Part 2) | Simulated desktop UI | Mission Control #2 (24 May) |
| | | Game: Unity (Part 1) | Email app | |
| | | unity tile system | Applicant Portal simulation | |
| | | nodejs filesystem | Implement accept offer task | |
| | | unity basics | Task system draft | |
| | | | Design save data structure | |
| | | | Implement save/load functions | |
| | | | ISB route template | |
| | | | Implement the player | |
| | | | switching map logic | |
| 3 | 26 May - 1 June | Game: Unity (Part 2) | Basic manual save/load UI | Mission Control #3 (31 May) |
| | | | Submit Photograph task | |
| | | | In game time system | |
| | | | Basic frontpage, menu UI | |
| | | | Selecting starting character UI | |
| | | | Bus transpotation prototype | |
| | | | Design hostel room | |
| | | | generate Milestone 1 README | |
| 4 | 2 - 8 June | | Expand UI framework | 2 June 2pm - Milestone 1 - Ideation |
| | | | Browser app simulation | |
| | | | Begin housing/visa simulation UI | |
| | | | Pre-arrival flow logic | |
| | | | Implement Bus transpotation | |
| | | | expand hostel map | |
| | | | Campus navigation prototype | |
| 5 | 9 - 15 June | | Arriving at Singapore | Mission Control #4 (9 June) |
| | | | expand visa application simulation | |
| | | | implement more bus routes | |
| | | | expand UHMS simulation | |
| | | | UHC map | |
| | | | Medical Examination appointment | |
| 6 | 16 - 22 June | | Auto-save checkpoints | |
| | | | expand campus navigation | |
| | | | MPSH map | |
| | | | EduRec registration simulation | |
| | | | Implement registration part 1 | |
| | | | Medical Examination | |
| | | | polish sprites | |
| 7 | 23 - 29 June | | Registration (Part Two) | |
| | | | Kent Ridge MRT map | |
| | | | International Students Orientation | |
| | | | hostel canteen map | |
| | | | Course registration simulation | |
| | | | tuition fee payment simulation | |
| | | | Integration testing | |
| | | | polish UI for save/load | |
| | | | generate Milestone 2 README | |
| 8 | 30 June - 6 July | | implement feedback collection | 30 June 2pm - Milestone 2 - Prototyping |
| | | | prepare for end-user testing | |
| | | | COM3 map | |
| 9 | 7 - 13 July | | end-user testing | |
| | | | bug fix | |
| | | | document code | |
| 10 | 14 - 20 July | | | Mission Control #5 (mid-July) |
| 11 | 21 - 27 July | | | |
| 12 | 28 July - 3 Aug | | generate Milestone 3 README | 28 July 2pm - Milestone 3 - Extension |
| 13 | 4 - 10 Aug | | | 4 Aug - Week 0 of Y2S1 |
| 14 | 11 - 17 Aug | | | |
| 15 | 18 - 24 Aug | | | 27 August - Splashdown - Refinement |

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

- Download the realease
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

## Documentation
