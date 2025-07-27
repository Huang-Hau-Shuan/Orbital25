import "./desktop.css";
import Desktop from "./Desktop";
import Taskbar from "./Taskbar";
import AppWindow from "./AppWindow";
import { getSimuNUSContext } from "../context/AppContext";
import {
  dbgErr,
  dbgLog,
  onSimuNUSMessage,
  SendToSimuNUS,
} from "../MessageBridge";
import { useEffect, useState } from "react";
import { apps_array } from "../apps/appRegistry";
const SimDesktopRoot = () => {
  const { openApps, openApp } = getSimuNUSContext();
  const [showSimDesktop, setShowSimDesktop] = useState(false);
  useEffect(() => {
    if (window.SimuNUS_API === undefined) {
      console.error("SimuNUS API Undefined");
      setShowSimDesktop(true);
      return;
    }
    onSimuNUSMessage("showSim", () => setShowSimDesktop(true));
    onSimuNUSMessage("hideSim", () => setShowSimDesktop(false));
  }, []);
  useEffect(() => {
    onSimuNUSMessage("openBrowser", (data) => {
      if (typeof data === "string" && data.length > 0) {
        const browserApp = apps_array.find((app) => app.name === "Browser");
        if (browserApp) openApp({ ...browserApp, props: { path: data } });
        else {
          dbgErr("openBrowser: Cannot find Browser app");
        }
      } else {
        dbgErr("openBrowser: Invalid param " + data);
      }
    });
  }, [openApps, openApp]);
  useEffect(() => {
    onSimuNUSMessage("getSimStatus", () =>
      SendToSimuNUS("simStatus", showSimDesktop)
    );
  }, [showSimDesktop]);
  return (
    <>
      {showSimDesktop && (
        <div
          id="desktop-container"
          onClick={() => {
            setShowSimDesktop(false);
            document.getElementById("unity-container")?.focus(); // focus the unity again. this may not work
            window.SimuNUS_API?.sendMessage("focusUnity", null); // send a click to focus unity. this is more likely to work
            dbgLog("Toggle simulated desktop");
          }}
        >
          <div
            className="sim-desktop"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Desktop />
            <Taskbar />
            {openApps.map((appinfo) => (
              <AppWindow key={appinfo.appmeta.name} app={appinfo} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SimDesktopRoot;
