import React from "react";
import type { DateRange, HostelApplication } from "../../../types";

interface HostelApplicationCardProps {
  application: HostelApplication;
  onContinue?: () => void;
}

const HostelApplicationCard: React.FC<HostelApplicationCardProps> = ({
  application,
  onContinue,
}) => {
  const stayPeriodString = (i: DateRange) => {
    return `${i.startDate} - ${i.endDate}`;
  };
  return (
    <div className="hostel-card">
      <div className="hostel-card-left">
        <h3>{application.name}</h3>
        <p>
          <strong>Stay Period:</strong>{" "}
          {stayPeriodString(application.stayPeriod)}{" "}
        </p>
        <p>
          You started your application for <strong>{application.name}</strong>{" "}
          on <strong>{application.applicationStartDate}</strong>.
        </p>
        <p>
          The status of your application is{" "}
          <strong>{application.status}.</strong>
        </p>
      </div>
      <div className="hostel-card-right">
        <button className="hostel-card-button" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default HostelApplicationCard;
