import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

export default function FloatingCartButton() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  // Read cart from localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCount(totalQty);
  };

  useEffect(() => {
    updateCartCount();

    // Listen to cart updates
    window.addEventListener("cartUpdated", updateCartCount);
    return () =>
      window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  return (
    <button
      onClick={() => navigate("/cart")}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full border-secondary border bg-primary text-white shadow-xl hover:scale-105 transition"
    >
      <FiShoppingCart size={22} />

      {/* Badge */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}
