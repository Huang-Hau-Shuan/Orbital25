// apps/BrowserApp.tsx
const Browser = ({ path }: { path: string }) => {
  return (
    <webview
      src={path}
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
};

export default Browser;
