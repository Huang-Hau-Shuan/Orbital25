import { Grid, TextField } from "@mui/material";
import type { FieldsProps } from "./PlayerProfile";

export default function BirthdayMajorFields({ form, onChange }: FieldsProps) {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={6}>
        <TextField
          label="Birthday (dd/mm/yyyy)"
          fullWidth
          value={form.birthday}
          onChange={(e) => onChange("birthday", e.target.value)}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="Major"
          fullWidth
          value={form.major}
          onChange={(e) => onChange("major", e.target.value)}
        />
      </Grid>
    </Grid>
  );
}
