// EmailWelcome.tsx
import React from "react";
import "../css/welcome-email.css"; // style can also be inlined if needed
import { getSimuNUSContext } from "../../context/AppContext";
import { GetOfficialName } from "../../../types";
import img from "./enrollment-cheatsheet.png";
const EmailWelcome: React.FC = () => {
  const { playerProfile } = getSimuNUSContext();
  return (
    <div className="welcome-email-container">
      <h1>
        🎓 Welcome to <span className="welcome-highlight">NUS</span>!
      </h1>
      <p>Hi, {GetOfficialName(playerProfile)}</p>
      <p>
        You've officially accepted your offer to join the National University of
        Singapore. Awesome! To help you get started on your quest, the{" "}
        <strong>SimuNUS Guide Team</strong> has crafted a handy reference scroll
        (aka <em>cheatsheet</em>) for all your upcoming enrollment steps.
      </p>
      <div className="welcome-image-preview">
        <p>
          <strong>Your Enrollment Cheatsheet:</strong>
        </p>
        <img src={img} alt="NUS Enrollment Cheatsheet" />
      </div>
      <div className="welcome-note">
        ⚠️ This cheatsheet is for simulation purposes only. We try to make
        everything as accurate as possible, but please double-check all official
        instructions on NUS or ICA.
      </div>
      <p>Ready to begin your NUS journey? Let the enrollment begin!</p>
      <p>- Team SimuNUS</p>
    </div>
  );
};

export default EmailWelcome;
