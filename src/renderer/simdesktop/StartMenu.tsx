// components/StartMenu.tsx
import { SendToSimuNUS } from "../MessageBridge";
import { getSimuNUSContext } from "../context/AppContext";
interface StartMenuProps {
  position: { bottom: number; left: number };
  onClose: () => void;
}
const StartMenu = ({ position, onClose }: StartMenuProps) => {
  const { closeApp } = getSimuNUSContext();
  const shutdownDesktop = () => {
    closeApp("*");
    SendToSimuNUS("hideSim", null);
    onClose();
  };
  const openAbout = () => {
    window.open("https://github.com/Huang-Hau-Shuan/Orbital25", "_blank");
    onClose();
  };
  const unlockAllApp = () => {
    SendToSimuNUS("setUnlockedApps", "*");
  };
  return (
    <div
      id="start-menu"
      style={{
        position: "absolute",
        bottom: `${position.bottom}px`,
        left: `${position.left}px`,
      }}
    >
      <button onClick={shutdownDesktop}>Shutdown</button>
      <button onClick={openAbout}>About</button>
      {window.SimuNUS_API?._DEBUG && (
        <button onClick={unlockAllApp} className="debug-dark">
          DEBUG: Unlock all apps
        </button>
      )}
    </div>
  );
};

export default StartMenu;
