import { useEffect } from "react";
import GuideInput from "../GuideInput";
import countries from "i18n-iso-countries";
import encountries from "i18n-iso-countries/langs/en.json";
import { GetOfficialName } from "../../../types";
import type { RegistrationProps } from "./MainMenuPage";

countries.registerLocale(encountries);

const verifyCountry = (input: unknown) =>
  typeof input === "string" && input.length === 3 && countries.isValid(input);

const PersonalInformationPage: React.FC<RegistrationProps> = ({
  markComplete,
  profile,
  static: isStatic,
  data,
  updateData,
}) => {
  useEffect(() => {
    markComplete(verifyCountry(data.countryBirth));
  }, [data.countryBirth]);

  return (
    <>
      <h4 className="section-title">Personal Information</h4>
      <table className="info-table">
        <tbody>
          <tr>
            <td>
              <strong>Official Name</strong>
            </td>
            <td>{GetOfficialName(profile)}</td>
          </tr>
          <tr>
            <td>
              <strong>First Name</strong>
            </td>
            <td>{profile.firstName}</td>
          </tr>
          <tr>
            <td>
              <strong>Last Name</strong>
            </td>
            <td>{profile.lastName}</td>
          </tr>
          <tr>
            <td>
              <strong>Gender</strong>
            </td>
            <td>{profile.gender}</td>
            <td>
              <strong>Date of Birth</strong>
            </td>
            <td>{profile.birthday}</td>
          </tr>
        </tbody>
      </table>

      <div className="section-header">National Identification Number</div>
      <table className="info-table">
        <tbody>
          <tr>
            <td>
              <strong>Singapore Residency Status</strong>
            </td>
            <td>{profile.isSingaporean ? "Singaporean" : "International"}</td>
          </tr>
          <tr>
            <td>
              <strong>Singapore ID Type</strong>
            </td>
            <td>
              {profile.isSingaporean
                ? "National Registration Identity Card"
                : (profile.finOrNric === "" ? "Pending " : "") +
                  "Foreign Identification Number"}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Identification Number</strong>
            </td>
            <td>{profile.finOrNric}</td>
          </tr>
        </tbody>
      </table>

      <div className="section-header">Citizenship Information</div>
      <table className="info-table">
        <tbody>
          <tr>
            <td>
              <strong>Country</strong>
            </td>
            <td>{profile.nationality}</td>
          </tr>
          <tr>
            <td>
              <strong>Country of Birth</strong>
            </td>
            <td>
              {isStatic ? (
                <>{data.countryBirth}</>
              ) : (
                <GuideInput
                  id="personal-info-country-of-birth"
                  value={data.countryBirth}
                  onChange={(e) =>
                    updateData({
                      ...data,
                      countryBirth: e.target.value.toUpperCase(),
                    })
                  }
                  guidePrompt={countries.getAlpha3Code(
                    profile.nationality,
                    "en"
                  )}
                  verify={verifyCountry}
                  pattern="[A-Z]*"
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="notes">
        <div>
          (a) Please note that your Official Name will be printed on various
          official documents issued by the University, in particular your degree
          scroll and academic transcript. If any information on Official Name,
          Residency status, Singapore Identification Type/Number or Citizenship
          is incorrect, please refer to FAQs
          {!isStatic && (
            <>
              <a href="#">here</a>
            </>
          )}
        </div>
        <div>
          (b) You are required to complete the entire online registration
          process even if amendments are required.
        </div>
        <div>
          (c) Passport Number is a required field. If you do not have a passport
          yet, please enter NA in the Passport Number field.
        </div>
      </div>
    </>
  );
};

export default PersonalInformationPage;
