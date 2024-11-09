'use client';

import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import "./styles.css";
import { Mic } from 'lucide-react';

const Dashboard = () => {

  const [file, setFile] = useState(null);
  const [inputText, setInputText] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };
  // const [searchText, setSearchText] = useState('');
  // const [isListening, setIsListening] = useState(false);

  // useEffect(() => {
  //   // Check if the browser supports SpeechRecognition
  //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
  //   if (SpeechRecognition) {
  //     const recognition = new SpeechRecognition();
  //     recognition.lang = 'en-US'; // Set the language to English (US)
  //     recognition.interimResults = true; // Capture partial results during speech
      
  //     recognition.onstart = () => {
  //       setIsListening(true);
  //       setSearchText("Please start speaking....");
  //     };
  //     recognition.onend = () => setIsListening(false);
      
  //     recognition.onresult = (event) => {
  //       // Get the recognized text from the speech event
  //       const transcript = Array.from(event.results)
  //         .map((result) => result[0].transcript)
  //         .join('');
  //       setSearchText(transcript); // Update the search text in the input field
  //     };

  //     // Function to start/stop speech recognition
  //     const handleVoiceClick = () => {
  //       if (isListening) {
  //         recognition.stop();
  //       } else {
  //         recognition.start();
  //       }
  //     };

  //     // Set the handleVoiceClick function as a property on recognition for easy access
  //     recognition.handleVoiceClick = handleVoiceClick;

  //     // Attach the recognition instance to the window for easy access in onClick handler
  //     window.recognition = recognition;
  //   }
  // }, [isListening]);

  // // Access the function directly for the onClick handler
  // const handleVoiceClick = () => window.recognition && window.recognition.handleVoiceClick();

  // return (
  //   <div className="dashboard-container">
  //     <div className="left-section">
  //       <ProfileCard />
  //     </div>

  //     <div className="right-section">
  //       {/* Click and Drop Box */}
  //       <div className="drop-box">
  //         <p>Click and Drop your files here</p>
  //         <div className="drop-area">
  //           <p>Drag and Drop or Click to Upload</p>
  //         </div>
  //       </div>

  //       {/* Search Bar with Voice Option */}
  //       <div className="search-container">
  //         <input
  //           type="text"
  //           placeholder="Search"
  //           className="search-input"
  //           value={searchText}
  //           onChange={(e) => setSearchText(e.target.value)}
  //         />
  //         <button className="voice-btn" onClick={handleVoiceClick}>
  //           🎙️
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex min-h-screen w-full bg-gray-900 text-white">
      
      <ProfileCard />



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
          <button className="ml-2 p-2 rounded-full text-green-500 hover:text-green-400 transition duration-200">
            <Mic />
          </button>
        </div>
      </div>
    </div>

      {/* <MainDash /> */}
    </div>

);
};

export default Dashboard;
