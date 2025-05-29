using UnityEngine;
using UnityEngine.SceneManagement;
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
    public static bool SceneExists(string sceneName)
    {
        int sceneCount = SceneManager.sceneCountInBuildSettings;

        for (int i = 0; i < sceneCount; i++)
        {
            string path = SceneUtility.GetScenePathByBuildIndex(i);
            string name = System.IO.Path.GetFileNameWithoutExtension(path);
            if (name == sceneName)
                return true;
        }

        return false;
    }

    public static string GetSceneName(int sceneIndex)
    {
        return System.IO.Path.GetFileNameWithoutExtension(SceneUtility.GetScenePathByBuildIndex(sceneIndex));
    }
}