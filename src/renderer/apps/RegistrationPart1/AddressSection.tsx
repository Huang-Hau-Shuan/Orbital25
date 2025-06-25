import React from "react";
import GuideInput from "../GuideInput";
import type { PlayerProfile } from "../../../types";
import GuideButton from "../GuideButton";

export interface AddressEntry {
  type: string;
  lines: string[];
  country: string;
  postal: string;
}

interface AddressSectionProps {
  addresses: AddressEntry[];
  onUpdate: (index: number, updated: AddressEntry) => void;
  onEdit: (index: number | null) => void;
  onDelete?: (index: number) => void;
  onAdd?: () => void;
  isPayment?: boolean;
  editingIndex: number | null;
  isStatic?: boolean;
  profile: PlayerProfile;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  addresses,
  onUpdate,
  onEdit,
  onDelete,
  onAdd,
  isPayment = false,
  editingIndex,
  isStatic = false,
  profile,
}) => {
  return (
    <div className="address-section">
      <table className="address-table">
        <thead>
          <tr>
            {!isPayment && <th>Address Type</th>}
            <th>{isPayment ? "Payment Address" : "Address"}</th>
            {!isStatic && <th></th>}
          </tr>
        </thead>
        <tbody>
          {addresses.map((addr, idx) => {
            const editing = editingIndex === idx && !isStatic;

            return (
              <tr key={idx}>
                {!isPayment && (
                  <td>
                    {editing ? (
                      <input
                        value={addr.type}
                        placeholder="Type (e.g. Mail, Home, Hostel)"
                        style={{ maxWidth: 100 }}
                        onChange={(e) =>
                          onUpdate(idx, { ...addr, type: e.target.value })
                        }
                      />
                    ) : (
                      <div>{addr.type}</div>
                    )}
                  </td>
                )}
                <td>
                  {editing ? (
                    <>
                      {addr.lines.map((line, i) => (
                        <div key={i}>
                          <GuideInput
                            id={`address${isPayment ? "-payment" : ""}-${
                              idx + 1
                            }-edit-line-${i + 1}`}
                            placeholder={"Address Line " + (i + 1)}
                            value={line}
                            onChange={(e) => {
                              const lines = [...addr.lines];
                              lines[i] = e.target.value;
                              onUpdate(idx, { ...addr, lines });
                            }}
                          />
                        </div>
                      ))}
                      <div>
                        <GuideInput
                          id={`address${isPayment ? "-payment" : ""}-${
                            idx + 1
                          }-edit-country`}
                          value={addr.country}
                          placeholder="Country"
                          onChange={(e) =>
                            onUpdate(idx, { ...addr, country: e.target.value })
                          }
                          guidePrompt={profile.nationality}
                          verify={(i) => typeof i === "string" && i.length > 0}
                        />
                        <GuideInput
                          id={`address${isPayment ? "-payment" : ""}-${
                            idx + 1
                          }-edit-postal-code`}
                          value={addr.postal}
                          placeholder="Postal Code"
                          type="text"
                          onChange={(e) =>
                            onUpdate(idx, { ...addr, postal: e.target.value })
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {addr.lines.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                      {addr.country} {addr.postal}
                    </>
                  )}
                </td>
                {!isStatic && (
                  <td className="action-buttons">
                    {editing ? (
                      <GuideButton
                        originalTag="button"
                        id={`address${isPayment ? "-payment" : ""}-${
                          idx + 1
                        }-save`}
                        className="reg-button"
                        onClick={() => onEdit(null)}
                      >
                        save
                      </GuideButton>
                    ) : (
                      <>
                        <GuideButton
                          id={`address${isPayment ? "-payment" : ""}-${
                            idx + 1
                          }-edit`}
                          originalTag="button"
                          className="reg-button"
                          onClick={() => onEdit(idx)}
                        >
                          edit
                        </GuideButton>
                        <button
                          className="reg-button"
                          onClick={() => onDelete?.(idx)}
                        >
                          delete
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {!isStatic && onAdd && (
        <div style={{ marginTop: 20 }}>
          <button className="reg-button" onClick={onAdd}>
            {isPayment ? "ADD PAYMENT ADDRESS" : "ADD A NEW ADDRESS"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressSection;
