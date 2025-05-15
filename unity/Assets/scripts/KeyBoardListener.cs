using UnityEngine;
using UnityEngine.SceneManagement;

public class KeyBoardListener : MonoBehaviour
{
    public GameObject menuCanvas;

    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        if (menuCanvas != null)
        {
            menuCanvas.SetActive(false);
        }
        else
        {
            Debug.LogWarning("menuCanvas is not assigned!");
        }
    }
    void ToggleMenu()
    {
        if (menuCanvas != null)
        {
            bool active = menuCanvas.activeSelf;
            if (!active)
            {
                //pause the game
                Time.timeScale = 0.0f;
                menuCanvas.SetActive(true);
            }
            else
            {
                Time.timeScale = 1.0f;
                menuCanvas.SetActive(false);
            }
        }
        else
        {
            Debug.LogWarning("menuCanvas is not assigned!");
        }
    }
    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape)) //TODO: use key bindings instead of static esc
        {
            if (SceneManager.GetActiveScene().buildIndex != 0)
            {
                //toggle menu when it is not at front page
                ToggleMenu();
                
            }
        }
    }
}
