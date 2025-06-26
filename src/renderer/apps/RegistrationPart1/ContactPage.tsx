import type { PhoneEntry, PhoneType } from "../../../types";
import GuideButton from "../GuideButton";
import GuideInput from "../GuideInput";
import type { RegistrationProps } from "./MainMenuPage";

const phoneTypeOptions: PhoneType[] = [
  "Home",
  "Mobile (Singapore)",
  "Mobile (Overseas)",
  "Office",
];

const ContactPage: React.FC<RegistrationProps> = ({
  markComplete,
  static: isStatic,
  data,
  updateData,
}) => {
  const phones = data.phoneNumbers;

  const updatePhone = (index: number, updated: Partial<PhoneEntry>) => {
    const newPhones = phones.map((entry, i) =>
      i === index ? { ...entry, ...updated } : entry
    );
    updateData({ ...data, phoneNumbers: newPhones });
  };

  const setPreferred = (index: number) => {
    const newPhones = phones.map((entry, i) => ({
      ...entry,
      preferred: i === index,
    }));
    updateData({ ...data, phoneNumbers: newPhones });
  };

  const addPhone = () => {
    updateData({
      ...data,
      phoneNumbers: [
        ...phones,
        {
          type: "Home",
          number: "",
          ext: "",
          preferred: !data.phoneNumbers.some((i) => i.preferred),
        },
      ],
    });
  };

  const deletePhone = (index: number) => {
    updateData({
      ...data,
      phoneNumbers: phones.filter((_val, i) => i !== index),
    });
  };

  const handleSave = () => {
    markComplete(
      phones.length >= 1 &&
        phones.every((phone) => phone.number) &&
        phones.some((phone) => phone.preferred)
    );
  };

  return (
    <div className="phone-form">
      <h4 className="section-title">Phone Numbers</h4>
      <p>Enter your phone numbers below.</p>
      <p>
        If multiple phone numbers are entered, specify your primary contact
        number by selecting the preferred checkbox.
      </p>
      <table>
        <thead>
          <tr>
            <th>*Phone Type</th>
            <th>*Telephone</th>
            <th style={{ maxWidth: 20 }}>Ext</th>
            <th>Preferred</th>
            {!isStatic && <th></th>}
          </tr>
        </thead>
        <tbody>
          {phones.map((entry, i) => (
            <tr key={i}>
              <td>
                {isStatic ? (
                  entry.type
                ) : (
                  <select
                    value={entry.type}
                    onChange={(e) =>
                      updatePhone(i, { type: e.target.value as PhoneType })
                    }
                  >
                    {phoneTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </td>
              <td>
                {isStatic ? (
                  entry.number
                ) : (
                  <GuideInput
                    id={`phone-${i + 1}-number`}
                    type="text"
                    value={entry.number}
                    onChange={(e) => updatePhone(i, { number: e.target.value })}
                  />
                )}
              </td>
              <td>
                {isStatic ? (
                  entry.ext
                ) : (
                  <GuideInput
                    id={`phone-${i + 1}-ext`}
                    value={entry.ext}
                    onChange={(e) => updatePhone(i, { ext: e.target.value })}
                  />
                )}
              </td>
              <td style={{ textAlign: "center" }}>
                {isStatic ? (
                  entry.preferred ? (
                    "✓"
                  ) : (
                    ""
                  )
                ) : (
                  <input
                    type="checkbox"
                    checked={entry.preferred}
                    onChange={() => setPreferred(i)}
                  />
                )}
              </td>
              {!isStatic && (
                <td>
                  <button className="reg-button" onClick={() => deletePhone(i)}>
                    DELETE
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!isStatic && (
        <>
          <div>
            <GuideButton
              originalTag="button"
              id="add-phone-number"
              className="reg-button"
              onClick={addPhone}
            >
              ADD A PHONE NUMBER
            </GuideButton>
          </div>
          <div>
            <GuideButton
              originalTag="button"
              id="save-phone-numbers"
              className="reg-button"
              onClick={handleSave}
            >
              SAVE
            </GuideButton>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactPage;
