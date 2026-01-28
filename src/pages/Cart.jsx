import React, { useEffect, useState } from "react";
import { FiPlus, FiMinus, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // 🔄 Update cart storage & UI
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };
  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(user);
  }, []);
  const handleRedirect = () => {
    if (!user) {
      toast.error("Please login to checkout");
      navigate("/login", {
        state: {
          from: location.pathname,
        },
      });
      return;
    }

    const checkoutData = {
      items: cart,
      subtotal,
    };

    navigate("/checkout", {
      state: checkoutData,
    });
  };

  // ➕ Increase quantity
  const increaseQty = (item) => {
    const updated = cart.map((c) => {
      if (c.productId === item.productId && c.variantId === item.variantId) {
        if (c.quantity >= Number(c.stock)) {
          toast.error(`Only ${c.stock} items available`);
          return c;
        }
        return { ...c, quantity: c.quantity + 1 };
      }
      return c;
    });

    updateCart(updated);
  };

  // ➖ Decrease quantity
  const decreaseQty = (item) => {
    const updated = cart
      .map((c) =>
        c.productId === item.productId && c.variantId === item.variantId
          ? { ...c, quantity: c.quantity - 1 }
          : c,
      )
      .filter((c) => c.quantity > 0);
    updateCart(updated);
  };

  // ❌ Remove item
  const removeItem = (item) => {
    const updated = cart.filter(
      (c) =>
        !(c.productId === item.productId && c.variantId === item.variantId),
    );
    updateCart(updated);
  };

  // 💰 Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  return (
    <section className="px-6 lg:px-20 py-12 bg-primary">
      <h1 className="text-3xl font-baijamjuree tracking-widest text-secondary mb-10 text-center">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center font-josefin py-20">
          <p className="text-lg text-white mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 border border-white text-white rounded-md tracking-widest"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
      <div className="grid lg:grid-cols-3 gap-6 md:gap-12">
        {/* LEFT – Cart Items */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 rounded-3xl border-b pb-6"
            >
              {/* Image */}
              <img
                loading="lazy"
                src={item.image}
                alt={item.title}
                className="w-20 h-28 md:w-24 md:h-32 object-cover rounded"
              />

              {/* Info */}
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-secondary font-josefin tracking-widest text-base md:text-xl">
                  {item.name}
                </h3>

                {item.size && (
                  <p className="text-sm font-josefin text-secondary">
                    Size: <span>{item.size}</span>
                  </p>
                )}

                {item.color && (
                  <p className="text-sm font-josefin text-secondary">
                    Color: <span>{item.color}</span>
                  </p>
                )}

                {/* Quantity */}
                <div className="flex text-white items-center gap-4 mt-3">
                  <button
                    onClick={() => decreaseQty(item)}
                    className="p-1.5 md:p-2 border rounded"
                  >
                    <FiMinus />
                  </button>

                  <span className="font-semibold">{item.quantity}</span>

                  <button
                    onClick={() => increaseQty(item)}
                    className="p-1.5 md:p-2 border rounded"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Price & Remove */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-between mt-2 md:mt-0">
                <button
                  onClick={() => removeItem(item)}
                  className="text-white border p-2 rounded-full"
                >
                  <FiX />
                </button>

                <p className="font-semibold text-secondary text-base md:text-lg">
                  ₹ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT – Summary */}
        <div className="border text-white rounded-lg p-6 h-fit space-y-6">
          <div className="flex justify-between">
            <span>Subtotal ({cart.length})</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>

          <hr />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total Orders</span>
            <span>₹ {total.toFixed(2)}</span>
          </div>

          <p className="text-xs text-center text-gray-300">
            * Shipping will be calculated at the time of checkout. The total
            amount you pay includes all applicable taxes.
          </p>

          <button
            onClick={() => handleRedirect()}
            className="w-full py-3 mt-4 border border-white text-white tracking-widest rounded-md hover:bg-primary/90 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      )}
    </section>
  );
}
