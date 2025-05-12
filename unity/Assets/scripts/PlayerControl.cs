using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerControl : MonoBehaviour
{
    public float movePower = 10f;

    private Rigidbody2D rb;
    private Animator anim;
    Vector2 movement;
    private float sprite_scale = 0;
    private Vector3 left_direction;
    private Vector3 right_direction;
    // Start is called before the first frame update
    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        anim = GetComponent<Animator>();
        sprite_scale = transform.localScale.y;
        left_direction = new (-sprite_scale, sprite_scale, sprite_scale);
        right_direction = new (sprite_scale, sprite_scale, sprite_scale);
    }

    private void Update()
    {
        movement = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));
        if (movement.x!=0|| movement.y!=0)
        {
            anim.SetBool("isRun", true);
        }
        else
        {
            anim.SetBool("isRun", false);
        }
        Vector3 moveVelocity = Vector3.zero;
        if (movement.x < 0)
        {
            transform.localScale = left_direction;
        }
        if (movement.x > 0)
        {
            transform.localScale = right_direction;
        }
    }
    void FixedUpdate()
    {
        rb.linearVelocity = movement * movePower;
        //transform.rotation = Quaternion.identity;
    }
}