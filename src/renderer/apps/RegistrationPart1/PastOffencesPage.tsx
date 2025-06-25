import React, { useEffect } from "react";
import type { RegistrationProps } from "./MainMenuPage";
import GuideButton from "../GuideButton";

const PastOffencesPage: React.FC<RegistrationProps> = ({
  markComplete,
  data,
  updateData,
  static: isStatic,
}) => {
  const hasOffence =
    data.pastOffences !== null
      ? data.pastOffences === ""
        ? "no"
        : "yes"
      : null;
  const details = data.pastOffences || "";

  useEffect(() => {
    const complete =
      hasOffence === "no" || (hasOffence === "yes" && details.trim() !== "");
    markComplete(complete);
  }, [data.pastOffences]);

  const setHasOffence = (val: "yes" | "no") => {
    updateData({ ...data, pastOffences: val === "no" ? "" : " " }); // Temporarily placeholder for 'yes'
  };

  const setDetails = (text: string) => {
    updateData({ ...data, pastOffences: text });
  };

  return (
    <div className="po-page">
      <h4 className="section-title">Declaration of Past Offences</h4>
      <p className="po-bold">
        <u>
          Declaration of past offences, current criminal or disciplinary
          proceedings, etc.
        </u>
      </p>
      <p>
        Have you ever been convicted of an offence by a court of law or a
        military court (court martial) in any country, suspended or expelled
        from an educational institution or terminated from your employment for
        any reason, or are there any court or disciplinary proceedings pending
        against you in any country?
      </p>

      {isStatic ? (
        <div style={{ margin: "10px 0" }}>
          {hasOffence === "yes"
            ? `Yes${details.trim() ? ": " + details.trim() : ""}`
            : hasOffence === "no"
            ? "No"
            : ""}
        </div>
      ) : (
        <>
          <GuideButton className="po-radio-group" id="declare-past-offence">
            <label>
              <input
                type="radio"
                className="po-radio"
                name="offence"
                checked={hasOffence === "yes"}
                onChange={() => setHasOffence("yes")}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                className="po-radio"
                name="offence"
                checked={hasOffence === "no"}
                onChange={() => setHasOffence("no")}
              />
              No
            </label>
          </GuideButton>

          {hasOffence === "yes" && (
            <div className="po-textbox-section">
              <p>
                If your answer to the above question is <strong>"Yes"</strong>,
                please provide a full statement of the relevant information in
                the box below.
              </p>
              <textarea
                className="po-textarea"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PastOffencesPage;
