// src/pages/Signin.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Adjust the path as necessary

const Signin = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Assuming you have a login function in your AuthContext

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("api/login/", {
        // Adjust URL as necessary
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("access", data.access); // Store access token
      localStorage.setItem("refresh", data.refresh); // Store refresh token
      login(); // Call login function to update state
      navigate("/"); // Redirect to dashboard or home page
    } catch (error) {
      console.error("Error during sign-in:", error);
      // Optional: Display an error message to the user here
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 border border-gray-500 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="border mb-4 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-rose-600"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border mb-4 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-rose-600"
            required
          />
          <button
            type="submit"
            className="bg-rose-700 text-white p-3 rounded w-full hover:bg-rose-600 transition duration-200"
          >
            Sign In
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")} // Change to your sign-up path
            className="text-rose-700 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signin;
