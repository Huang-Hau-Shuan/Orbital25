import { useEffect, useState } from "react";
import "../css/uhc.css";
import { GetOfficialName } from "../../../types";
import { dbgErr, onSimuNUSMessage, SendToSimuNUS } from "../../MessageBridge";
import GuideButton from "../GuideButton";
import BookingStepOne from "./step1";
import UHCBookingStepTwo from "./step2";
import UHCAppointmentConfirm from "./step3";
import UHCBookingComplete from "./step4";
import UHCCheckIn from "./checkin";
import { getSimuNUSContext } from "../../context/AppContext";
export type ServiceType =
  | "Medical Examination"
  | "Specialist Consultation"
  | "Consultation"
  | "Nursing"
  | null;
export type SubServiceType =
  | "Pre-admission Medical Exam"
  | "Staff Employment & Other Medical Exam"
  | "Orthopedic"
  | "Physiotherapy"
  | "Psychiatric"
  | "General Consultation"
  | "HPV (Gardasil 9) Vaccination"
  | "Shingrix Vaccination"
  | "Vaccination / Procedure / Laboratory Tests"
  | null;
export type ActionType =
  | null
  | "Reschedule"
  | "Cancel"
  | "Email"
  | "Check-in"
  | "Select";
export interface Appointment {
  action: ActionType;
  appointmentDate: string;
  time: string;
  service: ServiceType;
  subService: SubServiceType;
  patientName: string;
  status: "Booked" | "Waiting" | "Complete" | "Check-in";
  remarks: string;
  appointmentNumber: string;
  queueNumber: string;
}
const defaultAppointment: Appointment = {
  action: null,
  appointmentDate: "",
  time: "",
  service: null,
  subService: null,
  patientName: "",
  status: "Booked",
  remarks: "",
  appointmentNumber: "",
  queueNumber: "",
};
const UHCMain = () => {
  const { playerProfile } = getSimuNUSContext();
  const [page, setPage] = useState(0);
  useEffect(() => {
    onSimuNUSMessage("returnAppointments", (p) => {
      if (!Array.isArray(p)) {
        dbgErr(`UHC returnAppointments: received invalid appointments ${p}`);
      }
      setAppointments(p as Appointment[]);
    });
    onSimuNUSMessage("checkinAppointmentSuccess", (i) => {
      if (typeof i === "number" && i >= 0 && i < appointments.length) {
        setCurrentIndex(i);
        updateCurrentAppointment({
          ...appointments[i],
          status: "Check-in",
          action: "Check-in",
        });
      } else {
        dbgErr(`UHC Checkin: Invalid index ${i}`);
      }
    });
    SendToSimuNUS("getAppointments");
  }, []);
  const fullName = GetOfficialName(playerProfile);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment>({
    ...defaultAppointment,
    patientName: fullName,
  });
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const applyCurrentAppointment = () => {
    if (currentIndex === null) return;
    const newapp = appointments.map((a, idx) =>
      currentIndex === idx ? currentAppointment : a
    );
    setAppointments(newapp);
    SendToSimuNUS("setAppointments", newapp);
  };
  const updateCurrentAppointment = (app: Appointment) => {
    setCurrentAppointment(app);
    if (currentIndex === null) return;
    const newapp = appointments.map((a, idx) =>
      currentIndex === idx ? app : a
    );
    setAppointments(newapp);
    SendToSimuNUS("setAppointments", newapp);
  };
  const setAction = (i: number, act: ActionType) => {
    const newapp = appointments.map((a, idx) =>
      i === idx ? { ...a, action: act } : a
    );
    if (act === "Check-in" && !newapp[i].queueNumber) {
      const generateRandomString = (
        length: number,
        characters: string = "0123456789"
      ) => {
        let result = "";
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return result;
      };
      newapp[i].queueNumber = "C" + generateRandomString(4);
    }
    setAppointments(newapp);
    setCurrentIndex(i);
    setCurrentAppointment(newapp[i]);
    //we purposely not send to backend because actions need not persist after closing the app
  };
  return (
    <div className="uhc-container">
      <header className="uhc-header">
        <img
          src="/icon/nus-full-logo.svg"
          alt="NUS Logo"
          className="uhc-logo"
        />
        <div className="uhc-user-name">{fullName.toUpperCase()}</div>
      </header>
      {(() => {
        switch (page) {
          case 0:
            return (
              <>
                <div className="uhc-top">
                  <div className="uhc-user-type">Student</div>
                  <div style={{ flex: 1 }}></div>
                  <GuideButton
                    id="uhc-book-button"
                    className="uhc-book-button"
                    onClick={() => {
                      setPage(1);
                      setCurrentIndex(null);
                      setCurrentAppointment(defaultAppointment);
                    }}
                  >
                    Book New Appointment
                  </GuideButton>
                  <button
                    className="uhc-book-button"
                    style={{ color: "yellow" }}
                    onClick={() => {
                      setAppointments([
                        ...appointments,
                        {
                          service: "Medical Examination",
                          subService: "Pre-admission Medical Exam",
                          action: null,
                          appointmentDate: "30-06-2025",
                          time: "12:00",
                          patientName: fullName,
                          status: "Booked",
                          remarks: "",
                          appointmentNumber: "",
                          queueNumber: "",
                        },
                      ]);
                    }}
                  >
                    DEBUG: Add Default Appointment
                  </button>
                </div>
                <div className="uhc-main">
                  <div className="uhc-sidebar">
                    <label>Full Name*</label>
                    <input value={fullName.toUpperCase()} disabled />

                    <label>NUS ID *</label>
                    <input value={playerProfile.NUSNETID} disabled />

                    <label>User Type</label>
                    <select disabled>
                      <option selected>Student</option>
                    </select>

                    <label>Email Address*</label>
                    <input
                      value={`${playerProfile.NUSNETID.toUpperCase()}@U.NUS.EDU`}
                      disabled
                    />

                    <label>Mobile</label>
                    <div className="uhc-phone-row">
                      <input
                        value={playerProfile.mobileExt}
                        disabled
                        style={{ maxWidth: 40 }}
                      />
                      <input
                        value={playerProfile.mobile}
                        disabled
                        style={{ maxWidth: 120 }}
                      />
                    </div>
                    <p className="uhc-note">
                      <em>
                        Note: For change of mobile number, please go to EDUREC.
                      </em>
                    </p>
                  </div>

                  <div className="uhc-appointments-panel">
                    <div className="uhc-tab-bar">
                      <button className="uhc-tab active">Active</button>
                      <button className="uhc-tab">History</button>
                    </div>

                    <h2 className="uhc-table-title">Appointments</h2>
                    <div className="uhc-tabl-wrapper">
                      <table className="uhc-table">
                        <thead>
                          <tr>
                            <th>Action</th>
                            <th>Appointment Date</th>
                            <th>Time</th>
                            <th>Service</th>
                            <th>Sub Service</th>
                            <th>Patient Name</th>
                            <th>Status</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="uhc-rows">
                          {appointments.length === 0 ? (
                            <tr>
                              <td colSpan={8}>No Rows To Show</td>
                            </tr>
                          ) : (
                            appointments.map((app, i) => (
                              <tr>
                                <td>
                                  {app.action !== "Select" ? (
                                    <GuideButton
                                      id={`uhc-booking-${i}-action-button`}
                                      className="uhc-action-button"
                                      onClick={() => setAction(i, "Select")}
                                    >
                                      Action
                                    </GuideButton>
                                  ) : (
                                    <div className="uhc-action-select">
                                      <button
                                        onClick={() => {
                                          setAction(i, null);
                                        }}
                                      >
                                        Back
                                      </button>
                                      <button
                                        onClick={() => {
                                          setAction(i, "Reschedule");
                                          setPage(2);
                                        }}
                                      >
                                        Reschedule
                                      </button>
                                      <button
                                        onClick={() => {
                                          setAction(i, "Cancel");
                                          setPage(3);
                                        }}
                                      >
                                        Cancel
                                      </button>
                                      <GuideButton
                                        originalTag="button"
                                        id={`uhc-booking-${i}-check-in-button`}
                                        onClick={() => {
                                          SendToSimuNUS(
                                            "checkinAppointment",
                                            i
                                          );
                                          setAction(i, "Check-in");
                                          setPage(5);
                                        }}
                                      >
                                        Check-in
                                      </GuideButton>
                                      <button
                                        onClick={() => {
                                          setAction(i, null);
                                        }}
                                      >
                                        Email
                                      </button>
                                    </div>
                                  )}
                                </td>
                                <td>{app.appointmentDate}</td>
                                <td>{app.time}</td>
                                <td>{app.service}</td>
                                <td>{app.subService}</td>
                                <td>{app.patientName}</td>
                                <td>{app.status}</td>
                                <td>{app.remarks}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            );
          case 1:
            return (
              <BookingStepOne
                service={currentAppointment.service}
                setService={(service) => {
                  setCurrentAppointment({
                    ...currentAppointment,
                    service: service,
                  });
                }}
                subService={currentAppointment.subService}
                setSubService={(s) => {
                  setCurrentAppointment({
                    ...currentAppointment,
                    subService: s,
                  });
                }}
                onProceed={() => setPage(2)}
                onBack={() => setPage(0)}
                isSingaporean={playerProfile.isSingaporean}
              ></BookingStepOne>
            );
          case 2:
            return (
              <UHCBookingStepTwo
                service={currentAppointment.service}
                subService={currentAppointment.subService}
                onBack={() => setPage(1)}
                onProceed={() => setPage(3)}
                setAppointmentDate={(date) => {
                  setCurrentAppointment({
                    ...currentAppointment,
                    appointmentDate: date,
                  });
                }}
                setTime={(time) =>
                  setCurrentAppointment({ ...currentAppointment, time: time })
                }
              ></UHCBookingStepTwo>
            );
          case 3:
            return (
              <UHCAppointmentConfirm
                service={currentAppointment.service ?? ""}
                subService={currentAppointment.subService ?? ""}
                date={currentAppointment.appointmentDate}
                time={currentAppointment.time}
                mobileExt={playerProfile.mobileExt}
                mobile={playerProfile.mobile}
                email={playerProfile.NUSNETID + "@U.NUS.EDU"}
                onBack={function (): void {
                  setPage(2);
                }}
                proceedText={(() => {
                  switch (currentAppointment.action) {
                    case "Cancel":
                      return "CANCEL APPOINTMENT";
                    case "Reschedule":
                      return "RESCHEDULE";
                    default:
                      return "PROCEED";
                  }
                })()}
                onProceed={function (): void {
                  setPage(4);
                  switch (currentAppointment.action) {
                    case null:
                      {
                        const newAppointments = [
                          ...appointments,
                          currentAppointment,
                        ];
                        setAppointments(newAppointments);
                        SendToSimuNUS("setAppointments", newAppointments);
                      }
                      break;
                    case "Cancel":
                      {
                        const newAppointments = appointments.filter(
                          (_a, idx) => idx !== currentIndex
                        );
                        setAppointments(newAppointments);
                        SendToSimuNUS("setAppointments", newAppointments);
                        setCurrentIndex(null);
                      }
                      break;
                    case "Reschedule":
                      {
                        applyCurrentAppointment();
                      }
                      break;
                  }
                }}
                onReturnHome={function (): void {
                  setPage(0);
                }}
              ></UHCAppointmentConfirm>
            );
          case 4:
            return (
              <UHCBookingComplete
                appointment={currentAppointment}
                onReturnHome={() => setPage(0)}
              ></UHCBookingComplete>
            );
          case 5:
            return (
              <UHCCheckIn
                appointment={currentAppointment}
                onBack={() => {
                  updateCurrentAppointment({
                    ...currentAppointment,
                    status: "Waiting",
                  });
                  setPage(0);
                }}
              ></UHCCheckIn>
            );
        }
      })()}
    </div>
  );
};

export default UHCMain;
