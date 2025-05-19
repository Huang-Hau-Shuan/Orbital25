using UnityEditor;
using UnityEngine;
using System.Runtime.InteropServices; //Necessary for DllImport
public static class MessageBridge
{
#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    public static extern void SendDebugMessage(string message);

    [DllImport("__Internal")]
    public static extern void ExitGame();

    [DllImport("__Internal")]
    public static extern void SaveGame();

    [DllImport("__Internal")]
    public static extern void LoadGame();

    [DllImport("__Internal")]
    public static extern void ShowSimulatedDesktop();

    [DllImport("__Internal")]
    public static extern void HideSimulatedDesktop();

    [DllImport("__Internal")]
    public static extern void SendToSimuNUS(string channel, string data);

    [DllImport("__Internal")]
    public static extern void RegisterUnityMessageHandler(string channel, string gameObjectName, string methodName, bool stringify);
#else
    public static void SendDebugMessage(string message)
    {
        Debug.Log($"Send debug message: {message} (placeholder)");
    }

    public static void ExitGame()
    {
#if UNITY_EDITOR
        EditorApplication.isPlaying = false;
#else
        Application.Quit();
#endif
    }

    public static void SaveGame()
    {
        Debug.Log("Save game (placeholder)");
    }

    public static void LoadGame()
    {
        Debug.Log("Load game (placeholder)");
    }

    public static void ShowSimulatedDesktop()
    {
        Debug.Log("Show simulated desktop (placeholder)");
    }

    public static void HideSimulatedDesktop()
    {
        Debug.Log("Hide simulated desktop (placeholder)");
    }

    public static void SendToSimuNUS(string channel, string data)
    {
        Debug.Log($"Send message on channel: {channel} with data: {(data ?? "null")} (placeholder)");
    }

    public static void RegisterUnityMessageHandler(string channel, string gameObjectName, string methodName, bool stringify)
    {
        Debug.Log($"Register message handler for channel: {channel}, gameObject: {gameObjectName}, method: {methodName}, stringify: {stringify} (placeholder)");
    }
#endif
}
