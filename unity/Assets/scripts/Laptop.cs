using UnityEngine;

public class Laptop : MonoBehaviour
{
    public KeyCode interactKey = KeyCode.None;
    private bool canShow = true; //add a state to prevent keeps showing the option interface when interactKey is None
    private bool isPlayerNear = false;
    public GameObject exclamationMark;
    private void Start()
    {
        MessageBridge.RegisterUnityMessageHandler(
            "setHasNewMessage", gameObject.name, "ShowExclamation", true);
        MessageBridge.SendMessage("getHasNewMessage", "");
        canShow = true;
    }
    void Update()
    {
        if (isPlayerNear && canShow && (Input.GetKeyDown(interactKey) || interactKey == KeyCode.None))
        {
            MessageBridge.ShowSimulatedDesktop();
            canShow = false;
        }
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            isPlayerNear = true;
        }
    }

    void OnTriggerExit2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            isPlayerNear = false;
            MessageBridge.HideSimulatedDesktop();
            canShow = true;
        }
    }
    public void ShowExclamation(string show)
    {
        if (exclamationMark != null)
        {
            if (show.ToLower() == "true")
            {
                exclamationMark.SetActive(true);
            }
            else if (show.ToLower() == "false")
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
    private void HideExclamation()
    {
        if (exclamationMark != null)
            exclamationMark.SetActive(false);
    }
}
