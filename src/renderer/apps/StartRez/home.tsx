import { getSimuNUSContext } from "../../context/AppContext";
import { GetOfficialName } from "../../../types";
const HostelHome = () => {
  const { playerProfile } = getSimuNUSContext();
  const userName = GetOfficialName(playerProfile);
  return (
    <main className="hostel-content">
      <div style={{ fontSize: 16 }}>Hi {userName}!</div>
      <h3>IMPORTANT NOTE:</h3>
      <ol>
        <li>
          If you wish to submit a hostel application/registration, view your
          results, accept offers (if applicable), pay the semester 2 acceptance
          fee, please click on the process or STPS of the process (if not
          located at the top menu). Please note that the online hostel
          application, registration or acceptance period is from{" "}
          <strong>10.00am (first day) to 11.59am (last day)</strong>, Singapore
          time unless otherwise stated.
        </li>
        <li>
          If you are Undergraduate/Graduate/Non-Graduating student and
          unsuccessful in your application and wish to submit an appeal, please
          click on the <strong>“Appeal Process”</strong> located at the top
          menu. Choose the relevant term that you are appealing for. Click “Save
          & Continue” button to proceed.
        </li>
        <li>
          If you have been invoiced by the hostel management office and wish to
          make an online payment for your hostel fees, please click on the{" "}
          <strong>“Fees/Payments”</strong> tab located at the top menu.
        </li>
        <li>
          Only selected students are able to register for the Residential
          Colleges. Students shortlisted by the colleges are ineligible to apply
          for a place in the Halls, Houses or Residences.
        </li>
        <li>
          Non-Graduating Students who are staying for another semester need not
          re-apply for their second semester stay.
        </li>
        <li>
          Undergraduate and Graduate students who were successful in their
          semester 1 hostel application and have existing reservation for
          semester 2 need not re-apply during semester 2 application exercise.
        </li>
        <li>
          You will not be able to submit an application if you are:
          <ul>
            <li>Not eligible (part-time, graduated, withdrawn)</li>
            <li>Not accepted your NUS offer</li>
            <li>On Leave of Absence</li>
            <li>Banned (disciplinary/financial)</li>
            <li>Not offered to study in NUS for the upcoming academic year</li>
          </ul>
        </li>
      </ol>

      <p>
        For queries, please submit your queries via{" "}
        <a href="https://www.hosteladmissions.nus.edu.sg">
          www.hosteladmissions.nus.edu.sg
        </a>
      </p>

      <h3>DEFINITIONS OF APPLICATION STATUS:</h3>
      <ul>
        <li>
          <strong>In Progress</strong> - You have not completed your
          application/registration.
        </li>
        <li>
          <strong>Application Completed</strong> - You have completed your
          application/registration.
        </li>
        <li>
          <strong>Offered</strong> - You have been offered a room. Please accept
          the offer and pay the acceptance fee before the deadline.
        </li>
        <li>
          <strong>Offer Accepted</strong> - You have accepted the offer and
          completed the eOrientation Module but have not paid the acceptance
          fee.
        </li>
        <li>
          <strong>Successful</strong> - You have paid the acceptance fee and
          your reservation is confirmed.
        </li>
        <li>
          <strong>Unsuccessful</strong> - We are unable to offer you a room.
        </li>
        <li>
          <strong>Offer Lapsed</strong> - Your offer has been withdrawn or
          expired.
        </li>
        <li>
          <strong>Not Eligible</strong> - You are unable to apply due to
          eligibility criteria.
        </li>
        <li>
          <strong>Application Rejected</strong> - Your application has been
          rejected.
        </li>
        <li>
          <strong>Endorsed</strong> - You have completed eOrientation and
          arranged payment.
        </li>
        <li>
          <strong>Appeal Received</strong> - You have submitted an appeal.
        </li>
        <li>
          <strong>Appeal Unsuccessful</strong> - Your appeal has been rejected.
        </li>
      </ul>
    </main>
  );
};
export default HostelHome;
