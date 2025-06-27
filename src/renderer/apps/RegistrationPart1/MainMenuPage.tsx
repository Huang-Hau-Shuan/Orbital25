import { useEffect, useState } from "react";
import RegistrationPageWrapper from "./RegistrationPageWrapper";
import StepSection from "./StepSection";
import "../css/registration-part-one.css";
import PersonalInformationPage from "./PersonalInformationPage";
import AddressesPage, { emptyAddress } from "./AddressPage";
import {
  GetOfficialName,
  type AddressEntry,
  type PlayerProfile,
  type PhoneEntry,
  type EmergencyContact,
} from "../../../types";
import { dbgLog, onSimuNUSMessage, SendToSimuNUS } from "../../MessageBridge";
import ContactPage from "./ContactPage";
import EmergencyContactsPage from "./EmergencyContactsPage";
import AcceptanceRecordPage from "./AcceptanceRecord";
import AuthorisationRequirementsPage from "./AuthorisationRequirementsPage";
import FamilyFinancialPage from "./FamilyFinancialPage";
import HealthSupportPage from "./HealthSupportPage";
import PastOffencesPage from "./PastOffencesPage";
import ViewCredentialsPage from "./ViewCredentialsPage";
import { getSimuNUSContext } from "../../context/AppContext";
export interface RegistrationData {
  countryBirth: string; //3 digit code of country of birth
  addresses: AddressEntry[];
  paymentAddresses: AddressEntry[];
  phoneNumbers: PhoneEntry[];
  emergencyContacts: EmergencyContact[];
  acceptanceRecord: boolean[];
  authorisationRequirements: boolean[];
  authSubPage: number | null;
  familyIncome: string | null;
  familyMemberNumber: string;
  familyDeclaration: boolean;
  hasCondition: boolean | null;
  specialNeed: number | null;
  medications: string;
  allergies: string;
  pastOffences: string | null;
}
const defaultRegistrationData: RegistrationData = {
  countryBirth: "",
  addresses: [emptyAddress("Home"), emptyAddress("Mail")],
  paymentAddresses: [emptyAddress("Payment")],
  phoneNumbers: [],
  emergencyContacts: [],
  acceptanceRecord: [],
  authorisationRequirements: [false, false, false],
  authSubPage: null,
  familyIncome: null,
  familyMemberNumber: "",
  familyDeclaration: false,
  hasCondition: null,
  specialNeed: null,
  medications: "",
  allergies: "",
  pastOffences: null,
};
export interface RegistrationProps {
  markComplete: (b: boolean) => void;
  profile: PlayerProfile;
  static?: boolean;
  data: RegistrationData;
  updateData: (data: RegistrationData) => void;
}
const pageOrder = [
  "Personal Information",
  "Addresses",
  "Contacts",
  "Emergency Contacts",
  "Acceptance Record",
  "Authorisation Requirements",
  "Family Financial Background",
  "Health and Support",
  "Declaration of Past Offences",
  "Confirmation of Registration (Part One)",
  "View Student ID / PIN / NUSNET ID / NUSNET Password",
];
const MainMenuPage = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number | null>(null);
  const [completedPages, setCompletedPages] = useState<boolean[]>(
    Array(pageOrder.length).fill(false)
  );
  const [registrationData, setRegistrationData] = useState<RegistrationData>(
    defaultRegistrationData
  );
  const updateRegistrationData = (data: RegistrationData) => {
    SendToSimuNUS("setRegistrationData", data);
    setRegistrationData(data);
  };
  useEffect(() => {
    onSimuNUSMessage("returnRegistrationData", (d) => {
      dbgLog("MainMenuPage: received registration data " + JSON.stringify(d));
      setRegistrationData(d as RegistrationData); //ts auto guard doesn't handle null fields properly
    });
    SendToSimuNUS("getRegistrationData");
  }, []);
  const markComplete = (index: number, complete: boolean) => {
    const updated = [...completedPages];
    updated[index] = complete;
    setCompletedPages(updated);
  };
  const markCurrentComplete = (complete: boolean) => {
    if (currentPageIndex !== null) markComplete(currentPageIndex, complete);
  };
  const { playerProfile } = getSimuNUSContext();
  const pageComponent = (
    Page: React.FC<RegistrationProps>,
    isStatic?: boolean
  ) => {
    return (
      <Page
        markComplete={markCurrentComplete}
        profile={playerProfile}
        data={registrationData}
        updateData={updateRegistrationData}
        static={isStatic}
      ></Page>
    );
  };
  const wrapPage = (child: React.ReactNode) => {
    if (currentPageIndex == null) return null;
    if (currentPageIndex == 5 && registrationData.authSubPage !== null) {
      return (
        <div className="main-container">
          <div className="nus-icon-wrapper">
            <img src="icon/nus-full-logo.svg"></img>
          </div>
          <RegistrationPageWrapper
            currentIndex={currentPageIndex}
            onReturn={() =>
              updateRegistrationData({ ...registrationData, authSubPage: null })
            } // onReturn is The function for submit button in this case
            markComplete={(c) => markComplete(currentPageIndex, c)}
            completedPages={completedPages}
            proceedToNextPage={() =>
              updateRegistrationData({ ...registrationData, authSubPage: null })
            } // proceedToNExtPage is the funtion for return function in this case
            pageOrder={pageOrder}
            button1TextOverride="RETURN TO AUTHORISATION REQUIREMENTS"
            button2TextOverride="SUBMIT"
          >
            {child}
          </RegistrationPageWrapper>
        </div>
      );
    }
    if (currentPageIndex === 9) {
      //confirmation
      return (
        <div className="main-container">
          <h3 className="title-text">NUS Student Registration (Part One)</h3>
          <h4 className="title-text">
            Confirmation of Registration (Part One)
          </h4>
          <div className="info-box">
            <ol>
              <li>
                You have submitted the information below earlier. If you need to
                make amendments, please click on the link "Return to Main Menu"
                at the bottom of the page.
              </li>
              <li>
                You are advised to print a copy of the Confirmation page for
                your reference.
              </li>
              <li>
                If you have any enquiries after completing the Registration
                (Part One), please refer to the FAQ <a href="#">here</a>.
              </li>
            </ol>
          </div>
          <RegistrationPageWrapper
            currentIndex={currentPageIndex}
            onReturn={() => setCurrentPageIndex(null)}
            markComplete={(c) => markComplete(currentPageIndex, c)}
            completedPages={completedPages}
            proceedToNextPage={() => {
              markComplete(currentPageIndex, true);
              setCurrentPageIndex(currentPageIndex + 1);
            }}
            pageOrder={pageOrder}
            button2TextOverride="CONFIRM REGISTRATION (PART ONE)"
          >
            {child}
          </RegistrationPageWrapper>
        </div>
      );
    }
    return (
      <div className="main-container">
        <h3 className="title-text">NUS Student Registration (Part One)</h3>
        <h4 className="title-text">Welcome {GetOfficialName(playerProfile)}</h4>
        <RegistrationPageWrapper
          currentIndex={currentPageIndex}
          onReturn={() => setCurrentPageIndex(null)}
          markComplete={(c) => markComplete(currentPageIndex, c)}
          completedPages={completedPages}
          proceedToNextPage={() => setCurrentPageIndex(currentPageIndex + 1)}
          pageOrder={pageOrder}
        >
          {child}
        </RegistrationPageWrapper>
      </div>
    );
  };
  switch (currentPageIndex) {
    case null:
      return (
        <div className="main-container">
          <h3 className="title-text">NUS Student Registration (Part One)</h3>
          <h4 className="title-text">
            Welcome {GetOfficialName(playerProfile)}
          </h4>
          <h4 style={{ marginBottom: 0, color: "#5565af" }}>
            Information for Students
          </h4>
          <div className="info-box">
            <div>
              You will need approximately 15 minutes to complete Registration
              (Part One). Please remember to save after every section so that
              you may log in again if you are unable to complete the whole
              process in a single session.
            </div>
          </div>
          <div className="status-bar info-box">
            <div className="title-text">Status:</div>
            <span>
              <span className="status-icon completed" /> Completed
            </span>
            <span>
              <span className="status-icon pending" /> Not Completed
            </span>
          </div>

          <StepSection
            title="Step 1: Verification / Update of Personal Details"
            startIndex={0}
            count={4}
            completedPages={completedPages}
            onSelect={setCurrentPageIndex}
            pageOrder={pageOrder}
          />

          <StepSection
            title="Step 2: Acceptance Record and Authorisation Requirements"
            startIndex={4}
            count={2}
            completedPages={completedPages}
            onSelect={setCurrentPageIndex}
            pageOrder={pageOrder}
          />

          <StepSection
            title="Step 3: Other Declarations"
            startIndex={6}
            count={3}
            completedPages={completedPages}
            onSelect={setCurrentPageIndex}
            pageOrder={pageOrder}
          />

          <StepSection
            title="Step 4: Confirmation"
            startIndex={9}
            count={1}
            completedPages={completedPages}
            onSelect={setCurrentPageIndex}
            enabled={completedPages.every((i, index) => i || index > 8)} //only enable when all previous has completed
            pageOrder={pageOrder}
          />

          <StepSection
            title="Step 5: View User Profile and Download Form(s)"
            startIndex={10}
            count={1}
            completedPages={completedPages}
            onSelect={setCurrentPageIndex}
            enabled={completedPages.every((i, index) => i || index > 9)} //only enable when all previous has completed
            pageOrder={pageOrder}
          />

          <div className="info-box">
            <p style={{ color: "blue", fontSize: 12 }}>
              Students below 18 years of age are required to click on the link
              below (which will be activated after the completion of all the
              above steps) to download and submit the hardcopy of the following
              form(s) to Student Service Centre at Yusof Ishak House, or refer
              to the administrative notes from your Faculty/School/Registrar's
              Office on instructions for submission.
            </p>
            <p>Risk Acknowledgement and Consent</p>
            <p>
              Authorisation of Medical Procedures [For International Students
              Only]
            </p>
            <p>
              Appointment of Local (Singapore-based) Representative [For
              International Students Only]
            </p>
          </div>
          {window.SimuNUS_API?._DEBUG && (
            <button
              className="reg-button"
              style={{
                backgroundColor: "yellow",
                marginTop: 20,
                color: "black",
              }}
              onClick={() => {
                setCompletedPages(completedPages.map(() => true));
              }}
            >
              DEBUG: COMPLETE EVERYTHING
            </button>
          )}
        </div>
      );
    case 0:
      return wrapPage(pageComponent(PersonalInformationPage));
    case 1:
      return wrapPage(pageComponent(AddressesPage));
    case 2:
      return wrapPage(pageComponent(ContactPage));
    case 3:
      return wrapPage(pageComponent(EmergencyContactsPage));
    case 4:
      return wrapPage(pageComponent(AcceptanceRecordPage));
    case 5: // AuthorisationRequirementsPage has special layout
      return wrapPage(pageComponent(AuthorisationRequirementsPage));
    case 6:
      return wrapPage(pageComponent(FamilyFinancialPage));
    case 7:
      return wrapPage(pageComponent(HealthSupportPage));
    case 8:
      return wrapPage(pageComponent(PastOffencesPage));
    case 9:
      return wrapPage(
        <>
          {pageComponent(PersonalInformationPage, true)}
          {pageComponent(AddressesPage, true)}
          {pageComponent(ContactPage, true)}
          {pageComponent(EmergencyContactsPage, true)}
          {pageComponent(AcceptanceRecordPage, true)}
          {pageComponent(AuthorisationRequirementsPage, true)}
          {pageComponent(FamilyFinancialPage, true)}
          {pageComponent(HealthSupportPage, true)}
          {pageComponent(PastOffencesPage, true)}
        </>
      );
    case 10:
      return wrapPage(pageComponent(ViewCredentialsPage));
    default:
      return wrapPage(<p>Not Implemented</p>);
  }
};

export default MainMenuPage;
