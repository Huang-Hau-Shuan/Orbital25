import { Grid, TextField, Button } from "@mui/material";
import { useState } from "react";
interface GridInputProps {
  size: number;
  label: string;
  value: string;
  onChange: (val: string) => void;
  varify?: (val: string) => boolean;
  random?: () => string;
}
const GridInput: React.FC<GridInputProps> = ({
  size,
  label,
  value,
  onChange,
  varify,
  random,
}) => {
  const [edited, setEdited] = useState(false);
  return (
    <Grid size={size}>
      <TextField
        label={label}
        fullWidth
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setEdited(true);
        }}
        slotProps={
          random
            ? {
                input: {
                  endAdornment: (
                    <Button
                      onClick={() => {
                        const val = random();
                        onChange(val);
                        setEdited(true);
                      }}
                    >
                      Random
                    </Button>
                  ),
                },
              }
            : undefined
        }
        color={
          edited
            ? (varify ? varify(value) : Boolean(value))
              ? "success"
              : "error"
            : "primary"
        }
      ></TextField>
    </Grid>
  );
};
export default GridInput;
