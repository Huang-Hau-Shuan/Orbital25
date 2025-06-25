import {
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  TaskStatus,
  type PlayerStep,
  type StepCompletion,
  type TaskStep,
} from "../../types";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { dbgWarn } from "../MessageBridge";
interface TaskProgressProps {
  steps: StepCompletion[];
  stepDetails: TaskStep[];
}
interface PlayerProgress {
  step: PlayerStep;
  stepID: number;
  playerStepID: number;
}
const GetDescription = (ps: PlayerStep) => {
  switch (ps.type) {
    case "click":
      return `Click ${ps.id}`; //TODO: replace with the name of the button
    case "input":
      return `Input ${ps.id}`; //TODO: replace with the name of the input
    case "goScene":
      return `Go to ${ps.scene}`;
    case "interact":
      switch (ps.object) {
        case "laptop":
          return "Open your laptop";
        default:
          return "Interact with " + ps.object;
      }
    default: {
      dbgWarn("Unknown or not implemented PlayerStep: " + JSON.stringify(ps));
      return "[Not implemented]";
    }
  }
};
const TaskProgress = ({ steps, stepDetails }: TaskProgressProps) => {
  const [expanded, setExpanded] = useState(false);
  const playerSteps: PlayerProgress[] = stepDetails
    .map((step, idx) => {
      if (Array.isArray(step.playerSteps) && step.playerSteps.length > 0) {
        return step.playerSteps.map((ps, psidx) => {
          return { step: ps, stepID: idx, playerStepID: psidx };
        });
      }
      return [];
    })
    .flat();
  const current = playerSteps.map(
    (s) =>
      steps[s.stepID].status === TaskStatus.Finished ||
      steps[s.stepID].playerCurrentStep > s.playerStepID
  );
  const completedStepCount = current.filter((c) => c).length;
  const total = playerSteps.length;
  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      <LinearProgress
        variant="determinate"
        value={(completedStepCount / total) * 100}
      />
      <Typography variant="caption">{`${completedStepCount}/${total} steps completed`}</Typography>
      <Tooltip title="Show Steps">
        <IconButton onClick={() => setExpanded((e: boolean) => !e)}>
          {completedStepCount > 0 &&
            (expanded ? <ExpandLess /> : <ExpandMore />)}
        </IconButton>
      </Tooltip>
      {expanded && completedStepCount > 0 && (
        <List sx={{ ml: 2 }}>
          {playerSteps.map((playerStep, idx) => (
            <ListItemText
              slotProps={{
                primary: {
                  fontSize: 12,
                  color: current[idx] ? "success" : "default",
                },
              }}
            >
              {GetDescription(playerStep.step)}
            </ListItemText>
          ))}
        </List>
      )}
    </Box>
  );
};
export default TaskProgress;
