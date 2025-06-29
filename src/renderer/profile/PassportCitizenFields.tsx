import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import type { FieldsProps } from "./PlayerProfile";
import NRIC from "singapore-nric";
import GridInput from "./GridInput";
import countries from "i18n-iso-countries";
import encountries from "i18n-iso-countries/langs/en.json";
const randomPassport = () =>
  `E${Math.floor(10000000 + Math.random() * 90000000)}`;
countries.registerLocale(encountries);
export default function PassportCitizenFields({ form, onChange }: FieldsProps) {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <GridInput
        size={6}
        label="Nationality"
        value={form.nationality}
        onChange={(e) => {
          if ((e.length === 2 || e.length === 3) && e.toUpperCase() == e) {
            const name = countries.getName(e, "en");
            if (name) {
              onChange("nationality", name);
              if (name == "Singapore") onChange("isSingaporean", true);
              return;
            }
          }
          onChange("nationality", e);
        }}
        varify={(val) => countries.getAlpha3Code(val, "en") !== undefined}
      />
      <Grid size={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.isSingaporean}
              onChange={(e) => {
                if (form.nationality != "Singapore")
                  onChange("isSingaporean", e.target.checked);
              }}
            />
          }
          label="Singaporean / PR"
        />
      </Grid>
      <GridInput
        size={6}
        label="Passport Number"
        value={form.passport}
        onChange={(e) => onChange("passport", e)}
        random={randomPassport}
      />
      <GridInput
        size={6}
        label="NRIC / FIN"
        value={form.finOrNric}
        onChange={(e) => onChange("finOrNric", e)}
        random={() => NRIC.Generate(form.isSingaporean ? "T" : "M").toString()}
        varify={(val) =>
          NRIC.Validate(val) &&
          (form.isSingaporean
            ? val.startsWith("T") || val.startsWith("S")
            : val.startsWith("M") || val.startsWith("F") || val.startsWith("G"))
        }
      />
    </Grid>
  );
}
