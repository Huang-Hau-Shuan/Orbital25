import type { RegistrationProps } from "./MainMenuPage";
import AddressSection, { type AddressEntry } from "./AddressSection";
import { useEffect, useState } from "react";

export const emptyAddress: (type: string) => AddressEntry = (type) => ({
  type,
  lines: ["", ""],
  country: "",
  postal: "",
});

const AddressesPage: React.FC<RegistrationProps> = ({
  markComplete,
  static: isStatic,
  data,
  updateData,
  profile,
}) => {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingPaymentIdx, setEditingPaymentIdx] = useState<number | null>(
    null
  );
  useEffect(() => {
    const verifyAddress = (addr: AddressEntry) =>
      addr.country &&
      addr.lines.length > 0 &&
      addr.lines.every(Boolean) &&
      addr.postal.length > 0 &&
      addr.country.length > 0;
    const hasHome = data.addresses.some((add) => add.type === "Home");
    const hasMail = data.addresses.some((add) => add.type === "Mail");
    const hasPayment = data.paymentAddresses.length > 0;
    markComplete(
      data.addresses.every(verifyAddress) &&
        data.paymentAddresses.every(verifyAddress) &&
        hasHome &&
        hasMail &&
        hasPayment
    );
  }, [data.addresses, data.paymentAddresses]);

  return (
    <>
      <h4 className="section-title">Addresses</h4>
      {!isStatic && (
        <>
          <div className="reg-note">
            You can add a new address if there is no address shown. For changes
            to an address, please click 'Edit'
          </div>
          <strong className="reg-note">
            Please note that for Singapore address, it is compulsory to provide
            6-digit postal code and Unit/House Number (if applicable)
          </strong>
        </>
      )}

      <AddressSection
        profile={profile}
        addresses={data.addresses}
        editingIndex={isStatic ? null : editingIdx}
        isStatic={isStatic}
        onEdit={setEditingIdx}
        onDelete={(i) =>
          updateData({
            ...data,
            addresses: data.addresses.filter((_val, idx) => i !== idx),
          })
        }
        onUpdate={(i, updated) =>
          updateData({
            ...data,
            addresses: data.addresses.map((add, idx) =>
              i === idx ? updated : add
            ),
          })
        }
        onAdd={
          isStatic
            ? undefined
            : () => {
                const old_length = data.addresses.length;
                updateData({
                  ...data,
                  addresses: [...data.addresses, emptyAddress("Address Type")],
                });
                setEditingIdx(old_length);
              }
        }
      />

      <AddressSection
        profile={profile}
        addresses={data.paymentAddresses}
        isPayment
        isStatic={isStatic}
        editingIndex={isStatic ? null : editingPaymentIdx}
        onEdit={setEditingPaymentIdx}
        onDelete={(i) =>
          updateData({
            ...data,
            paymentAddresses: data.paymentAddresses.filter(
              (_val, idx) => i !== idx
            ),
          })
        }
        onUpdate={(i, updated) =>
          updateData({
            ...data,
            paymentAddresses: data.paymentAddresses.map((add, idx) =>
              i === idx ? updated : add
            ),
          })
        }
        onAdd={
          isStatic
            ? undefined
            : () => {
                const old_length = data.paymentAddresses.length;
                updateData({
                  ...data,
                  paymentAddresses: [
                    ...data.paymentAddresses,
                    emptyAddress("Payment"),
                  ],
                });
                setEditingPaymentIdx(old_length);
              }
        }
      />
    </>
  );
};

export default AddressesPage;
