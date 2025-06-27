import { useState } from "react";
import GuideButton from "../GuideButton";
import type { AuthProps } from "./AuthorisationRequirementsPage";

const AuthorisationRepresentativePage: React.FC<AuthProps> = ({
  setComplete,
}) => {
  const [checked, setChecked] = useState(0);
  return (
    <div className="subpage">
      <h3>
        Appointment of Local (Singapore-Based) Representative [For International
        Students Only]
      </h3>

      <p>
        <strong>Please choose one:</strong>
      </p>
      <div className="radio-group">
        <GuideButton id="auth-repr">
          <label>
            <input
              type="radio"
              name="repr"
              checked={checked == 1}
              onChange={() => {
                setChecked(1);
                setComplete(true);
              }}
            />
            I will not be appointing a local representative to authorise or
            refuse consent for any surgery or other medical procedures or
            treatment on me, on my behalf.
          </label>
        </GuideButton>
        <label>
          <input
            type="radio"
            name="repr"
            value="no"
            checked={checked == 2}
            onChange={() => {
              setChecked(2);
              setComplete(true);
            }}
          />
          I appoint the person named below as my local representative* with the
          authority to authorise or refuse consent for any surgery or other
          medical procedures or treatment on me, on my behalf.
        </label>
      </div>

      <p>
        In so doing, I, for myself, my successors, personal representatives and
        assigns hereby agree that:
      </p>
      <ol>
        <li>
          I will not hold the University, its officers, any of its full-time or
          part-time staff (including student assistants), agents or volunteers
          responsible or liable in any way for, and no right of action shall
          arise from, any loss or damage (including, without limitations,
          personal injury, loss of life or property damage) caused by or
          sustained as a result of my local representative's authorisation or
          refusal of consent for any surgery or other medical procedures or
          treatment.
        </li>
        <li>
          I will indemnify and keep indemnified, save and hold harmless the
          University, its officers, any of its full-time or part-time staff
          (including student assistants), agents or volunteers against all
          losses, claims, demands, actions, proceedings, damages, costs or
          expenses, including legal fees, and any other liability arising from
          my local representative's authorisation or refusal of consent for any
          surgery or other medical procedures or treatment.
        </li>
      </ol>
      <p className="note-text">
        * The local representative to be appointed must be at least 18 years of
        age.
      </p>
      {checked == 2 && <h4>[Local Representative Not Implemented]</h4>}
    </div>
  );
};

export default AuthorisationRepresentativePage;
