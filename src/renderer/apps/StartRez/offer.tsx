import React from "react";
import type { HostelProps } from "./main";
import type { HostelApplication } from "../../../types";
import HostelApplicationCard from "./HostelApplicationCard"; // assumes you created the card as discussed

const validOfferStatuses = ["Offered", "Offer Accepted", "Successful"];

const HostelOfferPage: React.FC<HostelProps> = ({
  applications,
  updateApplications,
}) => {
  const offerApps = applications.filter((a) =>
    validOfferStatuses.includes(a.status)
  );
  return (
    <div className="hostel-page">
      <h2 className="hostel-offer-title">Hostel Offer</h2>
      {offerApps.length === 0 ? (
        <p>There are no active hostel offers at this time.</p>
      ) : (
        <p>
          Please select a term below to start or continue with your offer
          acceptance process.
        </p>
      )}
      <>
        {offerApps.map((app, idx) => (
          <HostelApplicationCard
            key={idx}
            application={app}
            onContinue={() =>
              console.log("Continue to offer acceptance for:", app.name)
            }
          />
        ))}
      </>
    </div>
  );
};

export default HostelOfferPage;
