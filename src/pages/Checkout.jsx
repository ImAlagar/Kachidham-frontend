import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import { toast } from "react-toastify";
import Loader from "../components/HomeComponents/SkeletonLoader";
import axios from "axios";
import {
    useGetAvailableDiscountsMutation,
    useCalculateCartDiscountMutation,
    useValidateDiscountCodeMutation
} from "../redux/services/discountService";

/* ---------------- LOAD RAZORPAY ---------------- */
const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [shipping, setShipping] = useState(0);
    const [getAvailableDiscounts] = useGetAvailableDiscountsMutation();
    const [calculateCartDiscount] = useCalculateCartDiscountMutation();
    const [validateDiscountCode] = useValidateDiscountCodeMutation();
    const [user, setUser] = useState();
    const [orderCompleted, setOrderCompleted] = useState(false);

    /* ---------------- ITEMS ---------------- */
const rawItems = useMemo(() => {
    if (Array.isArray(location.state?.items)) {
        return location.state.items;
    }

    const storedItems = localStorage.getItem("checkout_items");
    return storedItems ? JSON.parse(storedItems) : [];
}, [location.state]);


    const items = useMemo(
        () =>
            rawItems.map((i) => ({
                ...i,
                price: Number(i.price) || Number(i.offerPrice) || 0,
                quantity: Number(i.quantity) || 1
            })),
        [rawItems]
    );

    const subtotal = useMemo(
        () => items.reduce((s, i) => s + i.price * i.quantity, 0),
        [items]
    );

    /* ---------------- FORM ---------------- */
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        city: "",
        deliveryRegion: "",
        state: "",
        address: "",
        pincode: ""
    });

    /* ---------------- COUPON ---------------- */
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [selectedCoupon, setSelectedCoupon] = useState(null); // 🔥 LOCKED COUPON

    const [finalAmount, setFinalAmount] = useState(subtotal);
    const [couponMessage, setCouponMessage] = useState("");
    const [loadingCoupon, setLoadingCoupon] = useState(false);
    const [couponError, setCouponError] = useState("");

    /* ---------------- FETCH COUPONS ---------------- */
    const fetchCoupons = async () => {
        try {
            const payload = {
                cartItems: items.map(i => ({
                    productId: i.productId,
                    variantId: i.variantId,
                    quantity: i.quantity,
                    price: i.price
                })),
                orderAmount: subtotal
            };

            const res = await getAvailableDiscounts(payload).unwrap();
            setAvailableCoupons(res.data || []);
        } catch (err) {
            console.error("Failed to load coupons", err);
        }
    };

    //Shipping 
    const calculateShipping = (region) => {
        if (!region) return 0;
        switch (region) {
            case "Tamil Nadu":
                return 80;

            case "Kerala":
            case "Karnataka":
            case "Andhra Pradesh":
            case "Telangana":
                return 100;

            case "Other":
            default:
                return 200;
        }
    };

    useEffect(() => {
        setShipping(calculateShipping(form.deliveryRegion));
    }, [form.deliveryRegion]);

    const finalState =
        form.deliveryRegion === "Other"
            ? form.state
            : form.deliveryRegion;

