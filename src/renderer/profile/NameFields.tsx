import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import type { FieldsProps } from "./PlayerProfile";
import GridInput from "./GridInput";

export default function NameFields({ form, onChange }: FieldsProps) {
  return (
    <Grid container spacing={2}>
      <GridInput
        size={6}
        label="First Name"
        value={form.firstName}
        onChange={(val) => onChange("firstName", val)}
      />
      <GridInput
        size={6}
        label="Last Name"
        value={form.lastName}
        onChange={(val) => onChange("lastName", val)}
      />
      <Grid size={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.firstNameBefore}
              onChange={(e) => onChange("firstNameBefore", e.target.checked)}
            />
          }
          label="First name comes before last name"
        />
      </Grid>

      <Typography sx={{ mb: 5 }}>
        {form.firstNameBefore
          ? `Full name: ${form.firstName} ${form.lastName}`
          : `Full name: ${form.lastName} ${form.firstName}`}
      </Typography>
    </Grid>
  );
}
