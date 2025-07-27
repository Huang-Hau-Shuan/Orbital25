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
    private bool canShow = true;
    [Header("Assign the interaction key. Set it to None if no interaction is required")]
    public KeyCode interactionKey = KeyCode.None;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        isPlayerNear = false;
        canShow = true;
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
                    if (!opt.gameObject.activeSelf)
                    {
                        opt.Show2Options(showOptionImage, prompt,
                        ChooseCallback, ChooseCallback, options[0], options[1]);
                        canShow = false;
                    }
                }
                else if (options.Count == 3)
                {
                    if (!opt.gameObject.activeSelf)
                    {
                        opt.Show3Options(showOptionImage, prompt,
                        ChooseCallback, ChooseCallback, ChooseCallback, options[0], options[1], options[2]);
                        canShow = false;
                    }
                }
                else
                {
                    Utils.LogError("TeleportPoint: Currently only support up to three options");
                }
            }
            else
            {
                Utils.LogWarning("Can't Let user choose which bus stop to go, ShowOptions is null");
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
        }
    }
    private void ChooseCallback(string option, string param)
    {
        if (option != null && (string.IsNullOrEmpty(jumpOption) || jumpOption == option))
        {

            Utils.Log($"User choosed {option}, jump to {jumpTo}");
            if (GameDataManager.instance)
            {
                if (jumpTo == "Campus Map")
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
            canShow = true;
        }
    }
    public bool IsPlayerNeat => isPlayerNear;

    void Update()
    {
        if (isPlayerNear && canShow && (interactionKey == KeyCode.None || Input.GetKeyDown(interactionKey)))
        {
            Teleport();
        }
    }
}
