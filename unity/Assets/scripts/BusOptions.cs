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
    private string currentStop = null;
    private DialogueUI ui;
    void Start()
    {
        instance = this;
    }
    public static Color GetColor(string name)
    {
        return name switch
        {
            "A1" => Color.red,
            "A2" => Utils.GetColorFromHex("E3CE0B"),
            "D1" => Utils.GetColorFromHex("C075E1"),
            "D2" => Utils.GetColorFromHex("6F1B6F"),
            "K" => Utils.GetColorFromHex("345A9B"),
            "BTC" => Utils.GetColorFromHex("EF8136"),
            _ => Color.white,
        };
    }
    private void DisableButton(string name)
    {
        GetButton(name).interactable = false;
        GetButton(name).gameObject.GetComponent<Image>().color = Color.gray;
    }
    private void EnableButton(string name) {
        GetButton(name).interactable = true;
        GetButton(name).gameObject.GetComponent<Image>().color = GetColor(name);
    }
    private void DisableAll()
    {
        A1Button.interactable = false;
        A1Button.gameObject.GetComponent<Image>().color = Color.gray;
        A2Button.interactable = false;
        A2Button.gameObject.GetComponent<Image>().color = Color.gray;
        D1Button.interactable = false;
        D1Button.gameObject.GetComponent<Image>().color = Color.gray;
        D2Button.interactable = false;
        D2Button.gameObject.GetComponent<Image>().color = Color.gray;
        KButton.interactable = false;
        KButton.gameObject.GetComponent<Image>().color = Color.gray;
        BTCButton.interactable = false;
        BTCButton.gameObject.GetComponent<Image>().color = Color.gray;
    }
    private void EnableAll()
    {
        A1Button.interactable = true;
        A1Button.gameObject.GetComponent<Image>().color = Color.red;
        A2Button.interactable = true;
        A2Button.gameObject.GetComponent<Image>().color = Utils.GetColorFromHex("E3CE0B");
        D1Button.interactable = true;
        D1Button.gameObject.GetComponent<Image>().color = Utils.GetColorFromHex("C075E1");
        D2Button.interactable = true;
        D2Button.gameObject.GetComponent<Image>().color = Utils.GetColorFromHex("6F1B6F");
        KButton.interactable = true;
        KButton.gameObject.GetComponent<Image>().color = Utils.GetColorFromHex("345A9B");
        BTCButton.interactable = true;
        BTCButton.gameObject.GetComponent<Image>().color = Utils.GetColorFromHex("EF8136");
    }
    private Button GetButton(string name)
    {
        return name switch
        {
            "A1" => A1Button,
            "A2" => A2Button,
            "D1" => D1Button,
            "D2" => D2Button,
            "K" => KButton,
            "BTC" => BTCButton,
            _ => null,
        };
    }
    public void ShowOptions(List<BusRoute> busRoutes, string currentStop)
    {
        DisableAll();
        foreach (BusRoute busRoute in busRoutes) { 
            EnableButton(busRoute.lineName);
        }
        this.currentStop = currentStop;
        gameObject.SetActive(true);
        ui = DialogueUI.instance;
        if (ui == null)
        {
            Utils.LogWarning("BusOptions.ShowOptions: DialogueUI is null");
            return;
        }
        ui.ShowSentence(busSprite, "", "Please select the bus you want to take at " + currentStop);
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
