import React from "react";
import type { HostelProps } from "./main";
import HostelApplicationCard from "./HostelApplicationCard";

const unsuccessfulStatus = "Unsuccessful";

const AppealProcessPage: React.FC<HostelProps> = ({
  applications,
  updateApplications,
}) => {
  const appealApps = applications.filter(
    (a) => a.status === unsuccessfulStatus
  );

  return (
    <div className="hostel-page">
      <h2 className="hostel-offer-title">Appeal Process</h2>
      {appealApps.length === 0 ? (
        <p>There are no applications eligible for appeal at this time.</p>
      ) : (
        <p>Please select a term below to start or continue with your appeal.</p>
      )}
      <>
        {appealApps.map((app, idx) => (
          <HostelApplicationCard
            key={idx}
            application={app}
            onContinue={() =>
              console.log("Continue to appeal process for:", app.name)
            }
          />
        ))}
      </>
    </div>
  );
};

export default AppealProcessPage;
