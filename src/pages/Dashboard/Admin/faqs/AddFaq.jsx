// components/admin/faqs/AddFaq.jsx - WITH NORMAL SELECT DROPDOWN
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../context/ThemeContext';
import { useCreateFaqMutation } from '../../../../redux/services/faqService';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/Common/Button';
import InputField from '../../../../components/Common/InputField';
import TextArea from '../../../../components/Common/TextArea';

const AddFaq = () => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [createFaq] = useCreateFaqMutation();

  // Form state
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'GENERAL',
    order: 0,
    isActive: true,
  });

  // Valid categories from backend
  const VALID_CATEGORIES = [
    { value: 'GENERAL', label: 'General' },
    { value: 'ORDERS', label: 'Orders' },
    { value: 'SHIPPING', label: 'Shipping' },
    { value: 'RETURNS', label: 'Returns' },
    { value: 'PAYMENTS', label: 'Payments' },
    { value: 'PRODUCTS', label: 'Products' },
    { value: 'CUSTOMIZATION', label: 'Customization' },
    { value: 'WHOLESALE', label: 'Wholesale' },
    { value: 'ACCOUNT', label: 'Account' },
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Parse order as number
    if (name === 'order') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    if (!formData.question.trim()) {
      toast.error('Question is required');
      return false;
    }

    if (!formData.answer.trim()) {
      toast.error('Answer is required');
      return false;
    }

    // Validate category is in valid list
    const validCategoryValues = VALID_CATEGORIES.map(cat => cat.value);
    if (!validCategoryValues.includes(formData.category)) {
      toast.error('Please select a valid category');
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
      const faqData = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        category: formData.category,
        order: Number(formData.order),
        isActive: formData.isActive
      };

      console.log('Submitting FAQ data:', faqData); // Debug log

      await createFaq(faqData).unwrap();
      
      // Reset form
      setFormData({
        question: '',
        answer: '',
        category: 'GENERAL',
        order: 0,
        isActive: true,
      });
      
      // Navigate back to FAQs list
      navigate('/dashboard/faqs');
    } catch (error) {
      console.error('Create FAQ error:', error);
      // Error toast is already handled by the mutation's onQueryStarted
    } finally {
      setLoading(false);
    }
  };

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
            <div className="max-w-4xl mx-auto">
              <motion.div
                variants={containerVariants}
                className={`rounded-lg ${currentTheme.shadow} overflow-hidden ${currentTheme.bg.secondary}`}
              >
                {/* Header */}
                <div className={`border-b ${currentTheme.border} ${currentTheme.bg.primary}`}>
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      
                      {/* Back Button */}
                      <button
                        onClick={() => navigate(-1)}
                        className={`p-2 rounded-lg ${currentTheme.bg.secondary} ${currentTheme.text.primary} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                      >
                        <ArrowLeft size={20} />
                      </button>

                      {/* Header Text */}
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold font-italiana">
                          Create New FAQ
                        </h1>
                        <p className={`${currentTheme.text.muted} font-instrument text-sm sm:text-base`}>
                          Add a new frequently asked question
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Basic Information */}
                  <motion.section
                    variants={containerVariants}
                    className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                  >
                    <motion.h2 
                      variants={itemVariants}
                      className="text-xl font-semibold font-instrument mb-6 flex items-center"
                    >
                      <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                      FAQ Information
                    </motion.h2>

                    <div className="space-y-6">
                      <motion.div variants={itemVariants}>
                        <InputField
                          label="Question *"
                          name="question"
                          value={formData.question}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., What payment methods do you accept?"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <TextArea
                          label="Answer *"
                          name="answer"
                          value={formData.answer}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., We accept all major credit cards, PayPal, and bank transfers."
                          rows={6}
                        />
                      </motion.div>
                    </div>
                  </motion.section>

                  {/* Additional Details */}
                  <motion.section
                    variants={containerVariants}
                    className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                  >
                    <motion.h2 
                      variants={itemVariants}
                      className="text-xl font-semibold font-instrument mb-6 flex items-center"
                    >
                      <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                      Additional Details
                    </motion.h2>

                    <motion.div variants={itemVariants} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category Dropdown - Normal HTML Select */}
                        <div>
                          <label className={`block text-sm font-medium font-instrument mb-2 ${currentTheme.text.secondary}`}>
                            Category *
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                            required
                          >
                            {VALID_CATEGORIES.map((category) => (
                              <option key={category.value} value={category.value}>
                                {category.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <InputField
                          label="Display Order"
                          name="order"
                          type="number"
                          value={formData.order}
                          onChange={handleInputChange}
                          min="0"
                          placeholder="e.g., 0"
                          helpText="Lower numbers appear first. Leave as 0 for auto-calculation."
                        />
                      </div>

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
                          Make this FAQ visible to users
                        </label>
                      </div>
                    </motion.div>
                  </motion.section>

                  {/* Submit Section */}
                  <motion.section
                    variants={containerVariants}
                    className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                  >
                    <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold font-instrument">Ready to Create FAQ</h3>
                        <p className={currentTheme.text.muted}>
                          This will add a new FAQ to your store
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
                          Create FAQ
                        </Button>
                      </div>
                    </motion.div>
                  </motion.section>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AddFaq;