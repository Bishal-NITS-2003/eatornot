'use client';
import { useState, useRef, useEffect } from 'react';

export default function FoodDetector() {
  const [prediction, setPrediction] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera function
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error("Error accessing the camera: ", error);
    }
  };

  // Capture photo function
  const capturePhoto = async () => {
    const context = canvasRef.current?.getContext('2d');
    if (context && videoRef.current) {
      context.drawImage(videoRef.current, 0, 0, 300, 300); // Draw video frame on canvas
      const imageBase64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
      await analyzeImage(imageBase64); // Send image to backend for analysis
    }
  };

  // Function to analyze the image
  const analyzeImage = async (imageBase64) => {
    try {
      const response = await fetch('/api/detectFood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      });
      const data = await response.json();
      setPrediction(data.concepts);
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  // Stop the camera when the component is unmounted or when it's no longer needed
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop()); // Stop all tracks to release the camera
      }
    };
  }, []);

  return (
    <div>
      <h1>Food Item Detection</h1>
      {!isCameraOn ? (
        <button onClick={startCamera}>Start Camera</button>
      ) : (
        <div>
          <video ref={videoRef} autoPlay style={{ display: 'block', width: 300, height: 300 }} />
          <button onClick={capturePhoto}>Capture Photo</button>
          <canvas ref={canvasRef} width={300} height={300} style={{ display: 'none' }} />
        </div>
      )}

      {prediction && (
        <div>
          <h3>Predictions:</h3>
          <ul>
            {prediction.map((concept, index) => (
              <li key={index}>
                {concept.name} - Confidence: {(concept.value * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
