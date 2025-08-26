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
  });
  const{login} = useAuth();
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/signup", form);

      localStorage.setItem("token", res.data.token);
      login(res.data.user);

      // redirect based on the role
      if (res.data.user.role === "ADMIN") navigate("/admin/dashboard");
      else if (res.data.user.role === "OWNER") navigate("/owner/dashboard");
      else navigate("/user/stores");

      // navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  const handleSignup = async (name:string, email:string, password:string, address:string)=>{
    try{
      const res = await axiosInstance.post("/auth/register", {name, email, password, address});
      login(res.data.user);

      if (res.data.role === "admin") navigate("/admin/dashboard");
      else if (res.data.role === "owner") navigate("/owner/dashboard");
      else navigate("/user/stores");
    }catch (err) {
      console.error("SignUp failed", err);
    };
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Signup
        </button>
      </form>

       <button
        onClick={() => handleSignup("Test User", "test@test.com", "Password@123", "123 Demo Street")}
        className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Demo Signup
      </button>
    </div>
  );
};

export default Signup;
