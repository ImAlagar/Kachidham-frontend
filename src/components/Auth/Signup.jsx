import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaAngleLeft } from "react-icons/fa6";
import { API_BASE_URL } from "../../config/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    // Minimum 6 chars, one number
    return /^(?=.*\d).{6,}$/.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      toast.error("Password must be at least 6 characters and contain a number");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Signup failed");
      }

      toast.success("Account created successfully 🎉");

      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Signup failed. Try again later.");
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
          Create Your Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border outline-none font-josefin px-4 py-2 rounded-md focus:ring-2 focus:ring-primary"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border outline-none font-josefin px-4 py-2 rounded-md focus:ring-2 focus:ring-primary"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border outline-none font-josefin px-4 py-2 rounded-md focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border outline-none font-josefin px-4 py-2 rounded-md focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 font-josefin text-lg tracking-widest rounded-md disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center font-josefin text-base mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-primary underline">
            Login
          </a>
        </p>

        <a
          href="/"
          className="text-primary gap-3 flex mt-3 items-center justify-center"
        >
          <span className="border border-primary rounded-full p-3">
            <FaAngleLeft />
          </span>
          Back to home page
        </a>
      </motion.div>
    </section>
  );
}
