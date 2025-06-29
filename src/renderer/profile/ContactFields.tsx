import { Grid } from "@mui/material";
import type { FieldsProps } from "./PlayerProfile";
import GridInput from "./GridInput";
import { filterNumber, randomDigits, validateEmail } from "../../safeUtils";

const randomEmail = () => `${randomDigits(10)}@example.com`;
const randomMobile = () => "8" + randomDigits(7);

export default function ContactFields({ form, onChange }: FieldsProps) {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <GridInput
        size={5}
        label="Mobile Number"
        value={form.mobile}
        onChange={(val) => onChange("mobile", filterNumber(val))}
        random={randomMobile}
      ></GridInput>
      <GridInput
        size={1}
        label="Extention"
        value={form.mobileExt}
        onChange={(val) => onChange("mobileExt", "+" + filterNumber(val))}
        varify={(val) => {
          return filterNumber(val).length > 0;
        }}
      />
      <GridInput
        size={6}
        label="Personal Email"
        value={form.personalEmail}
        onChange={(val) => onChange("personalEmail", val)}
        random={randomEmail}
        varify={validateEmail}
      />
    </Grid>
  );
}
