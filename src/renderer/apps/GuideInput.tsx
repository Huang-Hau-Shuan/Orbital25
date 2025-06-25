import React, { useEffect, useState } from "react";
import { SendToSimuNUS, dbgLog, onSimuNUSMessage } from "../MessageBridge";

interface GuideInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string; //compulsory id
  guidePrompt?: string; // hint shown in placeholder
  verify?: (input: string) => boolean; // verify the content
  onContentChange?: (content: string) => void;
  value?: string;
}

const GuideInput: React.FC<GuideInputProps> = ({
  id,
  guidePrompt,
  verify,
  className = "",
  onChange = null,
  onContentChange = null,
  value,
  ...rest
}) => {
  const [highlighted, setHighlighted] = useState(false);
  const [content, setContent] = useState(value);
  useEffect(() => {
    // Register guide trigger
    onSimuNUSMessage("guideInput_" + id, () => {
      setHighlighted(true);
    });

    // Notify backend that the input exists
    SendToSimuNUS("inputMounted", id);

    return () => {
      setHighlighted(false);
    };
  }, [id]);

  const checkCompletion = (val: string) => {
    const trimmed = val.trim();
    const isValid =
      verify?.(trimmed) ??
      (guidePrompt ? trimmed === guidePrompt : trimmed !== "");

    if (isValid) {
      setHighlighted(false);
      SendToSimuNUS("inputCompleted", id);
      dbgLog(`Player input valid value ${val} in #${id}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    else if (onContentChange) onContentChange(e.target.value);
    checkCompletion(e.target.value);
    setContent(e.target.value);
  };

  const handleFocus = () => {
    dbgLog("Player focused input #" + id);
    SendToSimuNUS("inputFocused", id);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const val = (content ?? "").toString().trim();
    if (e.key === "Tab" && val === "" && guidePrompt) {
      e.preventDefault(); // prevent tabbing away
      const syntheticEvent = {
        ...e,
        target: { value: guidePrompt },
      };
      handleChange(
        syntheticEvent as unknown as React.ChangeEvent<HTMLInputElement>
      );
    }
  };

  return (
    <input
      {...rest}
      id={id}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={guidePrompt ?? rest.placeholder}
      onKeyDown={handleKeyDown}
      className={`${className} ${highlighted ? "guide-highlight" : ""}`}
      value={content}
    />
  );
};

export default GuideInput;
