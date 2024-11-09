import React, { useEffect, useState } from 'react';
import { getDataFromToken } from '../../helpers/getDataFromToken';

import { User } from 'lucide-react';

const ProfileCard = ({ setUserDiseases }) => {
 

  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [userId, setUserID] = useState("");
  const [listItems, setListItems] = useState([]);

  const [newItem, setNewItem] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allItems] = useState([
    "Peanut Allergy","Asthma",  "Lactose Intolerance","Milk Allergy","Shellfish Allergy", "Asthma","Celiac Disease", "Gluten Sensitivity",
     "Egg Allergy", "Asthma", "Soy Allergy", "Asthma", "Acid Reflux", "Gastroesophageal Reflux Disease (GERD)", "Acid Reflux", "Citrus Allergy"
  ]); // Example of predefined diseases or items for suggestions

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
      setSuggestions([]); // Clear suggestions after selection
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

  return (
    <div className="w-1/4 bg-gray-800 p-6 flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-green-500 p-6 rounded-full">
          <User className="text-gray-900 size-10" />
        </div>
        <h2 className="mt-4 text-xl font-bold">{name}</h2>
        <p className="text-gray-400">{email}</p>
      </div>

      <div className="w-full mb-4">
        <h3 className="text-lg font-semibold text-green-500 mb-2">Your Diseases</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Add item"
            className="flex-1 px-3 py-2 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:outline-none"
            value={newItem}
            onChange={handleInputChange}
          />
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Add
          </button>
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-gray-700 rounded-lg mt-11 ml-6 max-h-40 max-w-40 overflow-y-auto shadow-lg">
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
          )}
        </div>
        <ul className="list-disc pl-5 space-y-2">
          {listItems.map((item, index) => (
            <li key={index} className="text-gray-300">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default ProfileCard;
