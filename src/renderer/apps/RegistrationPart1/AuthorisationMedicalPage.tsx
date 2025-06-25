import GuideButton from "../GuideButton";
import type { AuthProps } from "./AuthorisationRequirementsPage";

const AuthorisationMedicalPage: React.FC<AuthProps> = ({
  complete,
  setComplete,
}) => {
  return (
    <div className="subpage">
      <h3>
        Authorisation of Medical Procedures [For International Students Only]
      </h3>

      <p>
        <strong>Please choose one:</strong>
      </p>
      <div className="radio-group">
        <GuideButton id="auth-med">
          <label>
            <input
              type="radio"
              name="medical"
              checked={complete}
              onChange={() => setComplete(true)}
            />
            I authorise
          </label>
        </GuideButton>
        <label>
          <input
            type="radio"
            name="medical"
            checked={!complete}
            onChange={() => setComplete(false)}
          />
          I do not authorise
        </label>
      </div>

      <p>
        National University of Singapore, its officers, staff or any other
        authorised personnel to authorise or refuse consent for any surgery or
        other medical procedures or treatment on me, on my behalf, and
      </p>
      <ol>
        <li>
          I will not hold the University, its officers, staff or any other
          authorised personnel responsible or liable in any way for, and no
          right of action shall arise from, any loss or damage (including,
          without limitation and to the extent permissible by law, personnel
          injury, loss of life or property damage) caused by or sustained as a
          result of the performance or non-performance of any surgery or other
          medical procedures or treatment on me.
        </li>
        <li>
          I will indemnify and keep indemnified, save and hold harmless the
          University, its officers, staff or any other authorised personnel
          against all losses, claims, demands, actions, proceedings, damages,
          costs or expenses, including legal fees, and any other liability
          arising in any way from the performance or non-performance of any
          surgery or other medical procedures or treatment on me.
        </li>
      </ol>
    </div>
  );
};

export default AuthorisationMedicalPage;
