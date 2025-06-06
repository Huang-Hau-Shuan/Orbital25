import { useEffect, useState } from "react";
import "./css/email.css";
import {
  onSimuNUSMessage,
  SendToSimuNUS,
  dbgErr,
  dbgLog,
} from "../MessageBridge";
import GuideButton from "./GuideButton";
import EmailBody from "./emails/registry";

interface EmailMeta {
  id: string;
  subject: string;
  unread: boolean;
}

const EmailApp = () => {
  const [emails, setEmails] = useState<EmailMeta[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    SendToSimuNUS("getEmailList", {});
    onSimuNUSMessage("setEmailList", (data) => {
      if (Array.isArray(data)) {
        dbgLog(`Received ${data.length} emails`);
        setEmails(data);
      } else dbgErr("Received Invalid Emails");
    });
  }, []);
  const openEmail = (id: string) => {
    setSelectedId(id);
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, unread: false } : email
      )
    ); //locally remove red dot
    SendToSimuNUS("markEmailRead", id);
  };
  const selectedEmail = emails.find((e) => e.id === selectedId);
  return (
    <div className="email-app">
      <div className="sidebar">
        <h2>Inbox</h2>
        <ul className="email-list">
          {emails.map((email) => (
            <GuideButton
              key={email.id}
              id={"email-" + email.id}
              className="email-item"
              onClick={() => openEmail(email.id)}
            >
              <span
                style={{
                  fontWeight: email.unread ? "bold" : "normal",
                }}
              >
                {email.subject}
              </span>
              {email.unread && <span className="unread-dot" />}
            </GuideButton>
          ))}
        </ul>
      </div>
      <div className="content">
        <div className="email-subject">{selectedEmail?.subject}</div>
        <div className="email-body">
          {selectedId && <EmailBody id={selectedId}></EmailBody>}
        </div>
      </div>
    </div>
  );
};

export default EmailApp;
