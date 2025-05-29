import { useEffect, useState } from "react";
import { SendToSimuNUS, dbgLog, onSimuNUSMessage } from "../MessageBridge";
import "./css/guide-button.css";

interface GuideButtonProps {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const GuideButton = ({
  id,
  children,
  onClick,
  className = "",
  style,
}: GuideButtonProps) => {
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    // listen on different channel instead of one channel and check the payload,
    // to avoid registering on the same channel for multiple times
    onSimuNUSMessage("guideClick_" + id, () => {
      setHighlighted(true);
    });
    //inform the main program that this button is being rendered
    SendToSimuNUS("buttonMounted", id);
    return () => {
      // reset highlight on unmount
      setHighlighted(false);
    };
  }, [id]);

  const handleClick = () => {
    dbgLog("Player clicked button #" + id);
    if (onClick) onClick();
    SendToSimuNUS("buttonClicked", id);
    setHighlighted(false);
  };

  return (
    <div
      onClick={handleClick}
      className={`${className} ${highlighted ? "guide-button-highlight" : ""}`}
      style={style}
      id={id}
    >
      {children}
    </div>
  );
};

export default GuideButton;
