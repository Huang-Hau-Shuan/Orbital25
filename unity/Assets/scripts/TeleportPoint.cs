using UnityEngine.SceneManagement;
using UnityEngine;
using UnityEditor;
using System.Collections.Generic;

public class TeleportPoint : MonoBehaviour
{
    public string jumpTo;
    public List<string> options = new(); // what options to to choose. if jumpTo is campus map, it should be the bus stop option(s)
    public string jumpOption = null; //which option triggers scene change, null if all options trigger
    public string prompt = null;
    private bool isPlayerNear = false;
    public Sprite showOptionImage = null;

    [Header("Assign the interaction key. Set it to None if no interaction is required")]
    public KeyCode interactionKey = KeyCode.None;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        isPlayerNear = false;
    }
    public void Teleport()
    {
        if (options.Count >= 2)
        {
            var opt = ShowOptions.instance;
            if (opt != null)
            {
                if (options.Count == 2)
                {
                    opt.Show2Options(showOptionImage, prompt,
                        ChooseCallback, ChooseCallback, options[0], options[1]);
                }
                else if (options.Count == 3)
                {
                    opt.Show3Options(showOptionImage, prompt,
                        ChooseCallback, ChooseCallback, ChooseCallback, options[0], options[1], options[2]);
                }
                else
                {
                    Utils.LogError("TeleportPoint: Currently only support up to three options");
                }
            }
            else
            {
                Utils.LogError("Can't Let user choose which bus stop to go, ShowOptions is null");
            }
        }
        else
        {
            if (options.Count == 1)
            {
                if (GameDataManager.instance)
                { GameDataManager.instance.SetLastBusStop(options[0]); }
            }
            if (GameDataManager.instance)
            { GameDataManager.instance.LoadScene(jumpTo); }
            else
            {
                SceneManager.LoadScene(jumpTo);
            }
        }
    }
    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            isPlayerNear = true;
            if (interactionKey == KeyCode.None)
            {
                Teleport();
            }
        }
    }
    private void ChooseCallback(string option, string param)
    {
        if (option != null && (string.IsNullOrEmpty(jumpOption) || jumpOption == option))
        {

            Utils.Log($"User choosed {option}, jump to {jumpTo}");
            if (GameDataManager.instance)
            { 
                if(jumpTo == "Campus Map")
                    GameDataManager.instance.SetLastBusStop(option);
                GameDataManager.instance.LoadScene(jumpTo);
            }
            else
            {
                SceneManager.LoadScene(jumpTo);
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
    public bool IsPlayerNeat => isPlayerNear;

    void Update()
    {
        if (interactionKey != KeyCode.None && isPlayerNear && Input.GetKeyDown(interactionKey)) {
            Teleport();
        }
    }
}
