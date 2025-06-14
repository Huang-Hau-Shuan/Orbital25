using UnityEngine;

public class SingaporeMapManager : MonoBehaviour
{
    public MoveToPoint plane;
    public BusRoute route;
    private bool startToMove = false;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if (startToMove) { return; }
        if (plane.hasArrived) {
            startToMove = true;
            route.MoveBus("Changi Airport");
        }
    }
}
