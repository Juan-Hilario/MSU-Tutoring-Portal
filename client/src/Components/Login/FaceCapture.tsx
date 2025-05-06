import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "../../styles/FaceCapture.css";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";

const FaceCapture: React.FC = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const [result, setResult] = useState<any>(null);
  const [email, setEmail] = useState<string>("");
  // const [sudoUser, setSudoUser] = useState<User>({
  //     user: { fname: "", lname: "", id: "", email: "" },
  //     role: "User",
  // });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const capture = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (!webcamRef.current) return;

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    const capturedFile = dataURLtoFile(screenshot, "capture.jpg");

    const formData = new FormData();
    formData.append("photo", capturedFile);
    formData.append("email", email);

    try {
      const response = await fetch("http://localhost:4000/api/face-auth", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");

        setLoading(false);
      }

      const data = await response.json();
      setResult(data);

      if (data === true) {
        const params = new URLSearchParams({
          email: email,
        });
        const res = await fetch(
          `http://localhost:4000/api/face/me?${params.toString()}`,
        );

        if (!res.ok) throw new Error("failed to fetch user info");

        const userData = await res.json();

        navigate("/clockin_TempAuth", { state: { sudoUser: userData } });
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error("Upload failed:", err);
    }
  };

  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // const getSudoUser = async () => {
  //     try {
  //         const params = new URLSearchParams({
  //             email: email,
  //         });
  //         const res = await fetch(`http://localhost:4000/api/face/me?${params.toString()}`);

  //         if (!res.ok) throw new Error("failed to fetch user info");

  //         const data = await res.json();
  //         setSudoUser(data);
  //     } catch (err) {
  //         console.error(err);
  //     }
  // };

  return (
    <form onSubmit={capture}>
      <div className="faceCapture">
        <div className="faceCaptureTop">
          <h1>Facial Recognition</h1>
          <h2>Please enter your email</h2>
        </div>

        <label htmlFor="email"></label>
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="webcamContainer">
          {loading ? (
            <Loading />
          ) : (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ width: 300, height: 300 }}
              className="webcam"
            />
          )}
        </div>
        <button type="submit" className="">
          Capture Photo
        </button>
        {result != null && <p className="errorMsg">{result}</p>}
      </div>
    </form>
  );
};
export default FaceCapture;
