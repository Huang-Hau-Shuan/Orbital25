using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Splines;
using static UnityEngine.GraphicsBuffer;
[System.Serializable]
public class BusStopPair
{
    public int key;
    public GameObject value;
}
public class BusRoute : MonoBehaviour
{
    public GameObject busObject;
    [Header("The spline container")]
    public SplineContainer splineContainer;
    [Header("The bus line name, eg. A1, D2")]
    public string lineName;
    [Header("The corresponding bus stops to a point on the spline container")]
    public List<BusStopPair> busStops;
    private Spline spline;
    private bool isMoving = false;
    //use dictionary for faster and more convenient look up
    private Dictionary<string, BusStopPair> _busStops = new();
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    private void Start()
    {
        spline = splineContainer.Spline;
        foreach (var busStopPair in busStops)
        {
            if (busStopPair.value == null)
            {
                Utils.LogError("Bus Route " + lineName + ": bus stop is null");
                continue;
            }
            _busStops[busStopPair.value.name] = busStopPair;
        }
        MoveImmediatelyToStop("PGP");
        MoveToStop("CLB",1);
    }
    private void Update()
    {

    }
    //Teleport the bus toward a bus stop
    public void MoveImmediatelyToStop(string stopName)
    {
        if (busStops == null)
        {
            Utils.LogError("Bus Route " + lineName + ": busStops is null");
            return;
        }
        var pair = _busStops[stopName];
        if (pair != null)
        {
            //find the position and tangent of that spline point
            float t = spline.ConvertIndexUnit(pair.key, PathIndexUnit.Knot, PathIndexUnit.Normalized);
            SetBusPos(t);
        }
        else
        {
            Utils.LogError("Stop not found: " + stopName);
        }
    }
    public void MoveToStop(string stopName, float speed)
    {
        if (isMoving) return;
        var target = _busStops[stopName];
        if (target != null)
        {
            int currentKnot = FindClosestKnotToBus();
            StartCoroutine(MoveAlongSpline(currentKnot, target.key, speed));
        }
        else
        {
            Debug.LogWarning("Stop not found: " + stopName);
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

    private IEnumerator MoveAlongSpline(int startKnot, int endKnot, float speed)
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
        return new Vector3(spline[idx].Position.x, spline[idx].Position.y, spline[idx].Position.z)+transform.position;
    }
    //get the absolute direction of a point on the spline
    private Quaternion GetKnotDirection(int idx)
    {
        float t = spline.ConvertIndexUnit(idx, PathIndexUnit.Knot, PathIndexUnit.Normalized);
        if (spline.Evaluate(t, out var _position, out var tangent, out var up))
        {
            var ret = Quaternion.LookRotation(up, tangent);
            ret*= Quaternion.Euler(up * -90);
            return ret ;
        }
        return new Quaternion(0, 0, 0,1);
    }
    private void SetBusPos(float t)
    {
        if (spline.Evaluate(t, out var pos, out var tan, out var up))
        {
            busObject.transform.SetPositionAndRotation(new Vector3(pos.x, pos.y, pos.z) + transform.position, Quaternion.LookRotation(up, tan) * Quaternion.Euler(up * -90));
        }
    }
}
