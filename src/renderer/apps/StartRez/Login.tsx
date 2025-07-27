import type { LoginProps } from "../NUSApp";
import GuideButton from "../GuideButton";
import "../css/starrez.css";

const StarRezLoginPage = ({ setLogin }: LoginProps) => {
  return (
    <div className="starrez-page">
      <header className="starrez-header">
        <img src="/icon/nus-full-logo.svg" alt="NUS Logo" />
        <a
          href="#"
          className="starrez-login-link"
          onClick={() =>
            alert(
              "This button is for admins, please click the orange button instead"
            )
          }
        >
          Login
        </a>
      </header>

      <main className="starrez-main">
        <h2>Students With NUS-ID</h2>
        <ul>
          <li>
            For new students who have completed{" "}
            <strong>Registration (Part One)</strong>, please{" "}
            <strong>wait for 48 hours</strong> before you log into this portal
            using your NUS-ID to have a smooth application experience.
          </li>
          <li>
            If you have forgotten your password, please go to{" "}
            <a
              href="https://nusit.nus.edu.sg/change-or-reset-your-nus-id-password/"
              target="_blank"
              rel="noreferrer"
            >
              https://nusit.nus.edu.sg/change-or-reset-your-nus-id-password/
            </a>
            .
          </li>
          <li>
            Submit a question to our support team at this <a href="#">link</a>{" "}
            if you have any login issues.
          </li>
        </ul>
        <p>Please log in using your NUS-ID and password.</p>
        <GuideButton
          id="starrez-login-button"
          originalTag="button"
          className="starrez-login-button"
          onClick={() => setLogin(true)}
        >
          Login Here
        </GuideButton>
      </main>
      <div style={{ flex: 1 }}></div>
      <footer className="starrez-footer">
        <a href="#">Terms of Use</a>
        <a href="#">Privacy</a>
        <a href="#">Non-discrimination</a>
        <a href="#">Campus Map</a>
      </footer>
    </div>
  );
};

export default StarRezLoginPage;
