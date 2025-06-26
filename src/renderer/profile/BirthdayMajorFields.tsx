import { Grid } from "@mui/material";
import type { FieldsProps } from "./PlayerProfile";
import GridInput from "./GridInput";
import { getRandomDate, isValidDate } from "../../safeUtils";

export default function BirthdayMajorFields({ form, onChange }: FieldsProps) {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <GridInput
        size={6}
        label="Birthday (dd/mm/yyyy)"
        value={form.birthday}
        onChange={(val) => onChange("birthday", val)}
        varify={isValidDate}
        random={() => getRandomDate("01/01/2003", "01/06/2007")}
      />
      <GridInput
        size={6}
        label="Major"
        value={form.major}
        onChange={(val) => onChange("major", val)}
      />
    </Grid>
  );
}
