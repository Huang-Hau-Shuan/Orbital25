using UnityEngine;

public class Laptop : MonoBehaviour
{
    public KeyCode interactKey = KeyCode.E;
    private bool isPlayerNear = false;
    public GameObject exclamationMark;
    private void Start()
    {
        MessageBridge.RegisterUnityMessageHandler(
            "setHasNewMessage", gameObject.name, "ShowExclamation", true);
        MessageBridge.SendMessage("getHasNewMessage", "");
    }
    void Update()
    {
        if (isPlayerNear && Input.GetKeyDown(interactKey))
        {
            MessageBridge.ShowSimulatedDesktop();
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
    public void ShowExclamation(string show)
    {
        if (exclamationMark != null)
        {
            if (show.ToLower() == "true")
            {
                exclamationMark.SetActive(true);
            }else if (show.ToLower() == "false")
            {
                exclamationMark.SetActive(false);
            }
            else
            {
                Utils.LogError("Invalid argument for ShowExclamation: " + show);
            }
        }
        else
        {
            Utils.LogWarning("exclamationMark is null");
        }
    }
    private void HideExclamation(){
        if (exclamationMark != null)
            exclamationMark.SetActive(false);
    }
}
