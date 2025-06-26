import { useEffect, useState } from "react";
import type { ServiceType, SubServiceType } from "./main";
import { dbgErr, onSimuNUSMessage, SendToSimuNUS } from "../../MessageBridge";
import UHCBookingSlotSelector from "./slot";
import UHCProgreeBar from "./progress";
import GuideInput from "../GuideInput";
import GuideButton from "../GuideButton";
interface StepTwoProps {
  service: ServiceType;
  subService: SubServiceType;
  onBack: () => void;
  onProceed: () => void;
  setAppointmentDate: (date: string) => void;
  setTime: (time: string) => void;
}
const UHCBookingStepTwo = ({
  service,
  subService,
  onBack,
  onProceed,
  setAppointmentDate,
  setTime,
}: StepTwoProps) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [timeRange, setTimeRange] = useState<"Morning" | "Afternoon" | "">("");
  const [minDate, setMinDate] = useState("");
  const [showSlots, setShowSlots] = useState(false);
  useEffect(() => {
    onSimuNUSMessage("setTime", (str) => {
      if (typeof str !== "string") {
        dbgErr("UHC/step2: Invalid time");
        return;
      }
      try {
        const obj = JSON.parse(str);
        const y = obj.year.toString().padStart(4, "0");
        const m = obj.month.toString().padStart(2, "0");
        const d = obj.day.toString().padStart(2, "0");
        const dateStr = `${y}-${m}-${d}`;
        setMinDate(dateStr);
      } catch (e) {
        dbgErr("UHC/step2: Invalid time format from setTime: " + str);
      }
    });
    SendToSimuNUS("getTime");
  }, []);
  const canSearch = fromDate && toDate && timeRange;
  const onSearch = () => {
    if (canSearch) setShowSlots(true);
  };
  return (
    <div className="uhc-booking-container">
      <UHCProgreeBar stepNum={2}></UHCProgreeBar>

      <div className="uhc-booking-box">
        <h2>Service Details</h2>
        <div className="uhc-field-row">
          <label className="uhc-label">Service</label>
          <span className="uhc-colon">:</span>
          <span>{service}</span>
        </div>
        <div className="uhc-field-row">
          <label className="uhc-label">Sub Service</label>
          <span className="uhc-colon">:</span>
          <span>{subService}</span>
        </div>
      </div>

      <div className="uhc-booking-box">
        <h2>Preferred Date</h2>
        <div className="uhc-field-row">
          <label>From</label>
          <GuideInput
            id="uhc-select-from-date"
            type="date"
            value={fromDate}
            onContentChange={setFromDate}
            min={minDate}
            className={`uhc-date-input ${!fromDate ? "error" : ""}`}
          />
          <label>To</label>
          <GuideInput
            id="uhc-select-to-date"
            type="date"
            value={toDate}
            onContentChange={setToDate}
            min={fromDate}
            className="uhc-date-input"
          />
        </div>
      </div>

      <div className="uhc-booking-box">
        <h2>Preferred Time Range</h2>
        <div className="uhc-time-buttons">
          <div>
            <GuideButton
              id="uhc-morning-button"
              className={`uhc-time-option ${
                timeRange === "Morning" ? "selected" : ""
              }`}
              onClick={() => setTimeRange("Morning")}
              originalTag="button"
            >
              Morning
            </GuideButton>
            <div className="uhc-time-desc">Before 12:00</div>
          </div>
          <div>
            <button
              className={`uhc-time-option ${
                timeRange === "Afternoon" ? "selected" : ""
              }`}
              onClick={() => setTimeRange("Afternoon")}
            >
              Afternoon
            </button>
            <div className="uhc-time-desc">After 13:30</div>
          </div>
        </div>
      </div>

      <div className="uhc-booking-buttons">
        <button className="uhc-booking-button back" onClick={onBack}>
          BACK
        </button>
        <GuideButton
          className={`uhc-booking-button proceed ${canSearch ? "enabled" : ""}`}
          onClick={onSearch}
          originalTag="button"
          id="uhc-search-time-slot"
        >
          SEARCH
        </GuideButton>
      </div>
      {showSlots && (
        <UHCBookingSlotSelector
          baseDate={fromDate}
          setDate={setAppointmentDate}
          setTime={setTime}
          onProceed={onProceed}
        ></UHCBookingSlotSelector>
      )}
    </div>
  );
};

export default UHCBookingStepTwo;
