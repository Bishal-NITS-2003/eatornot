"use client";
import React, { useState } from 'react';

const DragDropBox = ({ size = "w-64 h-64", position = "mx-auto" }) => {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false); // Track the drag-over state

  // Handle when files are dropped (only accepts image files)
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false); // Reset the drag-over state after drop
    const droppedFile = e.dataTransfer.files[0];

    // Only allow image files (optional, you can change this to other file types)
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
    } else {
      alert('Only image files are allowed!');
    }
  };

  // Handle file selection from file input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Only allow image files
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    } else {
      alert('Only image files are allowed!');
    }
  };

  // Handle drag enter event to provide visual feedback
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true); // Set drag-over state to true
  };

  // Handle drag leave event to reset the feedback
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false); // Set drag-over state to false
  };

  return (
    <div className={`${size} ${position} flex items-center justify-center`}>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()} // Allow dropping by preventing default behavior
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative w-full h-full border-2 border-dashed rounded-lg transition duration-200 cursor-pointer 
          ${isDragOver ? 'bg-gray-700 border-green-500' : 'bg-gray-800 border-gray-700'}`}
      >
        {file ? (
          <div className="text-center">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
            />
            <p className="text-green-400">{file.name}</p>
          </div>
        ) : (
          <p className="text-gray-400">Drag and drop an image, or click to select</p>
        )}
        {/* Invisible file input to allow mobile users to select files */}
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default DragDropBox;