import React from "react";
import type { HostelProps } from "./main";
import HostelApplicationCard from "./HostelApplicationCard";
import type { HostelApplication } from "../../../types";

const CheckInPage: React.FC<HostelProps> = ({
  applications,
  updateApplications,
}) => {
  const successfulApps = applications.filter(
    (app) => app.status === "Successful"
  );

  const handleCheckIn = (target: HostelApplication) => {
    const updated = applications.map((app) =>
      app.name === target.name ? { ...app, checkIn: true } : app
    );
    updateApplications(updated);
  };

  return (
    <div className="hostel-page">
      <h2 className="hostel-offer-title">Check-In</h2>
      {successfulApps.length === 0 ? (
        <p>No update or declaration required.</p>
      ) : (
        <p>Please select a term below to check in for your hostel stay.</p>
      )}
      <>
        {successfulApps.map((app, idx) => (
          <HostelApplicationCard
            key={idx}
            application={app}
            onContinue={() => {
              handleCheckIn(app);
              alert("Successfully check in");
            }}
          />
        ))}
      </>
    </div>
  );
};

export default CheckInPage;
