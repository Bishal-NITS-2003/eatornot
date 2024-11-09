'use client';

import React, { useEffect, useState, useRef } from 'react';
import ProfileCard from '../components/ProfileCard';
import { Mic, Camera } from 'lucide-react';
import foodRestrictionsData from '../data/data.json';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [userDiseases, setUserDiseases] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null); // Ref for video element

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const checkFoodConsumption = (foodItem) => {
    const food = foodRestrictionsData.foodItems.find(item => item.name.toLowerCase() === foodItem.toLowerCase());
    if (!food) {
      setResult(`No restriction found for ${foodItem}. You can consume it.`);
      return;
    }
    const conflictingDiseases = food.cannotConsume.filter(disease => userDiseases.includes(disease));
    if (conflictingDiseases.length > 0) {
      setResult(`You cannot consume ${foodItem} due to: ${conflictingDiseases.join(', ')}`);
    } else {
      setResult(`You can consume ${foodItem}.`);
    }
  };

  const handleSearch = () => {
    checkFoodConsumption(inputText.trim());
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.onstart = () => {
        setIsListening(true);
        setInputText("Please start speaking....");
      };
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };
      const handleVoiceClick = () => {
        if (isListening) {
          recognition.stop();
        } else {
          recognition.start();
        }
      };
      recognition.handleVoiceClick = handleVoiceClick;
      window.recognition = recognition;
    }
  }, [isListening]);

  const handleVoiceClick = () => window.recognition && window.recognition.handleVoiceClick();

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const captureImage = () => {
    if (cameraStream) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
      setIsCameraOpen(false);
      cameraStream.getTracks().forEach(track => track.stop()); // Stop the camera
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-900 text-white">
      <ProfileCard setUserDiseases={setUserDiseases} />

      <div className="flex-1 p-6">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full h-48 border-2 border-dashed border-gray-700 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-200"
        >
          {file ? (
            <p className="text-green-400">{file.name}</p>
          ) : (
            <p className="text-gray-400">Drag and drop an image, or click to select</p>
          )}
        </div>

        <div className="mt-8">
          <label className="block mb-2 text-sm font-medium text-green-500">Enter Text</label>
          <div className="flex items-center border rounded-lg border-gray-700 bg-gray-800 px-4 py-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type here..."
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            />
            <button onClick={handleVoiceClick} className="ml-2 p-2 rounded-full text-green-500 hover:text-green-400 transition duration-200">
              <Mic />
            </button>
            <button onClick={handleCameraClick} className="ml-2 p-2 rounded-full text-green-500 hover:text-green-400 transition duration-200">
              <Camera />
            </button>
          </div>

          <button
            onClick={handleSearch}
            className="my-4 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Search
          </button>

          <div className="mt-4 text-white">
            <p>{result}</p>
          </div>

          {/* Display the captured image in a separate preview section */}
          {capturedImage && (
            <div className="mt-8">
              <h3 className="text-green-500 text-sm font-medium mb-2">Captured Image Preview:</h3>
              <div className="rounded-lg overflow-hidden border border-gray-700">
                <img src={capturedImage} alt="Captured Preview" className="object-cover" width={"500px"} height={"500px"}/>
              </div>
            </div>
          )}

          {/* Camera Preview */}
          {isCameraOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-auto max-w-full h-auto max-h-full rounded-lg"
              />
              <button
                onClick={captureImage}
                className="absolute bottom-10 bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Capture
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
