// src/pages/Signup.tsx
import { useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "",
  });
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/signup", form);

      login(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen py-6  ">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 py-4 w-96 transform transition-all duration-300 hover:shadow-2xl max-h-screen overflow-y-auto"
      >
        <h2 className="text-3xl font-extrabold mb-6 mt-3 text-center text-gray-800">
          Create an Account ✨
        </h2>

        {error && (
          <p className="text-red-500 mb-6 text-sm text-center">{error}</p>
        )}

        <div className="mb-2">
          <label className="block text-gray-600 mb-2 text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-600 mb-2 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-600 mb-2 text-sm font-medium">
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="Enter your address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-600 mb-2 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-600 mb-2 text-sm font-medium">
            Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Select a Role</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-green-600 hover:shadow-lg transition"
        >
          Sign up
        </button>

        <p className="mt-2 text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
