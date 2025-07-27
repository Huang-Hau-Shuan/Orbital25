using System;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

[Serializable]
public class GameTime : IComparable<GameTime>
{
    public int year, month, day, hour, minute;
    public GameTime(int year, int month, int day, int hour, int minute)
    {
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.minute = minute;
    }
    public GameTime()
    {
        year = 2025;
        month = 6;
        day = 10;
        hour = 9;
        minute = 0;
    }
    public bool IsEqualOrBefore(GameTime other)
    {
        if (other == null) return false;
        if (year > other.year) return false;
        if (year < other.year) return true;
        if (month > other.month) return false;
        if (month < other.month) return true;
        if (day > other.day) return false;
        if (day < other.day) return true;
        if (hour > other.hour) return false;
        if (hour < other.hour) return true;
        if (minute > other.minute) return false;
        return true;
    }
    public static bool operator >(GameTime _this, GameTime other)
    {
        if (_this == null || other == null) return false;
        return !_this.IsEqualOrBefore(other);
    }
    public static bool operator <(GameTime _this, GameTime other)
    {
        if (_this == null || other == null) return false;
        return _this.IsEqualOrBefore(other) && _this != other;
    }
    public int CompareTo(GameTime other)
    {
        if (other == null) return 1;
        if (this == other) return 0;
        if (this < other) return -1;
        return 1;
    }
    public static int operator -(GameTime end, GameTime start)
    {
        DateTime _start = new(start.year, start.month, start.day, start.hour, start.minute, 0);
        DateTime _end = new(end.year, end.month, end.day, end.hour, end.minute, 0);
        return (int)(_end - _start).TotalSeconds / 60;
    }
    public int MinutesFromStart()
    {
        return this - gameStartTime;
    }
    //check the number of days in a specific month
    public static int DaysInMonth(int month, int year)
    {
        if (month == 2)
        {
            // Leap year
            return IsLeapYear(year) ? 29 : 28;
        }

        return month switch
        {
            4 or 6 or 9 or 11 => 30,
            _ => 31,
        };
    }
    public static bool IsLeapYear(int year) => (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
    public string GetFormattedTime() => $"{hour:00}:{minute:00}";
    public string GetFormattedDate() => $"{day:00}/{month:00}/{year:0000}";
    public string GetFormattedFullTime() => GetFormattedDate() + " " + GetFormattedTime();

    public static readonly GameTime gameStartTime = new();
}
[Serializable]
public class TaskStartSchedule
{
    public int taskID;
    public GameTime time;
}

public class GameTimeManager : MonoBehaviour
{
    [Header("Time Settings")]
    public int minutesPerTick = 1;
    public float realSecondsPerTick = 1f;
    [Header("Text Output")]
    public Text date_text = null;
    public Text time_text = null;

    private GameTime gameTime = new();

    private float timer;
    private bool isPaused = true;
    public static GameTimeManager instance;
    public PQ.PriorityQueue<TaskStartSchedule, GameTime> scheduledEvents = new();
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
        MessageBridge.RegisterUnityMessageHandler("scheduleTaskStart", gameObject.name, "ScheduleTime", true);

        //test
#if UNITY_EDITOR
        ScheduleTime("{\"taskID\":0, \"time\":{\"year\":2025, \"month\":6,\"day\":10,\"hour\":9,\"minute\":3}}");
        TaskStartSchedule test_schedule = new();
        test_schedule.taskID = 99;
        test_schedule.time = new GameTime(2025, 8, 4, 10, 0);
        ScheduleTime(test_schedule);
#endif
    }
    void Update()
    {
        if (!isPaused)
            timer += Time.deltaTime;
        while (timer >= realSecondsPerTick)
        {
            timer -= realSecondsPerTick;
            AdvanceMinutes(minutesPerTick);
        }
        UpdateText();
        if (scheduledEvents.Count > 0)
        {
            var s = scheduledEvents.Peek();
            if (s != null && !(s.time > gameTime))
            {
                MessageBridge.SendMessage("startTask", s.taskID.ToString());
                scheduledEvents.Dequeue();
                if (scheduledEvents.Count > 0)
                    Utils.Log($"Dequeue scheduledEvents. {scheduledEvents.Count} tasks remain. Next task scheduled at {NextEventTime().GetFormattedFullTime()}");
                else
                    Utils.Log("Dequeue scheduledEvents. No remaining tasks");
            }
        }
    }
    public void StartTimer() => isPaused = false;
    public void PauseTimer() => isPaused = true;
    public GameTime NextEventTime()
    {
        if (scheduledEvents.Count == 0) return null;
        var s = scheduledEvents.Peek();
        if (s == null) return null;
        return s.time;
    }
    public void AdvanceMinutes(int minutes)
    {
        Minute += minutes;
    }

