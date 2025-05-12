using UnityEngine;

public class Laptop : MonoBehaviour
{
    public KeyCode interactKey = KeyCode.E;
    private bool isPlayerNear = false;
    public GameObject exclamationMark;
    void Update()
    {
        if (isPlayerNear && Input.GetKeyDown(interactKey))
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            OpenSimulatedDesktop();
#else
            Debug.Log("Simulated desktop would open here.");
#endif
            hideExclamation(); //hide the exclamation mark for now
        }
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            isPlayerNear = true;
            // You could also show an interaction prompt here (like "Press E to use laptop")
        }
    }

    void OnTriggerExit2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            isPlayerNear = false;
            // Hide interaction prompt
        }
    }

    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void ShowSimulatedDesktop();

    private void OpenSimulatedDesktop()
    {
        ShowSimulatedDesktop();
    }

    private void hideExclamation(){
        if (exclamationMark != null)
            exclamationMark.SetActive(false);
    }
}
