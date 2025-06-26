import React, { useState } from "react";
import type { ServiceType, SubServiceType } from "./main";
import GuideButton from "../GuideButton";

interface BookingStepOneProps {
  service: ServiceType;
  setService: (value: ServiceType) => void;
  subService: SubServiceType;
  setSubService: (value: SubServiceType) => void;
  onProceed: () => void;
  onBack: () => void;
  isSingaporean: boolean;
}

const services = [
  "Medical Examination",
  "Specialist Consultation",
  "Consultation",
  "Nursing",
];
const subServiceOptions: Record<string, string[]> = {
  "Medical Examination": [
    "Pre-admission Medical Exam",
    "Staff Employment & Other Medical Exam",
  ],
  "Specialist Consultation": ["Orthopedic", "Physiotherapy", "Psychiatric"],
  Consultation: ["General Consultation"],
  Nursing: [
    "HPV (Gardasil 9) Vaccination",
    "Shingrix Vaccination",
    "Vaccination / Procedure / Laboratory Tests",
  ],
};
const packageOptions = [
  "Standard Medical Examination with Student Pass Examination",
  "Student Pass Examination Only",
  "Standard Medical Examination",
];
const centre = "University Health Center";
const BookingStepOne: React.FC<BookingStepOneProps> = ({
  service,
  setService,
  subService,
  setSubService,
  onProceed,
  onBack,
  isSingaporean,
}) => {
  const [selectedPackage, setSelectedPackage] = useState(packageOptions[0]);
  return (
    <div className="uhc-booking-container">
      <div className="uhc-booking-title">
        Welcome to UHC Online Appointment Services
      </div>
      <div className="uhc-booking-box">
        <div className="uhc-booking-instruction">
          Please fill all the options below to proceed
        </div>
        <GuideButton
          id="uhc-booking-select-service"
          originalTag="div"
          className="uhc-field-row"
        >
          <label className="uhc-booking-label">Service</label>
          <select
            className="uhc-booking-select"
            value={service ?? ""}
            onChange={(e) =>
              setService(
                e.target.value ? (e.target.value as ServiceType) : null
              )
            }
          >
            <option value="" disabled>
              --Select--
            </option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </GuideButton>
        {service !== null && (
          <GuideButton
            id="uhc-booking-select-subservice"
            originalTag="div"
            className="uhc-field-row"
          >
            <label className="uhc-booking-label">Sub Service</label>
            <select
              className="uhc-booking-select"
              disabled={!service}
              value={subService ?? undefined}
              onChange={(e) =>
                setSubService(
                  e.target.value ? (e.target.value as SubServiceType) : null
                )
              }
            >
              <option value="">--Select--</option>
              {subServiceOptions[service]?.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </GuideButton>
        )}
      </div>
      <div className="uhc-booking-box">
        <div className="uhc-field-row">
          <label className="uhc-booking-label">Please choose a slot by</label>
          <select className="uhc-booking-select">
            <option>{centre}</option>
          </select>
        </div>
      </div>
      {subService === "Pre-admission Medical Exam" && (
        <div className="uhc-booking-box">
          <GuideButton
            id="uhc-booking-select-package"
            originalTag="div"
            className="uhc-field-row"
          >
            <label className="uhc-booking-label">Packages</label>
            <select
              className="uhc-booking-select"
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
            >
              <option value="">--Select--</option>
              {packageOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </GuideButton>
        </div>
      )}
      <div className="uhc-terms">
        <h2>Terms & Conditions</h2>
        <ul>
          <li>
            Once you have scheduled a confirmed appointment, any payment made is
            non-refundable. You may change the appointment 24 hours prior to the
            confirmed appointment date (please refer to the <a href="#">FAQ</a>
            ), thereafter rescheduling is not allowed.
          </li>
          <li>
            Personal data provided by the Attendees may be used by NUS for the
            purposes of the Event/service provided and communicating with the
            Attendees. By registering in the Event, you are deemed to have given
            your consent to the processing of your personal data by NUS and/or
            its service providers in connection with the Event/service provided.
            You acknowledge and agree to <a href="#">NUS' Privacy Notice</a> and
            its <a href="#">legal information and notices</a>.
          </li>
        </ul>
      </div>
      <div className="uhc-booking-buttons">
        <button className="uhc-booking-button back" onClick={onBack}>
          BACK
        </button>
        <GuideButton
          id="uhc-booking-proceed-1"
          originalTag="button"
          className="uhc-booking-button proceed"
          onClick={() => {
            const expectedPackage = isSingaporean
              ? packageOptions[2]
              : packageOptions[0];
            if (selectedPackage === expectedPackage) onProceed();
            else {
              alert(
                "You need to book " +
                  expectedPackage +
                  " to complete enrollment procedures"
              );
            }
          }}
          disabled={service === null || subService === null}
        >
          PROCEED
        </GuideButton>
      </div>
    </div>
  );
};

export default BookingStepOne;
