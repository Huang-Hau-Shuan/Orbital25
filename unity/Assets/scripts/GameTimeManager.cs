using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

public class GameTimeManager : MonoBehaviour
{
    [Header("Time Settings")]
    public int minutesPerTick = 1;
    public float realSecondsPerTick = 1f;
    [Header("Text Output")]
    public Text date_text = null;
    public Text time_text = null;


    private int _year = 2025;
    private int _month = 12;
    private int _day = 31;
    private int _hour = 23;
    private int _minute = 50;

    private float timer;
    private bool isPaused = true;
    public static GameTimeManager instance;
    private void Start()
    {
        instance = this;
        if (!Utils._debug)
        {
            if (date_text != null)
            {
                Destroy(date_text);
                date_text = null;
            }
            if (time_text != null)
            {
                Destroy(time_text);
                time_text = null;
            }
        }
        else
        {
            UpdateText();
        }
        MessageBridge.RegisterUnityMessageHandler("getTime", gameObject.name, "OnGetTime", true);
    }
    void Update()
    {
        if (!isPaused) 
            timer += Time.deltaTime;
        while (timer >= realSecondsPerTick)
        {
            timer-=realSecondsPerTick;
            AdvanceMinutes(minutesPerTick);
        }
        UpdateText();
    }
    public void StartTimer() => isPaused = false;
    public void PauseTimer() => isPaused = true;

    public void AdvanceMinutes(int minutes)
    {
        Minute += minutes;
    }

    public int Year
    {
        get => _year;
        set => _year = value;
    }

    public int Month
    {
        get => _month;
        set
        {
            int m = ((value - 1) % 12 + 12) % 12; // Positive remainder: 0-11
            _month = m + 1;                       // Month: 1-12
            int yearAdjust = (value - 1 - m) / 12; 
            Year += yearAdjust;
        }
    }

    public int Day
    {
        get => _day;
        set
        {
            int maxDays = DaysInMonth(Month, Year);
            _day = value;
            while (_day > maxDays)
            {
                _day-=maxDays;
                Month++;
                maxDays = DaysInMonth(Month, Year);
            }
            while (_day < 1) //every month starts from day 1 not 0
            {
                Month--;
                maxDays = DaysInMonth(Month, Year);
                _day += maxDays;
            }
        }
    }

    public int Hour
    {
        get => _hour;
        set
        {
            _hour = value % 24;
            Day += value / 24;
            if (_hour < 0) 
            { 
                _hour += 24;
                Day -= 1;
            }
        }
    }

    public int Minute
    {
        get => _minute;
        set
        {
            _minute = value%60;
            Hour += value / 60;
            if (_minute < 0){ 
                _minute += 60;
                Hour -= 1;
            }
        }
    }

    //check the number of days in a specific month
    public static int DaysInMonth(int month, int year)
    {
        if (month == 2)
        {
            // Leap year
            return (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) ? 29 : 28;
        }

        return month switch
        {
            4 or 6 or 9 or 11 => 30,
            _ => 31,
        };
    }
    public void SetTime(int h, int m)
    {
        Minute = m; Hour = h;
    }
    public void SetDate(int y, int m, int d)
    {
        Day = d;Month = m;Year = y;
    }
    public void SetTime(int y, int mo, int d, int h, int mi)
    {
        SetTime(h, mi);
        SetDate(y, mo, d);
    }
    public string GetFormattedTime() => $"{Hour:00}:{_minute:00}";
    public string GetFormattedDate() => $"{Day:00}/{Month:00}/{Year:0000}";
    private void UpdateText()
    {
        if (Utils._debug)
        {
            if (date_text != null)
                date_text.text = GetFormattedDate();
            if (time_text != null)
                time_text.text = GetFormattedTime();
        }
    }
    public void OnGetTime()
    {
        MessageBridge.SendMessage("setTime", 
            $"{{\"year\":{Year},\"month\":{Month},\"day\":{Day},\"hour\":{Hour},\"minute\":{Minute}}}");
    }
}
