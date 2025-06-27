import { useState } from "react";
import "../css/simumail.css";
import EmailApp from "../Email";
import GuideButton from "../GuideButton";
import ChangePasswordPage from "./ChangePassword";
enum MailPages {
  Main,
  ChangePassword,
  Email,
}
const MainPage = () => {
  const [page, setPage] = useState<MailPages>(MailPages.Main);
  if (page === MailPages.Email) return <EmailApp></EmailApp>;
  if (page === MailPages.ChangePassword)
    return <ChangePasswordPage></ChangePasswordPage>;
  return (
    <div className="simumail-container">
      <div className="simumail-header">
        <img
          src="/icon/nus-full-logo.svg"
          alt="NUS Logo"
          className="simumail-logo"
        />
        <div className="simumail-nav-links">
          <div>
            <a href="#">myEmail</a>
          </div>
          <div>
            <a href="#">Canvas</a>
          </div>
          <div>
            <a href="#">Library</a>
          </div>
          <div>
            <a href="#">Map</a>
          </div>
          <div>
            <a href="#">Calendar</a>
          </div>
        </div>
      </div>

      <div className="simumail-main">
        <div className="simumail-panel">
          <h2>NUS WebMail</h2>
          <p>The Freedom to access your NUSmail anytime and anywhere.</p>
          <button className="simumail-button">Staff</button>
          <button
            className="simumail-button"
            onClick={() => setPage(MailPages.Email)}
          >
            Student / Alumni
          </button>
        </div>
      </div>

      <div className="simumail-links">
        <GuideButton
          id="webmail-change-password-button"
          className="simumail-link blue"
          originalTag="button"
          onClick={() => setPage(MailPages.ChangePassword)}
        >
          Change NUS-ID Password
        </GuideButton>
        <button className="simumail-link red">
          FriendlyMail
          <br />
          (NUS staff & students)
        </button>
        <button className="simumail-link dark-blue">
          Distribution List Manager
          <br />
          (NUS staff)
        </button>
      </div>

      <div className="simumail-footer">
        <p>
          SimuNUS: This site is for Simulation purpose only. Please visit
          <a href="https://exchange.nus.edu.sg/">the original site</a> to change
          password, set friendly mail or log in
        </p>
      </div>
    </div>
  );
};

export default MainPage;
