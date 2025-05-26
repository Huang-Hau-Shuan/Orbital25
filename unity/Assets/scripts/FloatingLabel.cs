using UnityEngine;
using TMPro;

public class FloatingLabel : MonoBehaviour
{
    [Header("Text Settings")]
    public bool showText = true;
    public string text = null;
    public bool updateText = true;
    [Header("Position Settings")]
    public Vector3 offset = Vector3.up;
    [Header("Assign GameObjects")]
    public Canvas canvas;
    public GameObject textGameObject;
    private TextMeshProUGUI textObj;

    void Start()
    {
        if (canvas == null)canvas=FindFirstObjectByType<Canvas>();
        if (textGameObject == null)
        {
            if (canvas == null)
            {
                Utils.LogError("Failed to create TextMeshProGUI object: canvas is null");
                return;
            }
            // Create Text Object when is null (the newly created object has no style)
            textGameObject = new GameObject("FloatingLabel");
        }
        textGameObject.transform.SetParent(canvas.transform);
        if (!textGameObject.TryGetComponent(out textObj))
        textObj = textGameObject.AddComponent<TextMeshProUGUI>();
        textObj.alignment = TextAlignmentOptions.Center;
        if (text != null && text.Length>0) { textObj.text = text; }
        // Position it above the object in screen space
        UpdateLabelPosition();
    }

    void Update()
    {
        if (updateText)UpdateLabelPosition();
    }

    void UpdateLabelPosition()
    {
        if (textObj == null) return;
        if (showText) {
        Vector3 worldPos = transform.position + offset;
        Vector3 screenPos = Camera.main.WorldToScreenPoint(worldPos);
        textObj.rectTransform.position = screenPos; }
        textObj.gameObject.SetActive(showText);
    }

    public void SetText(string text)
    {
        if (textObj == null) return;
        this.text = text;
        textObj.text = text;
    }
    public void SetShowText(bool showText)
    {
        this.showText = showText;
        textObj.gameObject.SetActive(showText);
    }
}
