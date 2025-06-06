// Most of the NUS apps has a login page and a main page,
// so we wrap it to a template component for unified login behavior
import { useState } from "react";
import { dbgLog } from "../MessageBridge";
export type LoginProps = {
  setLogin: (_: boolean) => void;
};
interface NUSPageProps {
  loginPage: React.FC<LoginProps>;
  mainPage: React.FC<LoginProps>;
  appName?: string;
}

const NUSApp = (props: NUSPageProps) => {
  const [login, setLogin] = useState(false);
  const setNUSAppLogin = (login: boolean) => {
    setLogin(login);
    if (login) dbgLog("Login to " + (props.appName ? props.appName : ""));
    else dbgLog("Logout from " + (props.appName ? props.appName : ""));
  };
  return login ? (
    <props.mainPage setLogin={setNUSAppLogin} />
  ) : (
    <props.loginPage setLogin={setNUSAppLogin} />
  );
};
export default NUSApp;
