import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import './home.css';
import leftBg1svg from "./assets/leftbg1svg.svg"
import leftBg2svg from "./assets/leftbg2svg.svg"
import { ToastContainer, toast } from 'react-toastify';

export default function Home() {
  const [image, setImage] = useState<File | Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to the file input

  useEffect(() => {
    if (preview) {
      return () => URL.revokeObjectURL(preview);
    }
  }, [preview]);

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
      setFileUploaded(true);
    }
  };



  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            setImage(blob);
            setPreview(URL.createObjectURL(blob));
          }
        });
      }
    }
  };

  const getPrescriptionFromLlama = async (disease: string, confidence: number) => {
    const apiKey = "";
    const requestBody = {
      messages: [
        {
          role: "system",
          content: "You are a professional dermatologist. Based on the patient's diagnosis, please provide a prescription and medical advice in a structured format that can be easily parsed. Your response must follow this exact format:\n\n<diseaseData>\n  <diseaseName>Name of the skin condition</diseaseName>\n  \n  <medications>\n    <medication>\n      <medicineName>First medication name</medicineName>\n      <dosage>Precise dosage (e.g., 10mg)</dosage>\n      <frequency>How often to take (e.g., twice daily)</frequency>\n      <duration>How long to take (e.g., 7 days)</duration>\n      <specialInstructions>Any special instructions (e.g., take with food)</specialInstructions>\n    </medication>\n    <!-- You can add more medication blocks for additional prescriptions -->\n  </medications>\n  \n  <advice>\n    <point>First specific advice point about treatment or lifestyle</point>\n    <point>Second specific advice point</point>\n    <!-- Add more advice points as needed -->\n  </advice>\n</diseaseData>\n\nThe response MUST be in this exact XML format with no extra text before or after, as it will be parsed programmatically.",
        },
        {
          role: "user",
          content: `The patient has been diagnosed with ${disease} with a confidence level of ${confidence}%. Please provide a prescription and medical advice.`,
        },
      ],
      model: "",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    };
    console.log(requestBody.messages);
    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(response);
        const prescription = data.choices[0]?.message?.content || "No prescription available.";
        return prescription;
      } else {
        throw new Error(data?.error?.message || "Error generating prescription.");
      }
    } catch (error) {
      console.error("Error calling LLaMA:", error);
      return "Error generating prescription.";
    }
  };

  const sendToAPI = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", image);
    try {
      const response = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setLoading(false);
      if(data.confidence <= 90)
      {
        toast.error("Please upload a clear and fresh picture!");
      }
      else{
        const prescription = await getPrescriptionFromLlama(data.disease, data.confidence);
      navigate("/result", { state: { disease: data.disease, confidence: data.confidence, prescription } });
      }
    } catch (error) {
      setLoading(false);
      setError("Error sending image to API:" + error);
    }
  };

  const handleReupload = () => {
    setFileUploaded(false); // Reset the state to show the upload button again
    setImage(null); // Clear the selected image
    setPreview(null); // Clear the preview
    setSelectedFile(null); // Clear the selected file
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  return (
    <>
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <h2 className="gradient-text">SkinDoc</h2>
        </div>
        <div className="navbar-links">
          <a href="/aboutus" className="nav-link">About Us</a>
        </div>
      </nav>
      <div className="home-container">
        {/* Left Panel */}
        <div className="left-panel">
          <motion.div
            className="branding"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="gradient-text">SkinDoc</h1>
            <p className="tagline">Advanced Skin Disease Detection</p>
          </motion.div>
          <div className="features">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p>✨ Instant AI Diagnosis</p>
              <p>📸 Upload Images</p>
              <p>🔍 Detailed Analysis Report</p>
              <p>💊 Personalized Treatment Plans</p>
            </motion.div>
          </div>
          <div className="background-div">
            {/* Background Image */}
            <img
              src={leftBg1svg}
              alt="Background"
              className="background-img-1"
            />
            {/* Overlay Image */}
            <img
              src={leftBg2svg}
              alt="Overlay"
              className="background-img-2"
            />
          </div>
        </div>
        {/* Right Panel */}
        <div className="right-panel">
          <motion.div
            className="upload-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="upload-label">Upload Image for Diagnosis</h2>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              {!fileUploaded ? (
                <label
                  title="Click to upload"
                  htmlFor="button2"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    border: '2px dotted #6b7280',
                    borderRadius: '16px',
                    backgroundColor: '#f9fafb',
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  <img
                    style={{ width: '24px', height: '24px' }}
                    src="https://www.svgrepo.com/show/485545/upload-cicle.svg"
                    alt="file upload icon"
                  />
                  <div>
                    <span style={{ display: 'block' }}>Upload a file</span>
                    <span style={{ fontSize: '12px', marginTop: '4px' }}>Max 2 MB</span>
                  </div>
                </label>
              ) : (
                <div></div>
              )}
              <input
                hidden
                type="file"
                name="button2"
                id="button2"
                ref={fileInputRef} // Attach the ref to the file input
                onChange={handleFileChange}
              />
            </div>
            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="preview-image" />
              </div>
            )}
            <div className="action-buttons">
            {fileUploaded && (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: '20px' // Optional: Adds some spacing above the buttons
  }}>
    {/* Reupload Button */}
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%', // Adjust width as needed
        height: '50px', // Fixed height
        backgroundColor: '#f0f0f0', // Example background color
        border: '1px solid #ccc', // Example border
        borderRadius: '8px', // Rounded corners
        cursor: 'pointer',
      }}
      onClick={handleReupload} // Reupload functionality
    >
      Reupload
    </div>

    {/* Next Step Button */}
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%', // Adjust width as needed
        height: '50px', // Fixed height
        background: "linear-gradient(90deg, #3a7bd5, #00d2ff)", // Example background color (blue)
        color: '#fff', // White text
        border: 'none',
        borderRadius: '8px', // Rounded corners
        cursor: 'pointer',
      }}
      onClick={sendToAPI} // Next Step functionality
    >
      {loading ? "Analyzing..." : "Next Step →"}
    </div>
  </div>
)}
            </div>
            {loading && (
              <div className="loading-message">Analyzing your image...</div>
            )}
            {error && (
              <div className="error-message">{error}</div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
    <ToastContainer />
    </>
    
  );
}