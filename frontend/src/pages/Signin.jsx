// src/pages/Signin.js
import React, { useState } from 'react';

const Signin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signed In:', formData);
    // Add your sign-in logic here
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Sign In</h2>
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          value={formData.username} 
          onChange={handleChange} 
          className="border mb-4 p-2 w-full"
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          className="border mb-4 p-2 w-full"
          required 
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;