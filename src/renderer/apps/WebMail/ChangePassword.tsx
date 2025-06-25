import { useEffect, useState } from "react";
import { defaultPlayerProfile, type PlayerProfile } from "../../../types";
import { onSimuNUSMessage, SendToSimuNUS } from "../../MessageBridge";
import { isPlayerProfile } from "../../../types.guard";
import GuideInput from "../GuideInput";
import GuideButton from "../GuideButton";

const ChangePasswordPage = () => {
  const [profile, setProfile] = useState<PlayerProfile>(defaultPlayerProfile);
  const [id, setId] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    onSimuNUSMessage("setPlayerProfile", (data) => {
      if (isPlayerProfile(data)) {
        setProfile(data);
      }
    });
    onSimuNUSMessage("resetPasswordSuccess", () => {
      setError("Successfully reset password");
    });
    onSimuNUSMessage("resetPasswordError", (data) => {
      if (typeof data === "string") setError(data);
    });
    SendToSimuNUS("getPlayerProfile");
  });
  function isPasswordValid(password: string) {
    if (password.length < 12) {
      return false;
    }

    let hasUpper = /[A-Z]/.test(password);
    let hasLower = /[a-z]/.test(password);
    let hasDigit = /\d/.test(password);
    let hasSpecial = /[^A-Za-z0-9]/.test(password);

    let complexityCount = [hasUpper, hasLower, hasDigit, hasSpecial].filter(
      Boolean
    ).length;

    return complexityCount >= 3;
  }
  return (
    <div className="pw-container">
      <h2 className="pw-title">Change NUS-ID Password</h2>
      <p>
        Please enter your NUS-ID in the <strong>User ID</strong> field.
      </p>
      <p>
        For NUS AlumMAIL users, please login to <a href="#">AlumMAIL</a> to
        change your password.
      </p>

      <h3 className="pw-guidelines-title">Password Guidelines</h3>
      <ul className="pw-guidelines">
        <li>Your password must be at least 12 characters in length.</li>
        <li>
          Your password must be complex, which means that it should contain at
          least 3 out of the following classes of characters: Uppercase
          characters, Lowercase characters, Base 10 digits (0-9), Special
          characters
        </li>
        <li>
          Your password cannot contain your User ID or any part of your name
          (e.g. if your account name is "Amy Tan Hui Ling", your password should
          not contain "Amy", "Tan", "Hui", or "Ling").
        </li>
        <li>You cannot re-use any of your 6 old passwords.</li>
        <li>You cannot change your password more than once in a day.</li>
      </ul>
      {error && (
        <p
          style={{
            color: error === "Successfully reset password" ? "green" : "red",
          }}
        >
          {error}
        </p>
      )}
      <div className="pw-form">
        <label>User ID</label>
        <GuideInput
          id="webmail-change-password-userid"
          type="text"
          guidePrompt={profile.studentEmail}
          onContentChange={setId}
        />

        <label>Old Password</label>
        <GuideInput
          id="change-password-old"
          type="password"
          placeholder="Current Password"
          onContentChange={setOldPassword}
          guidePrompt={profile.emailPassword}
        />

        <label>New Password</label>
        <GuideInput
          id="change-password-new"
          type="password"
          placeholder="New Password"
          onContentChange={setNewPassword}
          verify={isPasswordValid}
        />

        <label>Confirm New Password</label>
        <GuideInput
          id="change-password-confirm"
          type="password"
          placeholder="Confirm New Password"
          onContentChange={setConfirmPassword}
          verify={(text) => text === newPassword}
        />

        <GuideButton
          originalTag="div"
          id="change-password-submit"
          className="pw-submit-btn"
          onClick={() => {
            if (
              !(
                id.toLowerCase() === profile.studentEmail.toLowerCase() ||
                id.toLowerCase() !==
                  profile.studentEmail.toLowerCase() + "@u.nus.edu"
              ) ||
              oldPassword !== profile.emailPassword
            ) {
              setError("Incorrect email or password");
              return;
            }

            if (oldPassword === newPassword) {
              setError("You cannot reuse your old password");
              return;
            }
            if (newPassword !== confirmPassword) {
              setError("Please confirm your new password");
              return;
            }
            if (isPasswordValid(newPassword)) {
              SendToSimuNUS("resetPassword", newPassword);
            } else {
              setError(
                "Please make sure your new password satisfy the complexity requirements"
              );
            }
          }}
        >
          Submit
        </GuideButton>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
