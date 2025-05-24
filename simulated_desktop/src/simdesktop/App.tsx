import "./desktop.css";
import Desktop from "./Desktop";
import Taskbar from "./Taskbar";
import AppWindow from "./AppWindow";
import { useAppManager } from "./context/AppContext";
const App = () => {
  const { openApps } = useAppManager();

  return (
    <div className="sim-desktop">
      <Desktop />
      <Taskbar />
      {openApps.map((appinfo) => (
        <AppWindow key={appinfo.appmeta.name} app={appinfo} />
      ))}
    </div>
  );
};

export default App;
