import React from "react";
import UHCProgreeBar from "./progress";
import GuideButton from "../GuideButton";

interface ConfirmProps {
  service: string;
  subService: string;
  date: string;
  time: string;
  mobileExt: string;
  mobile: string;
  email: string;
  proceedText?: string;
  onBack: () => void;
  onProceed: () => void;
  onReturnHome: () => void;
}

const UHCAppointmentConfirm: React.FC<ConfirmProps> = ({
  service,
  subService,
  date,
  time,
  mobileExt,
  mobile,
  email,
  onBack,
  onProceed,
  onReturnHome,
  proceedText = "PROCEED",
}) => {
  return (
    <div className="uhc-confirm-page">
      <UHCProgreeBar stepNum={3}></UHCProgreeBar>

      <div className="uhc-section">
        <h3>Appointment Details</h3>
        <div className="uhc-detail-box">
          <div className="uhc-detail-row">
            <div>Service</div>
            <div>:</div>
            <div>{service}</div>
          </div>
          <div className="uhc-detail-row">
            <div>Sub Service</div>
            <div>:</div>
            <div>{subService}</div>
          </div>
          <div className="uhc-detail-row">
            <div>Date</div>
            <div>:</div>
            <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
              {date}
              <div style={{ flex: 1 }}></div>
              <button className="uhc-edit-button" onClick={onBack}>
                Edit
              </button>
            </div>
          </div>
          <div className="uhc-detail-row">
            <div>Time</div>
            <div>:</div>
            <div>{time}</div>
          </div>
        </div>
      </div>

      <div className="uhc-section">
        <h3>Contact Details</h3>
        <div className="uhc-detail-box">
          <div className="uhc-detail-row">
            <div>Mobile</div>
            <div>:</div>
            <div className="uhc-grey-box">{mobileExt}</div>
            <div className="uhc-grey-box">{mobile}</div>
          </div>
          <div className="uhc-detail-row">
            <div>Email</div>
            <div>:</div>
            <div className="uhc-grey-box">{email}</div>
          </div>
        </div>
      </div>

      <div className="uhc-footer-buttons">
        <button className="uhc-button secondary" onClick={onReturnHome}>
          GO TO HOME
        </button>
        <GuideButton
          className="uhc-button primary"
          onClick={onProceed}
          id="uhc-booking-proceed-3"
          originalTag="button"
        >
          {proceedText}
        </GuideButton>
      </div>
    </div>
  );
};

export default UHCAppointmentConfirm;
