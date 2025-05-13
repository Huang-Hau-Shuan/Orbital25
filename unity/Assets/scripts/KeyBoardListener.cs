using UnityEngine;

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
            menuCanvas.SetActive(!active);
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
            ToggleMenu();
        }
    }
}
