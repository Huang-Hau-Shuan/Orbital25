// components/Clock.tsx
import { useEffect, useState } from "react";
import { onSimuNUSMessage, SendToSimuNUS } from "../MessageBridge";

interface InGameTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const formatTime = (t: InGameTime): string => {
  const hh = String(t.hour).padStart(2, "0");
  const mm = String(t.minute).padStart(2, "0");
  return `${hh}:${mm}`;
};

const formatDate = (t: InGameTime): string => {
  const yyyy = t.year;
  const mm = String(t.month).padStart(2, "0");
  const dd = String(t.day).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const Clock = ({ interval = 200 }: { interval?: number }) => {
  const [time, setTime] = useState<InGameTime>({
    year: 2025,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
  });
  useEffect(() => {
    // Listen for time updates
    onSimuNUSMessage("setTime", (data) => {
      if (typeof data !== "string") {
        SendToSimuNUS("warn", `Received invalid time: ${data}`);
        return;
      }
      try {
        data = JSON.parse(data);
      } catch {
        SendToSimuNUS("warn", `Received invalid time: ${data}`);
      }
      if (
        data &&
        typeof data === "object" &&
        "year" in data &&
        "month" in data &&
        "day" in data &&
        "hour" in data &&
        "minute" in data
      ) {
        setTime(data as InGameTime);
      } else {
        SendToSimuNUS("warn", `Received invalid time: ${data}`);
      }
    });
  }, []);
  useEffect(() => {
    // Request in-game time periodically
    const id = setInterval(() => {
      SendToSimuNUS("getTime", {});
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  return (
    <div className="clock">
      <div>{formatTime(time)}</div>
      <div>{formatDate(time)}</div>
    </div>
  );
};

export default Clock;
