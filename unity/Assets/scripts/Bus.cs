using UnityEngine;

public class Bus : MonoBehaviour
{
    public BusLineLogo line;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        line.SetBusLine("A2");
    }

    // Update is called once per frame
    void Update()
    {

    }

    public void SetBusLine(string busline)
    {
        line.SetBusLine(busline);
    }
}
