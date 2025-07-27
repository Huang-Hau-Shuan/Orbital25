import type { LoginProps } from "../NUSApp";
import "../css/starrez.css";
import { useEffect, useState } from "react";
import HostelHome from "./home";
import type { HostelApplication } from "../../../types";
import { dbgErr, onSimuNUSMessage, SendToSimuNUS } from "../../MessageBridge";
import { isHostelApplication } from "../../../types.guard";
import HostelOfferPage from "./offer";
import HostelStatementPage from "./statement";
import AppealProcessPage from "./appeal";
import UndergraduateApplicationPage from "./undergraduate";
import CheckInPage from "./checkin";
enum UHMSPage {
  Home,
  StatementOfAccount,
  AboutCheckinCheckout,
  FeesPayment,
  AppealProcess,
  HostelOffer,
  UndergraduateApplication,
}
export interface HostelProps {
  updateApplications: (hd: HostelApplication[]) => void;
  applications: HostelApplication[];
}
const HostelMainPage = ({ setLogin }: LoginProps) => {
  const [currentPage, setCurrentPage] = useState<UHMSPage>(UHMSPage.Home);
  const [applications, setApplications] = useState<HostelApplication[]>([]);
  useEffect(() => {
    onSimuNUSMessage("returnHostelData", (hd) => {
      if (Array.isArray(hd) && hd.every(isHostelApplication)) {
        setApplications(hd);
      } else {
        dbgErr(`returnHostelData: Invalid HostelData ${hd}`);
      }
    });
    SendToSimuNUS("getHostelData");
  }, []);
  const updateApplications = (hd: HostelApplication[]) => {
    setApplications(hd);
    SendToSimuNUS("setHostelData", hd);
  };
  const pageNode = (Page: React.FC<HostelProps>) => {
    return (
      <Page
        updateApplications={updateApplications}
        applications={applications}
      ></Page>
    );
  };
  const PageContent = (() => {
    switch (currentPage) {
      case UHMSPage.StatementOfAccount:
        return pageNode(HostelStatementPage);
      case UHMSPage.Home:
        return pageNode(HostelHome);
      case UHMSPage.AppealProcess:
        return pageNode(AppealProcessPage);
      case UHMSPage.HostelOffer:
        return pageNode(HostelOfferPage);
      case UHMSPage.UndergraduateApplication:
        return pageNode(UndergraduateApplicationPage);
      case UHMSPage.AboutCheckinCheckout:
        return pageNode(CheckInPage);
      default:
        return <h2>Not Implemented</h2>;
    }
  })();
  return (
    <div className="hostel-main">
      <header className="hostel-header">
        <img src="/icon/nus-full-logo.svg" alt="NUS Logo" />
      </header>
      <div className="hostel-nav">
        <a href="#" onClick={() => setCurrentPage(UHMSPage.StatementOfAccount)}>
          Statement of Account
        </a>
        <a
          href="#"
          onClick={() => setCurrentPage(UHMSPage.AboutCheckinCheckout)}
        >
          About Check-In/Out
        </a>
        <a href="#" onClick={() => setCurrentPage(UHMSPage.AppealProcess)}>
          Appeal Process
        </a>
        <a href="#" onClick={() => setCurrentPage(UHMSPage.HostelOffer)}>
          Hostel Offer
        </a>
        <a
          href="#"
          onClick={() => setCurrentPage(UHMSPage.UndergraduateApplication)}
        >
          Undergraduate Application
        </a>
        <a href="#" className="hostel-logout" onClick={() => setLogin(false)}>
          Log Out
        </a>
      </div>

      {PageContent}

      <footer className="hostel-footer">
        <h3 className="sim-warning">
          For Simulation Purpose Only. Please Do <strong>NOT</strong> use any
          actual personal information
        </h3>
      </footer>
    </div>
  );
};

export default HostelMainPage;
