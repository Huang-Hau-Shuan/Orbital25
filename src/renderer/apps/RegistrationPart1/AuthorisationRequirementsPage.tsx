import React, { useEffect } from "react";
import { type RegistrationProps } from "./MainMenuPage";
import GuideButton from "../GuideButton";
import AuthorisationMedicalPage from "./AuthorisationMedicalPage";
import AuthorisationRiskPage from "./AuthorisationRiskPage";
import AuthorisationRepresentativePage from "./AuthorisationRepresentativePage";

const pageList = [
  "Risk Acknowledgement and Consent",
  "Authorisation of Medical Procedures for International Students",
  "Appointment of Local Representative for International Students",
];

export interface AuthProps {
  complete: boolean;
  setComplete: (complete: boolean) => void;
}

const AuthorisationRequirementsPage: React.FC<RegistrationProps> = ({
  markComplete,
  data,
  updateData,
  static: isStatic,
}) => {
  const completed = data.authorisationRequirements;
  const authSubPage = data.authSubPage;

  useEffect(() => {
    markComplete(completed.length === 3 && completed.every(Boolean));
  }, [completed]);

  const setComplete = (index: number, value: boolean) => {
    const updated = [...completed];
    updated[index] = value;
    updateData({ ...data, authorisationRequirements: updated });
  };

  const setAuthSubPage = (index: number | null) => {
    updateData({ ...data, authSubPage: index });
  };

  // Subpages
  if (authSubPage === 0) {
    return (
      <AuthorisationRiskPage
        complete={completed[0]}
        setComplete={(c) => setComplete(0, c)}
      />
    );
  }

  if (authSubPage === 1) {
    return (
      <AuthorisationMedicalPage
        complete={completed[1]}
        setComplete={(c) => setComplete(1, c)}
      />
    );
  }

  if (authSubPage === 2) {
    return (
      <AuthorisationRepresentativePage
        complete={completed[2]}
        setComplete={(c) => setComplete(2, c)}
      />
    );
  }

  // Main menu view
  return (
    <div className="auth-container">
      <h4 className="section-title">Authorisation Requirements</h4>
      <div className="info-box">
        <strong>Note:</strong> <br />
        If you are below 18 years of age at the time of making these
        authorisations, you are also required to:
        <ol>
          <li>Print a hardcopy of your response;</li>
          <li>Have it signed by your parent/guardian;</li>
          <li>
            Submit it to Student Service Centre or as per faculty instructions.
          </li>
        </ol>
        You will not be able to proceed unless all sections are completed.
      </div>

      {pageList.map((title, i) => (
        <div
          style={{ display: "flex", alignItems: "center", padding: 4 }}
          key={i}
        >
          {isStatic ? (
            <div style={{ marginLeft: 8 }}>
              {completed[i] ? "✓" : ""} {title}
            </div>
          ) : (
            <GuideButton
              id={`authorisation-${i + 1}`}
              className="link-button"
              onClick={() => setAuthSubPage(i)}
            >
              <input type="checkbox" checked={completed[i]} readOnly />
              {title}
            </GuideButton>
          )}
        </div>
      ))}
    </div>
  );
};

export default AuthorisationRequirementsPage;
