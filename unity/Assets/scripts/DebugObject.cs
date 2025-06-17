using UnityEngine;

public class DebugObject : MonoBehaviour
{
    void Update()
    {
        gameObject.SetActive(Utils._debug);
    }

    public void TurnOffDebug()
    {
        Utils._debug = false;
        if (GameDataManager.instance != null)
        {
            GameDataManager.instance.gameConfig.debug = false;
        }
    }

    public void TurnOnDebug()
    {
        Utils._debug = true;
        if (GameDataManager.instance != null)
        {
            GameDataManager.instance.gameConfig.debug = true;
        }
    }
}
