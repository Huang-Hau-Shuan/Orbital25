//An overlay to cover the iframe and webview, preventing them from intercepting windows event
const Overlay = ({ visible }: { visible: boolean }) => {
  return visible ? <div className="drag-overlay" /> : null;
};

export default Overlay;
