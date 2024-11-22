"use client";
import React, { use, useEffect, useState } from 'react';
import diseasesData from '../data/diseases.json';
import { useRouter } from 'next/navigation';  // Import useRouter for navigation

import { User, X, Plus, Trash2  } from 'lucide-react';

const ProfileCard = ({ setUserDiseases, closeSidebar }) => {

  const router = useRouter();
 

  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [userId, setUserID] = useState("");
  const [listItems, setListItems] = useState([]);

  const [newItem, setNewItem] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allItems, setAllItems] = useState([]); // Initially empty
  const [isEditing, setIsEditing] = useState(false);


  // Populate allItems from the JSON data
  useEffect(() => {
    const extractedItems = diseasesData.map((item) => item.disease);
    setAllItems(extractedItems);
  }, []);


  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/getUser');
          if (response.ok) {
            const data = await response.json();
            setName(data.name);
            setEmail(data.email);
            setUserID(data._id);
            setListItems(data.diseases || []);
            setUserDiseases(data.diseases || []);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchUserData();
    }, []); // Empty dependency array means this runs only once on mount

    const handleInputChange = (e) => {
      const value = e.target.value;
      setNewItem(value);
  
      // Filter suggestions based on input value
      if (value.trim()) {
        const filteredSuggestions = allItems.filter(item =>
          item.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]); // Hide suggestions if input is empty
      }
    };

    const handleSuggestionClick = (suggestion) => {
      setNewItem(suggestion);
      setTimeout(() => setSuggestions([]), 0); // Clear suggestions with a slight delay
    };


  const handleAddItem = async () => {
    if (newItem.trim() && !listItems.includes(newItem)) {
      const updatedList = [...listItems, newItem];
      setListItems(updatedList);
      setNewItem('');
      setSuggestions([]);

      // Call the API to update the diseases in the database
      try {
        const response = await fetch('/api/updateDiseases', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,  // Pass the userId to the backend
            diseases: updatedList,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update diseases in the database');
        }

        const updatedUser = await response.json();
        setUserDiseases(updatedUser.diseases);  // Update the parent component's state with the updated diseases
      } catch (error) {
        console.error('Error updating diseases:', error);
      }
    }
  };

  const handleDeleteItem = async (index) => {
    setListItems((prev) => prev.filter((_, i) => i !== index));

  };

  const updateDiseasesItem = async () => {
    if(isEditing){
    try {
      const response = await fetch('/api/updateDiseases', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,  // Pass the userId to the backend
          diseases: listItems,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update diseases in the database');
      }

      const updatedUser = await response.json();
      setUserDiseases(updatedUser.diseases);  // Update the parent component's state with the updated diseases
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating diseases:', error);
    }
  }else{
    setIsEditing(true);
  }
  }


  const handleLogOut = async () => {

    await fetch('/api/logout', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {  router.push("/signIn");console.log(data.message)})
      .catch((err) => console.error(err));
    
  }

  return (
    <div className="h-full bg-gray-800 p-6 flex flex-col items-center relative">
      {/* Close button for mobile/tablet views */}
      <button
        onClick={closeSidebar}
        className="absolute top-4 right-4 sm:hidden p-2 bg-gray-700 rounded-full focus:outline-none hover:bg-gray-600 transition duration-200"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="flex flex-col items-center mb-8">
        <div className="bg-green-500 p-6 rounded-full mb-4">
          <User className="text-gray-900 size-10" />
        </div>
        <h2 className="mt-1 text-xl font-bold text-center">{name}</h2>
        <p className="text-gray-400 text-center">{email}</p>
        <button
                onClick={handleLogOut}
                className="my-3 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
              >
                Log out
              </button>
      </div>


      <div className="w-full mb-4">
        <h3 className="text-lg font-semibold text-green-500 mb-2">Your Diseases</h3>
        <div className="flex flex-col sm:flex-row gap-2 mb-2 w-full">
          <input
            type="text"
            placeholder="Add item"
            className="flex-1 w-full px-4 py-2 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:outline-none transition duration-200 ease-in-out transform hover:bg-gray-600"
            value={newItem}
            onChange={handleInputChange}
          />
         <button
            onClick={handleAddItem}
            className="mt-2 sm:mt-0 sm:px-3 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition duration-200 w-full sm:w-auto flex items-center justify-center"
          >
            {/* Plus icon instead of "Add" text */}
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
         {/* Suggestions Dropdown */}
{suggestions.length > 0 && (
  <div className="relative w-full" key={suggestions.join(',')}>
    <ul
      className="absolute left-0 bg-gray-700 rounded-lg max-h-40 overflow-y-auto shadow-lg z-10"
    >
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => handleSuggestionClick(suggestion)}
          className="px-3 py-2 text-white cursor-pointer hover:bg-gray-600"
        >
          {suggestion}
        </li>
      ))}
    </ul>
  </div>
)}
        <ul className="list-disc pl-5 space-y-2">
          {listItems.map((item, index) => (
            <li key={index} className="text-gray-300" >
              <span>{item}</span>
              {isEditing ? (
              <button
                  onClick={() => handleDeleteItem(index)}
                  className="ml-2 p-1 text-white rounded hover:bg-red-600"
                >
                  <Trash2 className="text-red" />
                </button>):<div></div>}
            </li>
            
          ))}
        </ul>
        <button
            onClick={updateDiseasesItem}
            className="my-3 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
          >
            {isEditing ? "Update Diseases" : "Edit Diseases"}
          </button>
      </div>
    </div>
  );
};


export default ProfileCard;
