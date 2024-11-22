"use client";
import React, { useEffect, useRef } from 'react';

const ScrollableNews = ({ newsItems }) => {
  const scrollContainerRef = useRef(null);

  // Function to scroll news items automatically
  const autoScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight; // Scroll to the bottom
    }
  };

  useEffect(() => {
    // Set interval to auto-scroll every 3 seconds
    const interval = setInterval(autoScroll, 3000);
    
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="h-80 overflow-y-auto bg-gray-800 rounded-lg p-4 space-y-3"
    >
      {newsItems.map((item, index) => (
        <div key={index} className="text-sm text-gray-300">
          <a href="#" className="hover:text-green-400">
            <strong>{item.title}</strong> – {item.description}
          </a>
        </div>
      ))}
    </div>
  );
};

export default ScrollableNews;