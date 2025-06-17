using HeneGames.DialogueSystem;
using UnityEngine;
using UnityEngine.UI;

public class ShowOptions:MonoBehaviour
{
    [Header("Assign buttons")]
    public Text option2_1;
    public Text option2_2;
    public Text option3_1;
    public Text option3_2;
    public Text option3_3;
    
    [Header("Assign Containers")]
    public GameObject option2;
    public GameObject option3;

    public delegate void ButtonCallback(string buttonText, string param);

    private string[] currentTexts = { "Yes", "No", "Yes", "No", "Cancel" };
    private string[] currentParams = { null, null, null, null, null };
    private ButtonCallback[] currentCallbacks = {null, null, null, null, null };

    static public ShowOptions instance = null;
    private void Start()
    {
        instance = this;
        if(option2_1 == null || option2_2 == null || option3_1 == null || option3_2 == null || option3_3 == null)
        {
            Utils.LogError("ShowOptions: button ref is null");
            return;
        }
        if (option2 == null || option3 == null)
        {
            Utils.LogError("ShowOptions: container ref is null");
            return;
        }
        option2.SetActive(false);
        option3.SetActive(false);
        gameObject.SetActive(false);

        //Test2Options();
        //Test3Options();
    }

    public void Show2Options(Sprite senderImage, string prompt, 
        ButtonCallback callback1, ButtonCallback callback2, 
        string text1 = "Yes", string text2 = "No", string param1 = null, string param2 = null)
    {
        option2_1.text = text1;
        option2_2.text = text2;
        currentTexts[0] = text1;
        currentTexts[1] = text2;
        currentParams[0] = param1;
        currentParams[1] = param2;
        currentCallbacks[0] = callback1;
        currentCallbacks[1] = callback2;


        var dui = FindFirstObjectByType<DialogueUI>();
        if (dui != null) {
            dui.ShowSentence(senderImage, "",prompt);
        }
        else
        {
            Utils.LogError("ShowOptions: Failed to show prompt, DialogueUI is null");
        }
        option2.SetActive(true);
        gameObject.SetActive(true);
    }
    public void Show3Options(Sprite senderImage, string prompt, 
        ButtonCallback callback1, ButtonCallback callback2, ButtonCallback callback3,
        string text1 = "Yes", string text2 = "No", string text3 = "Cancel",
        string param1 = null, string param2 = null, string param3 = null)
    {
        option3_1.text = text1;
        option3_2.text = text2;
        option3_3.text = text3;
        currentTexts[2] = text1;
        currentTexts[3] = text2;
        currentTexts[4] = text3;
        currentParams[2] = param1;
        currentParams[3] = param2;
        currentParams[4] = param3;
        currentCallbacks[2] = callback1;
        currentCallbacks[3] = callback2;
        currentCallbacks[4] = callback3;

        var dui = FindFirstObjectByType<DialogueUI>();
        if (dui != null)
        {
            dui.ShowSentence(senderImage, "", prompt);
        }
        else
        {
            Utils.LogError("ShowOptions: Failed to show prompt, DialogueUI is null");
        }
        option3.SetActive(true);
        gameObject.SetActive(true);
    }
    private void OnClick(int id)
    {
        option2.SetActive(false);
        option3.SetActive(false);
        gameObject.SetActive(false);
        if(DialogueUI.instance) DialogueUI.instance.ClearText();
        currentCallbacks[id](currentTexts[id], currentParams[id]);
    }

    //public callbacks assigned to the buttons' OnClick
    public void OnOption2_1Click()
    {
        OnClick(0);
    }
    public void OnOption2_2Click()
    {
        OnClick(1);
    }
    public void OnOption3_1Click()
    {
        OnClick(2);
    }
    public void OnOption3_2Click()
    {
        OnClick(3);
    }
    public void OnOption3_3Click()
    {
        OnClick(4);
    }


    //test functions
    private void TestCallback(string t, string p)
    {
        Utils.Log($"Button with text \"{t}\" clicked. param is \"{p}\"");
    }
    private void Test2Options()
    {
        Show2Options(null, "Test whether 2 options work properly", TestCallback, TestCallback, "A", "B", "p1", "p2");
    }
    private void Test3Options()
    {
        Show3Options(null, "Test whether 3 options work properly", TestCallback, TestCallback, TestCallback, "A", "B", "C", "p1", "p2", "p3");
    }
}
