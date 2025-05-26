using UnityEngine;

public class BusStop : MonoBehaviour
{
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    public bool initiallyFocused = false;
    private bool focused;
    private SpriteRenderer spriteRenderer;
    public Sprite sprite;
    public Sprite spriteFocused;
    void Start()
    {
        spriteRenderer = gameObject.GetComponent<SpriteRenderer>();
        focused=initiallyFocused;
        UpdateSprite();
    }
    void UpdateSprite()
    {
        if (spriteRenderer != null) {
            if (focused)
            {
                spriteRenderer.sprite = spriteFocused;
            }
            else
            {
                spriteRenderer.sprite = sprite;
            }
        }
    }
    public void SetFocus(bool f)
    {
        focused = f;
        UpdateSprite() ;
    }
}
