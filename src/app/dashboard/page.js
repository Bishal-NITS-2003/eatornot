"use client";

import React, { useEffect, useState, useRef } from "react";
import ProfileCard from "../components/ProfileCard";
import { Mic, Camera, X } from "lucide-react";
import { set } from "mongoose";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // Store the base64 image URL
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [userDiseases, setUserDiseases] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const fileInputRef = useRef(null); // Ref for file input element
  const videoRef = useRef(null); // Ref for video element

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  };

  const checkFoodConsumption = async (foodItem) => {
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foodItem, userDiseases }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        console.error(data.message);
        setResult("Error occurred while checking food consumption.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("Error occurred while checking food consumption.");
    }
  };

  const handleSearch = async  () => {
    if(file) {
      setResult("Loading...");
      const rawBase64 = imageSrc.replace(/^data:image\/\w+;base64,/, '');
      console.log("Base64", rawBase64);
      try {
        const response = await fetch("/api/detectFood", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ base64Image:rawBase64 })
        });
        
        const data = await response.json();
        if (data.success) {
          // Pass the ingredients to checkFoodConsumption function
          console.log(data.ingredients);
          checkFoodConsumption(data.ingredients);
        } else {
          setResult("Error occurred while fetching ingredients.");
        }
      } catch (error) {
        setResult("Error occurred while fetching ingredients.");
        console.error(error);
      }

    } else if (inputText.trim()) {
      setResult("Loading...");
      // Proceed with text-based search
      checkFoodConsumption([inputText.trim()]);
    } else {
      setResult("Please select an image or enter a food item to search.");
    }
   
  };

  // useEffect for speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.onstart = () => {
        setIsListening(true);
        setInputText("Please start speaking....");
      };
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
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

  const handleVoiceClick = () =>
    window.recognition && window.recognition.handleVoiceClick();
  // useEffect for speech recognition




  // useEffect for open camera
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };
  // useEffect for open camera

  const captureImage = () => {
    if (cameraStream) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
          // Log the base64 URL
      console.log("Captured Image Base64 URL:", dataUrl);
      setImageSrc(dataUrl);
      setIsCameraOpen(false);
      cameraStream.getTracks().forEach((track) => track.stop()); // Stop the camera
    }
  };

  const handleFileChange = (e) => {
    setFile(null);
    setResult("");
    setImageSrc(null); // Reset the image source
    setInputText(""); // Reset the input text
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      convertToBase64(selectedFile).then(setImageSrc);
    }
  };

  // Handle image drop event
  const handleDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      const base64Image = await convertToBase64(droppedFile);
      setImageSrc(base64Image);
      setFile(droppedFile);
    }
  };

  // Allow dropping of files
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Remove image function
  const handleRemoveImage = () => {
    setFile(null);
    setResult("");
    setImageSrc(null); // Reset the image source
    setInputText(""); // Reset the input text
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-900 text-white">
      <ProfileCard setUserDiseases={setUserDiseases} />

     <div className="flex-1 p-6">
  <div
    onDrop={handleDrop}
    onDragOver={handleDragOver}
    className="w-full h-48 border-2 border-dashed border-gray-700 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-200 relative"
  >
    {file ? (
      <p className="text-green-400">{file.name}</p>
    ) : (
      <p className="text-gray-400">Drag and drop an image, or click to select</p>
    )}
    
    {/* Invisible file input */}
    <input
      type="file"
      ref={fileInputRef}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      onChange={handleFileChange}
    />
  </div>



        {/* Image preview (from drop or file selection or camera capture) */}
        {/* Image preview (from drop or file selection or camera capture) */}
       

        <div className="mt-8">
          <label className="block mb-2 text-sm font-medium text-green-500">
            Enter Text
          </label>
          <div className="flex items-center border rounded-lg border-gray-700 bg-gray-800 px-4 py-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {setResult("");setInputText(e.target.value)}}
              placeholder="Type here..."
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            />
            <button
              onClick={handleVoiceClick}
              className="ml-2 p-2 rounded-full text-green-500 hover:text-green-400 transition duration-200"
            >
              <Mic />
            </button>
            <button
              onClick={handleCameraClick}
              className="ml-2 p-2 rounded-full text-green-500 hover:text-green-400 transition duration-200"
            >
              <Camera />
            </button>
          </div>
          {imageSrc && (
          <div className="mt-4 relative" style={{ width: "fit-content" }}>
            <h3 className="text-green-500 text-sm font-medium mb-2">
              Selected Image Preview:
            </h3>
            <img
              src={imageSrc}
              width={"500px"}
              alt="Selected Preview"
              className="rounded-lg object-cover"
            />
            {/* Remove image button */}
            <button
              onClick={handleRemoveImage}
              className="absolute top-5 right-0 p-2 text-red-500 hover:text-red-400 transition duration-200"
            >
              <X size={50} />
            </button>
          </div>
        )}

          <button
            onClick={handleSearch}
            className="my-4 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Eat or Not
          </button>

          <div className="mt-4 text-white">
            <p>{result}</p>
          </div>

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
