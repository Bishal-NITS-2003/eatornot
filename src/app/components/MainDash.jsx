"use client";

import React, { useEffect, useState, useRef } from "react";
import { Mic, Camera, X, Search, CheckCircle, AlertTriangle } from "lucide-react";
import ScrollableNews from "./ScrollableNews";

const MainDash = ({userDiseases, isSidebarOpen}) => {
    const [file, setFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null); // Store the base64 image URL
    const [result, setResult] = useState("");
    const [inputText, setInputText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [message, setMessage] = useState(''); // State to hold the message
    const [isDragOver, setIsDragOver] = useState(false); // Track the drag-over state

      // Example of news data
const foodNews = [
    { title: 'New Vegan Trends in 2024', description: 'Explore the top plant-based foods of the year!' },
    { title: 'Global Food Security Crisis', description: 'How climate change is affecting food production.' },
    { title: 'Healthy Fast Food Options', description: 'The rise of nutritious, fast food alternatives.' },
    { title: 'Food Waste and Sustainability', description: 'Solutions for reducing food waste worldwide.' },
    { title: 'The Future of Sustainable Farming', description: 'Innovations in eco-friendly agriculture.' },
    { title: 'Protein from Insects', description: 'How insects are becoming a viable protein source.' },
  ];

  const handleMessageCapture = (text) => {
    setMessage(text); // Set the message in state
  };




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

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false); // Reset drag-over state after drop
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      const base64Image = await convertToBase64(droppedFile);
      setImageSrc(base64Image);
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const fileInputRef = useRef(null); // Ref for file input element
  const videoRef = useRef(null); // Ref for video element

  
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


  const handleRemoveImage = () => {
    setFile(null);
    setResult("");
    setImageSrc(null); // Reset the image source
    setInputText(""); // Reset the input text
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
    if(userDiseases.length === 0) {
      alert("Please add atleast one disease to continue. You can add diseases in the sidebar.");
    }else{
    if(file) {
      setResult("Loading...");
      const rawBase64 = imageSrc.replace(/^data:image\/\w+;base64,/, '');
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
  }
    
   
  };


  
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
      setImageSrc(dataUrl);
      setIsCameraOpen(false);
      cameraStream.getTracks().forEach((track) => track.stop()); // Stop the camera
    }
  };







  return (
    <div
    className={`flex flex-col sm:flex-row gap-6 p-[1.5rem] w-full mx-auto ${
      isSidebarOpen ? "sm:ml-[1rem]" : "sm:ml-0"
    }`}
  >
    {/* Left Side: Drag-and-Drop Box + Text Input Field */}
    <div className="flex flex-col gap-6 sm:w-[45rem] w-full">
      {/* Drag-and-Drop Box */}
      <div className="w-100 h-64 flex items-center justify-center">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{display: 'flex'}}
          className={`relative w-full h-full border-2 border-dashed rounded-lg transition duration-200 cursor-pointer bg-gray-700 border-green-500"flex flex-col items-center justify-center`}
        >
          {imageSrc ? (
            <div className="relative flex flex-col items-center justify-center z-10">
              <p className="text-white mb-2">Image Preview:</p>
              <img
                src={imageSrc}
                alt="Selected Preview"
                className="w-72 h-48 object-cover rounded-md border border-gray-700"
              />
              <button
                onClick={handleSearch}
                className="my-10 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
              >
                Eat or Not
              </button>
              {/* Remove image button */}
              <button
                onClick={handleRemoveImage}
                className="absolute top-5 right-0 p-2 text-red-500 hover:text-red-400 transition duration-200"
              >
                <X size={24} />
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <Search size={36} className="mx-auto mb-2 text-gray-500" />
              <p>Select or drag and drop a photo of the dish </p>
            </div>
          )}
          {/* Invisible file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
            onChange={handleFileChange}
          />
        </div>
      </div>
      {/* Text Input Field */}
      <div className="mt-8 w-full">
        <label className="block mb-2 text-sm font-medium text-green-500">
          Food Name
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setResult("");
                setInputText(e.target.value);
              }}
              placeholder="Type here..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-white placeholder-gray-400 outline-none"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg shadow-lg transition duration-200"
            onClick={handleSearch}>
              Eat or Not
            </button>
          </div>
          <button
            onClick={handleVoiceClick}
            className="p-3 rounded-full bg-gray-800 border border-gray-700 text-green-500 hover:text-green-400 transition duration-200"
          >
            <Mic />
          </button>
          <button
            onClick={handleCameraClick}
            className="ml-2 p-3 bg-gray-800 rounded-full text-green-500 hover:text-green-400 transition duration-200"
          >
            <Camera />
          </button>
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
      {/* Message Box */}
      {result?(<div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6 border-l-4 border-green-500">
        <div className="flex items-center space-x-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <p className="text-lg font-semibold text-white">{result}</p>
        </div>
      </div>): <div></div>}
      
    </div>
    {/* Right Side: News Section */}
    <div className="flex-1 sm:w-1/2 lg:w-72 h-80">
      <h3 className="text-2xl font-semibold text-green-500 mb-4">Latest Food News</h3>
      <ScrollableNews newsItems={foodNews} />
    </div>
  </div>
  













    //     {file ? (
    //     <div className="relative flex flex-col items-center justify-center z-10">
    //       <p className="text-green-400">{file.name}</p>
    //     ) : (
    //       <p className="text-gray-400">
    //         Drag and drop an image, or click to select
    //       </p>
    //     )}

       
    //   </div>

    //   {/* Image preview (from drop or file selection or camera capture) */}
    //   {/* Image preview (from drop or file selection or camera capture) */}

    //   <div className="mt-8">
    //     <label className="block mb-2 text-sm font-medium text-green-500">
    //       Enter Text
    //     </label>
    //     <div className="flex items-center border rounded-lg border-gray-700 bg-gray-800 px-4 py-2">
          
         
         
    //     </div>
        

       

    

       
    //   </div>
    // </div>
  );
};

export default MainDash;
