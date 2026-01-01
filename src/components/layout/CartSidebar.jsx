import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiShoppingBag,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';

import {
  updateQuantity,
  removeCartItem,
  clearCart,
} from '../../redux/slices/cartSlice';
import { useTheme } from '../../context/ThemeContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const isDark = theme === 'dark';
  const [isProcessing, setIsProcessing] = useState(false);

  // CART SUMMARY
  const cartSummary = React.useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = Number(item.variant?.price) || Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + price * qty;
    }, 0);

    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total: Number(total.toFixed(2)),
      itemsCount: cartItems.reduce((c, item) => c + (item.quantity || 0), 0),
    };
  }, [cartItems]);

  // QUANTITY CHANGE
  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ itemId, quantity: newQty }));
  };

  const handleRemoveItem = (itemId) => dispatch(removeCartItem(itemId));

  // CHECKOUT HANDLER
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      onClose();

      if (!user) {
        navigate('/login', { state: { from: '/checkout' } });
        return;
      }

      navigate('/checkout');
      setIsProcessing(false);
    }, 300);
  };

  // ESC CLOSE
  useEffect(() => {
    const keyClose = (e) => e.key === 'Escape' && isOpen && onClose();
    document.addEventListener('keydown', keyClose);

    return () => document.removeEventListener('keydown', keyClose);
  }, [isOpen, onClose]);

  // STOP BODY SCROLL
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'unset');
  }, [isOpen]);

  const getProductImage = (item) => {
    if (item.variant?.image) return item.variant.image;
    if (item.product?.image) return item.product.image;
    if (item.product?.images?.[0]) return item.product.images[0];
    return '/api/placeholder/80/80';
  };

  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <FiShoppingBag className="w-10 h-10 text-gray-400" />
      </div>
      <p className="text-lg font-semibold">Your cart is empty</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Add items to get started</p>

      <button
        onClick={onClose}
        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:opacity-90 transition"
      >
        <Link to={'/shop'}>Continue Shopping</Link>
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* SIDEBAR */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className={`fixed top-0 right-0 h-screen w-full max-w-sm z-[101] shadow-2xl flex flex-col border-l ${
              isDark
                ? 'bg-gray-900 text-white border-gray-800'
                : 'bg-white text-gray-900 border-gray-200'
            }`}
          >
            {/* HEADER */}
            <div className="p-5 border-b flex items-center justify-between font-ui text-base">
              <div className="flex items-center gap-3">
                <FiShoppingBag className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-semibold font-heading">Shopping Cart</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cartSummary.itemsCount} items
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-body">
              {cartItems.length === 0 ? (
                <EmptyCart />
              ) : (
                cartItems.map((item) => {
                  const price = Number(item.variant?.price) || Number(item.price) || 0;
                  const total = price * (item.quantity || 0);
                  const imageUrl = getProductImage(item);

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-sm transition"
                    >
                      {/* IMAGE */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={imageUrl}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.src = '/api/placeholder/80/80')}
                        />
                      </div>

                      {/* DETAILS */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm line-clamp-1 font-ui">
                              {item.product?.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {item.variant?.color && `${item.variant.color} • `}
                              {item.variant?.size || 'One Size'}
                            </p>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* QUANTITY */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-3 py-1 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>
                            <span className="px-4 py-1 text-sm font-semibold font-ui">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>

                          <p className="font-semibold font-ui">₹{total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* FOOTER */}
            {cartItems.length > 0 && (
              <div className="border-t p-4 space-y-4 font-ui border-gray-200 dark:border-gray-800">
                {/* SHIPPING MESSAGE */}
                {cartSummary.subtotal < 50 && (
                  <div
                    className={`p-3 rounded-xl text-sm border flex flex-col gap-1 ${
                      isDark
                        ? 'bg-blue-900/20 text-blue-300 border-blue-800/50'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <FiCheck className="w-4 h-4" /> Free shipping on orders over ₹50
                    </span>
                    <p className="text-xs opacity-80">
                      Add ₹{(50 - cartSummary.subtotal).toFixed(2)} more to qualify
                    </p>
                  </div>
                )}

                {/* SUMMARY */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm opacity-80">
                    <span>Subtotal</span>
                    <span>₹{cartSummary.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span
                      className={
                        cartSummary.shipping === 0
                          ? 'text-green-600 dark:text-green-400'
                          : ''
                      }
                    >
                      {cartSummary.shipping === 0
                        ? 'FREE'
                        : `₹${cartSummary.shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-300 dark:border-gray-600 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>₹{cartSummary.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* CHECKOUT BUTTON */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center transition ${{
                    true: 'bg-gray-400 cursor-not-allowed',
                    false: 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90',
                  }[isProcessing.toString()]}`}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                      Processing...
                    </div>
                  ) : user ? (
                    <>
                      Checkout Now <FiArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    'Login to Checkout'
                  )}
                </button>

                <button
                  onClick={() =>
                    window.confirm('Clear all items from cart?') && dispatch(clearCart())
                  }
                  className="w-full text-center text-sm text-red-500 dark:text-red-400 hover:underline"
                >
                  Clear Cart
                </button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  30-day return policy • Secure checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
