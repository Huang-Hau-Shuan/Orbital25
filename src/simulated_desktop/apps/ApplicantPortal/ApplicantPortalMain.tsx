import { useState } from "react";
import ApplicantPortalHome from "./ApplicantPortalHome";
import AdmissionPage from "./AdmissionPage";
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
        <a
          id="applicant-portal-home"
          className={page == Page.Home ? "active" : undefined}
          onClick={() => setPage(Page.Home)}
        >
          Home
        </a>
        <a
          id="applicant-portal-admission"
          className={page == Page.Admission ? "active" : undefined}
          onClick={() => setPage(Page.Admission)}
        >
          Admission
        </a>
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

      {page == Page.Home && <ApplicantPortalHome />}
      {page == Page.Admission && <AdmissionPage />}
      <div className="app-footer">
        <a>Privacy Statement</a> &nbsp;&middot;&nbsp; <a>Contact Us</a>
      </div>
    </div>
  );
};

export default ApplicantPortalMain;
