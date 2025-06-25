import React, { useState, useEffect } from "react";
import type { AuthProps } from "./AuthorisationRequirementsPage";
import GuideButton from "../GuideButton";

const riskItems = [
  `I will abide by the applicable rules and regulations established or prescribed from time to time by, and comply with any instructions and directions of, the University or its departments, faculties, schools, offices, hostels or relevant units regarding participation in the University activities and/or the use of the University facilities.`,
  `While reasonable precaution and care will be taken by the University to ensure my safety, I understand that I am taking part in the University activities and using the University facilities at my own risk. I will co-operate fully with the University and conduct myself at all times in a safe and responsible manner, failing which I acknowledge and agree that the University has the right at any time to withdraw my participation in the University activities and/or use of the University facilities.`,
  `Unless caused by the University's negligence, I acknowledge and agree that the University will not be held liable for any injury or death or for any property loss or damage I sustain as a result of my participation in the University activities and/or use of the University facilities.`,
  `I will indemnify and keep indemnified the University against all losses, damages, claims, proceedings, costs or expenses, and any other liability which may be suffered or incurred by the University arising from my negligence while participating in the University activities and/or using the University facilities.`,
];

const AuthorisationRiskPage: React.FC<AuthProps> = ({ setComplete }) => {
  const [checked, setChecked] = useState<boolean[]>(
    Array(riskItems.length).fill(false)
  );

  useEffect(() => {
    setComplete(checked.every((i) => i));
  }, [checked]);

  const toggle = (i: number) => {
    const updated = [...checked];
    updated[i] = !updated[i];
    setChecked(updated);
  };

  return (
    <div className="subpage">
      <h3>Risk Acknowledgement and Consent</h3>
      <p>
        I understand that I may participate in activities (whether local or
        overseas) organised or endorsed by the University as part of my course
        of study or as part of co-curricular activities or courses offered by
        the University, including, but not limited to, orientation activities,
        overseas community service, exchange or enrichment programmes,
        fieldtrips, internships or industrial attachments (referred to as
        "University activities"). I may also be accommodated in the University's
        hostels or may use the University's sports, recreational and other
        facilities (referred to as "University facilities").
      </p>
      <p>
        <strong>In consideration of my admission to the University:</strong>
      </p>
      {riskItems.map((text, i) => (
        <GuideButton id={`risk-${i + 1}`}>
          <label key={i} className="checkbox-line">
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={() => toggle(i)}
            />
            {text}
          </label>
        </GuideButton>
      ))}
    </div>
  );
};

export default AuthorisationRiskPage;
