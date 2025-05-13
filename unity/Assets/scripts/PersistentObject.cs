using UnityEngine;

public class PersistentObject : MonoBehaviour
{
    private static PersistentObject instance;
    private void Awake()
    {
        // Make this object persistent
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject); // Prevent duplicates
        }
    }
}
