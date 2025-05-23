// components/StartMenu.tsx
import { SendToSimuNUS } from "../MessageBridge";

interface StartMenuProps {
  onClose: () => void;
}

const StartMenu = ({ onClose }: StartMenuProps) => {
  const shutdownDesktop = () => {
    SendToSimuNUS("hideSim", null);
    onClose();
  };

  const openAbout = () => {
    window.open("https://github.com/Huang-Hau-Shuan/Orbital25", "_blank");
    onClose();
  };

  return (
    <div id="start-menu">
      <button onClick={shutdownDesktop}>Shutdown</button>
      <button onClick={openAbout}>About</button>
    </div>
  );
};

export default StartMenu;
