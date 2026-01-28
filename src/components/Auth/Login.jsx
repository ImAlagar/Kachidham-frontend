import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaAngleLeft } from "react-icons/fa6";
import { API_BASE_URL } from "../../config/api";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // redirect after login
  const from = location.state?.from || "/";

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,form ,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data =  res.data
      if (!data.success || !data.data?.accessToken) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      toast.success("Login successful 🎉");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-primary/20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="font-baijamjuree text-3xl mb-10 tracking-widest text-center font-semibold">
          Welcome Back — Stay Stylish
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            autoComplete="email"   // ✅ FIX
            value={form.email}
            onChange={handleChange}
            className="w-full border outline-none font-josefin px-4 py-2 rounded-md focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            autoComplete="current-password" // ✅ FIX
            value={form.password}
            onChange={handleChange}
            className="w-full border outline-none font-josefin px-4 py-2 rounded-md focus:ring-2 focus:ring-primary"
          />

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 font-josefin text-lg tracking-widest rounded-md disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center font-josefin text-base mt-6">
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-primary underline">
            Sign up
          </Link>
        </p>

        <Link
          to="/"
          className="text-primary gap-3 flex mt-3 items-center justify-center"
        >
          <span className="border border-primary rounded-full p-3">
            <FaAngleLeft />
          </span>
          Back to home page
        </Link>
      </motion.div>
    </section>
  );
}
