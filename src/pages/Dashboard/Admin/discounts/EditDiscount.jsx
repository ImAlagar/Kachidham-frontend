// components/admin/discounts/EditDiscount.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../../../context/ThemeContext';
import { useGetDiscountByIdQuery, useUpdateDiscountMutation } from '../../../../redux/services/discountService';
import { toast } from 'react-toastify';
import { ArrowLeft, View, Calendar, Percent, DollarSign, Package, Truck } from 'lucide-react';
import Button from '../../../../components/Common/Button';
import InputField from '../../../../components/Common/InputField';
import TextArea from '../../../../components/Common/TextArea';

const EditDiscount = () => {
  const { discountId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const { data: discountData, isLoading: discountLoading } = useGetDiscountByIdQuery(discountId);
  const [updateDiscount] = useUpdateDiscountMutation();

  const discount = discountData?.data;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    productId: null,
    categoryId: null,
    subcategoryId: null,
    minQuantity: null,
    userType: 'ALL',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    perUserLimit: '1',
    validFrom: '',
    validUntil: '',
    isActive: true,
  });

  // Discount types
  const DISCOUNT_TYPES = [
    { value: 'PERCENTAGE', label: 'Percentage Discount', icon: <Percent size={16} /> },
    { value: 'FIXED_AMOUNT', label: 'Fixed Amount Discount', icon: <DollarSign size={16} /> },
    { value: 'BUY_X_GET_Y', label: 'Buy X Get Y Discount', icon: <Package size={16} /> },
  ];

  // User types
  const USER_TYPES = [
    { value: 'ALL', label: 'All Users' },

  ];

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

  // Initialize form with discount data
  useEffect(() => {
    if (discount) {
      // Format dates for input fields
      const formatDateForInput = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0];
      };

      setFormData({
        name: discount.name || '',
        description: discount.description || '',
        discountType: discount.discountType || 'PERCENTAGE',
        discountValue: discount.discountValue?.toString() || '',
        productId: discount.productId || null,
        categoryId: discount.categoryId || null,
        subcategoryId: discount.subcategoryId || null,
        minQuantity: discount.minQuantity?.toString() || '',
        userType: discount.userType || 'ALL',
        minOrderAmount: discount.minOrderAmount?.toString() || '',
        maxDiscount: discount.maxDiscount?.toString() || '',
        usageLimit: discount.usageLimit?.toString() || '',
        perUserLimit: discount.perUserLimit?.toString() || '1',
        validFrom: formatDateForInput(discount.validFrom) || '',
        validUntil: formatDateForInput(discount.validUntil) || '',
        isActive: discount.isActive || true,
      });
    }
  }, [discount]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle discount type change
  const handleDiscountTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      discountType: type,
      // Reset specific fields when type changes
      discountValue: type === 'FREE_SHIPPING' ? '0' : prev.discountValue,
      maxDiscount: type !== 'PERCENTAGE' ? '' : prev.maxDiscount,
      minQuantity: type === 'BUY_X_GET_Y' ? prev.minQuantity || '2' : ''
    }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Discount name is required');
      return false;
    }

    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      toast.error('Discount value must be greater than 0');
      return false;
    }

    if (formData.discountType === 'PERCENTAGE' && parseFloat(formData.discountValue) > 100) {
      toast.error('Percentage discount cannot exceed 100%');
      return false;
    }

    if (new Date(formData.validFrom) >= new Date(formData.validUntil)) {
      toast.error('Valid from date must be before valid until date');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const discountUpdateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        productId: formData.productId || null,
        categoryId: formData.categoryId || null,
        subcategoryId: formData.subcategoryId || null,
        minQuantity: formData.minQuantity ? parseInt(formData.minQuantity) : null,
        userType: formData.userType,
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        perUserLimit: parseInt(formData.perUserLimit) || 1,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        isActive: formData.isActive
      };


      await updateDiscount({
        discountId,
        discountData: discountUpdateData
      }).unwrap();
      
      // Navigate back to discounts list
      navigate('/dashboard/discounts');
    } catch (error) {
      console.error('Update discount error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate discount preview
  const calculateDiscountPreview = () => {
    if (!formData.discountValue) return { amount: 0, finalPrice: 1000 };
    
    const sampleAmount = 1000;
    let discountAmount = 0;
    
    if (formData.discountType === 'PERCENTAGE') {
      discountAmount = (sampleAmount * parseFloat(formData.discountValue)) / 100;
      if (formData.maxDiscount && discountAmount > parseFloat(formData.maxDiscount)) {
        discountAmount = parseFloat(formData.maxDiscount);
      }
    } else if (formData.discountType === 'FIXED_AMOUNT') {
      discountAmount = parseFloat(formData.discountValue);
    }
    
    return {
      amount: discountAmount,
      finalPrice: sampleAmount - discountAmount
    };
  };

  const preview = calculateDiscountPreview();

  if (discountLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!discount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Discount Not Found</h2>
          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex"
    >
      <div className="flex-1">
        <div className={currentTheme.text.primary}>
          <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
              <motion.div
                variants={containerVariants}
                className={`rounded-lg ${currentTheme.shadow} overflow-hidden ${currentTheme.bg.secondary}`}
              >
                {/* Header */}
                <div className={`border-b ${currentTheme.border} ${currentTheme.bg.primary}`}>
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
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
                          <h1 className="text-xl sm:text-2xl font-bold font-italiana">{discount.name}</h1>
                          <p className={`${currentTheme.text.muted} font-instrument text-sm sm:text-base`}>
                            Edit discount details
                          </p>
                        </div>
                      </div>

                      {/* Right: View Button */}
                      <div className="flex sm:flex-row flex-col sm:space-x-3 space-y-2 sm:space-y-0">
                        <Link
                          to={`/dashboard/discounts/view/${discount.id}`}
                          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <View size={16} className="mr-2" />
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Discount Information */}
                        <motion.section
                          variants={containerVariants}
                          className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                        >
                          <motion.h2 
                            variants={itemVariants}
                            className="text-xl font-semibold font-instrument mb-6 flex items-center"
                          >
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                            Discount Information
                          </motion.h2>

                          <div className="space-y-6">
                            <motion.div variants={itemVariants}>
                              <InputField
                                label="Discount Name *"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., SUMMER20, WELCOME10"
                                helpText="This will be the discount code customers enter"
                              />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                              <TextArea
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="e.g., Summer sale discount for all products"
                                rows={3}
                              />
                            </motion.div>

                            {/* Discount Type Selection */}
                            <motion.div variants={itemVariants}>
                              <label className={`block text-sm font-medium font-instrument mb-3 ${currentTheme.text.secondary}`}>
                                Discount Type *
                              </label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {DISCOUNT_TYPES.map((type) => (
                                  <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => handleDiscountTypeChange(type.value)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                                      formData.discountType === type.value
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : `${currentTheme.border} hover:border-blue-300`
                                    }`}
                                  >
                                    <div className={`mb-2 ${
                                      formData.discountType === type.value 
                                        ? 'text-blue-600 dark:text-blue-400' 
                                        : currentTheme.text.muted
                                    }`}>
                                      {type.icon}
                                    </div>
                                    <span className={`text-sm font-medium ${
                                      formData.discountType === type.value 
                                        ? currentTheme.text.primary 
                                        : currentTheme.text.secondary
                                    }`}>
                                      {type.label}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </motion.div>

                            {/* Discount Value */}
                            <motion.div variants={itemVariants}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {formData.discountType === 'PERCENTAGE' ? (
                                  <InputField
                                    label="Discount Percentage *"
                                    name="discountValue"
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    max="100"
                                    step="0.01"
                                    placeholder="e.g., 20"
                                    prefix="%"
                                  />
                                ) : formData.discountType === 'FIXED_AMOUNT' ? (
                                  <InputField
                                    label="Discount Amount *"
                                    name="discountValue"
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    step="0.01"
                                    placeholder="e.g., 100"
                                    prefix="₹"
                                  />
                                ) : formData.discountType === 'BUY_X_GET_Y' ? (
                                  <>
                                    <InputField
                                      label="Buy Quantity *"
                                      name="minQuantity"
                                      type="number"
                                      value={formData.minQuantity || '2'}
                                      onChange={handleInputChange}
                                      required
                                      min="2"
                                      placeholder="e.g., 2"
                                      helpText="Minimum quantity to qualify for discount"
                                    />
                                    <InputField
                                      label="Discount Amount *"
                                      name="discountValue"
                                      type="number"
                                      value={formData.discountValue}
                                      onChange={handleInputChange}
                                      required
                                      min="1"
                                      step="0.01"
                                      placeholder="e.g., 100"
                                      prefix="₹"
                                      helpText="Discount applied when buying specified quantity"
                                    />
                                  </>
                                ) : (
                                  <div className="col-span-2">
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                      <p className="text-green-700 dark:text-green-300 font-medium">
                                        Free Shipping Discount
                                      </p>
                                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                        This discount will provide free shipping to eligible orders
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>

                            {/* Max Discount (for percentage) */}
                            {formData.discountType === 'PERCENTAGE' && (
                              <motion.div variants={itemVariants}>
                                <InputField
                                  label="Maximum Discount Amount"
                                  name="maxDiscount"
                                  type="number"
                                  value={formData.maxDiscount}
                                  onChange={handleInputChange}
                                  min="0"
                                  step="0.01"
                                  placeholder="e.g., 500"
                                  prefix="₹"
                                  helpText="Optional: Maximum amount this discount can provide"
                                />
                              </motion.div>
                            )}
                          </div>
                        </motion.section>

                        {/* Discount Rules & Scope */}
                        <motion.section
                          variants={containerVariants}
                          className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                        >
                          <motion.h2 
                            variants={itemVariants}
                            className="text-xl font-semibold font-instrument mb-6 flex items-center"
                          >
                            <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                            Rules & Scope
                          </motion.h2>

                          <motion.div variants={itemVariants} className="space-y-6">
                            {/* User Type */}
                            <div>
                              <label className={`block text-sm font-medium font-instrument mb-2 ${currentTheme.text.secondary}`}>
                                Eligible Users *
                              </label>
                              <select
                                name="userType"
                                value={formData.userType}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                                required
                              >
                                {USER_TYPES.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Minimum Order Amount */}
                            <InputField
                              label="Minimum Order Amount"
                              name="minOrderAmount"
                              type="number"
                              value={formData.minOrderAmount}
                              onChange={handleInputChange}
                              min="0"
                              step="0.01"
                              placeholder="e.g., 1000"
                              prefix="₹"
                              helpText="Minimum order amount required to apply this discount"
                            />

                            {/* Usage Limits */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <InputField
                                label="Total Usage Limit"
                                name="usageLimit"
                                type="number"
                                value={formData.usageLimit}
                                onChange={handleInputChange}
                                min="1"
                                placeholder="e.g., 100"
                                helpText="Total number of times this discount can be used"
                              />
                              <InputField
                                label="Per User Limit"
                                name="perUserLimit"
                                type="number"
                                value={formData.perUserLimit}
                                onChange={handleInputChange}
                                min="1"
                                placeholder="e.g., 1"
                                required
                                helpText="Number of times a single user can use this discount"
                              />
                            </div>
                          </motion.div>
                        </motion.section>

                        {/* Validity Period */}
                        <motion.section
                          variants={containerVariants}
                          className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                        >
                          <motion.h2 
                            variants={itemVariants}
                            className="text-xl font-semibold font-instrument mb-6 flex items-center"
                          >
                            <span className="bg-yellow-100 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                            Validity Period
                          </motion.h2>

                          <motion.div variants={itemVariants} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <InputField
                                label="Valid From *"
                                name="validFrom"
                                type="date"
                                value={formData.validFrom}
                                onChange={handleInputChange}
                                required
                                icon={<Calendar size={16} />}
                              />
                              <InputField
                                label="Valid Until *"
                                name="validUntil"
                                type="date"
                                value={formData.validUntil}
                                onChange={handleInputChange}
                                required
                                icon={<Calendar size={16} />}
                              />
                            </div>
                          </motion.div>
                        </motion.section>

                        {/* Status */}
                        <motion.section
                          variants={containerVariants}
                          className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                        >
                          <motion.h2 
                            variants={itemVariants}
                            className="text-xl font-semibold font-instrument mb-6 flex items-center"
                          >
                            <span className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                            Status
                          </motion.h2>

                          <motion.div variants={itemVariants} className="space-y-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                              />
                              <label htmlFor="isActive" className="ml-2 text-sm font-medium">
                                Activate this discount
                              </label>
                            </div>
                            
                            {/* Usage Statistics */}
                            {discount.usedCount > 0 && (
                              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                                  Usage Statistics
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-600 dark:text-gray-400">Times Used:</p>
                                    <p className="font-bold text-lg">{discount.usedCount}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600 dark:text-gray-400">Total Discount Given:</p>
                                    <p className="font-bold text-lg">₹{discount.totalDiscounts || 0}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </motion.section>

                        {/* Submit Section */}
                        <motion.section
                          variants={containerVariants}
                          className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                        >
                          <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div>
                              <h3 className="text-lg font-semibold font-instrument">Update Discount</h3>
                              <p className={currentTheme.text.muted}>
                                Save changes to this discount
                              </p>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-4">
                              <Button
                                type="button"
                                onClick={() => navigate(-1)}
                                variant="ghost"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={loading}
                                variant="primary"
                                className="min-w-[200px]"
                                loading={loading}
                              >
                                Update Discount
                              </Button>
                            </div>
                          </motion.div>
                        </motion.section>
                      </form>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="lg:col-span-1">
                      <motion.div
                        variants={containerVariants}
                        className={`sticky top-6 border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                      >
                        <h3 className="text-lg font-semibold font-instrument mb-6 flex items-center">
                          <span className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <Percent size={16} />
                          </span>
                          Discount Preview
                        </h3>

                        <div className="space-y-4">
                          {/* Discount Code Preview */}
                          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                            <p className="text-sm opacity-90">Discount Code</p>
                            <p className="text-2xl font-bold tracking-wider mt-1">
                              {formData.name || 'YOURCODE'}
                            </p>
                          </div>

                          {/* Discount Details */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className={currentTheme.text.muted}>Type:</span>
                              <span className={`font-medium ${
                                formData.discountType === 'PERCENTAGE' ? 'text-purple-600 dark:text-purple-400'
                                : formData.discountType === 'FIXED_AMOUNT' ? 'text-green-600 dark:text-green-400'
                                : formData.discountType === 'BUY_X_GET_Y' ? 'text-blue-600 dark:text-blue-400'
                                : 'text-yellow-600 dark:text-yellow-400'
                              }`}>
                                {formData.discountType?.replace('_', ' ') || 'Percentage'}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className={currentTheme.text.muted}>Value:</span>
                              <span className="font-bold text-lg">
                                {formData.discountType === 'PERCENTAGE' ? `${formData.discountValue || '0'}%` : `₹${formData.discountValue || '0'}`}
                              </span>
                            </div>

                            {formData.discountType === 'PERCENTAGE' && formData.maxDiscount && (
                              <div className="flex justify-between items-center">
                                <span className={currentTheme.text.muted}>Max Amount:</span>
                                <span className="font-medium">₹{formData.maxDiscount}</span>
                              </div>
                            )}

                            {formData.discountType === 'BUY_X_GET_Y' && formData.minQuantity && (
                              <div className="flex justify-between items-center">
                                <span className={currentTheme.text.muted}>Buy Quantity:</span>
                                <span className="font-medium">{formData.minQuantity} items</span>
                              </div>
                            )}

                            <div className="flex justify-between items-center">
                              <span className={currentTheme.text.muted}>Min Order:</span>
                              <span className="font-medium">₹{formData.minOrderAmount || '0'}</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className={currentTheme.text.muted}>For Users:</span>
                              <span className="font-medium">
                                {USER_TYPES.find(t => t.value === formData.userType)?.label || 'All Users'}
                              </span>
                            </div>

                            {/* Usage Limit */}
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Usage Limits</p>
                              <div className="flex justify-between mt-1">
                                <span className="text-sm">Total:</span>
                                <span className="font-medium">{formData.usageLimit || 'Unlimited'}</span>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-sm">Per User:</span>
                                <span className="font-medium">{formData.perUserLimit || '1'}</span>
                              </div>
                            </div>

                            {/* Validity Period */}
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-sm text-blue-600 dark:text-blue-400">Valid Period</p>
                              <div className="mt-1 text-sm">
                                <p>From: {new Date(formData.validFrom).toLocaleDateString()}</p>
                                <p>Until: {new Date(formData.validUntil).toLocaleDateString()}</p>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <span className="text-sm">Status:</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                formData.isActive
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {formData.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>

                            {/* Preview Example */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
                              <p className="text-sm font-medium mb-2">Example Application:</p>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Order Amount:</span>
                                  <span>₹1000</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Discount ({formData.discountValue || '0'}%):</span>
                                  <span className="text-green-600 dark:text-green-400">-₹{preview.amount.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-bold">
                                  <span>Final Amount:</span>
                                  <span>₹{preview.finalPrice.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default EditDiscount;