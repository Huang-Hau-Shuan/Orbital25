import GuideButton from "../GuideButton";
import type { Appointment } from "./main";
import UHCProgreeBar from "./progress";
const UHCBookingComplete = ({
  appointment,
  onReturnHome,
  title,
}: {
  appointment: Appointment;
  onReturnHome: () => void;
  title?: string;
}) => {
  return (
    <div className="uhc-complete">
      <UHCProgreeBar stepNum={4} />
      <h2 className="uhc-table-title">
        {title ??
          (() => {
            switch (appointment.action) {
              case "Cancel":
                return "Appointment Cancelled";
              default:
                return "Appointment Successful";
            }
          })()}
      </h2>
      <div className="uhc-complete-form">
        <div className="uhc-detail-row">
          <div>Appointment Number</div>
          <div>:</div>
          <div>
            {appointment.appointmentNumber ??
              `NUS/UHC/${appointment.appointmentDate
                .split("-")
                .join("")}${appointment.time.split(":").join("")}`}
          </div>
        </div>
        <div className="uhc-detail-row">
          <div>Appointment Booked for</div>
          <div>:</div>
          <div>{appointment.patientName}</div>
        </div>
        <div className="uhc-detail-row">
          <div>Service</div>
          <div>:</div>
          <div>{appointment.service}</div>
        </div>
        <div className="uhc-detail-row">
          <div>Sub Service</div>
          <div>:</div>
          <div>{appointment.subService}</div>
        </div>
        <div className="uhc-detail-row">
          <div>Date</div>
          <div>:</div>
          <div>{appointment.appointmentDate}</div>
        </div>
        <div className="uhc-detail-row">
          <div>Time</div>
          <div>:</div>
          <div>{appointment.time}</div>
        </div>
        <div className="uhc-detail-row">
          <div>Clinic</div>
          <div>:</div>
          <div>University Health Centre</div>
        </div>
      </div>
      <div className="uhc-footer-buttons">
        <GuideButton
          id="uhc-complete-go-home"
          className="uhc-button secondary"
          onClick={onReturnHome}
          originalTag="button"
        >
          GO TO HOME
        </GuideButton>
      </div>
    </div>
  );
};
export default UHCBookingComplete;
