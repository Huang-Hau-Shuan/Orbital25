using UnityEngine;
using UnityEngine.SceneManagement;

public class MainMenu : MonoBehaviour
{
    public static bool SimuNUS_connected = false;
    public void Awake()
    {
        MessageBridge.RegisterUnityMessageHandler("SimuNUS_hello", gameObject.name, "HandleHelloMsg", true);
    }
    public void Start()
    {
        //Debug.Log("Sending hello message to SimuNUS backend...");
        MessageBridge.SendToSimuNUS("unity_hello", "");
    }
    public void HandleHelloMsg()
    {
        SimuNUS_connected = true;
        Debug.Log("Received hello message from SimuNUS backend");
    }
    public void OnClickStart()
    {
        SceneManager.LoadScene(1); // Loads scene 1 (main game scene)
    }

    public void OnClickLoad()
    {
        MessageBridge.LoadGame(); // Calls load game functionality
    }

    public void OnClickSettings()
    {
        Debug.Log("Settings not implemented (placeholder)");
    }

    public void OnClickExit()
    {
        MessageBridge.ExitGame(); // Exits game or stops play mode in Editor
    }
}