    public int Year
    {
        get => gameTime.year;
        set => gameTime.year = value;
    }

    public int Month
    {
        get => gameTime.month;
        set
        {
            int m = ((value - 1) % 12 + 12) % 12; // Positive remainder: 0-11
            gameTime.month = m + 1;                       // Month: 1-12
            int yearAdjust = (value - 1 - m) / 12;
            Year += yearAdjust;
        }
    }

    public int Day
    {
        get => gameTime.day;
        set
        {
            int maxDays = GameTime.DaysInMonth(Month, Year);
            gameTime.day = value;
            while (gameTime.day > maxDays)
            {
                gameTime.day -= maxDays;
                Month++;
                maxDays = GameTime.DaysInMonth(Month, Year);
            }
            while (gameTime.day < 1) //every month starts from day 1 not 0
            {
                Month--;
                maxDays = GameTime.DaysInMonth(Month, Year);
                gameTime.day += maxDays;
            }
        }
    }

    public int Hour
    {
        get => gameTime.hour;
        set
        {
            gameTime.hour = value % 24;
            Day += value / 24;
            if (gameTime.hour < 0)
            {
                gameTime.hour += 24;
                Day -= 1;
            }
        }
    }

    public int Minute
    {
        get => gameTime.minute;
        set
        {
            gameTime.minute = value % 60;
            Hour += value / 60;
            if (gameTime.minute < 0)
            {
                gameTime.minute += 60;
                Hour -= 1;
            }
        }
    }


    public void SetTime(int h, int m)
    {
        Minute = m; Hour = h;
    }
    public void SetDate(int y, int m, int d)
    {
        Day = d; Month = m; Year = y;
    }
    public void SetTime(int y, int mo, int d, int h, int mi)
    {
        SetTime(h, mi);
        SetDate(y, mo, d);
    }
    public void SetTime(GameTime t) => SetTime(t.year, t.month, t.day, t.hour, t.minute);
    public string GetFormattedTime() => $"{Hour:00}:{Minute:00}";
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
        MessageBridge.SendMessage("setTime", JsonUtility.ToJson(gameTime));
    }
    private void ScheduleTime(TaskStartSchedule t)
    {
        if (t == null)
        {
            Utils.LogError("GameTimeManager.ScheduleTime: TaskStartSchedule is null");
            return;
        }
        if (gameTime < t.time)
        {
            scheduledEvents.Enqueue(t, t.time);
            Utils.Log($"Task {t.taskID} scheduled at: {t.time.GetFormattedFullTime()}. Now there are {scheduledEvents.Count} tasks scheduled.");
        }
        else
        {
            //the sheduled time is before current time
            Utils.LogWarning("Task " + t.taskID + " should already happen, starting it immediately");
            MessageBridge.SendMessage("startTask", t.taskID.ToString());
        }
    }
    public void ScheduleTime(string time)
    {
        TaskStartSchedule t = JsonUtility.FromJson<TaskStartSchedule>(time);
        if (t != null)
        {
            ScheduleTime(t);
        }
        else
        {
            Utils.LogError("Invalid time: " + time);
        }
    }

    public GameTime GetGameTime() => gameTime;

    public void ResetSchedule()
    {
        scheduledEvents.Clear();
    }
}
