using HeneGames.DialogueSystem;
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
[Serializable]
public class GameConfig
{
    public bool debug = true;
    public string gameSaveLocation = null;
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

    public PlayerStatus()
    {
        isActive = true;
        location = new(-1.5f, -1f, 0f);
        rotation = new(0, 0, 0, 1);
        scale = new(0.2f, 0.2f, 1f);
    }
    public void SavePlayerTransition(GameObject player)
    {
        if (player == null)
        {
            isActive = false;
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
    public GameTime time;
    public int currentScene, previousScene;
    public string lastBusStop;
    public PlayerStatus playerStatus;
    public List<TaskProgress> tasks;
    public GameSave(List<TaskDetail> taskDetails)
    {
        time = new();
        currentScene = 1; previousScene = 0;
        playerStatus = new PlayerStatus();
        lastBusStop = null;
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
            gameSave.time = GameTimeManager.instance.GetGameTime();
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
        LoadScene(gameSave.currentScene);
    }
    public void NewGame()
    {
        gameSave = new GameSave(taskDetails);
        ReloadGameBySave();
        MessageBridge.SendMessage("newGame", "");
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
        GameTimeManager.instance.ResetSchedule();
        GameTimeManager.instance.SetTime(gameSave.time);
        GameTimeManager.instance.StartTimer();
        SceneManager.sceneLoaded -= OnLoadGame_SceneLoaded;
    }
    //load scene and update currentScene, previous Scene
    public void LoadScene(int sceneId)
    {
        if (sceneId < 0 || sceneId >= SceneManager.sceneCountInBuildSettings)
        {
            Utils.LogError("LoadScene: the scene id to load " + sceneId + " out of range, should be 0 to " + SceneManager.sceneCountInBuildSettings);
            return;
        }
        Utils.Log("LoadScene: Jump to scene " + sceneId.ToString());
        gameSave.previousScene = gameSave.currentScene;
        SceneManager.LoadScene(sceneId);
        gameSave.currentScene = sceneId;
        MessageBridge.SendMessage("sceneChanged", Utils.GetSceneName(sceneId));
        if (ShowOptions.instance != null) ShowOptions.instance.HideOptions();
    }
    public void SetLastBusStop(string busStop)
    {
        gameSave.lastBusStop = busStop;
    }
    public void LoadScene(string sceneName)
    {
        if (sceneName == null)
        {
            Utils.LogError("LoadScene: the scene name to load is null");
            return;
        }
        if (!Utils.SceneExists(sceneName))
        {
            Utils.LogError("LoadScene: the scene to load \"" + sceneName + "\" does not exist");
            return;
        }
        var dui = FindFirstObjectByType<DialogueUI>();
        if (dui != null)
        {
            dui.ClearText();
        }
        Utils.Log("LoadScene: Jump to scene " + sceneName);
        gameSave.previousScene = gameSave.currentScene;
        SceneManager.LoadScene(sceneName);
        gameSave.currentScene = SceneManager.GetSceneByName(sceneName).buildIndex;
        MessageBridge.SendMessage("sceneChanged", sceneName);
        if (ShowOptions.instance != null) ShowOptions.instance.HideOptions();
    }
    public void LoadScene(Scene scene)
    {
        LoadScene(scene.buildIndex);
    }
    public int GetCurrentSceneIndex()
    {
        return gameSave.currentScene;
    }
    public string GetCurrentSceneName()
    {
        return Utils.GetSceneName(gameSave.currentScene);
    }

    public int GetPreviousSceneIndex()
    {
        return gameSave.previousScene;
    }
    public string GetPreviousSceneName()
    {
        return Utils.GetSceneName(gameSave.previousScene);
    }
}
