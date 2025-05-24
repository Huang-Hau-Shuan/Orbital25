using UnityEngine;
public static class Utils
{
    public static bool _debug = true;
    public static bool SimuNUS_connected = false;
    public static void Log(string message)
    {
        if (_debug)
        {
            if (SimuNUS_connected)
            {
                MessageBridge.SendDebugMessage(message);
            }
            else
            {
                Debug.Log(message);
            }
        }
    }
    public static void LogError(string message)
    {
        if (_debug)
        {
            if (SimuNUS_connected)
            {
                MessageBridge.SendMessage("error", message);
            }
            else
            {
                Debug.LogError(message);
            }
        }
    }

    public static void LogWarning(string message)
    {
        if (_debug)
        {
            if (SimuNUS_connected)
            {
                MessageBridge.SendMessage("warn", message);
            }
            else
            {
                Debug.LogWarning(message);
            }
        }
    }
}