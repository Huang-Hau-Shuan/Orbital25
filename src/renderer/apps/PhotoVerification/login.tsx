import GuideButton from "../GuideButton";
import type { LoginProps } from "../NUSApp";
import "../css/login.css";
const PhotoVerificationLogin = ({ setLogin }: LoginProps) => {
  return (
    <div className="applicant-login">
      <div className="login-left">
        <div className="login-left-info-box">
          <p>
            Do note that you are required to accept the NUS offer online, before
            you proceed to submit your digital photo. To login to the system,
            you will be required to login with your Admission Application Number
            and Password/PIN.
          </p>
          <ul>
            <li>
              You are required to read the <a href="#">requirements</a> for the
              photo before you submit your photo online.
            </li>
            <li>
              Please do not submit your photo if you are not matriculating for
              the current year.
            </li>
            <li>
              If you encounter this error message "Missing confirmed
              upload/submit button" while using Internet Explorer, please log in
              to the system again with Google Chrome as your browser.
            </li>
            <li>
              Your photo submission will be processed within one week. Please
              login again after one week to check on the status. If your
              submitted photo is rejected, please re-submit a new photo as soon
              as possible. Kindly email the respective admission administrators
              should you have any enquiries or encounter any problems.
            </li>
          </ul>
        </div>
      </div>

      <div className="login-right">
        <div className="portal-title">
          <img
            src="icon/nus-full-logo.svg"
            alt="NUS Logo"
            className="nus-logo"
          />
          <div>Online Photo Verification</div>
        </div>
        <h3>Online Photo Submission for New Students</h3>

        <p>Please Select Application Type</p>
        <GuideButton
          id="photo-varification-undergraduate-login-btn"
          className="login-btn"
          originalTag="button"
          onClick={() => setLogin(true)}
        >
          Undergraduate (Full-time) / Advance@NUS / BTech/BIT / ALCNS
        </GuideButton>

        <button className="login-btn">YST</button>
        <button className="login-btn">Duke-NUS</button>
        <button className="login-btn">GDA</button>
        <div style={{ flex: 1 }}></div>
      </div>
    </div>
  );
};

export default PhotoVerificationLogin;
