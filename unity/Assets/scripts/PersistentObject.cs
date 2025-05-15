using System.Collections.Generic;
using UnityEngine;

public class PersistentObject : MonoBehaviour
{
    private static List<int> strored_ids = new List<int>(); //store the persistID existent persistent object 
    // we won't make >10 elements persistent so a simple list should be fine
    public int persistID; //a unique persist ID, only one instance of each persist ID will exist
    private void Awake()
    {
        // Make this object persistent
        if (!strored_ids.Contains(persistID))
        {
            DontDestroyOnLoad(gameObject);
            strored_ids.Add(persistID);
        }
        else
        {
            Destroy(gameObject); // Prevent duplicates
        }
    }
}
