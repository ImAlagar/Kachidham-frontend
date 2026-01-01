import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/slices/cartSlice';
import { useInitiatePaymentMutation, useVerifyPaymentMutation } from '../../redux/services/orderService';
import { toast } from 'react-hot-toast';
import { Lock, Loader } from 'lucide-react';

const RazorpayButton = ({
  orderData,
  amount,
  isProcessing,
  setIsProcessing,
  setOrderSuccess,
  setOrderNumber,
  disabled
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [initiatePayment] = useInitiatePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (disabled || isProcessing) return;
    
    setIsProcessing(true);

    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error('Failed to load payment gateway');
        setIsProcessing(false);
        return;
      }

      // Initiate payment with backend
      const result = await initiatePayment({ orderData }).unwrap();
      
      if (!result.success || !result.data?.razorpayOrder) {
        throw new Error('Failed to initiate payment');
      }

      const { razorpayOrder, tempOrderData } = result.data;
      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'kachidham Fashions',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          // Verify payment with backend
          const verifyResult = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData: tempOrderData
          }).unwrap();

          if (verifyResult.success) {
            // Clear cart and show success
            dispatch(clearCart());
            setOrderNumber(verifyResult.data.orderNumber);
            setOrderSuccess(true);
            toast.success('Payment successful! Order confirmed.');
          } else {
            toast.error('Payment verification failed');
          }
          setIsProcessing(false);
        },
        prefill: {
          name: orderData.name,
          email: orderData.email,
          contact: orderData.phone
        },
        notes: {
          address: orderData.address
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.data?.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={disabled || isProcessing}
      className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {isProcessing ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
          Processing Payment...
        </>
      ) : (
        <>
          <Lock className="w-5 h-5 mr-3" />
          Pay Now • ${amount.toFixed(2)}
        </>
      )}
    </button>
  );
};

export default RazorpayButton;