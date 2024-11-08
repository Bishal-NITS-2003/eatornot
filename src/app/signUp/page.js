'use client';

import { useState } from 'react';

import "./styles.css";

const Signup = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [diseaseInput, setDiseaseInput] = useState('');
  const [diseases, setDiseases] = useState([]);
  
  // Handle name change
  const handleNameChange = (e) => setName(e.target.value);
  
  // Handle email change
  const handleEmailChange = (e) => setEmail(e.target.value);
  
  // Handle password change
  const handlePasswordChange = (e) => setPassword(e.target.value);
  
  // Handle disease search and adding to list
  const handleDiseaseInputChange = (e) => setDiseaseInput(e.target.value);
  
  const addDiseaseToList = () => {
    if (diseaseInput && !diseases.includes(diseaseInput)) {
      setDiseases([...diseases, diseaseInput]);
      setDiseaseInput(''); // Clear input field after adding
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Log form data (you can send this data to an API or backend)
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Diseases:', diseases);

    // Clear form fields
    setName('');
    setEmail('');
    setPassword('');
    setDiseases([]);
  };
  
  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={handleNameChange} 
            required 
          />
        </div>
        
        {/* Email */}
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={handleEmailChange} 
            required 
          />
        </div>
        
        {/* Password */}
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={handlePasswordChange} 
            required 
          />
        </div>
        
        {/* Disease search input */}
        <div>
          <label>Search for Diseases</label>
          <div>
            <input 
              type="text" 
              value={diseaseInput} 
              onChange={handleDiseaseInputChange} 
              placeholder="Enter a disease" 
            />
            <button type="button" onClick={addDiseaseToList}>Add Disease</button>
          </div>
        </div>
        
        {/* Disease list display */}
        <div>
          <h3>Selected Diseases</h3>
          <ul>
            {diseases.map((disease, index) => (
              <li key={index}>{disease}</li>
            ))}
          </ul>
        </div>
        
        {/* Submit Button */}
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
