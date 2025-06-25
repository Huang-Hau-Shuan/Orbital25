import {
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import type { FieldsProps } from "./PlayerProfile";

export default function NameFields({ form, onChange }: FieldsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={6}>
        <TextField
          label="First Name"
          fullWidth
          value={form.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="Last Name"
          fullWidth
          value={form.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
        />
      </Grid>
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
