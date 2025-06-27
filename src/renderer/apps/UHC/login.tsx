import "../css/login.css";
import GuideButton from "../GuideButton";
import type { LoginProps } from "../NUSApp";
const UHCLogin = ({ setLogin }: LoginProps) => {
  return (
    <div className="applicant-login">
      <div className="login-left"></div>

      <div className="login-right">
        <div className="portal-title">
          <img
            src="icon/nus-full-logo.svg"
            alt="NUS Logo"
            className="nus-logo"
          />
          <div>UHC Appointment</div>
        </div>
        <h3>Login</h3>
        <GuideButton
          id="uhc-login-btn"
          className="login-btn"
          originalTag="button"
          onClick={() => setLogin(true)}
        >
          NUS Student
        </GuideButton>
        <button className="login-btn">NUS Staff</button>
        <button className="login-btn">Others</button>
        <div style={{ flex: 1 }}></div>
      </div>
    </div>
  );
};
export default UHCLogin;
