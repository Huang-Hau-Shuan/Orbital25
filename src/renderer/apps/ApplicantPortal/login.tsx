import GuideButton from "../GuideButton";
import type { LoginProps } from "../NUSApp";
import "../css/login.css";
const ApplicantPortalLogin = ({ setLogin }: LoginProps) => {
  return (
    <div className="applicant-login">
      <div className="login-left">
        <div className="login-left-info-box">
          <h3>ANNOUNCEMENTS</h3>
        </div>

        <div className="login-left-info-box">
          <h3>INSTRUCTIONS</h3>
          <ul>
            <li>
              Current NUS Students who wish to apply for Financial Aid,
              Scholarship or Programme Transfer are required to log in with
              their NUSNET ID or NUS email address.
            </li>
            <li>
              Prospective students applying for admissions to full-time
              undergraduate programmes can refer to the{" "}
              <a href="#">Application Guide</a> and{" "}
              <a href="#">Sample Application Form</a> for more information.
            </li>
            <li>
              If you have forgotten your login details, click{" "}
              <a href="#">here</a>.
            </li>
            <li>
              If you do not have an account with Google, Microsoft, Facebook or
              LinkedIn, click <a href="#">here</a> to register using another
              email address.
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
          <div>Applicant Portal</div>
        </div>
        <h3>Login</h3>

        <p>Prospective Students or Returning NSmen can log in with</p>
        <GuideButton
          id="applicant-portal-current-student-login-btn"
          className="login-btn"
          originalTag="button"
          onClick={() => setLogin(true)}
        >
          Social Account
        </GuideButton>

        <p>Current NUS Students to log in with</p>
        <button
          className="login-btn"
          onClick={() => {
            alert("New students do not have a NUS-ID yet.");
          }}
        >
          NUS-ID
        </button>
        <div style={{ flex: 1 }}></div>
        <div className="disclaimer">
          This application is for the use by authorised users only. All user
          activities will be recorded for security purposes. For more details,
          please see our Privacy Notice.
        </div>
      </div>
    </div>
  );
};

export default ApplicantPortalLogin;
