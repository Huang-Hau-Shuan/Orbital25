import { useState } from "react";
import ApplicantPortalHome from "./ApplicantPortalHome";
import AdmissionPage from "./AdmissionPage";
import GuideButton from "../GuideButton";
enum Page {
  Home,
  Admission,
  Financial_Aid,
  Scholarship,
}
const ApplicantPortalMain = ({
  setLogin,
}: {
  setLogin: (_: boolean) => void;
}) => {
  const [page, setPage] = useState(Page.Home);

  return (
    <div className="applicant-main">
      <header className="app-header">
        <img
          src="/icon/nus-full-logo.svg"
          alt="NUS Logo"
          className="header-logo"
        />
        <div className="flex-space"></div>
        <div className="portal-welcome">
          <p>Welcome to</p>
          <h3>Applicant Portal</h3>
        </div>
        <img
          src="/background/oam-header-bg.png"
          className="applicant-portal-header-img"
        ></img>
      </header>

      <div className="app-nav">
        <GuideButton
          id="applicant-portal-home"
          className={page == Page.Home ? "active" : undefined}
          onClick={() => setPage(Page.Home)}
        >
          Home
        </GuideButton>
        <GuideButton
          id="applicant-portal-admission"
          className={page == Page.Admission ? "active" : undefined}
          onClick={() => setPage(Page.Admission)}
        >
          Admission
        </GuideButton>
        <a
          className={page == Page.Financial_Aid ? "active" : undefined}
          onClick={() => setPage(Page.Financial_Aid)}
        >
          Financial Aid
        </a>
        <a
          className={page == Page.Scholarship ? "active" : undefined}
          onClick={() => setPage(Page.Scholarship)}
        >
          Scholarship
        </a>
        <div className="flex-space"></div>
        <div className="user-section">
          XXX{" "}
          <button className="logout-btn" onClick={() => setLogin(false)}>
            Logout
          </button>
        </div>
      </div>
      <div className="applicant-main-page">
        {page == Page.Home && <ApplicantPortalHome />}
        {page == Page.Admission && <AdmissionPage />}
        <div className="app-footer">
          <a>Privacy Statement</a> &nbsp;&middot;&nbsp; <a>Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default ApplicantPortalMain;
