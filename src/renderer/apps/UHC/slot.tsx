import { useState } from "react";
import GuideButton from "../GuideButton";

const getWeekday = (year: number, month: number, day: number) => {
  return new Date(year, month - 1, day).getDay(); // 0 is Sunday, 6 is Saturday
};

const UHCBookingSlotSelector = ({
  baseDate,
  setTime,
  setDate,
  onProceed,
}: {
  baseDate: string; // YYYY-MM-DD
  setTime: (time: string) => void;
  setDate: (date: string) => void;
  onProceed: () => void;
}) => {
  const [firstDate, setFirstDate] = useState(baseDate);
  const [selectedDate, setSelectedDate] = useState(baseDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const getThreeDays = () => {
    const [year, month, day] = firstDate.split("-").map(Number);
    const start = new Date(year, month - 1, day);
    return Array.from({ length: 3 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const dd = d.getDate();
      return {
        label: `${dd < 10 ? "0" + dd : dd} ${d.toLocaleString("default", {
          month: "short",
        })}`,
        weekday: d.toLocaleString("default", { weekday: "short" }),
        dateStr: `${y}-${String(m).padStart(2, "0")}-${String(dd).padStart(
          2,
          "0"
        )}`,
        disabled: getWeekday(y, m, dd) === 0 || getWeekday(y, m, dd) === 6,
      };
    });
  };

  const timeSlots = {
    Morning: [
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
    ],
    Afternoon: [
      "13:30",
      "13:45",
      "14:00",
      "14:15",
      "14:30",
      "14:45",
      "15:00",
      "15:15",
    ],
  };

  const isWeekend = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const wd = getWeekday(y, m, d);
    return wd === 0 || wd === 6;
  };

  return (
    <div className="uhc-slot-container">
      <h3>Recommended Date and Time</h3>
      <GuideButton
        id="uhc-slot-date-row"
        originalTag="div"
        className="uhc-slot-date-row"
      >
        {getThreeDays().map((d) => (
          <div
            key={d.dateStr}
            className={`uhc-date-card ${
              selectedDate === d.dateStr ? "selected" : ""
            } ${d.disabled ? "disabled" : ""}`}
            style={{ width: "30%" }}
            onClick={() => !d.disabled && setSelectedDate(d.dateStr)}
          >
            <div className="uhc-date-label"> {d.label.split(" ")[1]}</div>
            <div className="uhc-date-day">{d.label.split(" ")[0]}</div>
            <div className="uhc-date-week">{d.weekday}</div>
          </div>
        ))}
      </GuideButton>

      <GuideButton
        id="uhc-slot-timetable"
        className="uhc-slot-timetable"
        originalTag="div"
      >
        {Object.entries(timeSlots).map(([period, slots]) => (
          <div key={period} className="uhc-period-column">
            <div className="uhc-period-label">{period}</div>
            <div className="uhc-time-grid">
              {slots.map((time) => (
                <div
                  key={time}
                  className={`uhc-slot ${
                    selectedTime === time ? "selected" : ""
                  }`}
                  onClick={() => {
                    if (!isWeekend(selectedDate)) {
                      setSelectedTime(time);
                      setDate(selectedDate);
                    }
                  }}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        ))}
      </GuideButton>

      <div className="uhc-slot-legend">
        <span className="legend available"></span>Available
        <span className="legend selected"></span>Selected
        <span className="legend unavailable"></span>Unavailable
      </div>

      <div className="uhc-booking-buttons">
        <GuideButton
          id="uhc-booking-proceed-2"
          className="uhc-booking-button proceed"
          disabled={!selectedTime}
          onClick={() => {
            setTime(selectedTime ?? "");
            onProceed();
          }}
          originalTag="button"
        >
          PROCEED
        </GuideButton>
      </div>
    </div>
  );
};

export default UHCBookingSlotSelector;
