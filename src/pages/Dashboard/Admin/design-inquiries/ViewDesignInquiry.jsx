import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../context/ThemeContext';
import { useGetDesignInquiryByIdQuery, useUpdateInquiryStatusMutation } from '../../../../redux/services/designInquiryService';
import { ArrowLeft, Edit, Calendar, Phone, Mail, Image as ImageIcon, FileText, Clock, User, Package, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const ViewDesignInquiry = () => {
  const { inquiryId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [notes, setNotes] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const { data: inquiryData, isLoading, error, refetch } = useGetDesignInquiryByIdQuery(inquiryId);
  const [updateStatus] = useUpdateInquiryStatusMutation();

  const inquiry = inquiryData?.data;

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

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':
        return { bg: 'bg-blue-100 text-blue-800', dark: 'bg-blue-900 text-blue-200' };
      case 'CONTACTED':
        return { bg: 'bg-yellow-100 text-yellow-800', dark: 'bg-yellow-900 text-yellow-200' };
      case 'CONVERTED':
        return { bg: 'bg-green-100 text-green-800', dark: 'bg-green-900 text-green-200' };
      default:
        return { bg: 'bg-gray-100 text-gray-800', dark: 'bg-gray-900 text-gray-200' };
    }
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    if (!notes.trim() && newStatus !== 'NEW') {
      toast.error('Please add admin notes before updating status');
      return;
    }

    setStatusUpdateLoading(true);
    try {
      await updateStatus({
        inquiryId,
        status: newStatus,
        adminNotes: notes
      }).unwrap();
      
      setNotes('');
      refetch();
      toast.success('Status updated successfully!');
    } catch (error) {
      toast.error(error.error?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdateLoading(false);
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
          <h2 className="text-2xl font-bold text-red-600 mb-4">Inquiry Not Found</h2>
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

  if (!inquiry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${currentTheme.text.primary}`}>Inquiry not found</h2>
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

  const statusColor = getStatusColor(inquiry.status);

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
                  {inquiry.name}
                </h1>
                <p className={`${currentTheme.text.muted} font-instrument text-sm sm:text-base`}>
                  Design Inquiry Details
                </p>
              </div>
            </div>

            {/* Right: Edit Button & Status */}
            <div className="flex sm:flex-row flex-col sm:space-x-3 space-y-2 sm:space-y-0">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                theme === 'dark' ? statusColor.dark : statusColor.bg
              }`}>
                {inquiry.status}
              </div>
              <Link
                to={`/dashboard/design-inquiries/edit/${inquiry.id}`}
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
          {/* Left Column - Customer Info & Status Update */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Information Card */}
            <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
              <h2 className={`text-lg font-semibold font-instrument mb-4 flex items-center ${currentTheme.text.primary}`}>
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Name</label>
                  <p className={`font-medium ${currentTheme.text.primary}`}>{inquiry.name}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Contact Number</label>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <a 
                      href={`tel:${inquiry.contactNumber}`}
                      className={`font-medium hover:text-blue-600 ${currentTheme.text.primary}`}
                    >
                      {inquiry.contactNumber}
                    </a>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>WhatsApp Number</label>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
                    <a 
                      href={`https://wa.me/${inquiry.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-medium hover:text-green-600 ${currentTheme.text.primary}`}
                    >
                      {inquiry.whatsappNumber}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Appointment Details */}
            <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
              <h2 className={`text-lg font-semibold font-instrument mb-4 flex items-center ${currentTheme.text.primary}`}>
                <Calendar className="w-5 h-5 mr-2" />
                Appointment Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Preferred Date</label>
                  <p className={`font-medium ${currentTheme.text.primary}`}>
                    {formatDate(inquiry.preferredDate)}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-1`}>Preferred Time</label>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <p className={`font-medium ${currentTheme.text.primary}`}>
                      {inquiry.preferredTime}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Status Update Card */}
            <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
              <h2 className={`text-lg font-semibold font-instrument mb-4 ${currentTheme.text.primary}`}>
                Update Status
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-2`}>
                    Admin Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this inquiry..."
                    className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.text.primary} bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusUpdate('CONTACTED')}
                    disabled={statusUpdateLoading || inquiry.status === 'CONTACTED'}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('CONVERTED')}
                    disabled={statusUpdateLoading || inquiry.status === 'CONVERTED'}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Converted
                  </button>

                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Fabric Details & Admin Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fabric Details Card */}
            <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
              <h2 className={`text-xl font-semibold font-instrument mb-6 flex items-center ${currentTheme.text.primary}`}>
                <Package className="w-5 h-5 mr-2" />
                Fabric Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fabric Source */}
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-2`}>Fabric Source</label>
                  <div className={`px-4 py-2 rounded-lg ${
                    inquiry.fabricSource === 'to_be_sourced'
                      ? theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                      : theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                  }`}>
                    {inquiry.fabricSource === 'to_be_sourced' ? 'To Be Sourced' : 'Already Available'}
                  </div>
                </div>

                {/* Fabric Details */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-2`}>Fabric Details</label>
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <p className={`${currentTheme.text.secondary} whitespace-pre-line`}>
                      {inquiry.fabricDetails || 'No details provided'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reference Image */}
            {inquiry.referencePicture && (
              <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
                <h2 className={`text-xl font-semibold font-instrument mb-6 flex items-center ${currentTheme.text.primary}`}>
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Reference Image
                </h2>
                <div className="flex justify-center">
                  <a 
                    href={inquiry.referencePicture} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img 
                      src={inquiry.referencePicture} 
                      alt="Reference" 
                      className="max-w-full h-auto rounded-lg shadow-lg max-h-96 object-contain"
                    />
                    <p className={`text-center mt-2 text-sm ${currentTheme.text.muted}`}>
                      Click to view full image
                    </p>
                  </a>
                </div>
              </motion.div>
            )}

            {/* Admin Information */}
            <motion.div variants={itemVariants} className={`rounded-xl p-6 ${currentTheme.bg.card} ${currentTheme.shadow}`}>
              <h2 className={`text-xl font-semibold font-instrument mb-6 ${currentTheme.text.primary}`}>
                Admin Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-2`}>Inquiry ID</label>
                  <p className={`font-mono text-sm ${currentTheme.text.primary}`}>
                    {inquiry.id}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-2`}>Submitted</label>
                  <p className={currentTheme.text.primary}>
                    {formatDateTime(inquiry.createdAt)}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-2`}>Last Updated</label>
                  <p className={currentTheme.text.primary}>
                    {formatDateTime(inquiry.updatedAt)}
                  </p>
                </div>
                {inquiry.adminNotes && (
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium ${currentTheme.text.muted} mb-2`}>Admin Notes</label>
                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <p className={`${currentTheme.text.secondary} whitespace-pre-line`}>
                        {inquiry.adminNotes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewDesignInquiry;