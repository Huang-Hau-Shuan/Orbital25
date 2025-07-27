import { Box, Button, Alert, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import NameFields from "./NameFields";
import BirthdayMajorFields from "./BirthdayMajorFields";
import ContactFields from "./ContactFields";
import PassportCitizenFields from "./PassportCitizenFields";
import { dbgErr, onSimuNUSMessage, SendToSimuNUS } from "../MessageBridge";
import {
  defaultPlayerProfile,
  emptyPlayerProfile,
  type PlayerProfile,
} from "../../types";
import { checkInvalidProfile } from "../../safeUtils";

type ChangeCallback = (field: string, value: any) => void;
export interface FieldsProps {
  form: PlayerProfile;
  onChange: ChangeCallback;
}
export default function PlayerProfileForm() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(emptyPlayerProfile);
  const [err, setErr] = useState<null | string>(null);
  useEffect(() => {
    onSimuNUSMessage("newGame", () => {
      setShow(true);
    });
  }, []);
  const handleChange = (field: string, value: any) => {
    if (field in form) setForm((prev) => ({ ...prev, [field]: value }));
    else dbgErr("PlayerProfileForm.handleChange: Invalid field: " + field);
  };

  const handleSubmit = () => {
    const invalid = checkInvalidProfile(form);
    setErr(invalid);
    if (invalid === null) {
      SendToSimuNUS("initializePlayerProfile", form);
      SendToSimuNUS("setPlayerProfile", form);
      setShow(false);
    }
  };

  return show ? (
    <Box
      p={3}
      sx={{
        bgcolor: "white",
        position: "absolute",
        left: 0,
        right: 0,
        height: "100%",
        zIndex: 99999,
      }}
    >
      <Alert severity="warning" sx={{ mb: 3 }}>
        Please do <strong>NOT</strong> enter your real personal information.
        This is a simulation only.
      </Alert>

      <NameFields form={form} onChange={handleChange} />
      <BirthdayMajorFields form={form} onChange={handleChange} />
      <ContactFields form={form} onChange={handleChange} />
      <PassportCitizenFields form={form} onChange={handleChange} />
      {err && <Typography color="error">{`Invalid ${err}`}</Typography>}
      <Button
        variant="contained"
        onClick={handleSubmit}
        fullWidth
        sx={{ mt: 2 }}
      >
        Confirm Profile & Start Game
      </Button>

      {window.SimuNUS_API?._DEBUG && (
        <Button
          variant="contained"
          onClick={() => {
            setForm(defaultPlayerProfile);
          }}
          fullWidth
          sx={{ mt: 2, color: "yellow" }}
        >
          DEBUG: Use Default Profile
        </Button>
      )}
    </Box>
  ) : null;
}
