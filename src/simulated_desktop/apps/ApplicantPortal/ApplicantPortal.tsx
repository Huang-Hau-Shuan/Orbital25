import { useState } from "react";
import "../css/application-portal.css";
import ApplicantPortalLogin from "./ApplicantPortalLogin";
import ApplicantPortalMain from "./ApplicantPortalMain";
const ApplicantPortal = () => {
  const [login, setLogin] = useState(false);
  return login ? (
    <ApplicantPortalMain setLogin={setLogin} />
  ) : (
    <ApplicantPortalLogin setLogin={setLogin} />
  );
};
export default ApplicantPortal;
