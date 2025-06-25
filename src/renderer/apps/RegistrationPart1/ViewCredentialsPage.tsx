import React, { useState } from "react";
import type { RegistrationProps } from "./MainMenuPage";
import { SendToSimuNUS } from "../../MessageBridge";
import GuideInput from "../GuideInput";
import GuideButton from "../GuideButton";

const ViewCredentialsPage: React.FC<RegistrationProps> = ({
  markComplete,
  profile,
}) => {
  const [dobInput, setDobInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const formatBirthday = (birthday: string) => birthday.replace(/\D/g, "");

  const handleSubmit = () => {
    const expected = formatBirthday(profile.birthday);
    if (dobInput === expected) {
      setUnlocked(true);
      markComplete(true);
      SendToSimuNUS("generateStudentCredentials");
    } else {
      alert("Invalid date of birth. Please enter in DDMMYYYY format.");
    }
  };

  if (unlocked) {
    return (
      <div className="vc-page">
        <div className="vc-header">Student ID/PIN/NUS-ID/NUS-ID Password</div>

        <p>
          <strong>Student ID:</strong> {profile.studentID}
        </p>
        <p>
          <strong>PIN:</strong> 1234567
        </p>
        <p>
          <strong>NUS-ID:</strong> {profile.studentEmail?.split("@")[0]}
        </p>
        <p>
          <strong>NUS-ID Password:</strong> {profile.emailPassword}
        </p>

        <p className="vc-print-note">
          You may wish to print a copy of this page for reference. To print, go
          to File &gt;&gt; Print.
        </p>

        <p>
          <strong>Important notes on NUS-ID/Password:</strong>
        </p>
        <ol>
          <li>
            Your NUS-ID account will only be activated{" "}
            <strong>1 to 2 days</strong> after you complete your Registration
            (Part One).
          </li>
          <li>
            After activation, change your default NUS-ID Password at
            https://exchange.nus.edu.sg by clicking "Change NUS-ID Password"
            before accessing NUS Email, EduRec, Canvas, and other services.
          </li>
          <li>
            Register for{" "}
            <strong>Microsoft Multifactor Authentication (MFA)</strong> at{" "}
            <a
              href="https://nusit.nus.edu.sg/services/accounts-and-access/student-nus-id-getting-started/"
              target="_blank"
              rel="noreferrer"
            >
              this guide
            </a>{" "}
            to secure your account.
          </li>
          <li>
            Keep this information <strong>strictly confidential</strong>. You're
            responsible for all activities performed using your credentials.
          </li>
        </ol>
      </div>
    );
  }

  return (
    <div className="vc-page">
      <h3>View Student ID / PIN / NUSNET ID / NUSNET Password</h3>

      <p className="vc-note">
        For authentication purposes, please key in your date of birth below.
      </p>
      <p>
        Once you have obtained your Login ID, NUS Student Card PIN and NUSNET
        Password, you must not reveal them to anyone. You are responsible for
        all actions performed using these credentials.
      </p>

      <div className="vc-input-section">
        <label>
          Please enter your <strong>*Date of Birth</strong> in{" "}
          <strong>DDMMYYYY</strong> format:
        </label>
        <div className="vc-input-line">
          <GuideInput
            id="reg-1-view-credential-birthday"
            type="number"
            className="vc-input"
            value={dobInput}
            onChange={(e) => setDobInput(e.target.value)}
            guidePrompt={formatBirthday(profile.birthday)}
          />
          <GuideButton
            id="reg-1-submit"
            originalTag="button"
            className="reg-button"
            onClick={handleSubmit}
          >
            SUBMIT
          </GuideButton>
        </div>
        <p className="vc-example">
          (E.g. If your birthdate is 4 May 1980, please enter as 04051980)
        </p>
      </div>
    </div>
  );
};

export default ViewCredentialsPage;
