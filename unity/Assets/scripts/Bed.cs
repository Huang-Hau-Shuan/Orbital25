using UnityEngine;

public class Bed : MonoBehaviour
{
    private bool isPlayerNear = false;
    private bool canShow = true; //add a state to prevent keeps showing the option interface when interactKey is None
    public KeyCode interactKey = KeyCode.None;
    public Sprite bedSprite;
    public AudioClip newDayClip;
    public GameObject exclamationMark;

    private AudioSource audioSource;
    void Start()
    {
        isPlayerNear = false;
        audioSource = GetComponent<AudioSource>();
        if (audioSource == null)
        {
            Utils.LogWarning("Bed: Cannot play sound, audio source is null");
            return;
        }
        audioSource.clip = newDayClip;
        audioSource.loop = false;
        canShow = true;
    }
    public void SleepNextMorning(string _, string _1)
    {
        if (GameTimeManager.instance != null)
        {
            GameTimeManager.instance.Minute = 0;
            GameTimeManager.instance.Hour = 8;
            GameTimeManager.instance.Day += 1;
            Utils.Log("Bed: sleep until the next morning");
            ToastNotification.Show("Good morning! A new day starts");
            if (audioSource) audioSource.Play();
        }
        else
        {
            Utils.LogError("Bed: game time manager is null");
        }
    }
    public void SleepTillTaskStart(string _, string _1)
    {
        if (GameTimeManager.instance != null)
        {
            if (GameTimeManager.instance.scheduledEvents.Count > 0)
            {
                var s = GameTimeManager.instance.scheduledEvents.Peek();
                if (s != null && s.time != null)
                {
                    GameTimeManager.instance.SetTime(s.time.year, s.time.month, s.time.day, s.time.hour, s.time.minute - 2);
                    ToastNotification.Show("You sleeped till the next task starts");
                    if (audioSource) audioSource.Play();
                }
                else
                {
                    ToastNotification.Show("You don't have any scheduled tasks", "alert");
                }
            }
            else
            {
                ToastNotification.Show("You don't have any scheduled tasks", "alert");
            }
        }
        else
        {
            Utils.LogError("Bed: game time manager is null");
        }
    }
    // Update is called once per frame
    void Update()
    {
        if (GameTimeManager.instance != null)
        {
            var e = GameTimeManager.instance.NextEventTime();
            if (e != null)
            {
                var cur = GameTimeManager.instance.GetGameTime();
                exclamationMark.SetActive(e - cur > 10);
            }
        }
        if (isPlayerNear && canShow && (Input.GetKeyDown(interactKey) || interactKey == KeyCode.None))
        {
            if (ShowOptions.instance != null && ShowOptions.instance.gameObject.activeSelf == false)
            {
                ShowOptions.instance.Show3Options(bedSprite, "Go to bed?",
            SleepNextMorning, SleepTillTaskStart, null,
            "Sleep until the next morning", "Sleep until the next task starts");
            }
            canShow = false;
        }
    }
    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            isPlayerNear = true;
        }
    }

    void OnTriggerExit2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            isPlayerNear = false;
            MessageBridge.HideSimulatedDesktop();
            canShow = true;
        }
    }
}
