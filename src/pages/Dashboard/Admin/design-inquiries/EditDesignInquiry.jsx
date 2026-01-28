import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../context/ThemeContext';
import { useGetDesignInquiryByIdQuery, useUpdateDesignInquiryMutation } from '../../../../redux/services/designInquiryService';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Package, 
  Image as ImageIcon,
  X,
  Upload,
  Eye
} from 'lucide-react';

const EditDesignInquiry = () => {
  const { inquiryId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { theme } = useTheme();

  const { data: inquiryData, isLoading: inquiryLoading } = useGetDesignInquiryByIdQuery(inquiryId);
  const [updateInquiry] = useUpdateDesignInquiryMutation();

  const inquiry = inquiryData?.data;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    whatsappNumber: '',
    fabricSource: 'to_be_sourced',
    fabricDetails: '',
    preferredDate: '',
    preferredTime: '',
    status: 'NEW',
    adminNotes: '',
    referencePicture: ''
  });

  // Status options
  const STATUS_OPTIONS = [
    { value: 'NEW', label: 'New' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'FOLLOW_UP', label: 'Follow Up' },
    { value: 'CONVERTED', label: 'Converted' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  // Fabric source options
  const FABRIC_SOURCE_OPTIONS = [
    { value: 'to_be_sourced', label: 'To Be Sourced' },
    { value: 'already_available', label: 'Already Available' },
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
      input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
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
      input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
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

  // Initialize form with inquiry data
  useEffect(() => {
    if (inquiry) {
      // Format date for input field
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        name: inquiry.name || '',
        contactNumber: inquiry.contactNumber || '',
        whatsappNumber: inquiry.whatsappNumber || '',
        fabricSource: inquiry.fabricSource || 'to_be_sourced',
        fabricDetails: inquiry.fabricDetails || '',
        preferredDate: formatDateForInput(inquiry.preferredDate),
        preferredTime: inquiry.preferredTime || '',
        status: inquiry.status || 'NEW',
        adminNotes: inquiry.adminNotes || '',
        referencePicture: inquiry.referencePicture || ''
      });

      // Set image preview if reference picture exists
      if (inquiry.referencePicture) {
        setImagePreview(inquiry.referencePicture);
      }
    }
  }, [inquiry]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle textarea changes
  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Also update the form data
      setFormData(prev => ({
        ...prev,
        referencePicture: file.name // Store filename
      }));
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      referencePicture: ''
    }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }

    if (!formData.contactNumber.trim()) {
      toast.error('Contact number is required');
      return false;
    }

    if (!formData.preferredDate) {
      toast.error('Preferred date is required');
      return false;
    }

    if (!formData.preferredTime) {
      toast.error('Preferred time is required');
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
      const updateData = {
        name: formData.name.trim(),
        contactNumber: formData.contactNumber.trim(),
        whatsappNumber: formData.whatsappNumber.trim(),
        fabricSource: formData.fabricSource,
        fabricDetails: formData.fabricDetails.trim(),
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        status: formData.status,
        adminNotes: formData.adminNotes.trim(),
      };

      // Create FormData if there's a new image
      if (imageFile) {
        const formDataToSend = new FormData();
        
        // Append all form fields
        Object.entries(updateData).forEach(([key, value]) => {
          formDataToSend.append(key, value);
        });
        
        // Append the image file
        formDataToSend.append('referencePicture', imageFile);
        
        // Send as FormData
        await updateInquiry({
          inquiryId,
          updateData: formDataToSend
        }).unwrap();
      } else {
        // Send as JSON (no image change)
        await updateInquiry({
          inquiryId,
          updateData
        }).unwrap();
      }
      
      // Navigate back to inquiries list
      toast.success('Inquiry updated successfully!');
      navigate('/dashboard/design-inquiries');
    } catch (error) {
      console.error('Update inquiry error:', error);
      toast.error(error?.data?.message || 'Failed to update inquiry');
    } finally {
      setLoading(false);
    }
  };

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (inquiryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Inquiry Not Found</h2>
          <button onClick={() => navigate(-1)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go Back
          </button>
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
            <div className="max-w-4xl mx-auto">
              <motion.div
                variants={containerVariants}
                className={`rounded-lg ${currentTheme.shadow} overflow-hidden ${currentTheme.bg.secondary}`}
              >
                {/* Header */}
                <div className={`border-b ${currentTheme.border} ${currentTheme.bg.primary}`}>
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                      
                      {/* Left: Back Button + Title */}
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <button
                          onClick={() => navigate(-1)}
                          className={`p-2 rounded-lg ${currentTheme.bg.secondary} ${currentTheme.text.primary} hover:bg-gray-200 dark:hover:bg-gray-700`}
                        >
                          <ArrowLeft size={20} />
                        </button>
                        <div>
                          <h1 className="text-xl sm:text-2xl font-bold font-italiana">Edit Inquiry</h1>
                          <p className={`${currentTheme.text.muted} font-instrument text-sm sm:text-base`}>
                            Update design inquiry details
                          </p>
                        </div>
                      </div>

                      {/* Right: View Button */}
                      <div className="flex sm:flex-row flex-col sm:space-x-3 space-y-2 sm:space-y-0">
                        <Link
                          to={`/dashboard/design-inquiries/view/${inquiry.id}`}
                          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Customer Information */}
                  <motion.section
                    variants={containerVariants}
                    className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                  >
                    <motion.h2 
                      variants={itemVariants}
                      className="text-xl font-semibold font-instrument mb-6 flex items-center"
                    >
                      <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                      Customer Information
                    </motion.h2>

                    <div className="space-y-6">
                      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${currentTheme.text.secondary}`}>
                            Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Customer name"
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${currentTheme.text.secondary}`}>
                            Contact Number *
                          </label>
                          <div className="flex items-center">
                            <Phone className={`w-5 h-5 mr-2 ${currentTheme.text.muted}`} />
                            <input
                              type="tel"
                              name="contactNumber"
                              value={formData.contactNumber}
                              onChange={handleInputChange}
                              required
                              className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              placeholder="Contact number"
                            />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${currentTheme.text.secondary}`}>
                            WhatsApp Number
                          </label>
                          <input
                            type="tel"
                            name="whatsappNumber"
                            value={formData.whatsappNumber}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="WhatsApp number"
                          />
                        </div>
                      </motion.div>
                    </div>
                  </motion.section>

                  {/* Appointment Details */}
                  <motion.section
                    variants={containerVariants}
                    className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                  >
                    <motion.h2 
                      variants={itemVariants}
                      className="text-xl font-semibold font-instrument mb-6 flex items-center"
                    >
                      <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                      Appointment Details
                    </motion.h2>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${currentTheme.text.secondary}`}>
                          Preferred Date *
                        </label>
                        <div className="flex items-center">
                          <Calendar className={`w-5 h-5 mr-2 ${currentTheme.text.muted}`} />
                          <input
                            type="date"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${currentTheme.text.secondary}`}>
                          Preferred Time *
                        </label>
                        <div className="flex items-center">
                          <Clock className={`w-5 h-5 mr-2 ${currentTheme.text.muted}`} />
                          <input
                            type="time"
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </motion.section>

                  {/* Fabric Details */}
                  <motion.section
                    variants={containerVariants}
                    className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                  >
                    <motion.h2 
                      variants={itemVariants}
                      className="text-xl font-semibold font-instrument mb-6 flex items-center"
                    >
                      <span className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                      Fabric Details
                    </motion.h2>

                    <motion.div variants={itemVariants} className="space-y-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${currentTheme.text.secondary}`}>
                          Fabric Source
                        </label>
                        <select
                          name="fabricSource"
                          value={formData.fabricSource}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          {FABRIC_SOURCE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${currentTheme.text.secondary}`}>
                          Fabric Details
                        </label>
                        <textarea
                          name="fabricDetails"
                          value={formData.fabricDetails}
                          onChange={handleTextareaChange}
                          rows="4"
                          className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          placeholder="Describe the fabric details..."
                        />
                      </div>
                    </motion.div>
                  </motion.section>

                  {/* Reference Image */}
                  <motion.section
                    variants={containerVariants}
                    className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                  >
                    <motion.h2 
                      variants={itemVariants}
                      className="text-xl font-semibold font-instrument mb-6 flex items-center"
                    >
                      <span className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                      Reference Image
                    </motion.h2>

                    <motion.div variants={itemVariants} className="space-y-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${currentTheme.text.secondary}`}>
                          Upload Reference Image
                        </label>
                        <div className="space-y-4">
                          {/* Current Image Preview */}
                          {imagePreview && (
                            <div className="relative">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm ${currentTheme.text.muted}`}>
                                  Current/Selected Image:
                                </span>
                                <button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 dark:hover:bg-red-900"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                                  <img
                                    src={imagePreview}
                                    alt="Reference preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm ${currentTheme.text.muted}`}>
                                    {imageFile ? `New: ${imageFile.name}` : 'Current image'}
                                  </p>
                                  {imagePreview.startsWith('http') && (
                                    <a
                                      href={imagePreview}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-1"
                                    >
                                      <Eye size={14} className="mr-1" />
                                      View full image
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* File Upload Input */}
                          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors hover:border-blue-400 ${currentTheme.border}`}>
                            <input
                              type="file"
                              id="referencePicture"
                              name="referencePicture"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="referencePicture"
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <Upload className={`w-12 h-12 mb-3 ${currentTheme.text.muted}`} />
                              <p className={`font-medium mb-1 ${currentTheme.text.primary}`}>
                                {imagePreview ? 'Change Image' : 'Upload Reference Image'}
                              </p>
                              <p className={`text-sm ${currentTheme.text.muted}`}>
                                Click to upload or drag and drop
                              </p>
                              <p className={`text-xs mt-2 ${currentTheme.text.muted}`}>
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </label>
                          </div>

                          {/* File info if selected */}
                          {imageFile && (
                            <div className={`text-sm p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                              <p className={`font-medium ${currentTheme.text.primary}`}>
                                Selected: {imageFile.name}
                              </p>
                              <p className={currentTheme.text.muted}>
                                Size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.section>

                  {/* Admin Information */}
                  <motion.section
                    variants={containerVariants}
                    className={`border rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.border} ${currentTheme.shadow}`}
                  >
                    <motion.h2 
                      variants={itemVariants}
                      className="text-xl font-semibold font-instrument mb-6 flex items-center"
                    >
                      <span className="bg-gray-100 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                      Admin Information
                    </motion.h2>

                    <motion.div variants={itemVariants} className="space-y-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${currentTheme.text.secondary}`}>
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${currentTheme.text.secondary}`}>
                          Admin Notes
                        </label>
                        <textarea
                          name="adminNotes"
                          value={formData.adminNotes}
                          onChange={handleTextareaChange}
                          rows="4"
                          className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          placeholder="Add admin notes here..."
                        />
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
                        <h3 className="text-lg font-semibold font-instrument">Update Inquiry</h3>
                        <p className={currentTheme.text.muted}>
                          Save changes to this design inquiry
                        </p>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-4">
                        <button
                          type="button"
                          onClick={() => navigate(-1)}
                          className={`px-6 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5 mr-2" />
                              Update Inquiry
                            </>
                          )}
                        </button>
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

export default EditDesignInquiry;