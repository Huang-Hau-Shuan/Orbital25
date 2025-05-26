using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
[Serializable]
public class GameConfig
{
    public bool debug = true;
    public string gameSaveLocation= null;
}
[Serializable]
public class PlayerStatus
{
    //whether the player is active
    public bool isActive;

    //transition
    public Vector3 location;
    public Vector4 rotation;
    public Vector3 scale;

    //personal info (before enrollment)
    public string firstName; //same as passport, should be all capital letter
    public string lastName; //same as passport, should be all capital letter
    public bool firstNameBeforeLastName;
    public string personalEmail;
    public string passportNumber;

    //personal info (NUS related)
    public bool registered;
    public string studentID; //the id on student card, starting with 'A'
    public string studentEmail; //starts with 'E'
    public string studentAccountPassword;

    public PlayerStatus()
    {
        isActive = true;
        location = new(-1.5f, -1f, 0f);
        rotation = new(0, 0, 0, 1);
        scale = new(0.2f, 0.2f, 1f);

        firstNameBeforeLastName = true;
        firstName = "";lastName = "";
        personalEmail = "player@email.com";
        passportNumber = "123456789";

        registered = false;
        studentID = null;
        studentEmail = null;
        studentAccountPassword = null;
    }
    public void SavePlayerTransition(GameObject player)
    {
        if (player == null)
        {
            isActive=false;
            return;
        }
        location = player.transform.position;
        rotation.x = player.transform.rotation.x;
        rotation.y = player.transform.rotation.y;
        rotation.z = player.transform.rotation.z;
        rotation.w = player.transform.rotation.w;
        scale = player.transform.localScale;
        isActive = player.activeInHierarchy;
    }
    public void LoadPlayerTransition(GameObject player)
    {
        if (player == null)
        {
            Utils.LogWarning("Player is null");
            return;
        }
        player.SetActive(isActive);
        player.transform.localScale = scale;
        player.transform.SetPositionAndRotation(location, 
            new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w));
    }
}
[Serializable]
public class GameSave
{
    public int year, month, day, hour, minute;
    public int currentScene;
    public PlayerStatus playerStatus;
    public List<TaskProgress> tasks;
    public GameSave(List<TaskDetail> taskDetails)
    {
        year = 2025; month = 6; day = 10; hour = 9; minute = 0;
        currentScene = 1;
        playerStatus = new PlayerStatus();
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
        gameSave.playerStatus.SavePlayerTransition(player);
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
        MessageBridge.SendMessage("newGame","");
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
        gameSave.playerStatus.LoadPlayerTransition(player);
        GameTimeManager.instance.SetTime(gameSave.year, gameSave.month, gameSave.day, gameSave.hour, gameSave.minute);
        GameTimeManager.instance.StartTimer();
        SceneManager.sceneLoaded -= OnLoadGame_SceneLoaded;
    }
}
