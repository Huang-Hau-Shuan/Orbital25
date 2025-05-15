using UnityEngine;
using UnityEngine.SceneManagement;

public class InGameMenu : MonoBehaviour
{
    public void OnSaveClicked()
    {
        MessageBridge.SaveGame();
    }

    public void OnLoadClicked()
    {
        MessageBridge.LoadGame();
        toggle(false);
    }

    public void OnReturnToGameClicked()
    {
        toggle(false);
    }

    public void OnSettingsClicked()
    {
        Debug.Log("Open Settings (placeholder)");
        //TODO: Jump to settings scene
        toggle(false);
    }

    public void OnExitToMainMenuClicked()
    {
        toggle(false);
        SceneManager.LoadScene(0); //0: MainMenu
    }

    public void OnExitGameClicked()
    {
        MessageBridge.ExitGame();
    }
    public void toggle(bool active)
    {
        if (active) {
            Time.timeScale = 0.0f;
        }
        else
        {
            Time.timeScale = 1.0f;
        }
        gameObject.SetActive(active);
    }
}
