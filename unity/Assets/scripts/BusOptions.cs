using HeneGames.DialogueSystem;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class BusOptions : MonoBehaviour
{
    public Button A1Button;
    public Button A2Button;
    public Button D1Button;
    public Button D2Button;
    public Button KButton;
    public Button BTCButton;
    public Sprite busSprite;

    public static BusOptions instance;

    private static Dictionary<string, Color> colors = new();
    private string currentStop = null;
    private DialogueUI ui;
    void Start()
    {
        gameObject.SetActive(false);
        instance = this;
        colors["A1"] = Color.red;
        colors["A2"] = Utils.GetColorFromHex("E3CE0B");
        colors["D1"] = Utils.GetColorFromHex("C075E1");
        colors["D2"] = Utils.GetColorFromHex("6F1B6F");
        colors["K"] = Utils.GetColorFromHex("345A9B");
        colors["BTC"] = Utils.GetColorFromHex("EF8136");
    }
    public void DisableButton(string name)
    {
        GetButton(name).interactable = false;
        GetButton(name).gameObject.GetComponent<Image>().color = Color.gray;
    }
    public void EnableButton(string name) {
        GetButton(name).interactable = true;
        GetButton(name).gameObject.GetComponent<Image>().color = colors[name];
    }
    public void DisableAll()
    {
        foreach (string name in colors.Keys) {
            DisableButton(name);
        }
    }
    public void EnableAll()
    {
        foreach (string name in colors.Keys)
        {
            EnableButton(name);
        }
    }
    public Button GetButton(string name)
    {
        switch (name) {
            case "A1": return A1Button;
            case "A2": return A2Button;
            case "D1": return D1Button;
            case "D2": return D2Button;
            case "K": return KButton;
            case "BTC": return BTCButton;
            default: return null;
        }
    }
    public void ShowOptions(List<BusRoute> busRoutes, string currentStop)
    {
        DisableAll();
        foreach (BusRoute busRoute in busRoutes) { 
            EnableButton(busRoute.lineName);
        }
        this.currentStop = currentStop;
        gameObject.SetActive(true);
        ui = FindFirstObjectByType<DialogueUI>();
        if (ui != null)
        {
            ui.ShowSentence(busSprite, "", "Please select the bus you want to take at " + currentStop);
        }
    }
    private void GetOnBus(string lineName)
    {
        MessageBridge.SendMessage("GetOnBus", lineName); //notify the backend
        if (BusManager.Instance != null)
        {
            BusManager.Instance.GetOnBus(currentStop, lineName);
        }
        gameObject.SetActive(false);
        if(ui!= null)
        {
            ui.ClearText();
        }
    }
    public void A1OnClick()
    {
        GetOnBus("A1");
    }

    public void A2OnClick()
    {
        GetOnBus("A2");
    }
    public void D1OnClick()
    {
        GetOnBus("D1");
    }
    public void D2OnClick()
    {
        GetOnBus("D2");
    }
    public void KOnClick()
    {
        GetOnBus("K");
    }
    public void BTCOnClick()
    {
        GetOnBus("BTC");
    }
}
