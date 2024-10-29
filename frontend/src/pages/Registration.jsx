import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    re_password: "",
  });
  const [errors, setErrors] = useState({}); // State to hold individual field errors
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error message for that field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("api/register/", {
        // Adjust the URL as necessary
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Set errors for specific fields
        const fieldErrors = {};
        for (const [key, value] of Object.entries(errorData)) {
          fieldErrors[key] = value[0]; // Assuming API returns errors in a list
        }
        setErrors(fieldErrors);
        throw new Error("Registration failed");
      }

      // Navigate to sign-in on successful registration
      navigate("/signin");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 border border-gray-500 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`border p-3 w-full rounded focus:outline-none focus:ring-2 ${
                errors.username ? "border-red-500" : "focus:ring-rose-600"
              }`}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`border p-3 w-full rounded focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500" : "focus:ring-rose-600"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`border p-3 w-full rounded focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500" : "focus:ring-rose-600"
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="re_password"
              placeholder="Confirm Password"
              value={formData.re_password}
              onChange={handleChange}
              className={`border p-3 w-full rounded focus:outline-none focus:ring-2 ${
                errors.re_password ? "border-red-500" : "focus:ring-rose-600"
              }`}
              required
            />
            {errors.re_password && (
              <p className="text-red-500 text-sm">{errors.re_password}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-rose-700 text-white p-3 rounded w-full hover:bg-rose-600 transition duration-200"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")} // Change to your sign-in path
            className="text-rose-700 cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Registration;
