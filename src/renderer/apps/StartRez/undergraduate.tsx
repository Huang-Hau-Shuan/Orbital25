import React from "react";
import type { HostelProps } from "./main";
import HostelApplicationCard from "./HostelApplicationCard";

const UndergraduateApplicationPage: React.FC<HostelProps> = ({
  applications,
  updateApplications,
}) => {
  return (
    <div className="hostel-page">
      <h2 className="hostel-offer-title">Undergraduate Application</h2>
      {applications.length === 0 ? (
        <p>You have no hostel applications yet.</p>
      ) : (
        <p>
          Please select a term below to continue or review your application.
        </p>
      )}
      <>
        {applications.map((app, idx) => (
          <HostelApplicationCard
            key={idx}
            application={app}
            onContinue={() =>
              console.log(
                "Continue to undergraduate application for:",
                app.name
              )
            }
          />
        ))}
      </>
    </div>
  );
};

export default UndergraduateApplicationPage;
