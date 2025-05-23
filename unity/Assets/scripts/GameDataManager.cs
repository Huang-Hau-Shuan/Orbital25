using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
[Serializable]
public class GameConfig
{
    public bool debug = true;
}

[Serializable]
public class GameSave
{
    public int year, month, day, hour, minute;
    public int currentScene;
    public bool playerOnScene;
    public Vector3 playerLocation;
    public Vector4 playerRotation;
    public Vector3 playerScale;
    public List<TaskProgress> tasks;
    public GameSave(List<TaskDetail> taskDetails)
    {
        year = 2025; month = 6; day = 10; hour = 9; minute = 0;
        currentScene = 1;
        playerOnScene = true;
        playerLocation = new(-1.5f, -1f, 0f);
        playerRotation = new(0, 0, 0, 1);
        playerScale = new(0.3f, 0.3f, 0.3f);
        if (taskDetails != null)
        {
            tasks = new(capacity: taskDetails.Count);
            for (int i = 0; i < taskDetails.Count; i++)
            {
                tasks[i] = new TaskProgress(i, taskDetails[i].steps.Count);
            }
        }
        else
        {
            Utils.LogWarning("No task info");
        }
    }
}
public class GameDataManager : MonoBehaviour
{
    public GameObject playerPrefab;

    public GameConfig gameConfig;
    public GameSave gameSave;
    public List<TaskDetail> taskDetails;

    public static GameDataManager instance;
    public void Start()
    {
        instance = this;
        MessageBridge.RegisterUnityMessageHandler("setGameConfig", gameObject.name, "HandleSetConfig", true);
        MessageBridge.RegisterUnityMessageHandler("setGameData", gameObject.name, "HandleSetData", false);
        MessageBridge.RegisterUnityMessageHandler("setTasks", gameObject.name, "HandleSetTasks", true);
        GetConfig();
    }
    public void HandleSetConfig(string msg)
    {
        Utils.SimuNUS_connected = true;
        try
        {
            JsonUtility.FromJsonOverwrite(msg, gameConfig);
            Utils._debug = gameConfig.debug;
            Utils.Log("received game config: " + msg);
            MessageBridge.SendMessage("getTasks", "");
        }
        catch (Exception e)
        {
            Utils.LogError("Failed to parse game config: " + e.Message);
        }
    }
    public void HandleSetData(string msg)
    {
        try
        {
            if (msg == "" || msg == "null")
            {
                Utils.Log("No game data available");
                return;
            }
            JsonUtility.FromJsonOverwrite(msg, gameSave);
            Utils.Log("received game data: " + msg);
            ReloadGameBySave();
        }
        catch (Exception e)
        {
            Utils.LogError("Failed to parse game data: " + e.Message);
        }
    }
    public void HandleSetTasks(string msg)
    {
        try
        {
            JsonUtility.FromJsonOverwrite(msg, taskDetails);
            Utils.Log("received game tasks: " + msg);
        }
        catch (Exception e)
        {
            Utils.LogError("Failed to parse game config: " + e.Message);
        }
    }
    public void GetConfig()
    {
        MessageBridge.SendMessage("getGameConfig", "");
    }
    public void SaveConfig()
    {
        MessageBridge.SendMessage("saveGameConfig", JsonUtility.ToJson(gameConfig));
    }
    public void LoadGame()
    {
        MessageBridge.LoadGame(); //send a message to SimuNUS to get game data
    }
    public void UpdateGameSave()
    {
        if (GameTimeManager.instance != null)
        {
            gameSave.year = GameTimeManager.instance.Year;
            gameSave.month = GameTimeManager.instance.Month;
            gameSave.day = GameTimeManager.instance.Day;
            gameSave.hour = GameTimeManager.instance.Hour;
            gameSave.minute = GameTimeManager.instance.Minute;
        }
        GameObject player = GameObject.FindWithTag("Player");
        if (player != null)
        {
            gameSave.playerLocation = player.transform.position;
            gameSave.playerRotation.x = player.transform.rotation.x;
            gameSave.playerRotation.y = player.transform.rotation.y;
            gameSave.playerRotation.z = player.transform.rotation.z;
            gameSave.playerRotation.w = player.transform.rotation.w;
            gameSave.playerScale = player.transform.localScale;
            gameSave.playerOnScene = true;
        }
        else
        {
            gameSave.playerOnScene = false;
        }
        gameSave.currentScene = SceneManager.GetActiveScene().buildIndex;
    }
    public void SaveGame()
    {
        UpdateGameSave();
        MessageBridge.SendMessage("save", JsonUtility.ToJson(gameSave));
    }
    public void ReloadGameBySave()
    {
        SceneManager.sceneLoaded += OnLoadGame_SceneLoaded;
        SceneManager.LoadScene(gameSave.currentScene);
        
    }
    public void NewGame()
    {
        gameSave = new GameSave(taskDetails);
        ReloadGameBySave();
    }

    public void OnLoadGame_SceneLoaded(Scene scene, LoadSceneMode mode)
    {
        GameObject player = GameObject.FindWithTag("Player");
        if (player == null)
        {
            Utils.Log("Player not found for new game, instantiating a new player from prefab");
            if (playerPrefab == null)
            {
                Utils.LogError("Failed to instantiate player because player prefab is null");
                return;
            }
            player = Instantiate(playerPrefab);
        }
        player.SetActive(gameSave.playerOnScene);
        player.transform.localScale = gameSave.playerScale;
        player.transform.position = gameSave.playerLocation;
        player.transform.rotation = new Quaternion(
            gameSave.playerRotation.x,
            gameSave.playerRotation.y,
            gameSave.playerRotation.z,
            gameSave.playerRotation.w
        );
        GameTimeManager.instance.SetTime(gameSave.year, gameSave.month, gameSave.day, gameSave.hour, gameSave.minute);
        GameTimeManager.instance.StartTimer();
        SceneManager.sceneLoaded -= OnLoadGame_SceneLoaded;
    }
}
