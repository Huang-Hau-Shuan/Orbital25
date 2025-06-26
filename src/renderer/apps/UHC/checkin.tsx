import GuideButton from "../GuideButton";
import type { Appointment } from "./main";

const UHCCheckIn = ({
  appointment,
  onBack,
}: {
  appointment: Appointment;
  onBack: () => void;
}) => {
  return (
    <div className="uhc-checkin-wrapper">
      <div className="uhc-checkin-container">
        {appointment.status !== "Booked" ? (
          <>
            <h2 className="uhc-queue-info-title">Queue Information</h2>
            <div className="uhc-queue-info-field">
              <span>Queue Number:</span>
              <span className="uhc-bold-link">{appointment.queueNumber}</span>
            </div>
            <div className="uhc-queue-info-field">
              <span>Queue Status:</span>
              <span className="uhc-bold-link">{appointment.status}</span>
            </div>
            <div className="uhc-queue-info-field">
              <span>Clinic Name:</span>
              <span className="uhc-bold-link">University Health Centre</span>
            </div>
            <div className="uhc-queue-info-field">
              <span>Station Name:</span>
              <span className="uhc-bold-link">UHC Counter</span>
            </div>
            <div>
              <GuideButton
                id="uhc-checkin-back"
                originalTag="button"
                onClick={onBack}
              >
                Back
              </GuideButton>
            </div>
          </>
        ) : (
          <>
            <h2 className="uhc-checkin-title">Queue Number for Registration</h2>
            <p className="uhc-checkin-desc">
              Please proceed to the waiting area
              <br />
              and wait for your queue number to be called.
            </p>
            <div className="uhc-queue-box">{appointment.queueNumber}</div>
            <div>
              <GuideButton
                id="uhc-checkin-back"
                originalTag="button"
                onClick={onBack}
              >
                Back
              </GuideButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UHCCheckIn;
