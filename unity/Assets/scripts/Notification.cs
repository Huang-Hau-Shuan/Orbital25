using UnityEngine;

public class Notification : MonoBehaviour
{
    public AudioClip emailNotificationClip; // Assign in Inspector
    public AudioClip taskCompleteNotificationClip; // Assign in Inspector
    private AudioSource audioSource;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        audioSource = GetComponent<AudioSource>();
        audioSource.loop = false;
        MessageBridge.RegisterUnityMessageHandler("newEmail", gameObject.name, "NewEmail", true);
        MessageBridge.RegisterUnityMessageHandler("taskComplete", gameObject.name, "TaskComplete", true);
    }
    public void NewEmail(string message = null)
    {
        Utils.Log("Notifying the user that a new email has arrived");
        //ToastNotification.Show("You received a new email",2.5f,"info");
        audioSource.clip = emailNotificationClip;
        audioSource.Play();
    }
    public void TaskComplete(string message)
    {
        Utils.Log("Notifying the user that a task has completed");
        //ToastNotification.Show("Task " + message + " completed!", 5, "success");
        audioSource.clip = taskCompleteNotificationClip;
        audioSource.Play();
    }
}
