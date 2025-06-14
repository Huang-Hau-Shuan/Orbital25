using System;
using System.Collections.Generic;
using UnityEngine;

public class BusManager : MonoBehaviour
{
    public BusOptions busOptions;
    
    [Header("Bus Routes")]
    public BusRoute A1_Route;
    public BusRoute A2_Route;
    public BusRoute D1_Route;
    public BusRoute D2_Route;
    public BusRoute K_Route;
    public BusRoute E_Route;
    public BusRoute BTC_Route;
    public BusRoute L_Route;
    public static readonly int TotalLines = 8;
    public static readonly string[] LineNames = {"A1","A2","D1","D2","K","E","BTC","L" }; // a list to look up the name of the line by index
    public static Dictionary<string, int> LineIndices = null; // a table to look up the index of a line
    public static BusManager Instance = null;

    private BusRoute[] lines;
    private BusRoute currentLine = null;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        Instance = this;
        //initialize LineIndices
        if (LineIndices == null)
        {
            LineIndices = new Dictionary<string, int>();
            for (int i = 0; i < TotalLines; i++)
            {
                LineIndices.Add(LineNames[i], i);
            }
        }
        //initialize lines
        lines = new BusRoute[TotalLines];
        for (int i = 0; i < TotalLines; i++)
        {
            var r = GetRoute(i);
            if (r == null)
            {
                lines[i] = null;
                continue;
            }
            lines[i] = r;
        }
        string from = null;
        //get available bus routes
        if (GameDataManager.instance == null)
        {
#if UNITY_EDITOR
            //in editor, debug this scene only
            from = "PGP Foyer";
            Utils.Log("BusManager: GameDataManager is null, set to default bus stop PGP Foyer");
#else
            Utils.LogError("BusManager: GameDataManager is null");
            return;
#endif
        }
        else
        {
            from = GameDataManager.instance.gameSave.lastBusStop;
        }
        if (from == null)
        {
            Utils.LogError("BusManager: Cannot get where the player comes from. gameSave.lastBusStop is null");
            return;
        }
        GetOnBus(from);
    }
    public void StopBus()
    {
        if (currentLine != null)
        {
            currentLine.StopBus();
        }
    }
    public void SwitchLine()
    {
        StopBus();
        if (GameDataManager.instance != null)
        {
            GetOnBus(GameDataManager.instance.gameSave.lastBusStop);
        }
        else
        {
            Utils.LogError("BusManager: failed to switch line because GameDataManager is null");
        }
    }
    public void GetOnBus(string stopName, string lineName)
    {
        currentLine = GetRoute(lineName);
        currentLine.MoveBus(stopName);
    }
    public void GetOnBus(string stopName)
    {
        var stop = GameObject.Find(stopName).GetComponent<BusStop>();
        if (stop == null)
        {
            Utils.LogError("BusManager.GetOnBus: Invalid stopName " + stopName);
            return;
        }
        busOptions.ShowOptions(stop.availableLines, stopName);
    }
    public BusRoute GetRoute(string name)
    {
        switch (name.ToUpper()) {
            case "A1": return A1_Route;
            case "A2": return A2_Route;
            case "D1": return D1_Route;
            case "D2": return D2_Route;
            case "K": return K_Route;
            case "E": return E_Route;
            case "BTC": return BTC_Route;
            case "L": return L_Route;
            default: Utils.LogError("Unknown bus line: " + name);return null;
        }
    }
    public BusRoute GetRoute(int index)
    {
        return GetRoute(LineNames[index]);
    }
    public void GetOff()
    {
        if(currentLine != null)
        {
            currentLine.GetOff();
        }
    }
}
