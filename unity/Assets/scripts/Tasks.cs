using System.Collections.Generic;
using System;

[Serializable]
public class TaskProgress
{
    public int id; // the id is its index in SimuNUS
    public bool started;
    public List<bool> completedSteps;
    public bool finished;

    public TaskProgress(int taskId, int stepCount)
    {
        id = taskId;
        started = false;
        finished = false;
        completedSteps = new List<bool>(capacity: stepCount);
        for (int i = 0; i < stepCount; i++)// all false initially
        {
            completedSteps[i] = false;
        }
    }
}
[Serializable]
public class TaskStep
{
    public string name;
    public List<string> dependOnStepIds;
}
[Serializable]
public class TaskDetail
{
    public string name;
    public string description;
    public List<TaskStep> steps;
}