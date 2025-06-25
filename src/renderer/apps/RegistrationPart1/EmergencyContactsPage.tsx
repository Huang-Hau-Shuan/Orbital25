import { useEffect } from "react";
import type { RegistrationProps } from "./MainMenuPage";
import GuideInput from "../GuideInput";
import GuideButton from "../GuideButton";

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  ext: string;
  isPrimary: boolean;
  editing?: boolean;
}

const EmergencyContactsPage: React.FC<RegistrationProps> = ({
  markComplete,
  static: isStatic,
  data,
  updateData,
}) => {
  const contacts = data.emergencyContacts;

  const setContacts = (updated: EmergencyContact[]) => {
    updateData({ ...data, emergencyContacts: updated });
  };

  const setPrimary = (index: number) => {
    setContacts(contacts.map((c, i) => ({ ...c, isPrimary: i === index })));
  };

  const handleEdit = (index: number) => {
    setContacts(
      contacts.map((c, i) => (i === index ? { ...c, editing: true } : c))
    );
  };

  const handleSave = (index: number) => {
    setContacts(
      contacts.map((c, i) => (i === index ? { ...c, editing: false } : c))
    );
  };

  const updateField = (
    index: number,
    field: keyof EmergencyContact,
    value: string
  ) => {
    setContacts(
      contacts.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const deleteContact = (index: number) => {
    setContacts(contacts.filter((_c, i) => i !== index));
  };

  const addContact = () => {
    setContacts([
      ...contacts,
      {
        name: "",
        relationship: "",
        phone: "",
        ext: "",
        isPrimary: !contacts.some((i) => i.isPrimary),
        editing: true,
      },
    ]);
  };

  useEffect(() => {
    const complete =
      contacts.length > 0 &&
      contacts.every(
        (c) => !c.editing && c.name && c.phone && c.relationship
      ) &&
      contacts.some((c) => c.isPrimary);
    markComplete(complete);
  }, [contacts]);

  return (
    <div className="phone-form">
      <h4 className="section-title">Emergency Contacts</h4>
      <p>
        Below is a list of your emergency contacts.
        {!isStatic && (
          <>
            {" "}
            To edit the information for a contact, select the Edit button. To
            add a contact, select the Add an Emergency Contact button.
          </>
        )}
      </p>
      <table>
        <thead>
          <tr>
            <th>Primary Contact</th>
            <th>Contact Name</th>
            <th>Relationship</th>
            <th>Phone</th>
            <th>Extension</th>
            {!isStatic && <th></th>}
            {!isStatic && <th></th>}
          </tr>
        </thead>
        <tbody>
          {contacts.map((c, i) => (
            <tr key={i}>
              <td style={{ textAlign: "center" }}>
                {isStatic ? (
                  c.isPrimary ? (
                    "✓"
                  ) : (
                    ""
                  )
                ) : (
                  <input
                    type="radio"
                    name="primary"
                    checked={c.isPrimary}
                    onChange={() => setPrimary(i)}
                  />
                )}
              </td>
              {c.editing && !isStatic ? (
                <>
                  <td>
                    <GuideInput
                      id={`emergency-${i + 1}-name`}
                      style={{ maxWidth: 150 }}
                      value={c.name}
                      onChange={(e) => updateField(i, "name", e.target.value)}
                    />
                  </td>
                  <td>
                    <GuideInput
                      id={`emergency-${i + 1}-relationship`}
                      value={c.relationship}
                      style={{ maxWidth: 100 }}
                      onChange={(e) =>
                        updateField(i, "relationship", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <GuideInput
                      id={`emergency-${i + 1}-number`}
                      value={c.phone}
                      style={{ maxWidth: 100 }}
                      onChange={(e) => updateField(i, "phone", e.target.value)}
                    />
                  </td>
                  <td>
                    <GuideInput
                      id={`emergency-${i + 1}-ext`}
                      style={{ maxWidth: 30 }}
                      value={c.ext}
                      onChange={(e) => updateField(i, "ext", e.target.value)}
                    />
                  </td>
                  <td>
                    <GuideButton
                      originalTag="button"
                      id={`emergency-save-${i + 1}`}
                      className="reg-button"
                      onClick={() => handleSave(i)}
                    >
                      save
                    </GuideButton>
                  </td>
                </>
              ) : (
                <>
                  <td>{c.name}</td>
                  <td>{c.relationship}</td>
                  <td>{c.phone}</td>
                  <td>{c.ext}</td>
                  {!isStatic && (
                    <>
                      <td>
                        <button
                          className="reg-button"
                          onClick={() => handleEdit(i)}
                        >
                          edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="reg-button"
                          onClick={() => deleteContact(i)}
                        >
                          delete
                        </button>
                      </td>
                    </>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!isStatic && (
        <GuideButton
          id="add-emergency-contact"
          originalTag="button"
          className="reg-button"
          onClick={addContact}
        >
          ADD AN EMERGENCY CONTACT
        </GuideButton>
      )}
    </div>
  );
};

export default EmergencyContactsPage;
