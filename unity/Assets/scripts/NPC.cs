using UnityEngine;
using TMPro;
using UnityEngine.UI;
using UnityEditor;

public class NPC : MonoBehaviour
{
    public NPCDialogue dialogueData; 
    public GameObject dialoguePanel;
    public TMP_Text dialogueText, nameText;
    public Image portraitImage;

    private int dialogueIndex; // to know what line of dialogue we're on
    private bool isTyping, isDialogueActive;
}
