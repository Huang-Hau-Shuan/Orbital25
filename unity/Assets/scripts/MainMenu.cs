using UnityEngine;
using UnityEngine.SceneManagement;

public class MainMenu : MonoBehaviour
{
    
    public void OnClickStart()
    {
        GameDataManager.instance.NewGame();
    }

    public void OnClickLoad()
    {
        MessageBridge.LoadGame(); // send get game data to main
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