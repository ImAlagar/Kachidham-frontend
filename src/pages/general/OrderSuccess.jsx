import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Home, 
  ShoppingBag, 
  List, 
  Mail, 
  Phone, 
  MapPin,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [orderDetails, setOrderDetails] = useState(null);
  const [showItems, setShowItems] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      
      // First check location state
      const stateOrder = location.state;
      
      if (stateOrder) {
        setOrderDetails(stateOrder);
        setLoading(false);
        return;
      }

      // If no state, check localStorage
      try {
        const storedOrder = localStorage.getItem("lastOrder");
        if (storedOrder) {
          const parsedOrder = JSON.parse(storedOrder);
          setOrderDetails(parsedOrder);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error parsing order:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your order details...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your order details. Please check your orders or contact support.</p>
          <Link
            to="/user/orders"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  // Helper to get image URL - handles different data structures
  const getImageUrl = (item) => {
    if (!item) return null;
    
    // Try variant image first
    if (item.variant?.image) return item.variant.image;
    
    // Try product image
    if (item.product?.image) return item.product.image;
    
    // Try images array
    if (item.product?.images?.[0]) return item.product.images[0];
    
    // Fallback
    return null;
  };

  // Get order items from different possible structures
  const orderItems = orderDetails.items || 
                     orderDetails.orderData?.orderItems || 
                     orderDetails.cartItems || 
                     [];

  // Get order total
  const orderTotal = orderDetails.totals?.totalAmount || 
                     orderDetails.total || 
                     (orderItems.reduce((sum, item) => 
                       sum + (item.variant?.price || item.price || 0) * (item.quantity || 1), 0));

  // Get shipping address
  const shippingAddress = orderDetails.orderData || orderDetails;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Success Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <motion.div 
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white border-4 border-green-100 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-green-600 font-bold text-sm">✓</span>
              </motion.div>
            </motion.div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Order Confirmed Successfully!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for your purchase. Your order #{orderDetails.orderNumber || "N/A"} has been received.
          </p>
          <p className="text-green-600 font-medium mt-2 flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" />
            A confirmation email has been sent to {shippingAddress.email || "your email"}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Order Summary Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Package className="w-7 h-7 text-blue-600" />
                  Order Summary
                </h2>
                <button
                  onClick={() => setShowItems(!showItems)}
                  className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
                >
                  {showItems ? (
                    <>
                      <span className="text-sm font-medium">Hide Items</span>
                      <ChevronUp className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium">Show Items</span>
                      <ChevronDown className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Items List */}
              {showItems && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 mb-6"
                >
                  {orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors group"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                          {getImageUrl(item) ? (
                            <img
                              src={getImageUrl(item)}
                              alt={item.product?.name || "Product"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate mb-1">
                          {item.product?.name || "Product Name"}
                        </h3>
                        
                        {/* Variant Details */}
                        <div className="flex flex-wrap gap-3 mb-2">
                          {item.variant?.color && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Color: {item.variant.color}
                            </span>
                          )}
                          
                          {item.variant?.size && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Size: {item.variant.size}
                            </span>
                          )}
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-gray-500">Quantity:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {item.quantity || 1}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              &#8377;{((item.variant?.price || item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              &#8377;{(item.variant?.price || item.price || 0).toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      &#8377;{orderDetails.totals?.subtotal?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  
                  {orderDetails.totals?.couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span className="font-semibold">
                        -&#8377;{orderDetails.totals?.couponDiscount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between text-2xl font-bold text-gray-900">
                      <span>Total Amount</span>
                      <span>&#8377;{orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Support Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6"
            >
              <h3 className="font-bold text-blue-800 mb-3">Need Help?</h3>
              <p className="text-blue-700 text-sm mb-4">
                Our support team is here to help with any questions about your order.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                Contact Support →
              </a>
            </motion.div>

          </div>

          {/* Right Column - Actions & Timeline */}
          <div className="space-y-8">
            
            {/* Payment & Delivery Status */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Order Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    orderDetails.paymentMethod === 'cod' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {orderDetails.paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Processing
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-gray-900 font-medium">3-5 business days</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Next Steps</h3>
              
              <div className="space-y-3">
                <Link
                  to="/user/orders"
                  className="flex items-center justify-center gap-3 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl"
                >
                  <List className="w-5 h-5" />
                  View Order Details
                </Link>
                
                <Link
                  to="/shop"
                  className="flex items-center justify-center gap-3 w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-300 border-2 border-gray-300 hover:border-gray-400"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Continue Shopping
                </Link>
                
                <Link
                  to="/"
                  className="flex items-center justify-center gap-3 w-full py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Back to Homepage
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">
            You'll receive shipping updates via email. Check your spam folder if you don't see our emails.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Order ID: {orderDetails.orderNumber || "N/A"} | {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;