const applyCoupon = async () => {
    if (!couponCode) return;

    setCouponError("");
    setCouponMessage("");

    // 🔍 Find coupon from available list
    const coupon = availableCoupons.find(
        c => c.name.toLowerCase() === couponCode.toLowerCase()
    );

    if (!coupon) {
        setCouponError("Invalid coupon code");
        return;
    }

    // ✅ FRONTEND VALIDATION
    const frontendError = validateCouponFrontend(coupon);
    if (frontendError) {
        setCouponError(frontendError);
        return;
    }

    try {
        setLoadingCoupon(true);
        setSelectedCoupon(coupon); // 🔥 Store immediately when clicked

        // ✅ CORRECT PAYLOAD STRUCTURE
        const payload = {
            cartItems: items.map(i => ({
                product: {
                    id: i.productId,
                    offerPrice: i.offerPrice,
                    normalPrice: i.normalPrice || i.price,
                    name: i.name
                },
                productId: i.productId,
                variantId: i.variantId || null,
                quantity: i.quantity,
                price: i.price
            })),
            discountId: coupon.id,  // 🔥 MUST BE 'discountId' (not couponId)
            userId: user?.id
        };

        console.log("🎯 SENDING PAYLOAD TO BACKEND:", payload);
        console.log("🎯 DISCOUNT ID BEING SENT:", coupon.id);

        // ✅ Call API with correct structure
        const res = await calculateCartDiscount(payload).unwrap();

        console.log("🎯 BACKEND RESPONSE:", res);

        if (!res.success) {
            setDiscount(0);
            setFinalAmount(subtotal + shipping);
            setSelectedCoupon(null); // Reset if failed
            setCouponError(res.data?.message || res.data?.errors?.[0] || "Coupon not applicable");
            return;
        }

        // ✅ Check if user selected discount was applied
        const appliedDiscount = res.data.appliedDiscounts?.find(d => 
            d.type === "USER_SELECTED" || d.name === coupon.name
        );

        if (!appliedDiscount) {
            console.warn("⚠️ Selected discount not applied, auto discount used instead");
            toast.info(`Applied best available discount: ${res.data.appliedDiscounts?.[0]?.name || 'Auto discount'}`);
        }

        // ✅ Update state with backend calculation
        setDiscount(res.data.totalDiscount || 0);
        setFinalAmount((res.data.finalTotal || subtotal) + shipping);
        
        if (appliedDiscount) {
            setCouponMessage(`${appliedDiscount.name} applied successfully ✅`);
        } else {
            setCouponMessage("Best available discount applied");
        }

    } catch (err) {
        console.error("🔥 COUPON APPLICATION ERROR:", err);
        
        setDiscount(0);
        setFinalAmount(subtotal + shipping);
        setSelectedCoupon(null);
        
        const errorMsg = err?.data?.message || 
                        err?.data?.errors?.[0] || 
                        err?.error || 
                        "Failed to apply coupon";
        setCouponError(errorMsg);
        
        toast.error(errorMsg);
    } finally {
        setLoadingCoupon(false);
    }
};

/* ---------------- REMOVE COUPON ---------------- */
const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setSelectedCoupon(null);
    setCouponMessage("");
    setFinalAmount(subtotal + shipping);
    setCouponError("");
    
    toast.info("Coupon removed");
};

