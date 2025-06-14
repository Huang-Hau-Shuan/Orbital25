using UnityEngine;

public class Bus : MonoBehaviour
{
    public BusLineLogo line;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        //hide the bus until the user decide to take which line
        gameObject.SetActive(false);
    }

    public void SetBusLine(string busline)
    {
        line.SetBusLine(busline);
    }
}
