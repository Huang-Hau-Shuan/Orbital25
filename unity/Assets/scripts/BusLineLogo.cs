using UnityEngine;

public class BusLineLogo : MonoBehaviour
{
    public Sprite[] sprites;
    public SpriteRenderer spriteRenderer;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    private void Awake()
    {
        spriteRenderer = GetComponent<SpriteRenderer>();
    }
    void Start()
    {
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void SetSprite(int index)
    {
        if (index >= 0 && index < sprites.Length)
        {
            spriteRenderer.sprite = sprites[index];
        }
        else
        {
            Debug.LogWarning($"SetSprite: Index {index} is out of range. Valid range is 0 to {sprites.Length - 1}.");
        }
    }

    public void SetBusLine(string busline)
    {
        switch (busline)
        {
            case "A1":
                SetSprite(0);break;
            case "A2":
                SetSprite(1);break;
            case "BTC":
                SetSprite(2);break;
            case "D1":
                SetSprite(3);break;
            case "D2":
                SetSprite(4);break;
            case "K":
                SetSprite(5);break;
            case "L":
                SetSprite(6);break;
            default:
                Debug.LogWarning($"SetBusLine: Bus line {busline} does not exist");break;
        }
    }
}
