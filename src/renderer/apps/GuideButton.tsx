import { useEffect, useState } from "react";
import { SendToSimuNUS, dbgLog, onSimuNUSMessage } from "../MessageBridge";
import "./css/guide-button.css";

interface GuideButtonProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  originalTag?: "button" | "div" | "a"; //put other elements in children
  onClick?: () => void;
  ref?: React.RefObject<any>;
  disabled?: boolean;
}

const GuideButton = ({
  id,
  children,
  originalTag,
  onClick,
  className = "",
  ref,
  disabled,
  ...props
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
    if (disabled === true) return;
    dbgLog("Player clicked button #" + id);
    if (onClick) onClick();
    SendToSimuNUS("buttonClicked", id);
    setHighlighted(false);
  };
  const cn = `${className} ${highlighted ? "guide-highlight" : ""}`;
  switch (originalTag) {
    case "a":
      return (
        <a onClick={handleClick} className={cn} id={id} ref={ref} {...props}>
          {children}
        </a>
      );
    case "button":
      return (
        <button
          onClick={handleClick}
          className={cn}
          id={id}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          {children}
        </button>
      );
    default:
      return (
        <div onClick={handleClick} className={cn} id={id} ref={ref} {...props}>
          {children}
        </div>
      );
  }
};

export default GuideButton;
