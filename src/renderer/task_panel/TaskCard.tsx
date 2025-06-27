import { Card, CardContent, Typography, Chip, Button } from "@mui/material";
import {
  formatDateTime,
  TaskStatus,
  type TaskCompletion,
  type TaskDetail,
} from "../../types";
import TaskProgress from "./TaskProgress";
import { dbgErr, SendToSimuNUS } from "../MessageBridge";
const statusText = {
  [TaskStatus.NotStarted]: "Not Started",
  [TaskStatus.Ongoing]: "In Progress",
  [TaskStatus.Finished]: "Completed",
  [TaskStatus.Failed]: "Failed",
  [TaskStatus.Waiting]: "Waiting",
};
type MuiColors =
  | "default"
  | "primary"
  | "success"
  | "error"
  | "secondary"
  | "info"
  | "warning";
const statusColor: Record<number, MuiColors> = {
  [TaskStatus.NotStarted]: "default",
  [TaskStatus.Ongoing]: "primary",
  [TaskStatus.Finished]: "success",
  [TaskStatus.Failed]: "error",
  [TaskStatus.Waiting]: "secondary",
};
interface TaskCardProps {
  task: TaskCompletion;
  detail: TaskDetail;
}
const TaskCard = ({ task, detail }: TaskCardProps) => {
  if (task === undefined) {
    dbgErr("TaskCard: task is undefined");
    return null;
  }
  if (detail === undefined) {
    dbgErr("TaskCard: detail is undefined");
    return null;
  }
  return (
    <Card variant="outlined" sx={{ mb: 2, border: "solid 2px grey" }}>
      <CardContent>
        <Typography variant="h6">{task.name}</Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
          {detail?.description || "No description available."}
        </Typography>
        <Chip
          color={statusColor[task.status]}
          label={statusText[task.status]}
        />
        {task.status === TaskStatus.Waiting && task.scheduled && (
          <Typography variant="body2" color="secondary">
            {"Avaible at " + formatDateTime(task.scheduledTime)}
          </Typography>
        )}
        {(task.status === TaskStatus.NotStarted ||
          task.status === TaskStatus.Waiting) && (
          <Button
            sx={{
              backgroundColor: "yellow",
              border: "solid 2px black",
              margin: 1,
            }}
            onClick={() => SendToSimuNUS("debugStartTask", task.name)}
          >
            DEBUG: Start Now
          </Button>
        )}
        <TaskProgress
          completed={task.status === TaskStatus.Finished}
          steps={task.steps}
          stepDetails={detail.steps}
        />
      </CardContent>
    </Card>
  );
};
export default TaskCard;
