using UnityEngine;
using UnityEngine.SceneManagement;

public class InGameMenu : MonoBehaviour
{

#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void SimuNUS_ExitGame();

    [DllImport("__Internal")]
    private static extern void SimuNUS_SaveGame();

    [DllImport("__Internal")]
    private static extern void SimuNUS_LoadGame();
#endif

    private void Start()
    {
        
    }
    private void Update()
    {
    }

    

    public void OnSaveClicked()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        SimuNUS_SaveGame();
#else
        Debug.Log("Save Game (placeholder)");
#endif
    }

    public void OnLoadClicked()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        SimuNUS_LoadGame();
#else
        Debug.Log("Load Game (placeholder)");
#endif
    }

    public void OnReturnToGameClicked()
    {
        gameObject.SetActive(!gameObject.activeSelf);
    }

    public void OnSettingsClicked()
    {
        Debug.Log("Open Settings");
        //TODO: Jump to settings scene
    }

    public void OnExitToMainMenuClicked()
    {
        Debug.Log("Exit to Main Menu");
        //TODO: Jump to main menu scene
    }

    public void OnExitGameClicked()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        SimuNUS_ExitGame();
#else
        Application.Quit();
#endif
        
    }
}
