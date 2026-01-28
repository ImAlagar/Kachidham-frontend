import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config/api";
import Loader from "../components/HomeComponents/SkeletonLoader";
import { FiPackage } from "react-icons/fi";
import axios from "axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_BASE_URL}/api/orders/user/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const json = res.data;
      if (!json.success) throw new Error("Failed to fetch orders");

      setOrders(json.data.orders || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-24 text-center text-red-500 tracking-widest">
        {error}
      </p>
    );
  }

  return (
    <motion.section
      className="px-6 lg:px-20 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl md:text-4xl font-semibold tracking-widest font-baijamjuree mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        My Orders
      </motion.h1>

      {orders.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center text-center py-24 bg-secondary/20 rounded-xl"
        >
          <FiPackage className="text-5xl text-secondary mb-6" />
          <h2 className="text-xl font-semibold tracking-widest mb-2">
            No Orders Yet
          </h2>
        </motion.div>
      ) : (
        <div className="space-y-10">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              className="border rounded-xl p-6 bg-white shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* ORDER HEADER */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{order.id}</p>
                </div>

                <span className="px-4 py-1 rounded-full bg-[#E6EFE4] text-[#5F7A5F] text-sm">
                  {order.status}
                </span>
              </div>

              {/* ALL ORDER ITEMS */}
              <div className="space-y-4 mb-6">
                {order.orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-center border-b pb-4 last:border-b-0"
                  >
                    <img
                      src={
                        item.productVariant?.variantImages?.[0]?.imageUrl ||
                        "/placeholder.png"
                      }
                      alt={item.product?.name}
                      className="w-20 h-24 object-cover rounded-md"
                    />

                    <div className="flex-1">
                      <p className="font-medium">
                        {item.product?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Size: {item.productVariant?.size} | Color:{" "}
                        {item.productVariant?.color}
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

              {/* DELIVERY ADDRESS */}
              <div className="bg-[#F3F6F2] rounded-lg p-4 mb-6 text-sm">
                <p className="font-medium mb-1">Delivery Address</p>
                <p>{order.name}</p>
                <p>{order.address}</p>
                <p>
                  {order.city}, {order.state} – {order.pincode}
                </p>
                <p>Phone: {order.phone}</p>
              </div>

              {/* PRICE SUMMARY */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹ {order.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ₹ {order.discount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Paid</span>
                  <span>₹ {order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
