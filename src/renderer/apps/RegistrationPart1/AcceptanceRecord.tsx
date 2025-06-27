import React, { useEffect } from "react";
import { type RegistrationProps } from "./MainMenuPage";
import { SendToSimuNUS } from "../../MessageBridge";
import GuideButton from "../GuideButton";

const policyList = [
  {
    label: "NUS Personal Data Notice for Students",
    link: "http://nus.edu.sg/registrar/docs/info/registration-guides/NUS-Registration-Personal-Data-Notice-and-Consent.pdf",
  },
  {
    label: "NUS Student Data Protection Policy",
    link: "https://nus.edu.sg/registrar/docs/info/administrative-policies-procedures/nus-student-data-protection-policy-regn.pdf",
  },
  {
    label: "NUS Code of Student Conduct",
    link: "https://studentconduct.nus.edu.sg/wp-content/uploads/NUS-Code-of-Student-Conduct.pdf",
  },
  {
    label: "NUS Student Confidentiality Agreement",
    link: "http://www.nus.edu.sg/registrar/docs/info/administrative-policies-procedures/nus-student-confidentiality-agreement.pdf",
  },
  {
    label: "NUS Acceptable Use Policy for IT Resources",
    link: "http://nus.edu.sg/registrar/docs/info/registration-guides/aup-form.pdf",
  },
  {
    label: "NUS Intellectual Property Policy",
    link: "http://www.nus.edu.sg/ilo/docs/default-source/default-document-library/nus-ip-policy-010109-v110309.pdf?sfvrsn=f2cc12dd_4",
  },
  {
    label: "NUS Do Not Call Policy",
    link: "http://nus.edu.sg/registrar/docs/info/registration-guides/nus-dnc-policy.pdf",
  },
];

const misconductChecks = [
  "All offenders will be subject to a minimum one-year suspension.",
  "Offenders may face expulsion, for severe or aggravated forms of sexual misconduct.",
  "Offenders will have a notation reflecting the length of suspension placed on their (interim and final) academic transcripts. The notation can only be expunged, on the request of the student but subject to the University’s approval, after a period of 3 years from the student’s graduation.",
  "To return to the University after the period of suspension, offenders must be certified fit by a counsellor and/or medical professional.",
];

const AcceptanceRecordPage: React.FC<RegistrationProps> = ({
  markComplete,
  data,
  updateData,
  static: isStatic,
}) => {
  const policyChecks = data.acceptanceRecord.slice(0, policyList.length);
  const sanctionChecks = data.acceptanceRecord.slice(
    policyList.length,
    policyList.length + misconductChecks.length
  );

  useEffect(() => {
    const allChecked =
      policyChecks.length === policyList.length &&
      policyChecks.every(Boolean) &&
      sanctionChecks.length === misconductChecks.length &&
      sanctionChecks.every(Boolean);
    markComplete(allChecked);
  }, [data.acceptanceRecord]);

  const toggleSanction = (index: number, value: boolean) => {
    const base = [...data.acceptanceRecord];
    base[policyList.length + index] = value;
    updateData({ ...data, acceptanceRecord: base });
  };

  const checkPolicy = (index: number) => {
    const updated = [...data.acceptanceRecord];
    updated[index] = true;
    updateData({ ...data, acceptanceRecord: updated });
    SendToSimuNUS("openBrowser", policyList[index].link);
  };

  return (
    <>
      <h4 className="section-title">Acceptance Record</h4>
      <div className="acceptance-page">
        <div className="info-box">
          <strong>Note:</strong> When you click open and read each of the
          following documents, the associated checkboxes will be ticked
          accordingly. Please note that you will only be able to proceed when
          all the checkboxes and buttons are checked.
        </div>

        {policyList.map((p, i) => (
          <div key={i} className="policy-row">
            {isStatic ? (
              data.acceptanceRecord[i] ? (
                <div>✓ {p.label}</div>
              ) : (
                <div style={{ opacity: 0.4 }}>{p.label}</div>
              )
            ) : (
              <>
                <GuideButton
                  id={`acceptance-record-policy-${i + 1}`}
                  originalTag="a"
                  onClick={() => checkPolicy(i)}
                >
                  <input type="checkbox" checked={policyChecks[i]} readOnly />{" "}
                  {p.label}
                </GuideButton>
                {i === 0 && (
                  <label>
                    <input type="checkbox" checked={policyChecks[i]} readOnly />
                    I acknowledge that I have read and fully understand the
                    contents of the above document (i.e. {p.label}) and hereby
                    give my consent as set out above
                  </label>
                )}
              </>
            )}
          </div>
        ))}

        <div className="info-box">
          Please {!isStatic && <a href="#">click here</a>} for a brief overview
          of the NUS policies with which you are required to comply as a
          registered NUS student.
        </div>

        <h4>Sanctions for Sexual Misconduct</h4>
        <p>
          Sexual misconduct will not be tolerated by the University. I
          acknowledge that I have understood the following disciplinary sactiosn
          for sexual miconduct offences that NUS has put in place:
        </p>
        {misconductChecks.map((text, i) => (
          <label key={i} className="checkbox-line">
            {isStatic ? (
              sanctionChecks[i] ? (
                <div>✓ {text}</div>
              ) : (
                <div style={{ opacity: 0.4 }}>{text}</div>
              )
            ) : (
              <GuideButton id={`sexual-misconduct-checkbox-${i + 1}`}>
                <input
                  type="checkbox"
                  checked={sanctionChecks[i]}
                  onChange={(e) => toggleSanction(i, e.target.checked)}
                />
                {text}
              </GuideButton>
            )}
          </label>
        ))}

        <div className="info-box">
          <p>
            At all times, students are also responsible for understanding and
            complying with all other policies and procedures listed{" "}
            {!isStatic && <a href="#">here</a>} established by the Senate and
            the University administration.
          </p>
          <p>
            NUS reserves the right to make changes without prior notification.
          </p>
        </div>
      </div>
    </>
  );
};

export default AcceptanceRecordPage;
