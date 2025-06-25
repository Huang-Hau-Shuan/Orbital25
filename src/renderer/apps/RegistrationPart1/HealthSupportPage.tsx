import React, { useEffect } from "react";
import type { RegistrationProps } from "./MainMenuPage";
import GuideButton from "../GuideButton";

const specialNeedsOptions = [
  "Not Applicable",
  "Assessment Related (e.g. extra time, larger font size, use of laptop/computer, etc.)",
  "Non-Assessment Related (e.g. mobility and campus accessibility, etc.)",
  "Both (Assessment & Non-Assessment Related)",
];

const HealthSupportPage: React.FC<RegistrationProps> = ({
  markComplete,
  data,
  updateData,
  static: isStatic,
}) => {
  const hasCondition = data.hasCondition;
  const specialNeed = data.specialNeed;
  const medications = data.medications;
  const allergies = data.allergies;

  useEffect(() => {
    const filled = hasCondition !== null && specialNeed !== null;
    markComplete(filled);
  }, [hasCondition, specialNeed]);

  const setHasCondition = (value: boolean) =>
    updateData({ ...data, hasCondition: value });

  const setSpecialNeed = (index: number) =>
    updateData({ ...data, specialNeed: index });

  const setMedications = (value: string) =>
    updateData({ ...data, medications: value });

  const setAllergies = (value: string) =>
    updateData({ ...data, allergies: value });

  return (
    <div className="hs-page">
      <h4 className="section-title">Health and Support</h4>

      <p className="hs-bold">
        *Do you have any <strong>past or current</strong> 1) medical,{" "}
        <i>e.g. epilepsy, allergies, tuberculosis</i>, 2) mental health,{" "}
        <i>e.g. anxiety, eating disorder, depression</i>, 3) disability or
        learning needs, <i>e.g. autism, dyslexia, visual impairment</i>, which
        may or may not cause you to require support or facilities while studying
        at the University?
      </p>
      <p className="hs-note">
        Students with colour-blindness are advised to indicate their condition
        here as they may face challenges in certain programmes in Engineering,
        Science and Design & Environment.
      </p>

      {isStatic ? (
        <div style={{ marginBottom: "1rem" }}>
          {hasCondition !== null && (hasCondition ? "Yes" : "No")}
        </div>
      ) : (
        <GuideButton
          className="hs-radio-group"
          id="health-conditions"
          originalTag="div"
        >
          <label>
            <input
              className="hs-radio"
              type="radio"
              name="has-condition"
              checked={hasCondition === true}
              onChange={() => setHasCondition(true)}
            />
            Yes
          </label>
          <label>
            <input
              className="hs-radio"
              type="radio"
              name="has-condition"
              checked={hasCondition === false}
              onChange={() => setHasCondition(false)}
            />
            No
          </label>
        </GuideButton>
      )}

      {hasCondition === true && !isStatic && (
        <h3>[Health Condition Simulation not Implemented]</h3>
      )}

      <GuideButton
        className="hs-special"
        id="special-arrangements"
        originalTag="div"
      >
        <p>
          <strong>
            <u>Special Needs Arrangements</u>
          </strong>
        </p>
        <p>
          Please indicate the type of special needs arrangements that you
          require:
        </p>

        {isStatic ? (
          <div>
            {typeof specialNeed === "number"
              ? specialNeedsOptions[specialNeed]
              : ""}
          </div>
        ) : (
          specialNeedsOptions.map((opt, i) => (
            <label key={i} className="hs-radio-line">
              <input
                className="hs-radio"
                type="radio"
                name="special-need"
                checked={specialNeed === i}
                onChange={() => setSpecialNeed(i)}
              />
              {opt}
            </label>
          ))
        )}
      </GuideButton>

      <div className="hs-textbox-group">
        <label>
          If you are taking any <strong>medications</strong>, please provide
          details below.
          {isStatic ? (
            <div className="hs-static-text">{medications}</div>
          ) : (
            <textarea
              className="hs-textarea"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
            />
          )}
        </label>
      </div>

      <div className="hs-textbox-group">
        <label>
          If you have a <strong>drug or food allergy</strong>, please provide
          details and describe your reaction.
          {isStatic ? (
            <div className="hs-static-text">{allergies}</div>
          ) : (
            <textarea
              className="hs-textarea"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          )}
        </label>
      </div>

      <div className="hs-note-box">
        <strong>Note:</strong> Disclosure will not disadvantage your
        application. This info helps NUS assess support needs and make necessary
        adjustments to support a positive student experience.
      </div>
    </div>
  );
};

export default HealthSupportPage;
