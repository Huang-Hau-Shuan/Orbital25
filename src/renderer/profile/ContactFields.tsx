import { Grid, TextField, Button } from "@mui/material";
import type { FieldsProps } from "./PlayerProfile";

const randomDigits = (length: number) =>
  Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0");
const randomEmail = () => `player${randomDigits(4)}@example.com`;
const randomMobile = () => `+65${randomDigits(8)}`;

export default function ContactFields({ form, onChange }: FieldsProps) {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={6}>
        <TextField
          label="Mobile Number"
          fullWidth
          value={form.mobile}
          onChange={(e) => onChange("mobile", e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <Button onClick={() => onChange("mobile", randomMobile())}>
                  Random
                </Button>
              ),
            },
          }}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="Personal Email"
          fullWidth
          value={form.personalEmail}
          onChange={(e) => onChange("personalEmail", e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <Button
                  onClick={() => onChange("personalEmail", randomEmail())}
                >
                  Random
                </Button>
              ),
            },
          }}
        />
      </Grid>
    </Grid>
  );
}
