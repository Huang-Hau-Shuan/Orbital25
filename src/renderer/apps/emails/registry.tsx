import Offer from "./offer";
import EmailWelcome from "./welcome";

const emailRegistry: Record<string, React.FC<any>> = {
  offer: Offer,
  welcome: EmailWelcome,
};
const EmailBody = ({ id }: { id: string }) => {
  const comp = emailRegistry[id];
  return comp !== undefined ? comp({}) : <p>Failed to load Email Content</p>;
};
export default EmailBody;
