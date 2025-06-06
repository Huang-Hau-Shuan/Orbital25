import { useState } from "react";
import "../css/application-portal.css";
const ApplicantPortalHome = () => {
  const [applications] = useState([
    {
      year: "2025/2026",
      action: "Continue to submit Application",
      due: "",
    },
  ]);
  return (
    <div className="app-content">
      <h2>Welcome to Applicant Portal</h2>

      {applications.length > 0 && (
        <table className="app-table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Academic Year</th>
              <th>Pending Action Item(s)</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{a.year}</td>
                <td>
                  <a href="#">{a.action}</a>
                </td>
                <td>{a.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default ApplicantPortalHome;
