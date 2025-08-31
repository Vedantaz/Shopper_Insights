// src/pages/Login.tsx
import { useState } from "react";
import axiosInstance from "../api/axios";
import {useAuth} from'../auth/AuthContext'
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/login", form);
      localStorage.setItem("token", res.data.user.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      login(res.data.user.user);
      if (res.data.user.user.role === "ADMIN") navigate("/admin/dashboard");
      else if (res.data.user.user.role === "OWNER") navigate("/owner/dashboard");
      else navigate("/user/stores");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
<div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
  <form
    onSubmit={handleSubmit}
    className="bg-white shadow-lg rounded-xl p-8 w-96 transform transition-all duration-300 hover:shadow-2xl"
  >
    <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
      Welcome Back 👋
    </h2>

    {error && (
      <p className="text-red-500 mb-6 text-sm text-center">{error}</p>
    )}

    <div className="mb-6">
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

    <button
      type="submit"
      className="w-full mt-8 bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition"
    >
      Login
    </button>

    <p className="mt-2 text-sm text-gray-500 text-center">
      Don’t have an account?{" "}
      <a href="/signup" className="text-blue-500 hover:underline">
        Sign up
      </a>
    </p>
  </form>
</div>

  );
};

export default Login;
