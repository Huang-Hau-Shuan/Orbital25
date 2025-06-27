import React, { useEffect } from "react";
import type { RegistrationProps } from "./MainMenuPage";
import GuideButton from "../GuideButton";
import GuideInput from "../GuideInput";

const incomeOptions = [
  "Less than $500",
  "$500 - $1,000",
  "$1,001 - $2,000",
  "$2,001 - $2,500",
  "$2,501 - $4,000",
  "$4,001 - $5,000",
  "$5,001 - $6,000",
  "$6,001 - $6,900",
  "$6,901 - $8,000",
  "$8,001 - $9,000",
  "$9,001 - $10,000",
  "above $10,000",
  "Unknown",
];

const FamilyFinancialPage: React.FC<RegistrationProps> = ({
  markComplete,
  data,
  updateData,
  static: isStatic,
}) => {
  const selectedIncome = data.familyIncome;
  const familySize = data.familyMemberNumber;
  const declaration = data.familyDeclaration;
  const verifyFamilyNumber = (size: string) => {
    const num = Number(size.trim());
    return num > 0 && !Number.isNaN(num);
  };
  useEffect(() => {
    const complete =
      !!selectedIncome && verifyFamilyNumber(familySize) && declaration;
    markComplete(complete);
  }, [selectedIncome, familySize, declaration]);

  const setIncome = (val: string) => updateData({ ...data, familyIncome: val });

  const setFamilySize = (val: string) =>
    updateData({ ...data, familyMemberNumber: val });

  const setDeclaration = (val: boolean) =>
    updateData({ ...data, familyDeclaration: val });

  return (
    <div className="ffb-page">
      <h4 className="section-title">Family Financial Background</h4>
      <div className="ffb-info-box">
        <div className="ffb-info-header">Important Information</div>
        <p>
          The University is collecting the household income information of all
          students, in order to assess the levels of financial aid necessary for
          needy students, and increase needy students’ awareness of financial
          aid.
        </p>
        <p>
          All information submitted herein will be treated confidentially but
          may be used for the benefit of NUS, its constituent parts, and
          agencies contracted by NUS for purposes directly related to its
          interests.
        </p>
        <p>
          Household income refers to the gross income of all family members in
          the same household, including self-employment, salary, CPF, and other
          income sources.
        </p>
      </div>

      <div className="ffb-question">
        <p>
          <strong>
            1. How much is your gross monthly household income? Please select
            one option only.
          </strong>
        </p>
        {isStatic ? (
          <div>{selectedIncome}</div>
        ) : (
          <GuideButton
            id="family-income"
            originalTag="div"
            className="ffb-radio-grid"
          >
            {incomeOptions.map((option, i) => (
              <label key={i} className="ffb-radio-option">
                <input
                  className="ffb-radio"
                  type="radio"
                  name="income"
                  value={option}
                  checked={selectedIncome === option}
                  onChange={() => setIncome(option)}
                />
                {option}
              </label>
            ))}
          </GuideButton>
        )}
      </div>

      <div className="ffb-question">
        <p>
          <strong>
            2. Total number of family members (inclusive of the student) staying
            in the same household as the student?
          </strong>
        </p>
        {isStatic ? (
          <div>{familySize}</div>
        ) : (
          <GuideInput
            id="family-size"
            className="ffb-text"
            type="number"
            step="1"
            min="1"
            value={familySize}
            onChange={(e) => setFamilySize(e.target.value.split(".")[0])}
            verify={verifyFamilyNumber}
          />
        )}
      </div>

      <div className="ffb-question">
        {isStatic ? (
          declaration && (
            <div>
              ✓ I declare that the information provided in this form is true to
              the best of my knowledge.
            </div>
          )
        ) : (
          <GuideButton id="family-checkbox">
            <label className="ffb-checkbox-wrapper">
              <input
                className="ffb-checkbox"
                type="checkbox"
                checked={declaration}
                onChange={(e) => setDeclaration(e.target.checked)}
              />
              I declare that the information provided in this form is true to
              the best of my knowledge and I have not wilfully suppressed or
              misrepresented any fact.
            </label>
          </GuideButton>
        )}
      </div>
    </div>
  );
};

export default FamilyFinancialPage;
