import React, { useEffect, useState } from 'react';

import { User } from 'lucide-react';

const ProfileCard = ({ setUserDiseases }) => {
 

  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [listItems, setListItems] = useState([]);

  const [newItem, setNewItem] = useState('');

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/getUser');
          if (response.ok) {
            const data = await response.json();
            setName(data.name);
            setEmail(data.email);
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

  const handleAddItem = () => {
    if (newItem.trim()) {
      setListItems([...listItems, newItem]);
      setNewItem('');
      setUserDiseases([...listItems, newItem]);
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
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Add
          </button>
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
