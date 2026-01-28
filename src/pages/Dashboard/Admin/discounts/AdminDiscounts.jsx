// components/admin/discounts/AdminDiscounts.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiRefreshCw, 
  FiEdit2,
  FiTrash2,
  FiEye,
  FiToggleLeft,
  FiToggleRight,
  FiPercent,
  FiTag,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiDollarSign,
  FiPackage
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetAllDiscountsQuery,
  useDeleteDiscountMutation,
  useToggleDiscountStatusMutation,
  useGetDiscountStatsQuery,
} from '../../../../redux/services/discountService';
import {
  setPagination,
  setFilters
} from '../../../../redux/slices/discountSlice';

// Component imports
import DiscountStats from '../../../../components/admin/stats/DiscountStats';
import DeleteConfirmationModal from '../../../../shared/DeleteConfirmationModal';
import DataCard from '../../../../shared/DataCard';
import DataTable from '../../../../shared/DataTable';
import { useTheme } from '../../../../context/ThemeContext';

const AdminDiscounts = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Redux state
  const { 
    pagination,
    filters 
  } = useSelector((state) => state.discount);

  // Local state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    discount: null
  });
  const [statusLoading, setStatusLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // RTK Query hooks
  const {
    data: discountsResponse,
    isLoading: discountsLoading,
    error: discountsError,
    refetch: refetchDiscounts
  } = useGetAllDiscountsQuery({
    page: pagination.currentPage,
    limit: pagination.pageSize,
    discountType: filters.discountType === 'ALL' ? undefined : filters.discountType,
    status: filters.status === 'ALL' ? undefined : filters.status,
    search: debouncedSearchTerm || undefined,
  });

  const { data: statsResponse } = useGetDiscountStatsQuery();
  
  // Mutations
  const [deleteDiscount, { isLoading: isDeleting }] = useDeleteDiscountMutation();
  const [toggleStatus, { isLoading: isStatusLoading }] = useToggleDiscountStatusMutation();

  // Extract data
  const discountsData = discountsResponse?.data || {};
  const discounts = Array.isArray(discountsData) ? discountsData : 
                   Array.isArray(discountsData.discounts) ? discountsData.discounts : 
                   Array.isArray(discountsData.data) ? discountsData.data : 
                   Array.isArray(discountsData.items) ? discountsData.items : [];
  
  const serverPagination = discountsResponse?.data?.pagination || {};
  const totalDiscounts = serverPagination.total || 0;
  const serverTotalPages = serverPagination.pages || 1;
  const stats = statsResponse?.data || {};

  // Discount types
  const DISCOUNT_TYPES = [
    { value: 'ALL', label: 'All Types' },
    { value: 'PERCENTAGE', label: 'Percentage' },
    { value: 'FIXED_AMOUNT', label: 'Fixed Amount' },
    { value: 'BUY_X_GET_Y', label: 'Buy X Get Y' },
    { value: 'FREE_SHIPPING', label: 'Free Shipping' },
  ];

  // User types
  const USER_TYPES = [
    { value: 'ALL', label: 'All Users' },
    { value: 'REGULAR', label: 'Regular' },
    { value: 'WHOLESALE', label: 'Wholesale' },
    { value: 'NEW_USER', label: 'New User' },
    { value: 'LOYALTY', label: 'Loyalty' },
  ];

  // Theme-based styles
  const themeStyles = {
    background: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    card: theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    },
    button: {
      primary: theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
      danger: theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white',
    },
    input: theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    table: {
      header: theme === 'dark' ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-200',
      row: theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50',
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handlers
  const handleRefresh = () => {
    refetchDiscounts();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDiscount(deleteModal.discount.id).unwrap();
      setDeleteModal({ isOpen: false, discount: null });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleStatusToggle = async (discountId, currentStatus) => {
    setStatusLoading(prev => ({ ...prev, [discountId]: true }));
    
    try {
      await toggleStatus({ 
        discountId, 
        currentStatus 
      }).unwrap();
    } catch (error) {
      console.error('Status toggle failed:', error);
    } finally {
      setStatusLoading(prev => ({ ...prev, [discountId]: false }));
    }
  };

  const handleServerPageChange = (page) => {
    dispatch(setPagination({ 
      currentPage: page 
    }));
  };

  const handlePageSizeChange = (newSize) => {
    dispatch(setPagination({ 
      pageSize: newSize,
      currentPage: 1
    }));
  };

  const handleDiscountTypeFilterChange = (discountType) => {
    dispatch(setFilters({ 
      discountType 
    }));
  };

  const handleStatusFilterChange = (status) => {
    dispatch(setFilters({ 
      status 
    }));
  };

  const openDeleteModal = (discount) => {
    setDeleteModal({ isOpen: true, discount });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, discount: null });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if discount is expired
  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  // Check if discount is upcoming
  const isUpcoming = (validFrom) => {
    return new Date(validFrom) > new Date();
  };

  // Get discount display value
  const getDiscountDisplayValue = (discount) => {
    if (discount.discountType === 'PERCENTAGE') {
      return `${discount.discountValue}%`;
    } else if (discount.discountType === 'FIXED_AMOUNT') {
      return `₹${discount.discountValue}`;
    } else if (discount.discountType === 'BUY_X_GET_Y') {
      return `Buy ${discount.minQuantity || 2} Get Discount`;
    } else if (discount.discountType === 'FREE_SHIPPING') {
      return 'Free Shipping';
    }
    return discount.discountValue;
  };

  // Table columns configuration
  const columns = [
    {
      key: 'code',
      title: 'Code',
      dataIndex: 'name',
      sortable: true,
      render: (value, record) => (
        <div className="min-w-0">
          <p className={`font-bold truncate ${themeStyles.text.primary}`}>{value}</p>
          <p className={`text-xs truncate ${themeStyles.text.muted}`}>
            ID: {record.id.substring(0, 8)}...
          </p>
        </div>
      ),
      className: 'min-w-48'
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'discountType',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value === 'PERCENTAGE' 
            ? theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
            : value === 'FIXED_AMOUNT'
            ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
            : value === 'BUY_X_GET_Y'
            ? theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
            : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
        }`}>
          {value === 'PERCENTAGE' && <FiPercent className="w-3 h-3 mr-1" />}
          {value === 'FIXED_AMOUNT' && <FiDollarSign className="w-3 h-3 mr-1" />}
          {value === 'BUY_X_GET_Y' && <FiPackage className="w-3 h-3 mr-1" />}
          {value === 'FREE_SHIPPING' && <FiTag className="w-3 h-3 mr-1" />}
          {value}
        </span>
      )
    },
    {
      key: 'value',
      title: 'Value',
      render: (record) => (
        <div className="flex flex-col">
          <span className={`font-bold ${themeStyles.text.primary}`}>
            {getDiscountDisplayValue(record)}
          </span>
          {record.discountType === 'PERCENTAGE' && record.maxDiscount && (
            <span className={`text-xs ${themeStyles.text.muted}`}>
              Max: ₹{record.maxDiscount}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'scope',
      title: 'Scope',
      render: (record) => (
        <div className="min-w-0">
          {record.product ? (
            <p className={`text-xs truncate ${themeStyles.text.muted}`}>
              Product: {record.product.name}
            </p>
          ) : record.category ? (
            <p className={`text-xs truncate ${themeStyles.text.muted}`}>
              Category: {record.category.name}
            </p>
          ) : record.subcategory ? (
            <p className={`text-xs truncate ${themeStyles.text.muted}`}>
              Subcategory: {record.subcategory.name}
            </p>
          ) : (
            <p className={`text-xs truncate ${themeStyles.text.muted}`}>
              Sitewide
            </p>
          )}
          <p className={`text-xs truncate ${themeStyles.text.muted}`}>
            {record.userType || 'All Users'}
          </p>
        </div>
      )
    },
    {
      key: 'validity',
      title: 'Validity',
      render: (record) => {
        const expired = isExpired(record.validUntil);
        const upcoming = isUpcoming(record.validFrom);
        
        return (
          <div className="min-w-0">
            <div className={`text-xs ${expired ? 'text-red-500' : upcoming ? 'text-yellow-500' : themeStyles.text.muted}`}>
              <div className="flex items-center">
                <FiCalendar className="w-3 h-3 mr-1" />
                {formatDate(record.validFrom)} - {formatDate(record.validUntil)}
              </div>
              {expired && <span className="text-red-500">(Expired)</span>}
              {upcoming && <span className="text-yellow-500">(Upcoming)</span>}
            </div>
          </div>
        );
      }
    },
    {
      key: 'usage',
      title: 'Usage',
      render: (record) => (
        <div className="text-center">
          <span className={`font-bold ${themeStyles.text.primary}`}>
            {record.usedCount || 0}
          </span>
          {record.usageLimit && (
            <span className={`text-xs block ${themeStyles.text.muted}`}>
              /{record.usageLimit}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'isActive',
      render: (isActive, record) => {
        const isLoading = statusLoading[record.id];
        const expired = isExpired(record.validUntil);
        const upcoming = isUpcoming(record.validFrom);
        
        let statusText = isActive ? 'Active' : 'Inactive';
        let statusClass = '';
        
        if (expired) {
          statusText = 'Expired';
          statusClass = theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
        } else if (upcoming) {
          statusText = 'Upcoming';
          statusClass = theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
        } else {
          statusClass = isActive 
            ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
            : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
        }
        
        return (
          <button
            onClick={() => !expired && !upcoming && handleStatusToggle(record.id, isActive)}
            disabled={isLoading || expired || upcoming}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${statusClass} ${
              (isLoading || expired || upcoming) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            data-action-button="true"
          >
            {isLoading ? (
              <FiRefreshCw className="w-3 h-3 mr-1 animate-spin" />
            ) : isActive ? (
              <FiToggleRight className="w-3 h-3 mr-1" />
            ) : (
              <FiToggleLeft className="w-3 h-3 mr-1" />
            )}
            {isLoading ? 'Updating...' : statusText}
          </button>
        );
      }
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      render: (value, record) => (
        <div className="flex items-center space-x-2">
          {/* View Button */}
          <Link
            to={`/dashboard/discounts/view/${value}`}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-blue-400 hover:bg-blue-900'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
            title="View Details"
            data-action-button="true"
          >
            <FiEye className="w-4 h-4" />
          </Link>
          
          {/* Edit Button */}
          <Link
            to={`/dashboard/discounts/edit/${value}`}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-green-400 hover:bg-green-900'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title="Edit Discount"
            data-action-button="true"
          >
            <FiEdit2 className="w-4 h-4" />
          </Link>
          
          {/* Delete Button */}
          <button
            onClick={() => openDeleteModal(record)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-red-400 hover:bg-red-900'
                : 'text-red-600 hover:bg-red-50'
            }`}
            title="Delete Discount"
            // disabled={isDeleting || record.usedCount > 0}
            data-action-button="true"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const renderDiscountCard = (discount) => {
    const expired = isExpired(discount.validUntil);
    const upcoming = isUpcoming(discount.validFrom);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg border p-4 shadow-sm hover:shadow-md transition-all ${themeStyles.card}`}
      >
        <div className="flex flex-col space-y-3">
          
          {/* Discount Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  discount.discountType === 'PERCENTAGE'
                    ? theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                    : discount.discountType === 'FIXED_AMOUNT'
                    ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                    : discount.discountType === 'BUY_X_GET_Y'
                    ? theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                    : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}>
                  {discount.discountType}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  expired ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : upcoming ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : discount.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {expired ? 'Expired' : upcoming ? 'Upcoming' : discount.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className={`font-bold line-clamp-1 ${themeStyles.text.primary}`}>
                {discount.name}
              </h3>
              <p className={`text-sm line-clamp-1 ${themeStyles.text.muted}`}>
                {discount.description}
              </p>
            </div>

            {/* Discount Value */}
            <div className="text-right">
              <span className={`text-2xl font-bold ${
                discount.discountType === 'PERCENTAGE' ? 'text-purple-600 dark:text-purple-400'
                : discount.discountType === 'FIXED_AMOUNT' ? 'text-green-600 dark:text-green-400'
                : 'text-blue-600 dark:text-blue-400'
              }`}>
                {getDiscountDisplayValue(discount)}
              </span>
            </div>
          </div>

          {/* Discount Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className={themeStyles.text.muted}>Scope:</span>
              <p className={themeStyles.text.primary}>
                {discount.product ? 'Product' : discount.category ? 'Category' : discount.subcategory ? 'Subcategory' : 'Sitewide'}
              </p>
            </div>
            <div>
              <span className={themeStyles.text.muted}>Users:</span>
              <p className={themeStyles.text.primary}>
                {discount.userType || 'All'}
              </p>
            </div>
            <div>
              <span className={themeStyles.text.muted}>Min Order:</span>
              <p className={themeStyles.text.primary}>
                ₹{discount.minOrderAmount || 0}
              </p>
            </div>
            <div>
              <span className={themeStyles.text.muted}>Usage:</span>
              <p className={themeStyles.text.primary}>
                {discount.usedCount || 0}/{discount.usageLimit || '∞'}
              </p>
            </div>
          </div>

          {/* Validity */}
          <div className={`text-xs p-2 rounded ${
            expired ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            : upcoming ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}>
            <div className="flex items-center">
              <FiCalendar className="w-3 h-3 mr-1" />
              Valid: {formatDate(discount.validFrom)} - {formatDate(discount.validUntil)}
            </div>
          </div>

          {/* Bottom section: Action buttons */}
          <div className={`flex items-center justify-between pt-3 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            
            {/* ID */}
            <span className={`text-xs ${themeStyles.text.muted}`}>
              ID: {discount.id.substring(0, 8)}...
            </span>
            
            {/* Action buttons */}
            <div className="flex space-x-2">
              <Link
                to={`/dashboard/discounts/view/${discount.id}`}
                className={`p-1 rounded transition-colors ${
                  theme === 'dark' ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-50'
                }`}
                data-action-button="true"
              >
                <FiEye className="w-4 h-4" />
              </Link>
              
              <Link
                to={`/dashboard/discounts/edit/${discount.id}`}
                className={`p-1 rounded transition-colors ${
                  theme === 'dark' ? 'text-green-400 hover:bg-green-900' : 'text-green-600 hover:bg-green-50'
                }`}
                data-action-button="true"
              >
                <FiEdit2 className="w-4 h-4" />
              </Link>
              
              <button
                onClick={() => openDeleteModal(discount)}
                className={`p-1 rounded transition-colors ${
                  theme === 'dark' ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-50'
                }`}
                disabled={isDeleting || discount.usedCount > 0}
                data-action-button="true"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen p-3 sm:p-4 lg:p-6 ${themeStyles.background}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className={`text-2xl font-italiana sm:text-3xl font-bold truncate ${themeStyles.text.primary}`}>
                Discounts Management
              </h1>
              <p className={`mt-1 text-sm sm:text-base ${themeStyles.text.secondary}`}>
                Manage your store discounts • {totalDiscounts} total discounts
              </p>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-3">              
              <button
                onClick={handleRefresh}
                disabled={discountsLoading}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <FiRefreshCw className={`w-4 h-4 ${discountsLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <Link
                to="/dashboard/discounts/add"
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add Discount</span>
              </Link>
            </div>
          </div>

          {/* Discount Statistics */}
          <div className="mb-6 lg:mb-8">
            <DiscountStats stats={stats} />
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Input */}
            <div className="relative max-w-md">
              <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeStyles.text.muted}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search discounts by name, description..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${themeStyles.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Discount Type Filters */}
              <div className="flex flex-wrap gap-2">
                {DISCOUNT_TYPES.slice(0, 4).map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleDiscountTypeFilterChange(type.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filters.discountType === type.value
                        ? theme === 'dark' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
                {DISCOUNT_TYPES.length > 4 && (
                  <select
                    value={filters.discountType}
                    onChange={(e) => handleDiscountTypeFilterChange(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${themeStyles.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {DISCOUNT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Status Filters */}
              <div className="flex gap-2">
                {['ALL', 'ACTIVE', 'INACTIVE'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilterChange(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filters.status === status
                        ? theme === 'dark' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status === 'ALL' ? 'All Status' : status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Discounts Display */}
        <div className={`rounded-xl shadow-sm border overflow-hidden ${themeStyles.card}`}>
          {isMobile ? (
            <div className="p-4">
              <DataCard
                data={discounts}
                renderItem={renderDiscountCard}
                onItemClick={(discount) => navigate(`/dashboard/discounts/view/${discount.id}`)}
                emptyMessage="No discounts found"
                emptyAction={
                  <div className="text-center">
                    <p className={`text-sm mb-4 ${themeStyles.text.muted}`}>
                      {filters.discountType !== 'ALL' || filters.status !== 'ALL'
                        ? `No discounts found with current filters`
                        : 'Get started by creating your first discount'
                      }
                    </p>
                    {(filters.discountType !== 'ALL' || filters.status !== 'ALL') ? (
                      <button
                        onClick={() => {
                          handleDiscountTypeFilterChange('ALL');
                          handleStatusFilterChange('ALL');
                          setSearchTerm('');
                        }}
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span>Clear Filters</span>
                      </button>
                    ) : (
                      <Link
                        to="/dashboard/discounts/add"
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                        <span>Add Your First Discount</span>
                      </Link>
                    )}
                  </div>
                }
                pagination={{
                  serverTotalItems: totalDiscounts,
                  serverTotalPages: serverTotalPages,
                  serverCurrentPage: pagination.currentPage,
                  serverPageSize: pagination.pageSize,
                  onServerPageChange: handleServerPageChange,
                  onPageSizeChange: handlePageSizeChange,
                  pageSizeOptions: [10, 20, 50]
                }}
                theme={theme}
              />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={discounts}
              keyField="id"
              loading={discountsLoading}
              onRowClick={(discount) => navigate(`/dashboard/discounts/view/${discount.id}`)}
              emptyMessage={
                <div className="text-center py-12">
                  <div className={`text-lg mb-2 ${themeStyles.text.secondary}`}>No discounts found</div>
                  <p className={`text-sm mb-4 ${themeStyles.text.muted}`}>
                    {filters.discountType !== 'ALL' || filters.status !== 'ALL' || searchTerm
                      ? 'No discounts match your current filters'
                      : 'Get started by creating your first discount'
                    }
                  </p>
                  {(filters.discountType !== 'ALL' || filters.status !== 'ALL' || searchTerm) ? (
                    <button
                      onClick={() => {
                        handleDiscountTypeFilterChange('ALL');
                        handleStatusFilterChange('ALL');
                        setSearchTerm('');
                      }}
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>Clear All Filters</span>
                    </button>
                  ) : (
                    <Link
                      to="/dashboard/discounts/add"
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add New Discount</span>
                    </Link>
                  )}
                </div>
              }
              pagination={{
                serverTotalItems: totalDiscounts,
                serverTotalPages: serverTotalPages,
                serverCurrentPage: pagination.currentPage,
                serverPageSize: pagination.pageSize,
                onServerPageChange: handleServerPageChange,
                onPageSizeChange: handlePageSizeChange,
                pageSizeOptions: [10, 20, 50]
              }}
              className="border-0"
              theme={theme}
            />
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteConfirm}
          title="Delete Discount"
          message={
            deleteModal.discount?.usedCount > 0 
              ? `Cannot delete discount "${deleteModal.discount?.name}" because it has been used ${deleteModal.discount?.usedCount} times.`
              : `Are you sure you want to delete discount "${deleteModal.discount?.name}"? This action cannot be undone.`
          }
          confirmText="Delete Discount"
          confirmDisabled={deleteModal.discount?.usedCount > 0}
          isLoading={isDeleting}
          theme={theme}
        />
      </motion.div>
    </div>
  );
};

export default AdminDiscounts;