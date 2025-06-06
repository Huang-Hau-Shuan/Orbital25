// apps/PhotoVerification.tsx
import { useState, useRef, useEffect } from "react";
import "../css/photo-submission.css";
import {
  dbgErr,
  dbgLog,
  onSimuNUSMessage,
  SendToSimuNUS,
} from "../../MessageBridge";
import GuideButton from "../GuideButton";
interface ImageInfo {
  type: string;
  width: number;
  height: number;
  ratio: number;
  sizeKB: number;
}

const PhotoVerificationMain = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [info, setInfo] = useState<ImageInfo | null>(null);
  //const [error, setError] = useState<string>("");
  const [resizedUrl, setResizedUrl] = useState<string>("");
  const [resizedInfo, setResizedInfo] = useState<ImageInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // to clear it when rejecting resizing
  useEffect(() => {
    onSimuNUSMessage("photoSubmitted", () => {
      alert("Successfully uploaded image");
    });
  }, []);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKB = file.size / 1024;
    const ext = file.name.split(".").pop();

    if (!(ext == "jpg" || ext == "jpeg")) {
      alert(
        "Invalid Photo\nPlease load an image with an extention of one of the following:\n\njpg, jpeg"
      );
      setInfo(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const ratio = +(width / height).toFixed(2);
        setFile(file);
        setPreviewUrl(reader.result as string);
        setInfo({
          type: "JPEG",
          width,
          height,
          ratio,
          sizeKB: +sizeKB.toFixed(2),
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!file || !info) return;
    if (resizedUrl && resizedInfo) {
      dbgLog(resizedInfo);
      const base64 = resizedUrl.split(",")[1]; // the base 64 content without header
      SendToSimuNUS("submitPhoto", {
        filename: "resized.jpg",
        content: base64,
      });
    } else {
      dbgLog(info);
      const base64 = previewUrl.split(",")[1];
      SendToSimuNUS("submitPhoto", {
        filename: "resized.jpg",
        content: base64,
      });
    }
  };
  const handleResize = () => {
    if (file == null) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 340;
        canvas.height = 453;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, 340, 453);

        canvas.toBlob((blob) => {
          if (!blob) {
            dbgErr("Failed to create resized image blob");
            return;
          }
          const reader2 = new FileReader();
          reader2.onload = () => {
            const resizedDataUrl = reader2.result as string;
            setResizedUrl(resizedDataUrl);
            setResizedInfo({
              type: "JPEG",
              width: 340,
              height: 453,
              ratio: +(img.width / img.height).toFixed(2),
              sizeKB: Math.round((resizedDataUrl.length * (3 / 4)) / 1024),
            });
          };
          reader2.readAsDataURL(blob);
        }, "image/jpeg");
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };
  const handleReject = () => {
    setFile(null);
    setPreviewUrl("");
    setInfo(null);
    setResizedUrl("");
    setResizedInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="photo-verification">
      <div className="photo-banner">Intranet</div>
      <div className="photo-header">
        <img src="/icon/nus-full-logo.svg" alt="NUS logo" />
        <div style={{ flex: 1 }}></div>
        <h3>Computer Centre</h3>
      </div>
      <div className="photo-info">
        <h1>Online Photo Verification</h1>
        <p>
          Name: XXX
          <br />
          Matriculation/Registration number: A********
        </p>
        <p>
          Please note that the photo submitted must conform to the following
          format:
        </p>
        <ul>
          <li>The photo must predominantly show the face clearly.</li>
          <li>The photo must be saved in .jpg format.</li>
          <li>
            The photo dimension (Width by Height) must be 340 x 453 pixels.
          </li>
          <li>
            The photo must have an aspect ratio of 0.75.{" "}
            {
              "Aspect ratio is width/length. e.g. 340 by 453 pixels -> 340/453 = 0.75"
            }
          </li>
        </ul>

        <p>Please attach the photo file below:</p>
        {info && info.sizeKB > 100 && (
          <p className="error-msg">
            The file size that you have upload is more than 100 KB. Please
            upload another photo file.
          </p>
        )}
        <div className="upload-section">
          <GuideButton id="upload-photo-input">
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg"
              onChange={handleFileChange}
            />
          </GuideButton>

          <small>{"(The file size should be less than 100KB)"}</small>
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Preview" />
              {info && (
                <div className="image-info">
                  <p>
                    <strong>Image Properties</strong>
                  </p>
                  <div>Type : {info.type}</div>
                  <div>
                    Dimension : {info.width} by {info.height}
                  </div>
                  <div>Ratio : {info.ratio}</div>
                </div>
              )}
            </div>
          )}
          {info &&
            info.sizeKB <= 100 &&
            (info.width == 340 || info.height == 453 ? (
              <>
                <p>
                  This photo will be send to Office of the University Registrar
                  for verification before it is being updated into the database
                </p>
                <GuideButton
                  className="photo-submit-btn"
                  onClick={handleSubmit}
                  id="photo-submit-btn"
                  originalTag="button"
                >
                  Send
                </GuideButton>
              </>
            ) : resizedUrl && resizedInfo ? (
              <div>
                <div className="image-preview">
                  <img src={resizedUrl} alt="Resized student photo" />
                  <div className="image-info">
                    <p>
                      <strong>Resized Image Properties</strong>
                    </p>
                    <p>Type : {resizedInfo.type}</p>
                    <p>
                      Dimension : {resizedInfo.width} by {resizedInfo.height}
                    </p>
                    <p>Ratio : {resizedInfo.ratio}</p>
                  </div>
                </div>
                <p>
                  You may send the resized photo to Office of the University
                  Registrar for verification or reject it and upload another
                  photo.
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="photo-submit-btn" onClick={handleReject}>
                    Reject
                  </button>
                  <GuideButton
                    className="photo-submit-btn"
                    onClick={handleSubmit}
                    id="photo-submit-btn"
                    originalTag="button"
                  >
                    Send
                  </GuideButton>
                </div>
              </div>
            ) : (
              <>
                <p>
                  {
                    "This photo does not appear to be in the correct file type (JPEG) or dimension (Width by Height = 340 by 453 pixels). You may want to resize the image through the system."
                  }
                </p>
                <button className="photo-submit-btn" onClick={handleResize}>
                  Resize
                </button>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoVerificationMain;
