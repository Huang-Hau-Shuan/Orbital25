// components/AppWindow.tsx
import React, { useRef, useState, useEffect } from "react";
import { useAppManager, type OpenApp } from "./context/AppContext";
import Overlay from "./Overlay";

const AppWindow = ({ app }: { app: OpenApp }) => {
  const { closeApp, bringToFront } = useAppManager();
  const [position, setPosition] = useState({
    top: 100,
    left: 100,
    width: 600,
    height: 400,
  });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const onWindowClick = () => {
    bringToFront(app);
  };
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    const rect = windowRef.current!.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPosition({
        top: e.clientY - offset.current.y,
        left: e.clientX - offset.current.x,
        width: position.width,
        height: position.height,
      });
    };

    const onMouseUp = () => {
      setDragging(false);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, position]);

  return (
    <div
      ref={windowRef}
      className="window"
      onMouseDown={onWindowClick}
      style={{
        top: position.top,
        left: position.left,
        position: "absolute",
        zIndex: app.z,
      }}
    >
      <div
        className="titlebar"
        onMouseDown={onMouseDown}
        style={{ zIndex: 9999 }}
      >
        {app.appmeta.name}
        <div className="close-btn" onClick={() => closeApp(app)}>
          x
        </div>
      </div>
      <div style={{ flex: 1, overflow: "overlay" }}>
        <app.appmeta.component {...app.appmeta.props} />
      </div>
      {/* add another layer of overlay to prevent windows events from leaking to iframe and webview */}
      <Overlay visible={dragging} />
    </div>
  );
};

export default AppWindow;
