// components/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  useCalculateOrderTotalsMutation, 
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
  useCreateCODOrderMutation,
} from "../../redux/services/orderService";
import { clearCart } from "../../redux/slices/cartSlice";
import { useGetAvailableCouponsQuery, useValidateCouponMutation } from "../../redux/services/couponService";
import { useCalculateQuantityPriceMutation } from "../../redux/services/productService";
import { 
  CreditCard, 
  MapPin, 
  ShoppingCart, 
  Shield, 
  Truck, 
  Percent, 
  Tag, 
  CheckCircle, 
  Lock, 
  ArrowLeft,
  ChevronRight,
  Package,
  Gift,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
  Smartphone,
  Mail,
  User,
  Home,
  Navigation,
  Sparkles,
  ShieldCheck,
  Zap,
  ShoppingBag,
  CreditCard as CardIcon,
  Banknote,
  QrCode,
  Wallet,
  Smartphone as PhoneIcon
} from "lucide-react";
import razorpayService from "../../utils/razorpayService";

const Checkout = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  // API mutations
  const [calculateOrderTotals] = useCalculateOrderTotalsMutation();
  const [initiatePayment] = useInitiatePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [createCODOrder] = useCreateCODOrderMutation();
  const [validateCoupon] = useValidateCouponMutation();
  const [calculateQuantityPrice] = useCalculateQuantityPriceMutation();

  // State
  const [individualItemTotals, setIndividualItemTotals] = useState({});
  const [quantityDiscounts, setQuantityDiscounts] = useState({});
  const [calculatingDiscounts, setCalculatingDiscounts] = useState(false);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);
  const [activeSection, setActiveSection] = useState("address");

  // Form state with user data pre-filled
  const [orderData, setOrderData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
    paymentMethod: "ONLINE"
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    shippingCost: 0,
    totalAmount: 0,
    quantityDiscount: 0,
    couponDiscount: 0
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState("");

  // Theme colors
  const isDark = theme === "dark";
  const bgPrimary = isDark ? "bg-gradient-to-br from-gray-900 to-gray-950" : "bg-gradient-to-br from-gray-50 to-white";
  const bgSecondary = isDark ? "bg-gray-800/50 backdrop-blur-lg" : "bg-white/80 backdrop-blur-lg";
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const borderColor = isDark ? "border-gray-700/50" : "border-gray-200/50";
  const cardBg = isDark ? "bg-gray-800/40 backdrop-blur-lg" : "bg-white/90 backdrop-blur-lg";
  const inputBg = isDark ? "bg-gray-700/30" : "bg-gray-50/80";
  const errorColor = isDark ? "text-red-400" : "text-red-600";
  const errorBorder = isDark ? "border-red-500/50" : "border-red-500";

  // Get available coupons
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.variant?.price || item.product?.price || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0);

  const { 
    data: availableCouponsData, 
    isLoading: couponsLoading
  } = useGetAvailableCouponsQuery(subtotal, {
    skip: subtotal === 0
  });

  const availableCoupons = availableCouponsData?.data || [];

  // Calculate discounts
  useEffect(() => {
    const calculateIndividualTotals = async () => {
      if (cartItems.length === 0) return;

      setCalculatingDiscounts(true);
      const newTotals = {};
      const newDiscounts = {};
      
      for (const item of cartItems) {
        try {
          const cleanProductId = getCleanProductId(item.product?._id);
          if (!cleanProductId) continue;

          const result = await calculateQuantityPrice({
            productId: cleanProductId,
            variantId: item.variant?._id,
            quantity: item.quantity
          }).unwrap();

          if (result.success) {
            const originalPrice = (item.variant?.price || item.product?.price || 0) * item.quantity;
            const discountedPrice = result.data.finalPrice;
            const itemDiscount = originalPrice - discountedPrice;

            newTotals[item.id] = {
              finalPrice: discountedPrice,
              originalPrice: originalPrice,
              discount: result.data.applicableDiscount,
              savings: result.data.totalSavings
            };

            newDiscounts[item.id] = {
              discount: itemDiscount,
              discountInfo: result.data.applicableDiscount,
              originalPrice: originalPrice,
              discountedPrice: discountedPrice
            };
          }
        } catch (error) {
          const price = Number(item.variant?.price) || Number(item.product?.price) || 0;
          const originalPrice = price * item.quantity;
          newTotals[item.id] = {
            finalPrice: originalPrice,
            originalPrice: originalPrice,
            discount: null,
            savings: 0
          };
        }
      }
      
      setIndividualItemTotals(newTotals);
      setQuantityDiscounts(newDiscounts);
      
      const discountedSubtotal = Object.values(newTotals).reduce((total, item) => total + item.finalPrice, 0);
      const originalSubtotal = Object.values(newTotals).reduce((total, item) => total + item.originalPrice, 0);
      
      setTotals(prev => ({
        ...prev,
        subtotal: discountedSubtotal,
        quantityDiscount: originalSubtotal - discountedSubtotal,
        totalAmount: discountedSubtotal - (appliedCoupon ? totals.couponDiscount : 0)
      }));
      
      setCalculatingDiscounts(false);
    };

    calculateIndividualTotals();
  }, [cartItems, calculateQuantityPrice]);

  // Calculate delivery estimate
  useEffect(() => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5); // 5 days delivery
    setDeliveryEstimate(deliveryDate.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    }));
  }, []);

  // Helper functions
  const getCleanProductId = (productId) => {
    if (!productId) return null;
    const colorSuffixes = ['-Red', '-Blue', '-Green', '-Black', '-White', '-Yellow'];
    let cleanId = productId;
    for (const suffix of colorSuffixes) {
      if (productId.endsWith(suffix)) {
        cleanId = productId.slice(0, -suffix.length);
        break;
      }
    }
    return cleanId;
  };

  const calculateItemTotal = (item) => {
    if (individualItemTotals[item.id]) {
      return individualItemTotals[item.id].finalPrice;
    }
    const price = item.variant?.price || item.product?.price || 0;
    const quantity = item.quantity || 0;
    return price * quantity;
  };

  const getProductImage = (item) => {
    if (!item) return '/placeholder-product.jpg';
    
    if (item.variant?.image) {
      return item.variant.image;
    }
    
    if (item.product?.images?.length > 0) {
      return item.product.images[0];
    }
    
    if (item.product?.image) {
      return item.product.image;
    }
    
    return '/placeholder-product.jpg';
  };

  const getOrderItemsData = () => {
    return cartItems.map((item) => {
      const productId = item.product?._id || item.product?.id;
      const variantId = item.variant?._id || item.variant?.id;

      if (!productId) {
        throw new Error(`Missing product ID for: ${item.product?.name || 'Unknown Product'}`);
      }

      const orderItem = {
        productId: productId,
        quantity: item.quantity || 1
      };

      if (variantId && variantId !== productId) {
        orderItem.productVariantId = variantId;
      }

      return orderItem;
    });
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const pincodeRegex = /^\d{6}$/;
    
    if (!orderData.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!orderData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(orderData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!orderData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(orderData.phone)) {
      errors.phone = 'Phone must be 10 digits';
    }

    if (!orderData.address?.trim()) {
      errors.address = 'Address is required';
    }

    if (!orderData.city?.trim()) {
      errors.city = 'City is required';
    }

    if (!orderData.state?.trim()) {
      errors.state = 'State is required';
    }

    if (!orderData.pincode?.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!pincodeRegex.test(orderData.pincode)) {
      errors.pincode = 'Pincode must be 6 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle field blur
  const handleFieldBlur = (field) => {
    setTouchedFields({ ...touchedFields, [field]: true });
    
    // Validate specific field
    const errors = { ...formErrors };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const pincodeRegex = /^\d{6}$/;

    if (field === 'name' && !orderData.name?.trim()) {
      errors.name = 'Name is required';
    } else if (field === 'email') {
      if (!orderData.email?.trim()) {
        errors.email = 'Email is required';
      } else if (!emailRegex.test(orderData.email)) {
        errors.email = 'Invalid email address';
      } else {
        delete errors.email;
      }
    } else if (field === 'phone') {
      if (!orderData.phone?.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(orderData.phone)) {
        errors.phone = 'Phone must be 10 digits';
      } else {
        delete errors.phone;
      }
    } else if (field === 'pincode') {
      if (!orderData.pincode?.trim()) {
        errors.pincode = 'Pincode is required';
      } else if (!pincodeRegex.test(orderData.pincode)) {
        errors.pincode = 'Pincode must be 6 digits';
      } else {
        delete errors.pincode;
      }
    } else if (field === 'address' && !orderData.address?.trim()) {
      errors.address = 'Address is required';
    } else if (field === 'city' && !orderData.city?.trim()) {
      errors.city = 'City is required';
    } else if (field === 'state' && !orderData.state?.trim()) {
      errors.state = 'State is required';
    } else {
      delete errors[field];
    }

    setFormErrors(errors);
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setOrderData({ ...orderData, [field]: value });
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };

  // Coupon handling
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      setLoading(true);
      const result = await validateCoupon({
        code: couponCode.trim(),
        subtotal: totals.subtotal
      }).unwrap();
      
      if (result.success) {
        setAppliedCoupon(result.data.coupon);
        const couponDiscount = result.data.discount;
        
        setTotals(prev => ({
          ...prev,
          couponDiscount: couponDiscount,
          totalAmount: prev.subtotal - couponDiscount
        }));
        
        toast.success("Coupon applied successfully!");
      }
    } catch (error) {
      toast.error(error.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setTotals(prev => ({
      ...prev,
      couponDiscount: 0,
      totalAmount: prev.subtotal
    }));
    toast.info("Coupon removed");
  };

  // Payment handlers
  const handleRazorpayPayment = async () => {
    // First validate form
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      const allFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
      const touched = {};
      allFields.forEach(field => touched[field] = true);
      setTouchedFields(touched);
      
      toast.error("Please fix all form errors before proceeding");
      return;
    }

    try {
      setPaymentProcessing(true);
      const orderItemsData = getOrderItemsData();
      
      const paymentData = {
        orderData: {
          ...orderData,
          orderItems: orderItemsData,
          couponCode: appliedCoupon?.code || null
        }
      };

      const result = await initiatePayment(paymentData).unwrap();
      
      if (result.success) {
        const { razorpayOrder, tempOrderData } = result.data;

        const razorpayResponse = await razorpayService.openRazorpayCheckout({
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "kachidham Fashions",
          description: `Order Payment - ${tempOrderData.orderNumber}`,
          prefill: {
            name: orderData.name,
            email: orderData.email,
            contact: orderData.phone
          },
          theme: {
            color: "#9333ea"
          }
        });

        const verificationResult = await verifyPayment({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          orderData: {
            ...orderData,
            orderItems: orderItemsData,
            couponCode: appliedCoupon?.code || null
          }
        }).unwrap();

        if (verificationResult.success) {
          const order = verificationResult.data;
          const successData = {
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            items: cartItems,
            paymentMethod: 'ONLINE',
            status: 'confirmed'
          };
          
          toast.success("Payment successful! Order confirmed.");
          handleOrderSuccess(successData);
        }
      }
    } catch (error) {
      console.error("Payment failed:", error);
      const errorMessage = error.data?.message || "Payment processing failed";
      toast.error(`Payment failed: ${errorMessage}`);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCODOrder = async () => {
    // First validate form
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      const allFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
      const touched = {};
      allFields.forEach(field => touched[field] = true);
      setTouchedFields(touched);
      
      toast.error("Please fix all form errors before proceeding");
      return;
    }

    try {
      setLoading(true);
      const orderItemsData = getOrderItemsData();
      
      const result = await createCODOrder({
        orderData: {
          ...orderData,
          orderItems: orderItemsData,
          couponCode: appliedCoupon?.code || null
        }
      }).unwrap();
      
      if (result.success) {
        const successData = {
          orderNumber: result.data.orderNumber,
          totalAmount: result.data.totalAmount,
          items: cartItems,
          paymentMethod: 'COD',
          status: 'confirmed'
        };
        
        toast.success("Order placed successfully!");
        handleOrderSuccess(successData);
      }
    } catch (error) {
      toast.error(error.data?.message || "Order creation failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (orderData.paymentMethod === "COD") {
      handleCODOrder();
    } else {
      handleRazorpayPayment();
    }
  };

  const handleOrderSuccess = (successData) => {
    setOrderCompleted(true);
    localStorage.setItem('orderSuccessData', JSON.stringify(successData));
    dispatch(clearCart());
    navigate('/payment-success', { 
      state: successData,
      replace: true
    });
  };

  // Redirects
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    
    if (cartItems.length === 0 && !orderCompleted) {
      const orderSuccessData = localStorage.getItem('orderSuccessData');
      if (!orderSuccessData) {
        navigate("/cart");
      }
    }
  }, [user, cartItems, navigate, orderCompleted]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Helper function to render form field with error
  const renderFormField = (field, label, icon, type = "text", placeholder = "") => {
    const hasError = formErrors[field] && touchedFields[field];
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          {icon}
          {label}
        </label>
        <input
          type={type}
          name={field}
          value={orderData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          onBlur={() => handleFieldBlur(field)}
          className={`w-full px-4 py-3 rounded-xl border ${hasError ? errorBorder : borderColor} ${inputBg} ${textPrimary} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
          placeholder={placeholder}
        />
        {hasError && (
          <div className="mt-2 flex items-center space-x-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className={`text-sm ${errorColor}`}>{formErrors[field]}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${bgPrimary} transition-colors duration-300`}>
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Final step to get your favorite products delivered
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Steps */}
          <div className="lg:col-span-2 space-y-8">
            {/* Error Alert if any form errors exist */}
            {Object.keys(formErrors).length > 0 && (
              <div className={`p-4 rounded-xl border ${errorBorder} bg-red-50/50 dark:bg-red-900/20 backdrop-blur-lg`}>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="font-bold text-red-700 dark:text-red-300">Please fix the following errors:</h3>
                    <ul className="mt-2 text-sm text-red-600 dark:text-red-400 list-disc list-inside">
                      {Object.values(formErrors).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Indicators */}
          <div className="mb-8 px-2 sm:px-4">
            <div className="relative">
              {/* Progress Line Background */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
              
              {/* Progress Line Fill */}
              <div className="absolute top-5 left-0 h-0.5 bg-green-500 z-0" style={{ width: '50%' }}></div>
              
              <div className="relative flex justify-between items-center z-10">
                {['Cart', 'Details', 'Payment', 'Confirm'].map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    {/* Step Circle */}
                    <div className={`
                      w-10 h-10 sm:w-12 sm:h-12
                      rounded-full flex items-center justify-center border-2 
                      transition-all duration-300 mb-2
                      ${index <= 1 
                        ? index === 1 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white shadow-lg' 
                          : 'bg-green-500 border-transparent text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400'
                      }
                    `}>
                      {index < 1 ? (
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <span className="text-base sm:text-lg font-medium">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* Step Label */}
                    <span className={`
                      text-xs sm:text-sm font-medium text-center px-1
                      ${index <= 1 
                        ? 'text-gray-900 dark:text-white font-semibold' 
                        : 'text-gray-500'
                      }
                    `}>
                      {step}
                    </span>
                    
                    {/* Mobile Step Indicator (optional dots) */}
                    {index < 3 && (
                      <div className="sm:hidden mt-2">
                        <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

            {/* Shipping Address Card */}
            <div className={`${cardBg} rounded-2xl border ${borderColor} shadow-xl overflow-hidden backdrop-blur-lg`}>
              <div className="p-6 border-b ${borderColor}">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Address</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Where should we deliver your order?</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {renderFormField("name", "Full Name", <User className="w-4 h-4 mr-2" />, "text", "John Doe")}
                  
                  {renderFormField("email", "Email Address", <Mail className="w-4 h-4 mr-2" />, "email", "john@example.com")}
                  
                  {renderFormField("phone", "Phone Number", <PhoneIcon className="w-4 h-4 mr-2" />, "tel", "9876543210")}
                  
                  {renderFormField("pincode", "Pincode", <Navigation className="w-4 h-4 mr-2" />, "text", "560001")}
                  
                  {renderFormField("city", "City", <Home className="w-4 h-4 mr-2" />, "text", "e.g., Mumbai")}
                  
                  {renderFormField("state", "State", <MapPin className="w-4 h-4 mr-2" />, "text", "e.g., Maharashtra")}
                  
                  {/* Address field */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Home className="w-4 h-4 mr-2" />
                      Complete Address
                    </label>
                    <textarea
                      name="address"
                      value={orderData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      onBlur={() => handleFieldBlur("address")}
                      rows="3"
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.address && touchedFields.address ? errorBorder : borderColor} ${inputBg} ${textPrimary} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none`}
                      placeholder="Street, apartment, landmark..."
                    />
                    {formErrors.address && touchedFields.address && (
                      <div className="mt-2 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className={`text-sm ${errorColor}`}>{formErrors.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className={`${cardBg} rounded-2xl border ${borderColor} shadow-xl overflow-hidden backdrop-blur-lg`}>
              <div className="p-6 border-b ${borderColor}">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose how you want to pay</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Online Payment */}
                  <button
                    onClick={() => setOrderData({...orderData, paymentMethod: "ONLINE"})}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                      orderData.paymentMethod === "ONLINE"
                        ? "border-purple-500 bg-purple-50/50 dark:bg-purple-900/20 shadow-lg"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        orderData.paymentMethod === "ONLINE" 
                          ? "bg-gradient-to-r from-purple-500 to-pink-500" 
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}>
                        <CardIcon className={`w-5 h-5 ${
                          orderData.paymentMethod === "ONLINE" 
                            ? "text-white" 
                            : "text-gray-600 dark:text-gray-400"
                        }`} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Card / UPI / Wallet</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Pay securely online</p>
                      </div>
                      {orderData.paymentMethod === "ONLINE" && (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                      )}
                    </div>
                  </button>

                  {/* COD */}
                  <button
                    onClick={() => setOrderData({...orderData, paymentMethod: "COD"})}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                      orderData.paymentMethod === "COD"
                        ? "border-green-500 bg-green-50/50 dark:bg-green-900/20 shadow-lg"
                        : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        orderData.paymentMethod === "COD" 
                          ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}>
                        <Banknote className={`w-5 h-5 ${
                          orderData.paymentMethod === "COD" 
                            ? "text-white" 
                            : "text-gray-600 dark:text-gray-400"
                        }`} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Cash on Delivery</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Pay when delivered</p>
                      </div>
                      {orderData.paymentMethod === "COD" && (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className={`${cardBg} rounded-2xl border ${borderColor} shadow-xl p-6 backdrop-blur-lg`}>
              <div className="flex items-center justify-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Secure Checkout</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🔒 256-bit SSL encryption • 💳 Safe payment processing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${cardBg} rounded-2xl border ${borderColor} shadow-2xl sticky top-8 overflow-hidden backdrop-blur-lg`}>
              {/* Order Summary Header */}
              <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b ${borderColor}">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{cartItems.length} items</p>
              </div>

              {/* Items List */}
              <div className="p-6 max-h-80 overflow-y-auto space-y-4">
                {cartItems.map((item) => {
                  const itemTotal = calculateItemTotal(item);
                  const productImage = getProductImage(item);
                  
                  return (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={productImage}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                          {item.product?.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.variant?.color} • Qty: {item.quantity}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ₹{itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Details */}
              <div className="p-6 border-t ${borderColor}">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {totals.quantityDiscount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 dark:text-green-400">Quantity Discount</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        -₹{totals.quantityDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  {totals.couponDiscount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-purple-600 dark:text-purple-400">Coupon Discount</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">
                        -₹{totals.couponDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-medium text-green-600 dark:text-green-400">FREE</span>
                  </div>

                  {/* Delivery Estimate */}
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        Estimated delivery: {deliveryEstimate}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total Amount</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ₹{totals.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {orderData.paymentMethod === "COD" ? "Pay on delivery" : "Pay now"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || paymentProcessing || calculatingDiscounts || Object.keys(formErrors).length > 0}
                    className={`
                      w-full py-4 mt-6 rounded-xl font-bold text-lg
                      transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl
                      relative overflow-hidden group
                      ${orderData.paymentMethod === "ONLINE" 
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      }
                      text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                    `}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    {paymentProcessing ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing Payment...
                      </div>
                    ) : loading || calculatingDiscounts ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {calculatingDiscounts ? 'Calculating...' : 'Processing...'}
                      </div>
                    ) : Object.keys(formErrors).length > 0 ? (
                      "Fix errors to continue"
                    ) : orderData.paymentMethod === "COD" ? (
                      <>
                        <span>Place Order (COD)</span>
                        <Truck className="w-5 h-5 ml-2 inline" />
                      </>
                    ) : (
                      <>
                        <span>Pay ₹{totals.totalAmount.toFixed(0)}</span>
                        <Zap className="w-5 h-5 ml-2 inline" />
                      </>
                    )}
                  </button>

                  {/* Security Assurance */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <Lock className="w-3 h-3" />
                      <span>256-bit SSL secured</span>
                      <div className="w-1 h-1 bg-gray-300 rounded-full" />
                      <Shield className="w-3 h-3" />
                      <span>Payment protected</span>
                    </div>
                  </div>

                  {/* Need Help */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Need help? Call us at{" "}
                      <a href="tel:+919940334421" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                        +91 99403 34421
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Cart */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/cart")}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;