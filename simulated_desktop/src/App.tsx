import "./desktop.css";
import Desktop from "./components/Desktop";
import Taskbar from "./components/Taskbar";
import AppWindow from "./components/AppWindow";
import { useAppManager } from "./context/AppContext";
import Overlay from "./components/Overlay";
import { useState } from "react";
const App = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const { openApps } = useAppManager();

  return (
    <div className="sim-desktop">
      <Desktop />
      <Taskbar />
      {openApps.map((app) => (
        <AppWindow
          key={app.name}
          name={app.name}
          path={app.path}
          z={app.z}
          onDragStart={() => setOverlayVisible(true)}
          onDragEnd={() => setOverlayVisible(false)}
        />
      ))}
      <Overlay visible={overlayVisible} />
    </div>
  );
};

export default App;
