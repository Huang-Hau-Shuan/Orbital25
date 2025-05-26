// apps/AdmissionPage.tsx
import { useState } from "react";

const AdmissionPage = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [offerAccepted, setOfferAccepted] = useState<boolean | null>(null);

  const handleAccept = () => {
    setOfferAccepted(true);
  };

  const handleReject = () => {
    setOfferAccepted(false);
  };

  if (!showDetails) {
    return (
      <div className="admission-inquiry">
        <div>Admission</div>
        <a onClick={() => setShowDetails(true)} className="link-btn">
          Enquire Admission Status
        </a>
      </div>
    );
  }

  return (
    <div className="admission-details">
      <table className="admission-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Application Status</th>
            <th>Application Fee Payment Status</th>
            <th>Application Offer Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="left-col">
              <strong>Application</strong>
              <ul className="action-list">
                <li>
                  <a>Check application status</a>
                </li>
                <li>
                  <a>View original application submission</a>
                </li>
                <li>
                  <a>View current application record</a>
                </li>
                <li>
                  <a>Submit supporting documents</a>
                </li>
                <li>
                  <a>Pay application fee</a>
                </li>
                {offerAccepted === null ? (
                  <>
                    <li>
                      <a onClick={handleAccept} id="applicant-portal-accept">
                        Accept Offer
                      </a>
                    </li>
                    <li>
                      <a onClick={handleReject} id="applicant-portal-reject">
                        Reject Offer
                      </a>
                    </li>
                  </>
                ) : (
                  <li style={{ color: offerAccepted ? "green" : "red" }}>
                    Offer {offerAccepted ? "accepted" : "rejected"}
                  </li>
                )}
              </ul>
            </td>
            <td>Your application has been processed</td>
            <td>Paid</td>
            <td>Accepted</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdmissionPage;
