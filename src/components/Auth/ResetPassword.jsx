import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import axios from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token = new URLSearchParams(window.location.search).get("token");

  // Validate token
  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
      return;
    }

    const validate = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/auth/reset-password?token=${token}`
        );

        if (!res.data.success) {
          throw new Error(res.data.message || "Invalid or expired token");
        }

        setTokenValid(true);
      } catch (err) {
        console.error("Token validation failed:", err.message);
        setError(err.message || "Something went wrong");

        setTimeout(() => navigate("/forgot-password"), 1500);
      } finally {
        setLoading(false);
      }
    };

    validate();
  }, [token, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        { token, password }
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Something went wrong");
      }

      setSuccess("Password reset successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  if (loading) return null;

  return (
    <section className="min-h-screen bg-[#d9dbe1] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-lg">
        <h1 className="text-center text-3xl font-josefin mb-6">
          Reset Your Password
        </h1>

        {tokenValid && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded-lg px-4 py-3"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border rounded-lg px-4 py-3"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              className="w-full bg-[#0a0f2c] text-white py-3 rounded-lg shadow"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
