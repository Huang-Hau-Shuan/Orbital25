import { useEffect, useState } from "react";
import { Typography, Box, IconButton, Tooltip } from "@mui/material";
import { type TaskCompletion, type TaskDetail } from "../../types";
import {
  dbgErr,
  dbgWarn,
  onSimuNUSMessage,
  SendToSimuNUS,
} from "../MessageBridge";
import { isTaskCompletion } from "../../types.guard";
import TaskCard from "./TaskCard";
import { ChevronRight, TaskOutlined } from "@mui/icons-material";

const TaskPanel = () => {
  const [tasks, setTasks] = useState<TaskCompletion[]>([]);
  const [details, setDetails] = useState<TaskDetail[]>([]);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [isGame, setIsGame] = useState(false);
  useEffect(() => {
    onSimuNUSMessage("setTaskDetails", (tasks) => {
      if (Array.isArray(tasks)) {
        setDetails(tasks as TaskDetail[]);
      }
    });
    onSimuNUSMessage("setTaskCompletion", (tasks) => {
      if (
        Array.isArray(tasks) &&
        tasks.every((task) => isTaskCompletion(task))
      ) {
        setTasks(tasks);
      } else {
        dbgErr(`Invalid task completion: ${tasks}`);
      }
    });
    onSimuNUSMessage("sceneChanged", (scene: unknown) => {
      if (typeof scene !== "string") {
        dbgWarn(`TaskPanel: Received Invalid scene name ${scene}`);
        return;
      }
      setIsGame(scene !== "MainMenu");
    });
    SendToSimuNUS("getTaskCompletion");
    SendToSimuNUS("getTaskDetails");
  }, []);
  if (!isGame) return null;
  return (
    <Box
      sx={{
        position: "fixed",
        right: 0,
        top: panelExpanded ? 0 : 80,
        height: panelExpanded ? "100vh" : 40,
        width: panelExpanded ? 300 : 40,
        bgcolor: "white",
        boxShadow: 3,
        overflowY: panelExpanded ? "auto" : "hidden",
        zIndex: 1300,
        p: panelExpanded ? 2 : 0,
        transition: "all 0.3s",
        borderRadius: panelExpanded ? 0 : 5,
      }}
    >
      {panelExpanded ? (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" gutterBottom>
              Tasks
            </Typography>
            <Tooltip title="Minify">
              <IconButton onClick={() => setPanelExpanded(false)}>
                <ChevronRight />
              </IconButton>
            </Tooltip>
          </Box>
          {tasks.map((task, idx) => (
            <TaskCard key={task.name} task={task} detail={details[idx]} />
          ))}
        </>
      ) : (
        <Tooltip title="Expand Task Panel">
          <IconButton color="success" onClick={() => setPanelExpanded(true)}>
            <TaskOutlined />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default TaskPanel;
