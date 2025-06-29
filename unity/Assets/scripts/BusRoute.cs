using System.Collections;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using UnityEngine;
using UnityEngine.Splines;
using UnityEngine.UI;
[System.Serializable]
public class BusStopPair
{
    public int key; //the index of the point on the spline
    public BusStop value; // the corresponding BusStop GameObject
}
public class BusRoute : MonoBehaviour
{
    public bool notify = true;
    public GameObject busObject;
    public Button getOffButton;
    public Button switchLineButton;
    public SplineContainer splineContainer;
    public string lineName;
    public List<BusStopPair> busStops;
    public float waitTime;
    public float speed = 1;
    private Spline spline;
    public bool isMoving = false;
    private int currentStopIndex = 0;
    //use dictionary for faster and more convenient look up
    private Dictionary<string, int> _busStops = new();
    //initializing bus stops must come before BusManager.start
    public delegate void OnBusArrive(string stop);
    public OnBusArrive onBusArrive = null;
    static public readonly Dictionary<string, string> GetOffTable = new Dictionary<string, string>{
        {"PGP","PGP Foyer"},
        {"Opp UHC", "UHC"}
    };
    private void Awake()
    {
        int index = 0;
        foreach (var busStopPair in busStops)
        {
            if (busStopPair.value == null)
            {
                Utils.LogError("Bus Route " + lineName + ": bus stop " + busStopPair.key + " is null");
                continue;
            }
            if (index != busStops.Count - 1)
            {
                // add this bus route to the available lines of the bus stop if it is not the last stop
                // for the buses that the first stop is also the last stop the player can still get on because the bus route is added at the begining
                busStopPair.value.AddAvailableLine(this);
            }
            _busStops[busStopPair.value.name] = index;
            index++;
        }
        spline = splineContainer.Spline;
    }
    private void Start()
    {
        if (getOffButton && switchLineButton)
        {
            getOffButton.gameObject.SetActive(false);
            switchLineButton.gameObject.SetActive(false);
        }
    }
    //private void Update()
    //{

    //}
    public bool HasStop(string stopName)
    {
        return _busStops.ContainsKey(stopName);
    }
    public void StopBus()
    {
        StopAllCoroutines();
        busObject.SetActive(false);
    }
    //Teleport the bus toward a bus stop
    public void MoveImmediatelyToStop(string stopName)
    {
        if (busStops == null)
        {
            Utils.LogError("Bus Route " + lineName + ": busStops is null");
            return;
        }
        if (!_busStops.ContainsKey(stopName))
        {
            Utils.LogError("BusRoute " + lineName + ": " + stopName + " not in stored bus stops, valid stop names are " + _busStops.Keys.ToString());
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
        if (string.IsNullOrEmpty(startStopName))
        {
            Utils.LogError("BusRoute.MoveBus: failed to move bus. StartStopName is null");
        }
        if (!_busStops.ContainsKey(startStopName))
        {
            Utils.LogError("BusRoute " + lineName + ": " + startStopName + " not in stored bus stops, valid stop names are " + _busStops.Keys.ToString());
            return;
        }
        if (targetStopName != null && !_busStops.ContainsKey(targetStopName))
        {
            Utils.LogError("BusRoute " + lineName + ": " + targetStopName + " not in stored bus stops, valid stop names are " + _busStops.Keys.ToString());
            return;
        }
        int fromIndex = _busStops[startStopName];
        if (fromIndex == busStops.Count - 1)
        {
            //the last stop is also the first stop
            fromIndex = 0;
        }
        int toIndex = targetStopName == null ? busStops.Count - 1 : _busStops[targetStopName];
        MoveImmediatelyToStop(startStopName);
        busObject.SetActive(true);
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
            if (Utils.SceneExists(stopName))
            {
                GameDataManager.instance.LoadScene(stopName);
            }
            else if (GetOffTable.ContainsKey(stopName))
            {
                var sceneName = GetOffTable[stopName];
                if (Utils.SceneExists(sceneName))
                {
                    GameDataManager.instance.LoadScene(sceneName);
                }
                else
                {
                    Utils.LogError($"ButRouts.GetOff: GetOffTable[\"{stopName}\"] = \"{sceneName}\", but this sceneName does not exist");
                }
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
            int end = busStops[i + 1].key;
            if (end < busStops[i].key)
            {
                //first go to the starting point or ending point
                yield return MoveAlongSpline(busStops[i].key, splineContainer.Splines[0].Count);
                if (end > 0)
                {
                    yield return MoveAlongSpline(0, end);
                }
            }
            else
                yield return MoveAlongSpline(busStops[i].key, end);
            busStops[i].value.SetFocus(false);
            if (notify && GameDataManager.instance)
            {
                // toastnotification and GameDataManager are only created from main menu,
                // so if GameDataManager.instance is not null, ToastNotification shouldn't be null either
                ToastNotification.Show("We are arriving at: " + busStops[i + 1].value.name, 1, "info");
            }
            MessageBridge.SendMessage("BusArrive", busStops[i + 1].value.name);
            if (GameDataManager.instance)
            {
                GameDataManager.instance.SetLastBusStop(busStops[i + 1].value.name);
            }
            busStops[i + 1].value.SetFocus(true);
            onBusArrive?.Invoke(busStops[i + 1].value.name);
            // Wait at this stop
            if (!nonStop)
            {
                if (getOffButton != null && switchLineButton != null)
                {
                    getOffButton.gameObject.SetActive(true);
                    switchLineButton.gameObject.SetActive(true);
                }
                currentStopIndex = i + 1;
                yield return new WaitForSeconds(waitTime);
                if (getOffButton != null && switchLineButton != null)
                {
                    getOffButton.gameObject.SetActive(false);
                    switchLineButton.gameObject.SetActive(false);
                }
            }

        }
        if (getOffButton != null && switchLineButton != null)
        {
            getOffButton.gameObject.SetActive(true);
            switchLineButton.gameObject.SetActive(true);
        }
    }
    private IEnumerator MoveAlongSpline(int startKnot, int endKnot)
    {
        isMoving = true;

        float startT = spline.ConvertIndexUnit(startKnot, PathIndexUnit.Knot, PathIndexUnit.Normalized);
        float endT = spline.ConvertIndexUnit(endKnot, PathIndexUnit.Knot, PathIndexUnit.Normalized);

        float travelTime = Mathf.Abs(endT - startT) * spline.GetLength();
        float duration = travelTime / speed;
        float time = 0f;
        if (getOffButton != null && switchLineButton != null)
        {
            getOffButton.gameObject.SetActive(false);
            switchLineButton.gameObject.SetActive(false);
        }
        while (time < duration)
        {
            float t = Mathf.Lerp(startT, endT, time / duration);
            SetBusPos(t);
            time += Time.deltaTime;
            yield return null;
        }

        // Final position
        if (endKnot == splineContainer.Splines[0].Count) { endKnot = 0; }
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
