import React, { useState } from "react";
import { API_BASE_URL } from "../../config/api";
import axios from "axios";
export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await axios.post( `${API_BASE_URL}/api/auth/forgot-password` ,email,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = res.data;

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setMessage("Password reset link has been sent to your email 💛");
    } 
    catch (err) {
      setError(err.message || "Unable to process request");
    }

    setLoading(false);
  };

  return (
    <section className="px-6 bg-primary/20">

      <div className="max-w-lg h-screen flex justify-center items-center mx-auto">

        <div className="
          bg-white rounded-2xl border border-[#c8a25c40]
          shadow-[0_10px_40px_rgba(200,162,92,.15)]
          hover:shadow-[0_20px_60px_rgba(200,162,92,.25)]
          transition-all duration-300 px-8 py-10
        ">

          <h2 className="text-center font-josefin text-3xl text-primary mb-3">
            Forgot Password
          </h2>

          <p className="text-center text-gray-600 mb-6 font-josefin">
            Enter your registered email to receive a reset link
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-primary text-sm">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="
                  w-full mt-1 border rounded-lg px-4 py-3
                  focus:outline-none focus:border-primary
                  font-josefin
                "
                placeholder="example@email.com"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">
                {error}
              </p>
            )}

            {message && (
              <p className="text-green-700 text-sm text-center">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-primary text-white rounded-lg py-3
                font-josefin tracking-[0.1em]
                shadow hover:shadow-lg
                transition
              "
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

          </form>
          <div className="mt-5 font-josefin">
            <a href="/login" className="hover:underline hover:text-secondary transition-all ease-in-out duration-200">← Back to login page</a>
          </div>
        </div>

      </div>
    </section>
  );
}