/* ---------------- VALIDATE COUPON FRONTEND ---------------- */
const validateCouponFrontend = (coupon) => {
    // Calculate totals
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartProductIds = items.map(item => item.productId);
    
    /* ---------------- BUY X GET Y / QUANTITY BASED ---------------- */
    if (coupon.discountType === "BUY_X_GET_Y" || coupon.discountType === "QUANTITY_BASED") {
        // Check for specific product requirement
        if (coupon.productId) {
            const productItem = items.find(item => item.productId === coupon.productId);
            if (!productItem) {
                return `This coupon requires a specific product`;
            }
            
            if (coupon.minQuantity && productItem.quantity < coupon.minQuantity) {
                return `Add ${coupon.minQuantity - productItem.quantity} more of this product`;
            }
        } 
        // Check total cart quantity
        else if (coupon.minQuantity && totalQty < coupon.minQuantity) {
            return `Add ${coupon.minQuantity - totalQty} more item(s) to use this coupon`;
        }
    }
    
    /* ---------------- MIN ORDER AMOUNT ---------------- */
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        return `Add ₹${(coupon.minOrderAmount - subtotal).toFixed(2)} more to apply this coupon`;
    }
    
    /* ---------------- PRODUCT SPECIFIC ---------------- */
    if (coupon.productId && !cartProductIds.includes(coupon.productId)) {
        return "This coupon is for a specific product not in your cart";
    }
    
    /* ---------------- CATEGORY SPECIFIC ---------------- */
    if (coupon.categoryId || coupon.category?.length > 0) {
        // You'll need to get category info from your items
        // This is a simplified check
        const hasCategoryMatch = items.some(item => 
            item.categoryId === coupon.categoryId || 
            (coupon.category && coupon.category.includes(item.category))
        );
        if (!hasCategoryMatch) {
            return "This coupon is for a specific category";
        }
    }
    
    return ""; // No error
};

    useEffect(() => {
        if (items.length > 0) {
            fetchCoupons();
        }
    }, [items, subtotal]);



    useEffect(() => {
        if (!couponCode) {
            setFinalAmount(subtotal + shipping);
        }
    }, [subtotal, shipping, couponCode]);


    /* ---------------- INITIATE PAYMENT ---------------- */
    const initiatePayment = async () => {


        // 🔢 Calculate final amount (SINGLE SOURCE OF TRUTH)
        const calculatedFinalAmount = Number(
            (subtotal + shipping - discount).toFixed(2)
        );

        // 🧾 Prepare order items (MATCH BACKEND SHAPE)
        const orderItems = items.map((i) => ({
            productId: i.productId,
            productVariantId: i.variantId || null, // ✅ backend expects this
            quantity: i.quantity
        }));

        // 📦 PAYLOAD — EXACTLY WHAT BACKEND EXPECTS
        const payload = {
            orderData: {
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
                city: form.city,
                state: finalState,
                pincode: form.pincode,

                // ✅ coupon / discount
                discountCode: selectedCoupon?.name || null,
                discountId: selectedCoupon?.id || null,
                discountAmount: discount,


                // ✅ totals (VERY IMPORTANT)
                subtotal: subtotal,
                shipping: shipping,
                totalAmountRupees: calculatedFinalAmount,
                totalAmountPaise: Math.round(calculatedFinalAmount * 100),

                // ✅ items
                orderItems
            }
        };

        // 🧪 Final payload check

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to continue");
                navigate("/login");
                return { success: false };
            }

            const res = await axios.post(
                `${API_BASE_URL}/api/orders/initiate-payment`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const json = res.data;

            if (!json.success) {
                toast.error(json.message || "Payment initiation failed");
                return { success: false };
            }

            return json;

        } catch (error) {
            console.error("INITIATE PAYMENT ERROR:", error);

            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }

            toast.error(
                error.response?.data?.message || "Payment initiation failed"
            );
            return { success: false };
        }
    };

    /* ---------------- VERIFY PAYMENT ---------------- */
    const verifyPayment = async (rp) => {
        const orderItems = items.map((i) => {
            const item = {
                productId: i.productId,   // ✅ SAME FIX
                quantity: i.quantity
            };

            if (i.variantId) {
                item.variantId = i.variantId;
            }

            return item;
        });

        const payload = {
            razorpay_order_id: rp.razorpay_order_id,
            razorpay_payment_id: rp.razorpay_payment_id,
            razorpay_signature: rp.razorpay_signature,
            orderData: {
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
                city: form.city,
                state: finalState,
                pincode: form.pincode,
                couponCode: selectedCoupon?.name || null,
                couponId: selectedCoupon?.id || null,

                orderItems
            }
        };

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/orders/verify-payment`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                }
            );

            const json = res.data;
            return json;
        } catch (error) {
            console.error("VERIFY PAYMENT ERROR ❌", error);
            return { success: false };
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        if (user === null && !orderCompleted) {
            navigate("/login", {
                state: { from: location.pathname }
            });
        }
    }, [user, orderCompleted]);


    /* ---------------- RAZORPAY FLOW ---------------- */
    const handlePayment = async () => {
        // 🔐 Validate delivery details
        if (
            !form.name ||
            !form.email ||
            !form.phone ||
            !form.address ||
            !form.city ||
            !form.deliveryRegion ||
            !form.pincode ||
            (form.deliveryRegion === "Other" && !form.state)
        ) {
            toast.error("Please fill all delivery details");
            return;
        }

        // 🔐 Auth check
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to continue");
            navigate("/login", { state: { from: location.pathname } });
            return;
        }

        // 💳 Load Razorpay
        const loaded = await loadRazorpay();
        if (!loaded) {
            toast.error("Payment gateway failed to load. Please try again.");
            return;
        }

        try {
            setIsProcessing(true);

            // 🧾 INITIATE PAYMENT
            const init = await initiatePayment();

            if (!init.success) {
                setIsProcessing(false);
                return;
            }

            const { razorpayOrder } = init.data;

            const rzp = new window.Razorpay({
                key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Kachidham",
                description: "Order Payment",
                order_id: razorpayOrder.id,

                handler: async (response) => {
                    try {
                        setIsProcessing(true);

                        // ✅ VERIFY PAYMENT
                        const verify = await verifyPayment(response);

                        if (!verify.success) {
                            setIsProcessing(false);
                            toast.error("Payment verification failed");
                            return;
                        }

                        // 🟢 ORDER SUCCESS
                        setOrderCompleted(true); // 🔥 IMPORTANT

                        // 🧹 CLEAR CART
                        localStorage.removeItem("cart"); // if using localStorage cart

                        const orderDetails = {
                        items,
                        subtotal,
                        discount,
                        finalAmount,
                        address: {
                            name: form.name,
                            email: form.email,
                            phone: form.phone,
                            address: form.address,
                            city: form.city,
                            state: finalState,
                            pincode: form.pincode,
                        }
                        };
                        // ✅ SAVE ORDER DETAILS
                        localStorage.setItem(
                        "orderDetails",
                        JSON.stringify(orderDetails)
                        );
                        // 📦 SAVE RESULT
                        localStorage.setItem(
                            "paymentResult",
                            JSON.stringify(verify.data)
                        );

                        // 📊 META PIXEL
                        if (window.fbq) {
                            window.fbq("track", "Purchase", {
                                value: Number(verify.data.totalAmount.toFixed(2)),
                                currency: "INR",
                            });
                        }


                        // 🚀 GO TO SUCCESS PAGE
                        setTimeout(() => {
                            navigate("/order-success", { replace: true });

                        }, 800);

                    } catch (err) {
                        console.error("VERIFY ERROR", err);
                        setIsProcessing(false);
                        toast.error("Payment verification failed");
                    }
                },

                prefill: {
                    name: form.name,
                    email: form.email,
                    contact: form.phone,
                },

                theme: { color: "#6B7C6B" },

                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                    },
                },
            });

            rzp.on("payment.failed", (response) => {
                setIsProcessing(false);
                toast.error(response.error.description || "Payment failed");
            });

            rzp.open();

        } catch (error) {
            console.error("PAYMENT ERROR", error);
            setIsProcessing(false);
            toast.error("Payment process failed. Please try again.");
        }
    };


    /* ---------------- HELPER FUNCTION: CHECK COUPON ELIGIBILITY ---------------- */
    const checkCouponEligibility = (coupon) => {
        // Get cart data
        const totalCartQty = items.reduce((sum, item) => sum + item.quantity, 0);
        const cartProductIds = items.map(item => item.productId);
        const cartCategories = items.map(item => item.category || item.productCategory);
        
        let isEligible = false;
        let requirementText = "";
        
        // 1️⃣ QUANTITY-BASED COUPON (for exact quantity)
        if (coupon.discountType === "QUANTITY_BASED" || coupon.discountType === "BUY_X_GET_Y") {
            if (coupon.quantityRequirement || coupon.minQuantity) {
                const requiredQty = coupon.quantityRequirement || coupon.minQuantity;
                // Check if cart has exact quantity
                isEligible = totalCartQty >= requiredQty;
                requirementText = `Buy minimum ${requiredQty} items`;

                
                if (!isEligible) {
                    requirementText = `Need exactly ${requiredQty} items (You have ${totalCartQty})`;
                }
            } else {
                isEligible = true;
                requirementText = "Quantity based coupon";
            }
        }
        
        // 2️⃣ CATEGORY-BASED COUPON
        else if (coupon.categoryId) {
            const hasCategoryMatch = items.some(item =>
                item.categoryId === coupon.categoryId
            );
            isEligible = hasCategoryMatch;
            requirementText = "For selected category";
            
            if (!isEligible) {
                requirementText = `Add products from ${coupon.category.join(", ")} category`;
            }
        }
        
        // 3️⃣ PRODUCT-SPECIFIC COUPON
        else if (coupon.productId) {
            const hasProductMatch = cartProductIds.includes(coupon.productId);


            
            isEligible = hasProductMatch;
            requirementText = `For specific products`;
            
            if (!isEligible) {
                requirementText = `Add required product to cart`;
            }
        }
        
        // 4️⃣ ALL PRODUCTS COUPON (no restrictions)
        else {
            isEligible = true;
            requirementText = "For all products";
        }
        
        // Additional checks for minimum order amount
        const needAmount = coupon.minOrderAmount > subtotal 
            ? coupon.minOrderAmount - subtotal 
            : 0;
        
        // Final eligibility check including amount
        const finalEligible = isEligible && needAmount === 0;
        
        return {
            isEligible: finalEligible,
            requirementText,
            needAmount
        };
    };

    /* ---------------- HELPER FUNCTION: RENDER COUPON CARD ---------------- */
    const renderCouponCard = (c) => {
        const { isEligible, requirementText, needAmount } = checkCouponEligibility(c);
        
        return (
            <div
                key={c.id}
                className={`border p-3 rounded cursor-pointer transition-all ${
                    isEligible 
                        ? 'border-green-400 bg-green-400/10 hover:bg-green-400/20' 
                        : 'border-secondary/50 bg-secondary/10 opacity-70'
                }`}
                onClick={() => {
                    if (!isEligible) return;
                    setCouponCode(c.name);
                    setSelectedCoupon(c); // 🔥 STORE FULL COUPON
                }}

            >
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{c.name}</span>
                            <span className="text-xs bg-white/10 text-white px-2 py-1 rounded">
                                {c.discountValue}{c.discountType === "PERCENTAGE" ? "%" : "₹"} OFF
                            </span>
                        </div>
                        <p className="text-xs mt-2 text-white/80">{requirementText}</p>
                        
                        {c.minOrderAmount > 0 && (
                            <p className="text-xs mt-1 text-white/60">
                                Min. order: ₹{c.minOrderAmount}
                                {needAmount > 0 && ` | Need ₹${needAmount} more`}
                            </p>
                        )}
                    </div>
                    
                    {isEligible ? (
                        <button className="text-xs bg-green-400 text-white px-3 py-1 rounded hover:bg-green-500">
                            APPLY
                        </button>
                    ) : (
                        <span className="text-xs bg-secondary/30 text-secondary px-3 py-1 rounded">
                            LOCKED
                        </span>
                    )}
                </div>
            </div>
        );
    };

    if (!items.length)
        return (
            <div className="py-24 text-center">
                <p>No items to checkout</p>
            </div>
        );

    return (
        <section className=" lg:px-20 py-10 lg:py-16 bg-primary">
            {isProcessing && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40">
                    <Loader />
                    <p className="mt-10 text-white tracking-widest">
                        Confirming your order...
                    </p>
                </div>
            )}

            <h1 className="text-4xl mb-5 font-baijamjuree text-white text-center">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:gap-10">
                {/* LEFT */}
                <div className=" p-8 border border-secondary font-josefin rounded-xl space-y-6">
                    <h1 className="text-2xl text-white md:text-4xl">Shipping details</h1>
                    <div className="space-y-5">
                        {/* NAME */}
                        <div className="flex flex-col gap-1">
                            <label className="font-medium  text-white">Full Name</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full border-b border-secondary font-josefin text-white bg-transparent px-4 py-3 rounded-2xl outline-none"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="flex flex-col gap-1">
                            <label className="font-medium  text-white">Email</label>
                            <input
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full border-b border-secondary font-josefin text-white bg-transparent px-4 py-3 rounded-2xl outline-none"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* PHONE */}
                        <div className="flex flex-col gap-1">
                            <label className="font-medium  text-white">Phone</label>
                            <input
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full border-b border-secondary font-josefin text-white bg-transparent px-4 py-3 rounded-2xl outline-none"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        {/* ADDRESS */}
                        <div className="flex flex-col gap-1">
                            <label className="font-medium  text-white">Address</label>
                            <input
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className="w-full border-b border-secondary font-josefin text-white bg-transparent px-4 py-3 rounded-2xl outline-none"
                                placeholder="Door no, Street"
                            />
                        </div>

                        {/* CITY */}
                        <div className="flex flex-col gap-1">
                            <label className="font-medium  text-white">City</label>
                            <input
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                className="w-full border-b border-secondary font-josefin text-white bg-transparent px-4 py-3 rounded-2xl outline-none"
                                placeholder="Enter city"
                            />
                        </div>

                        {/* STATE DROPDOWN */}
                        <div className="flex flex-col gap-1">
                            <label className="font-medium  text-white">State</label>

                            <select
                                value={form.deliveryRegion}
                                onChange={(e) =>
                                    setForm({ ...form, deliveryRegion: e.target.value })
                                }
                                className={`w-full border-b border-secondary bg-transparent px-4 py-3 rounded-2xl outline-none
                                            ${form.deliveryRegion ? "text-gray-500" : "text-gray-400"}`}
                            >
                                <option value="" disabled>Select State</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Telangana">Telangana</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* SHOW EXTRA INPUT WHEN OTHER */}
                        {form.deliveryRegion === "Other" && (
                            <div className="flex flex-col gap-1">
                                <label className="font-medium  text-white">Enter Your State</label>
                                <input
                                    value={form.state}
                                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                                    className="w-full border-b border-secondary font-josefin text-white bg-transparent px-4 py-3 rounded-2xl outline-none"
                                    placeholder="Type your state name"
                                />
                            </div>
                        )}

                        {/* PINCODE */}
                        <div className="flex flex-col gap-1">
                            <label className="font-medium  text-white">Pincode</label>
                            <input
                                value={form.pincode}
                                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                                className="w-full border-b font-josefin text-white border-secondary bg-transparent px-4 py-3 rounded-2xl outline-none"
                                placeholder="Enter pincode"
                            />
                        </div>
                    </div>

                </div>

                {/* RIGHT */}
                <div className="border border-secondary  p-8 rounded-xl font-josefin space-y-6">
                    <h1 className="text-2xl text-white font-josefin md:text-4xl">
                        Product details
                    </h1>

                    <div className="space-y-6">
                        {items.map((item) => (
                            <div
                                key={`${item.productId}-${item.variantId}`}
                                className="flex gap-4 border-b border-secondary pb-4"
                            >
                                {/* IMAGE */}
                                <img
                                    loading="lazy"
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-28 object-cover rounded-lg border"
                                />

                                {/* DETAILS */}
                                <div className="flex-1 space-y-1">
                                    <p className="text-lg text-white font-semibold">{item.name}</p>

                                    <p className="text-sm text-white">
                                        Color: <span className="font-medium">{item.color}</span>
                                    </p>

                                    <p className="text-sm text-white">
                                        Size: <span className="font-medium">{item.size}</span>
                                    </p>

                                    <p className="text-sm text-white">
                                        Quantity: <span className="font-medium">{item.quantity}</span>
                                    </p>
                                </div>

                                {/* PRICE */}
                                <div className="text-right">
                                    <p className="text-sm text-white">
                                        ₹ {item.price.toFixed(2)} × {item.quantity}
                                    </p>
                                    <p className="text-lg text-white font-semibold">
                                        ₹ {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AVAILABLE COUPONS */}
                    {availableCoupons.length > 0 ? (
                        <div className="space-y-4 text-sm">
                            <p className="font-semibold text-xl text-white">Available Coupons</p>
                            
                            {/* Group coupons by type for better organization */}
                            {(() => {
                                // Filter coupons by type
                                const quantityCoupons = availableCoupons.filter(c => 
                                    c.discountType === "QUANTITY_BASED" || c.discountType === "BUY_X_GET_Y"
                                );
                                
                                const categoryCoupons = availableCoupons.filter(c => 
                                    c.category && c.category.length > 0
                                );
                                
                                const productCoupons = availableCoupons.filter(c => 
                                    c.productId && c.productId.length > 0
                                );
                                
                                const allProductCoupons = availableCoupons.filter(c => 
                                    !c.category && !c.productId && 
                                    c.discountType !== "QUANTITY_BASED" && 
                                    c.discountType !== "BUY_X_GET_Y"
                                );
                                
                                return (
                                    <>
                                        {/* ALL PRODUCTS COUPONS */}
                                        {allProductCoupons.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-white font-medium text-lg">For All Products</p>
                                                {allProductCoupons.map(c => renderCouponCard(c))}
                                            </div>
                                        )}
                                        
                                        {/* QUANTITY-BASED COUPONS */}
                                        {quantityCoupons.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-white font-medium text-lg">Quantity Based Coupons</p>
                                                {quantityCoupons.map(c => renderCouponCard(c))}
                                            </div>
                                        )}
                                        
                                        {/* CATEGORY-BASED COUPONS */}
                                        {categoryCoupons.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-white font-medium text-lg">Category Specific Coupons</p>
                                                {categoryCoupons.map(c => renderCouponCard(c))}
                                            </div>
                                        )}
                                        
                                        {/* PRODUCT-SPECIFIC COUPONS */}
                                        {productCoupons.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-white font-medium text-lg">Product Specific Coupons</p>
                                                {productCoupons.map(c => renderCouponCard(c))}
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    ) : (
                        <p className="text-white text-sm">No coupons available</p>
                    )}

                    {/* APPLY COUPON */}
                    <div className="flex gap-3">
                        <input
                            value={couponCode}
                            disabled={discount > 0}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon"
                            className="flex-1 border border-secondary bg-transparent text-white px-4 py-3 rounded"
                        />

                        {discount > 0 ? (
                            <button
                                onClick={removeCoupon}
                                className="px-6 py-3 border border-red-400 text-red-400 rounded hover:bg-red-400/10"
                            >
                                Remove
                            </button>
                        ) : (
                            <button
                                onClick={applyCoupon}
                                disabled={loadingCoupon || !couponCode}
                                className={`px-6 py-3 border rounded ${
                                    loadingCoupon || !couponCode
                                        ? 'border-secondary/50 text-secondary/50 cursor-not-allowed'
                                        : 'border-secondary text-white hover:bg-secondary/10'
                                }`}
                            >
                                {loadingCoupon ? "Applying..." : "Apply"}
                            </button>
                        )}
                    </div>

                    {couponError && (
                        <p className="text-sm text-red-400">{couponError}</p>
                    )}

                    {couponMessage && !couponError && (
                        <p className="text-sm text-green-400">{couponMessage}</p>
                    )}

                    <div className="border-t flex flex-col gap-3 border-secondary pt-4">
                        <div className="flex justify-between text-white">
                            <span>Subtotal</span>
                            <span>₹ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-white">
                            <span>Discount</span>
                            <span>- ₹ {discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-white">
                            <span>Shipping</span>
                            <span>₹ {shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-white text-lg">
                            <span>Total</span>
                            <span>₹ {finalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={`w-full py-4 text-white border rounded-xl transition-all ${
                            isProcessing 
                                ? 'border-secondary/50 bg-secondary/20 cursor-not-allowed' 
                                : 'border-white hover:bg-white/10'
                        }`}
                    >
                        {isProcessing ? "Processing..." : "Pay Now"}
                    </button>
                </div>
            </div>
        </section>
    );
}