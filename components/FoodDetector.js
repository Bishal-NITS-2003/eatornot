"use client";

// components/FoodDetector.js
import React, { useState, useRef } from 'react';


import axios from 'axios';

const FoodDetector = () => {
  const [foodName, setFoodName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const API_KEY = "AIzaSyCfS-uqrojbh2Hf9PXdjtEZpALK_h2UdJQ"; // Use your Google Vision API Key

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      classifyImage(file);
    }
  };

  // Open the camera
  const openCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  // Capture photo from video feed
  const capturePhoto = () => {
    if (!videoRef.current) return;

    // Set canvas dimensions to match the video dimensions
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame from the video onto the canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to a data URL (Base64)
    const dataUrl = canvas.toDataURL('image/png');
    setImage(dataUrl);

    classifyImageFromBase64(dataUrl);

    // Stop the video stream after capturing the photo
    video.srcObject.getTracks().forEach((track) => track.stop());
    setIsCameraOpen(false);
  };

  // Classify image using Google Cloud Vision API (For uploaded image)
  const classifyImage = async (imageFile) => {
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1]; // Remove data:image/png;base64

      try {
        const response = await axios.post(
          `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
          {
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: 'LABEL_DETECTION',
                    maxResults: 5,
                  },
                ],
              },
            ],
          }
        );

        const labels = response.data.responses[0].labelAnnotations;
        const foodLabels = labels.filter((label) =>
          label.description.toLowerCase().includes('food')
        );

        if (foodLabels.length > 0) {
          setFoodName(foodLabels[0].description);
        } else {
          setFoodName('No food detected');
        }
      } catch (error) {
        console.error('Error detecting food:', error.response ? error.response.data : error.message);
        setFoodName('Error detecting food');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(imageFile); // Convert image to base64
  };

  // Classify image using Google Cloud Vision API (For captured image)
  const classifyImageFromBase64 = async (base64Image) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
        {
          requests: [
            {
              image: {
                content: base64Image.split(',')[1], // Remove the data:image/png;base64 part
              },
              features: [
                {
                  type: 'LABEL_DETECTION',
                  maxResults: 5,
                },
              ],
            },
          ],
        }
      );

      const labels = response.data.responses[0].labelAnnotations;
      const foodLabels = labels.filter((label) =>
        label.description.toLowerCase().includes('food')
      );

      if (foodLabels.length > 0) {
        setFoodName(foodLabels[0].description);
      } else {
        setFoodName('No food detected');
      }
    } catch (error) {
      console.error('Error detecting food:', error.response ? error.response.data : error.message);
      setFoodName('Error detecting food');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Food Detection using Google Cloud Vision</h2>

      {/* File input for image upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'inline-block' }}
      />
      {/* Button to open camera */}
      <button onClick={openCamera} style={{ marginLeft: '10px' }}>
        Open Camera
      </button>

      {isCameraOpen && (
        <div>
          <video
            ref={videoRef}
            style={{ width: '300px', marginTop: '10px' }}
            autoPlay
          />
          <button onClick={capturePhoto} style={{ marginTop: '10px' }}>
            Capture Photo
          </button>
        </div>
      )}

      {/* Hidden canvas to capture image from video */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Display image preview */}
      {image && <img src={image} alt="Uploaded or Captured" width="200" />}
      
      {/* Show loading message or detected food */}
      {loading ? (
        <p>Detecting food item...</p>
      ) : (
        <p>Detected Food: {foodName}</p>
      )}
    </div>
  );
};

export default FoodDetector;
