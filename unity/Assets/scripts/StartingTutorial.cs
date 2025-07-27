using UnityEngine;

public class StartingTutorial : MonoBehaviour
{
    public string text = "";
    private static bool show = false;
    void Start()
    {
        if (GameDataManager.instance)
        {
            if (!show)
            {
                ToastNotification.Show(text);
                show = true;
            }
        }
    }

    void Update()
    {

    }
}
