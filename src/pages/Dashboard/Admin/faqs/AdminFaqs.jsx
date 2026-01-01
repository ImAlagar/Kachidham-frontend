// components/admin/faqs/AdminFaqs.jsx
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
  FiHelpCircle,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetAllFaqsQuery,
  useDeleteFaqMutation,
  useToggleFaqStatusMutation,
  useGetFaqStatsQuery,
} from '../../../../redux/services/faqService';
import {
  setPagination,
  setFilters
} from '../../../../redux/slices/faqSlice';

// Component imports
import FaqStats from '../../../../components/admin/stats/FaqStats';
import DeleteConfirmationModal from '../../../../shared/DeleteConfirmationModal';
import DataCard from '../../../../shared/DataCard';
import DataTable from '../../../../shared/DataTable';
import { useTheme } from '../../../../context/ThemeContext';

const AdminFaqs = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Redux state
  const { 
    pagination,
    filters 
  } = useSelector((state) => state.faq);

  // Local state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    faq: null
  });
  const [statusLoading, setStatusLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // RTK Query hooks
  const {
    data: faqsResponse,
    isLoading: faqsLoading,
    error: faqsError,
    refetch: refetchFaqs
  } = useGetAllFaqsQuery({
    page: pagination.currentPage,
    limit: pagination.pageSize,
    category: filters.category === 'ALL' ? undefined : filters.category,
    status: filters.status === 'ALL' ? undefined : filters.status,
  });

  const { data: statsResponse } = useGetFaqStatsQuery();
  
  // Mutations
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();
  const [toggleStatus, { isLoading: isStatusLoading }] = useToggleFaqStatusMutation();

  // Extract data
  const faqsData = faqsResponse?.data || {};
  const faqs = Array.isArray(faqsData) ? faqsData : 
              Array.isArray(faqsData.faqs) ? faqsData.faqs : 
              Array.isArray(faqsData.data) ? faqsData.data : 
              Array.isArray(faqsData.items) ? faqsData.items : [];
  
  const serverPagination = faqsResponse?.data?.pagination || {};
  const totalFaqs = serverPagination.total || 0;
  const serverTotalPages = serverPagination.pages || 1;
  const stats = statsResponse?.data || {};

  // FAQ categories
  const FAQ_CATEGORIES = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'GENERAL', label: 'General' },
    { value: 'PAYMENTS', label: 'Payments' },
    { value: 'SHIPPING', label: 'Shipping' },
    { value: 'RETURNS', label: 'Returns' },
    { value: 'PRODUCTS', label: 'Products' },
    { value: 'ACCOUNT', label: 'Account' },
    { value: 'ORDERS', label: 'Orders' },
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

  // Apply search filter
  useEffect(() => {
    if (debouncedSearchTerm !== filters.search) {
      dispatch(setFilters({ search: debouncedSearchTerm }));
    }
  }, [debouncedSearchTerm, dispatch]);

  // Handlers
  const handleRefresh = () => {
    refetchFaqs();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteFaq(deleteModal.faq.id).unwrap();
      setDeleteModal({ isOpen: false, faq: null });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleStatusToggle = async (faqId, currentStatus) => {
    setStatusLoading(prev => ({ ...prev, [faqId]: true }));
    
    try {
      await toggleStatus({ 
        faqId, 
        currentStatus 
      }).unwrap();
    } catch (error) {
      console.error('Status toggle failed:', error);
    } finally {
      setStatusLoading(prev => ({ ...prev, [faqId]: false }));
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

  const handleCategoryFilterChange = (category) => {
    dispatch(setFilters({ 
      category 
    }));
  };

  const handleStatusFilterChange = (status) => {
    dispatch(setFilters({ 
      status 
    }));
  };

  const openDeleteModal = (faq) => {
    setDeleteModal({ isOpen: true, faq });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, faq: null });
  };

  // Filter FAQs by search term
  const filteredFaqs = faqs.filter(faq => {
    if (!debouncedSearchTerm) return true;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return (
      faq.question?.toLowerCase().includes(searchLower) ||
      faq.answer?.toLowerCase().includes(searchLower) ||
      faq.category?.toLowerCase().includes(searchLower)
    );
  });

  // Table columns configuration
  const columns = [
    {
      key: 'order',
      title: '#',
      dataIndex: 'order',
      sortable: true,
      render: (value) => (
        <span className={`font-medium ${themeStyles.text.primary}`}>
          {value}
        </span>
      ),
      className: 'w-12'
    },
    {
      key: 'question',
      title: 'Question',
      dataIndex: 'question',
      sortable: true,
      render: (value, record) => (
        <div className="min-w-0">
          <p className={`font-medium truncate ${themeStyles.text.primary}`}>{value}</p>
          <p className={`text-sm truncate ${themeStyles.text.muted}`}>
            Category: {record.category}
          </p>
        </div>
      ),
      className: 'min-w-64'
    },
    {
      key: 'answer',
      title: 'Answer',
      dataIndex: 'answer',
      render: (value) => (
        <p className={`text-sm truncate max-w-xs ${themeStyles.text.muted}`}>
          {value}
        </p>
      ),
      className: 'min-w-48'
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'isActive',
      render: (isActive, record) => {
        const isLoading = statusLoading[record.id];
        
        return (
          <button
            onClick={() => handleStatusToggle(record.id, isActive)}
            disabled={isLoading}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isActive
                ? theme === 'dark' 
                  ? 'bg-green-900 text-green-200 hover:bg-green-800' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            data-action-button="true"
          >
            {isLoading ? (
              <FiRefreshCw className="w-3 h-3 mr-1 animate-spin" />
            ) : isActive ? (
              <FiToggleRight className="w-3 h-3 mr-1" />
            ) : (
              <FiToggleLeft className="w-3 h-3 mr-1" />
            )}
            {isLoading ? 'Updating...' : isActive ? 'Active' : 'Inactive'}
          </button>
        );
      }
    },
    {
      key: 'createdAt',
      title: 'Created',
      dataIndex: 'createdAt',
      sortable: true,
      render: (value) => (
        <span className={themeStyles.text.muted}>
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      render: (value, record) => (
        <div className="flex items-center space-x-2">
          {/* View Button */}
          <Link
            to={`/dashboard/faqs/view/${value}`}
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
            to={`/dashboard/faqs/edit/${value}`}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-green-400 hover:bg-green-900'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title="Edit FAQ"
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
            title="Delete FAQ"
            disabled={isDeleting}
            data-action-button="true"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const renderFaqCard = (faq) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg border p-4 shadow-sm hover:shadow-md transition-all ${themeStyles.card}`}
      >
        <div className="flex flex-col space-y-3">
          
          {/* FAQ Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  theme === 'dark' 
                    ? 'bg-blue-900 text-blue-200' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  #{faq.order}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {faq.category}
                </span>
              </div>
              <h3 className={`font-medium line-clamp-2 ${themeStyles.text.primary}`}>
                {faq.question}
              </h3>
            </div>

            {/* Status toggle */}
            <button
              onClick={() => handleStatusToggle(faq.id, faq.isActive)}
              disabled={statusLoading[faq.id]}
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 whitespace-nowrap ${
                faq.isActive
                  ? theme === 'dark' 
                    ? 'bg-green-900 text-green-200' 
                    : 'bg-green-100 text-green-800'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-800'
              } ${statusLoading[faq.id] ? "opacity-50 cursor-not-allowed" : ""}`}
              data-action-button="true"
            >
              {statusLoading[faq.id] && <FiRefreshCw className="w-3 h-3 animate-spin" />}
              <span>
                {statusLoading[faq.id]
                  ? "Updating..."
                  : faq.isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </button>
          </div>

          {/* FAQ Answer */}
          <div className={`text-sm line-clamp-3 ${themeStyles.text.muted}`}>
            {faq.answer}
          </div>

          {/* Bottom section: Created date + Action buttons */}
          <div className={`flex items-center justify-between pt-3 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            
            {/* Created date */}
            <span className={`text-xs ${themeStyles.text.muted}`}>
              Created: {new Date(faq.createdAt).toLocaleDateString()}
            </span>
            
            {/* Action buttons */}
            <div className="flex space-x-2">
              <Link
                to={`/dashboard/faqs/view/${faq.id}`}
                className={`p-1 rounded transition-colors ${
                  theme === 'dark' ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-50'
                }`}
                data-action-button="true"
              >
                <FiEye className="w-4 h-4" />
              </Link>
              
              <Link
                to={`/dashboard/faqs/edit/${faq.id}`}
                className={`p-1 rounded transition-colors ${
                  theme === 'dark' ? 'text-green-400 hover:bg-green-900' : 'text-green-600 hover:bg-green-50'
                }`}
                data-action-button="true"
              >
                <FiEdit2 className="w-4 h-4" />
              </Link>
              
              <button
                onClick={() => openDeleteModal(faq)}
                className={`p-1 rounded transition-colors ${
                  theme === 'dark' ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-50'
                }`}
                disabled={isDeleting}
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
                FAQs Management
              </h1>
              <p className={`mt-1 text-sm sm:text-base ${themeStyles.text.secondary}`}>
                Manage your frequently asked questions • {totalFaqs} total FAQs
              </p>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-3">              
              <button
                onClick={handleRefresh}
                disabled={faqsLoading}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <FiRefreshCw className={`w-4 h-4 ${faqsLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <Link
                to="/dashboard/faqs/add"
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add FAQ</span>
              </Link>
            </div>
          </div>

          {/* FAQ Statistics */}
          <div className="mb-6 lg:mb-8">
            <FaqStats stats={stats} />
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
                placeholder="Search FAQs by question, answer, or category..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${themeStyles.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {FAQ_CATEGORIES.slice(0, 4).map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryFilterChange(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filters.category === cat.value
                        ? theme === 'dark' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
                {FAQ_CATEGORIES.length > 4 && (
                  <select
                    value={filters.category}
                    onChange={(e) => handleCategoryFilterChange(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${themeStyles.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {FAQ_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
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

        {/* FAQs Display */}
        <div className={`rounded-xl shadow-sm border overflow-hidden ${themeStyles.card}`}>
          {isMobile ? (
            <div className="p-4">
              <DataCard
                data={filteredFaqs}
                renderItem={renderFaqCard}
                onItemClick={(faq) => navigate(`/dashboard/faqs/view/${faq.id}`)}
                emptyMessage="No FAQs found"
                emptyAction={
                  <div className="text-center">
                    <p className={`text-sm mb-4 ${themeStyles.text.muted}`}>
                      {filters.category !== 'ALL' || filters.status !== 'ALL'
                        ? `No FAQs found with current filters`
                        : 'Get started by creating your first FAQ'
                      }
                    </p>
                    {(filters.category !== 'ALL' || filters.status !== 'ALL') ? (
                      <button
                        onClick={() => {
                          handleCategoryFilterChange('ALL');
                          handleStatusFilterChange('ALL');
                          setSearchTerm('');
                        }}
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span>Clear Filters</span>
                      </button>
                    ) : (
                      <Link
                        to="/dashboard/faqs/add"
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                        <span>Add Your First FAQ</span>
                      </Link>
                    )}
                  </div>
                }
                pagination={{
                  serverTotalItems: totalFaqs,
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
              data={filteredFaqs}
              keyField="id"
              loading={faqsLoading}
              onRowClick={(faq) => navigate(`/dashboard/faqs/view/${faq.id}`)}
              emptyMessage={
                <div className="text-center py-12">
                  <div className={`text-lg mb-2 ${themeStyles.text.secondary}`}>No FAQs found</div>
                  <p className={`text-sm mb-4 ${themeStyles.text.muted}`}>
                    {filters.category !== 'ALL' || filters.status !== 'ALL' || searchTerm
                      ? 'No FAQs match your current filters'
                      : 'Get started by creating your first FAQ'
                    }
                  </p>
                  {(filters.category !== 'ALL' || filters.status !== 'ALL' || searchTerm) ? (
                    <button
                      onClick={() => {
                        handleCategoryFilterChange('ALL');
                        handleStatusFilterChange('ALL');
                        setSearchTerm('');
                      }}
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>Clear All Filters</span>
                    </button>
                  ) : (
                    <Link
                      to="/dashboard/faqs/add"
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add New FAQ</span>
                    </Link>
                  )}
                </div>
              }
              pagination={{
                serverTotalItems: totalFaqs,
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
          title="Delete FAQ"
          message={
            `Are you sure you want to delete "${deleteModal.faq?.question}"? This action cannot be undone.`
          }
          confirmText="Delete FAQ"
          isLoading={isDeleting}
          theme={theme}
        />
      </motion.div>
    </div>
  );
};

export default AdminFaqs;