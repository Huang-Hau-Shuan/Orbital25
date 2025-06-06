import { useEffect, useState } from "react";
import { SendToSimuNUS, dbgLog, onSimuNUSMessage } from "../MessageBridge";
import "./css/guide-button.css";

interface GuideButtonProps {
  id: string;
  children?: React.ReactNode;
  originalTag?: "button" | "div" | "a"; //put other elements in children
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  ref?: React.RefObject<any>;
}

const GuideButton = ({
  id,
  children,
  originalTag,
  onClick,
  className = "",
  style,
  ref,
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
  const cn = `${className} ${highlighted ? "guide-button-highlight" : ""}`;
  switch (originalTag) {
    case "a":
      return (
        <a onClick={handleClick} className={cn} style={style} id={id} ref={ref}>
          {children}
        </a>
      );
    case "button":
      return (
        <button
          onClick={handleClick}
          className={cn}
          style={style}
          id={id}
          ref={ref}
        >
          {children}
        </button>
      );
    default:
      return (
        <div
          onClick={handleClick}
          className={`${className} ${
            highlighted ? "guide-button-highlight" : ""
          }`}
          style={style}
          id={id}
          ref={ref}
        >
          {children}
        </div>
      );
  }
};

export default GuideButton;
