using UnityEngine;

public class MoveToPoint : MonoBehaviour
{
    [SerializeField] private Transform targetPoint;
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float stopDistance = 0.01f;
    [SerializeField] private string arriveMessage = null;

    public bool hasArrived = false;

    void Update()
    {
        if (hasArrived || targetPoint == null)
            return;

        Vector3 direction = targetPoint.position - transform.position;
        float distance = direction.magnitude;

        if (distance <= stopDistance)
        {
            hasArrived = true;
            if (arriveMessage != null)
            {
                MessageBridge.SendMessage("arriveAt", arriveMessage);
            }
            return;
        }

        Vector3 move = direction.normalized * moveSpeed * Time.deltaTime;
        if (move.magnitude > distance)
            move = direction;

        transform.position += move;
    }
}
