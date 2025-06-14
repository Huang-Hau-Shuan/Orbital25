using UnityEngine.SceneManagement;
using UnityEngine;
using UnityEditor;
using System.Collections.Generic;

public class TeleportPoint : MonoBehaviour
{
    public string jumpTo;
    public List<string> busStop = new(); //which bus stop(s) to teleport 
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
            if (busStop.Count > 1)
            {
                //TODO: let the player select which bus stop to go
            }
            else
            {
                if (busStop.Count == 1)
                {
                    if (GameDataManager.instance)
                    { GameDataManager.instance.SetLastBusStop(busStop[0]); }
                }
                if (GameDataManager.instance)
                { GameDataManager.instance.LoadScene(jumpTo); }
                else
                {
                    SceneManager.LoadScene(jumpTo);
                }
            }
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
