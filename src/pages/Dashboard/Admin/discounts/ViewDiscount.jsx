// components/admin/discounts/ViewDiscount.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../context/ThemeContext';
import { useGetDiscountByIdQuery } from '../../../../redux/services/discountService';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Percent, 
  DollarSign, 
  Package, 
  Truck,
  Users,
  ShoppingBag,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart2,
  User
} from 'lucide-react';

const ViewDiscount = () => {
  const { discountId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { data: discountData, isLoading, error } = useGetDiscountByIdQuery(discountId);
  const discount = discountData?.data;

  // Theme-based styling
  const themeClasses = {
    light: {
      bg: {
        primary: 'bg-white',
        secondary: 'bg-gray-50',
        card: 'bg-white',
      },
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-700',
        muted: 'text-gray-600',
      },
      border: 'border-gray-200',
      shadow: 'shadow-lg',
    },
    dark: {
      bg: {
        primary: 'bg-gray-900',
        secondary: 'bg-gray-800',
        card: 'bg-gray-800',
      },
      text: {
        primary: 'text-white',
        secondary: 'text-gray-200',
        muted: 'text-gray-400',
      },
      border: 'border-gray-700',
      shadow: 'shadow-lg shadow-gray-900',
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Discount Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!discount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${currentTheme.text.primary}`}>Discount not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get discount type icon and color
  const getDiscountTypeInfo = (type) => {
    switch(type) {
      case 'PERCENTAGE':
        return { icon: <Percent size={20} />, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900' };
      case 'FIXED_AMOUNT':
        return { icon: <DollarSign size={20} />, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900' };
      case 'BUY_X_GET_Y':
        return { icon: <Package size={20} />, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900' };
      case 'FREE_SHIPPING':
        return { icon: <Truck size={20} />, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900' };
      default:
        return { icon: <Tag size={20} />, color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800' };
    }
  };

  // Get user type label
  const getUserTypeLabel = (type) => {
    const types = {
      'ALL': 'All Users',
      'REGULAR': 'Regular Customers',
      'WHOLESALE': 'Wholesale Customers',
      'NEW_USER': 'New Users',
      'LOYALTY': 'Loyalty Members'
    };
    return types[type] || type;
  };

  // Get discount scope
  const getDiscountScope = (discount) => {
    if (discount.product) return `Product: ${discount.product.name}`;
    if (discount.category) return `Category: ${discount.category.name}`;
    if (discount.subcategory) return `Subcategory: ${discount.subcategory.name}`;
    return 'Sitewide';
  };

  // Calculate discount value display
  const getDiscountValueDisplay = (discount) => {
    if (discount.discountType === 'PERCENTAGE') {
      return `${discount.discountValue}%`;
    } else if (discount.discountType === 'FIXED_AMOUNT') {
      return `₹${discount.discountValue}`;
    } else if (discount.discountType === 'BUY_X_GET_Y') {
      return `Buy ${discount.minQuantity || 2} Get ₹${discount.discountValue} off`;
    } else if (discount.discountType === 'FREE_SHIPPING') {
      return 'Free Shipping';
    }
    return discount.discountValue;
  };

  // Check if discount is expired
  const isExpired = () => {
    return new Date(discount.validUntil) < new Date();
  };

  // Check if discount is upcoming
  const isUpcoming = () => {
    return new Date(discount.validFrom) > new Date();
  };

  const discountTypeInfo = getDiscountTypeInfo(discount.discountType);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen"
    >
      {/* Header */}
      <div className={`border-b ${currentTheme.border} ${currentTheme.bg.primary}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            
            {/* Left: Back Button + Title */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate(-1)}
                className={`p-2 rounded-lg ${currentTheme.bg.secondary} ${currentTheme.text.primary} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold font-italiana ${currentTheme.text.primary}`}>
                  {discount.name}
                </h1>
                <p className={`${currentTheme.text.muted} font-instrument text-sm sm:text-base`}>
                  Discount Details
                </p>
              </div>
            </div>

            {/* Right: Edit Button */}
            <div className="flex sm:flex-row flex-col sm:space-x-3 space-y-2 sm:space-y-0">
              <Link
                to={`/dashboard/discounts/edit/${discount.id}`}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={16} className="mr-2" />
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Discount Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Discount Header Card */}
            <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${discountTypeInfo.bgColor}`}>
                    <div className={discountTypeInfo.color}>
                      {discountTypeInfo.icon}
                    </div>
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${currentTheme.text.primary}`}>
                      {discount.name}
                    </h2>
                    <p className={`text-sm ${currentTheme.text.muted}`}>
                      {discount.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${discountTypeInfo.color}`}>
                    {getDiscountValueDisplay(discount)}
                  </div>
                  {discount.discountType === 'PERCENTAGE' && discount.maxDiscount && (
                    <div className={`text-sm ${currentTheme.text.muted}`}>
                      Max: ₹{discount.maxDiscount}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Discount Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scope & Rules */}
              <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
                <h3 className={`text-lg font-semibold font-instrument mb-4 flex items-center ${currentTheme.text.primary}`}>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Scope & Rules
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Scope</label>
                    <p className={`font-medium ${currentTheme.text.primary}`}>
                      {getDiscountScope(discount)}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Eligible Users</label>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <p className={`font-medium ${currentTheme.text.primary}`}>
                        {getUserTypeLabel(discount.userType)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Minimum Order Amount</label>
                    <p className={`font-medium ${currentTheme.text.primary}`}>
                      ₹{discount.minOrderAmount || '0'}
                    </p>
                  </div>
                  {discount.minQuantity && (
                    <div>
                      <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Minimum Quantity</label>
                      <p className={`font-medium ${currentTheme.text.primary}`}>
                        {discount.minQuantity} items
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Usage Limits */}
              <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
                <h3 className={`text-lg font-semibold font-instrument mb-4 flex items-center ${currentTheme.text.primary}`}>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Usage Limits
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Total Usage Limit</label>
                    <p className={`font-medium ${currentTheme.text.primary}`}>
                      {discount.usageLimit ? `${discount.usedCount || 0} / ${discount.usageLimit}` : 'Unlimited'}
                    </p>
                    {discount.usageLimit && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${((discount.usedCount || 0) / discount.usageLimit) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Per User Limit</label>
                    <p className={`font-medium ${currentTheme.text.primary}`}>
                      {discount.perUserLimit || 1} time(s)
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Total Discount Given</label>
                    <p className={`font-bold text-lg text-green-600 dark:text-green-400`}>
                      ₹{discount.totalDiscounts || 0}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Validity Period */}
              <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
                <h3 className={`text-lg font-semibold font-instrument mb-4 flex items-center ${currentTheme.text.primary}`}>
                  <Calendar className="w-5 h-5 mr-2" />
                  Validity Period
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Valid From</label>
                    <p className={`font-medium ${currentTheme.text.primary}`}>
                      {formatDate(discount.validFrom)}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Valid Until</label>
                    <p className={`font-medium ${currentTheme.text.primary}`}>
                      {formatDate(discount.validUntil)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className={`text-sm ${isExpired() ? 'text-red-600 dark:text-red-400' : isUpcoming() ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                        {isExpired() ? 'Expired' : isUpcoming() ? 'Upcoming' : 'Currently Active'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Status & History */}
              <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
                <h3 className={`text-lg font-semibold font-instrument mb-4 flex items-center ${currentTheme.text.primary}`}>
                  <BarChart2 className="w-5 h-5 mr-2" />
                  Status & History
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={currentTheme.text.muted}>Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      discount.isActive && !isExpired() && !isUpcoming()
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {discount.isActive && !isExpired() && !isUpcoming() ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Created At</label>
                    <p className={`font-medium ${currentTheme.text.primary}`}>
                      {formatDate(discount.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Last Updated</label>
                    <p className={`font-medium ${currentTheme.text.primary}`}>
                      {formatDate(discount.updatedAt)}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Discount ID</label>
                    <p className={`font-mono text-sm ${currentTheme.text.primary}`}>
                      {discount.id}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Usage History & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
              <h3 className={`text-lg font-semibold font-instrument mb-4 ${currentTheme.text.primary}`}>Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/dashboard/discounts/edit/${discount.id}`)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Discount
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to List
                </button>
              </div>
            </motion.div>

            {/* Recent Usage */}
            {discount.discountUsage && discount.discountUsage.length > 0 && (
              <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
                <h3 className={`text-lg font-semibold font-instrument mb-4 flex items-center ${currentTheme.text.primary}`}>
                  <Users className="w-5 h-5 mr-2" />
                  Recent Usage
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {discount.discountUsage.map((usage, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${currentTheme.border}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">
                            {usage.user?.name || 'Customer'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Order #{usage.order?.orderNumber}
                          </p>
                        </div>
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          -₹{usage.discountAmount}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(usage.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Discount Preview */}
            <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
              <h3 className={`text-lg font-semibold font-instrument mb-4 ${currentTheme.text.primary}`}>How It Works</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Customer Experience:</p>
                  <p className="text-sm">Customers enter <strong>{discount.name}</strong> at checkout</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Discount Applied:</p>
                  <p className="text-sm">{getDiscountValueDisplay(discount)} discount applied</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Conditions:</p>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    <li>Min order: ₹{discount.minOrderAmount || 0}</li>
                    {discount.userType !== 'ALL' && (
                      <li>For: {getUserTypeLabel(discount.userType)}</li>
                    )}
                    <li>Per user limit: {discount.perUserLimit || 1} time(s)</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewDiscount;