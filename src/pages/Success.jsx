import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Success() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem("orderDetails");
    const paymentResult = localStorage.getItem("paymentResult");

    // 🚨 Only redirect if data NEVER existed
    if (!storedOrder || !paymentResult) {
      navigate("/");
      return;
    }

    setOrder(JSON.parse(storedOrder));

    // ✅ AUTO REDIRECT AFTER 30 SECONDS
    const timer = setTimeout(() => {
      cleanupStorage();
      navigate("/");
    }, 30000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // ✅ CLEAR STORAGE SAFELY
  const cleanupStorage = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("orderDetails");
    localStorage.removeItem("paymentResult");
    localStorage.removeItem("rzp_stored_checkout_id");
    localStorage.removeItem("rzp_checkout_anon_id");
    localStorage.removeItem("rzp_device_id");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!order) return null;

  const { items, subtotal, discount, finalAmount, address } = order;

  return (
    <section className="min-h-screen bg-secondary/10 px-6 lg:px-20 py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10 space-y-10"
      >
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-green-600">
            Payment Successful 🎉
          </h1>
          <p className="text-gray-600">
            Thank you for shopping with Harshika Fashion
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to home in 30 seconds…
          </p>
        </div>

        {/* ITEMS */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Order Items</h2>

          <div className="space-y-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-center border rounded-xl p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-28 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ₹ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <div className="bg-[#f6f7f3] rounded-xl p-4">
            <p className="font-semibold">{address.name}</p>
            <p>{address.address}</p>
            <p>
              {address.city}, {address.state} - {address.pincode}
            </p>
            <p>Phone: {address.phone}</p>
            <p>Email: {address.email}</p>
          </div>
        </div>

        {/* PRICE */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- ₹ {discount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold">
            <span>Total Paid</span>
            <span>₹ {finalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              cleanupStorage();
              navigate("/");
            }}
            className="px-6 py-3 bg-primary text-white rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </motion.div>
    </section>
  );
}
