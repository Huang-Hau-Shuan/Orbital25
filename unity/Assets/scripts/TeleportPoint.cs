using UnityEngine.SceneManagement;
using UnityEngine;
using UnityEditor;

public class TeleportPoint : MonoBehaviour
{
    public string jumpTo;
    public bool isPlayerNear = false;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        isPlayerNear = false;
    }
    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            isPlayerNear = true;
            GameDataManager.instance.LoadScene(jumpTo);
        }
    }

    void OnTriggerExit2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            isPlayerNear = false;
        }
    }
        // Update is called once per frame
        void Update()
    {
        
    }
}
