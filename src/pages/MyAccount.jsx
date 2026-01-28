import React from "react";
import { replace, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";

export default function MyAccount() {
  const navigate = useNavigate();

  // get user safely
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login" , {replace: true })
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-secondary/20 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Heading */}
        <h1 className="font-baijamjuree text-3xl mb-2 tracking-widest font-semibold">
          My Account
        </h1>
        <p className="font-josefin text-gray-600 mb-8">
          Welcome back{user?.name ? `, ${user.name}` : ""} 👋
        </p>

        {/* User Info */}
        <div className="space-y-2 mb-8">
          <p className="font-josefin text-sm">
            <span className="font-semibold">Name:</span>{" "}
            {user?.name || "Guest"}
          </p>
          <p className="font-josefin text-sm">
            <span className="font-semibold">Email:</span>{" "}
            {user?.email || "-"}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/my-orders")}
            className="w-full bg-primary text-white py-2 rounded-md font-josefin tracking-widest"
          >
            My Orders
          </button>

          <button
            onClick={handleLogout}
            className="w-full border border-primary text-primary py-2 rounded-md font-josefin tracking-widest"
          >
            Logout
          </button>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => navigate("/")}
          className="text-primary gap-3 flex mt-6 items-center justify-center mx-auto"
        >
          <span className="border border-primary rounded-full p-3">
            <FaAngleLeft />
          </span>
          Back to home page
        </button>
      </div>
    </section>
  );
}
