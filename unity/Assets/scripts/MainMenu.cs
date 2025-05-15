using UnityEngine;
using UnityEngine.SceneManagement;

public class MainMenu : MonoBehaviour
{
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