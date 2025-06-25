import {
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import type { FieldsProps } from "./PlayerProfile";
import NRIC from "singapore-nric";
const randomPassport = () =>
  `E${Math.floor(10000000 + Math.random() * 90000000)}`;

export default function PassportCitizenFields({ form, onChange }: FieldsProps) {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={6}>
        <TextField
          label="Nationality"
          fullWidth
          value={form.nationality}
          onChange={(e) => {
            onChange("nationality", e.target.value);
          }}
        />
      </Grid>
      <Grid size={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.nationality == "Singapore" || form.isSingaporean}
              onChange={(e) => {
                if (form.nationality != "Singapore")
                  onChange("isSingaporean", e.target.checked);
              }}
            />
          }
          label="Singaporean / PR"
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="Passport Number"
          fullWidth
          value={form.passport}
          onChange={(e) => onChange("passport", e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <Button onClick={() => onChange("passport", randomPassport())}>
                  Random
                </Button>
              ),
            },
          }}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="NRIC / FIN"
          fullWidth
          value={form.finOrNric}
          onChange={(e) => onChange("finOrNric", e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <Button
                  onClick={() =>
                    onChange(
                      "finOrNric",
                      NRIC.Generate(form.isSingaporean ? "T" : "M").toString()
                    )
                  }
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
