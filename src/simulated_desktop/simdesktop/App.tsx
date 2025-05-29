import "./desktop.css";
import Desktop from "./Desktop";
import Taskbar from "./Taskbar";
import AppWindow from "./AppWindow";
import { useAppManager } from "./context/AppContext";
import { dbgLog, onSimuNUSMessage, SendToSimuNUS } from "../MessageBridge";
import { useEffect, useState } from "react";
const App = () => {
  const { openApps } = useAppManager();
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

export default App;
