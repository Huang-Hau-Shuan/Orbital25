using UnityEngine;
using UnityEngine.SceneManagement;

public class SingaporeMapManager : MonoBehaviour
{
    public MoveToPoint plane;
    public BusRoute route;
    private bool startToMove = false;
    public TeleportPoint teleobj = null;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        route.onBusArrive = OnArrive;
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

    void OnArrive(string name)
    {
        if (name == "Kent Ridge")
        {
            Utils.Log("Arrived at Kent Ridge, Jump to Campus Map");
            if (teleobj != null)
            {
                teleobj.Teleport();
            }
            else
            {
                Utils.LogError("SingaporeMapManager.OnArrive: Cannot show bus stops options because teleobj is null");
            }
        }
    }
}
