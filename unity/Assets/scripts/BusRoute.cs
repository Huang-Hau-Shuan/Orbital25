using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Splines;
using UnityEngine.UI;
[System.Serializable]
public class BusStopPair
{
    public int key; //the index of the point on the spline
    public GameObject value; // the corresponding BusStop GameObject
}
public class BusRoute : MonoBehaviour
{
    public GameObject busObject;
    public Button getOffButton;
    public SplineContainer splineContainer;
    public string lineName;
    public List<BusStopPair> busStops;
    public float waitTime;
    public float speed = 1;
    private Spline spline;
    private bool isMoving = false;
    private int currentStopIndex = 0;
    //use dictionary for faster and more convenient look up
    private Dictionary<string, int> _busStops = new();
    //initializing bus stops must come before BusManager.start
    private void Awake()
    {
        int index = 0;
        foreach (var busStopPair in busStops)
        {
            if (busStopPair.value == null)
            {
                Utils.LogError("Bus Route " + lineName + ": bus stop is null");
                continue;
            }
            busStopPair.value.GetComponent<BusStop>().AddAvailableLine(this);
            _busStops[busStopPair.value.name] = index;
            index++;
        }
        spline = splineContainer.Spline;
    }
    private void Start()
    {
    }
    private void Update()
    {

    }
    public bool HasStop(string stopName)
    {
        return _busStops.ContainsKey(stopName);
    }
    //Teleport the bus toward a bus stop
    public void MoveImmediatelyToStop(string stopName)
    {
        if (busStops == null)
        {
            Utils.LogError("Bus Route " + lineName + ": busStops is null");
            return;
        }
        int index = _busStops[stopName];
        currentStopIndex = index;
        var pair = busStops[index];
        if (pair != null)
        {
            Utils.Log("Move bus to " + pair.value.name + "which is the " + pair.key.ToString() + " knot on spline");
            //find the position and tangent of that spline point
            float t = spline.ConvertIndexUnit(pair.key, PathIndexUnit.Knot, PathIndexUnit.Normalized);
            SetBusPos(t);
        }
        else
        {
            Utils.LogError("Stop not found: " + stopName);
        }
    }
    //let the bus start moving along the spline till the destination
    public void MoveBus(string startStopName, string targetStopName = null, bool nonStop = false)
    {
        int fromIndex = _busStops[startStopName];
        int toIndex = targetStopName == null ? busStops.Count - 1 : _busStops[targetStopName];
        MoveImmediatelyToStop(startStopName);
        StartCoroutine(MoveAndStopAtEach(fromIndex, toIndex, nonStop));
    }
    public void GetOff()
    {
        GetOff(busStops[currentStopIndex].value.name);
    }
    public void GetOff(string stopName)
    {
        if (busStops == null)
        {
            Utils.LogError("BusRoute.GetOff: stopName is null");
        }
        else if (_busStops.ContainsKey(stopName))
        {
            if (stopName == "PGP" || stopName == "PGP Foyer")
            {
                stopName = "Room";
            }
            if (Utils.SceneExists(stopName))
            {
                GameDataManager.instance.LoadScene(stopName);
            }
            else
            {
                ToastNotification.Show("Map " + stopName + " Not Implemented", 2, "alert");
            }
        }
        else
        {
            Utils.LogError("BusRoute.GetOff: invalid stopName for line " + lineName);
        }
    }

    private int FindClosestKnotToBus()
    {
        float minDist = float.MaxValue;
        int closestIndex = 0;
        for (int i = 0; i < spline.Count; i++)
        {
            Vector3 point = spline[i].Position;
            float dist = Vector3.Distance(busObject.transform.position, point);
            if (dist < minDist)
            {
                minDist = dist;
                closestIndex = i;
            }
        }
        return closestIndex;
    }
    private IEnumerator MoveAndStopAtEach(int fromIndex, int toIndex, bool nonStop)
    {
        for (int i = fromIndex; i < toIndex; i++)
        {
            currentStopIndex = i;
            yield return MoveAlongSpline(busStops[i].key, busStops[i + 1].key);
            ToastNotification.Show("We are arriving at: " + busStops[i + 1].value.name, 1, "info");
            // Wait at this stop
            if (!nonStop)
            {
                getOffButton.gameObject.SetActive(true);
                currentStopIndex = i + 1;
                yield return new WaitForSeconds(waitTime);
                getOffButton.gameObject.SetActive(false);
            }
        }
        //Force get off
        getOffButton.onClick.Invoke();
    }
    private IEnumerator MoveAlongSpline(int startKnot, int endKnot)
    {
        isMoving = true;

        float startT = spline.ConvertIndexUnit(startKnot, PathIndexUnit.Knot, PathIndexUnit.Normalized);
        float endT = spline.ConvertIndexUnit(endKnot, PathIndexUnit.Knot, PathIndexUnit.Normalized);

        float travelTime = Mathf.Abs(endT - startT) * spline.GetLength();
        float duration = travelTime / speed;
        float time = 0f;

        while (time < duration)
        {
            float t = Mathf.Lerp(startT, endT, time / duration);
            SetBusPos(t);
            time += Time.deltaTime;
            yield return null;
        }

        // Final position
        busObject.transform.SetPositionAndRotation(
            GetKnotPosition(endKnot), GetKnotDirection(endKnot));

        isMoving = false;
    }

    //get the absolute position of a point on the spline
    private Vector3 GetKnotPosition(int idx)
    {
        return new Vector3(spline[idx].Position.x, spline[idx].Position.y, spline[idx].Position.z) + transform.position;
    }
    //get the absolute direction of a point on the spline
    private Quaternion GetKnotDirection(int idx)
    {
        float t = spline.ConvertIndexUnit(idx, PathIndexUnit.Knot, PathIndexUnit.Normalized);
        if (spline.Evaluate(t, out var _position, out var tangent, out var up))
        {
            var ret = Quaternion.LookRotation(up, tangent);
            ret *= Quaternion.Euler(up * -90);
            return ret;
        }
        return new Quaternion(0, 0, 0, 1);
    }
    private void SetBusPos(float t)
    {
        if (spline.Evaluate(t, out var pos, out var tan, out var up))
        {
            busObject.transform.SetPositionAndRotation(new Vector3(pos.x, pos.y, pos.z) + transform.position, Quaternion.LookRotation(up, tan) * Quaternion.Euler(up * -90));
        }
    }
}
