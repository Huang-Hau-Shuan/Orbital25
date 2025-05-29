using System;
using System.Collections.Generic;
using UnityEngine;

public class BusManager : MonoBehaviour
{
    [Header("Bus Routes")]
    public GameObject A1_Route;
    public GameObject A2_Route;
    public GameObject D1_Route;
    public GameObject D2_Route;
    public GameObject K_Route;
    public GameObject E_Route;
    public GameObject BTC_Route;
    public GameObject L_Route;
    public static readonly int TotalLines = 8;
    public static readonly string[] LineNames = {"A1","A2","D1","D2","K","E","BTC","L" }; // a list to look up the name of the line by index
    public static Dictionary<string, int> LineIndices = null; // a table to look up the index of a line

    private BusRoute[] lines;
    private BusRoute currentLine = null;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
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
            lines[i] = r.GetComponent<BusRoute>();
            if (lines[i] == null)
            {
                Utils.LogError("BusManager: game object " + r.name + " does not have BusRoute component");
            }
        }
        //get available bus routes
        string from = GameDataManager.instance.GetPreviousSceneName();
        if (from == null)
        {
            Utils.LogError("BusManager: Cannot get where the player comes from. previous scene is null");
            return;
        }
        if (from == "Room")
        {
            from = "PGP";
        }
        GetOnBus(from);
    }

    public void GetOnBus(string stopName)
    {
        var stop = GameObject.Find(stopName).GetComponent<BusStop>();
        currentLine = stop.availableLines[0]; //TODO: let user select the bus line
        stop.availableLines[0].MoveBus(stopName);
    }
    public GameObject GetRoute(string name)
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
    public GameObject GetRoute(int index)
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
