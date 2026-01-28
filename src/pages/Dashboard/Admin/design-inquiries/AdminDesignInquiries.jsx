import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiRefreshCw, 
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPhone,
  FiMail,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiClock,
  FiFileText
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetAllDesignInquiriesQuery,
  useDeleteDesignInquiryMutation,
  useUpdateInquiryStatusMutation,
  useGetDesignInquiryStatsQuery,
} from '../../../../redux/services/designInquiryService';
import {
  setPagination,
  setFilters
} from '../../../../redux/slices/designInquirySlice';

// Component imports
import DesignInquiryStats from '../../../../components/admin/stats/DesignInquiryStats';
import DeleteConfirmationModal from '../../../../shared/DeleteConfirmationModal';
import DataCard from '../../../../shared/DataCard';
import DataTable from '../../../../shared/DataTable';
import { useTheme } from '../../../../context/ThemeContext';
import StatusBadge from '../../../../components/Common/StatusBadge';

const AdminDesignInquiries = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Redux state
  const { 
    pagination,
    filters 
  } = useSelector((state) => state.designInquiry);

  // Local state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    inquiry: null
  });
  const [statusLoading, setStatusLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // RTK Query hooks
  const {
    data: inquiriesResponse,
    isLoading: inquiriesLoading,
    error: inquiriesError,
    refetch: refetchInquiries
  } = useGetAllDesignInquiriesQuery({
    page: pagination.currentPage,
    limit: pagination.pageSize,
    status: filters.status === 'ALL' ? undefined : filters.status,
    fabricSource: filters.fabricSource === 'ALL' ? undefined : filters.fabricSource,
  });

  const { data: statsResponse } = useGetDesignInquiryStatsQuery();
  
  // Mutations
  const [deleteInquiry, { isLoading: isDeleting }] = useDeleteDesignInquiryMutation();
  const [updateStatus, { isLoading: isStatusLoading }] = useUpdateInquiryStatusMutation();

  // Extract data
  const inquiriesData = inquiriesResponse?.data || {};
  const inquiries = Array.isArray(inquiriesData) ? inquiriesData : [];
  const serverPagination = inquiriesResponse?.pagination || {};
  const totalInquiries = serverPagination.total || 0;
  const serverTotalPages = serverPagination.pages || 1;
  const stats = statsResponse?.data || {};

  // Status options
  const STATUS_OPTIONS = [
    { value: 'ALL', label: 'All Status', color: 'gray' },
    { value: 'NEW', label: 'New', color: 'blue' },
    { value: 'CONTACTED', label: 'Contacted', color: 'yellow' },
    { value: 'CONVERTED', label: 'Converted', color: 'green' },
  ];

  // Fabric source options
  const FABRIC_SOURCE_OPTIONS = [
    { value: 'ALL', label: 'All Sources' },
    { value: 'to_be_sourced', label: 'To Be Sourced' },
    { value: 'already_available', label: 'Already Available' },
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
    refetchInquiries();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteInquiry(deleteModal.inquiry.id).unwrap();
      setDeleteModal({ isOpen: false, inquiry: null });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleStatusUpdate = async (inquiryId, newStatus, adminNotes = '') => {
    setStatusLoading(prev => ({ ...prev, [inquiryId]: true }));
    
    try {
      await updateStatus({ 
        inquiryId, 
        status: newStatus,
        adminNotes
      }).unwrap();
    } catch (error) {
      console.error('Status update failed:', error);
    } finally {
      setStatusLoading(prev => ({ ...prev, [inquiryId]: false }));
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

  const handleStatusFilterChange = (status) => {
    dispatch(setFilters({ 
      status 
    }));
  };

  const handleFabricSourceFilterChange = (fabricSource) => {
    dispatch(setFilters({ 
      fabricSource 
    }));
  };

  const openDeleteModal = (inquiry) => {
    setDeleteModal({ isOpen: true, inquiry });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, inquiry: null });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  // Filter inquiries by search term
  const filteredInquiries = inquiries.filter(inquiry => {
    if (!debouncedSearchTerm) return true;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return (
      inquiry.name?.toLowerCase().includes(searchLower) ||
      inquiry.contactNumber?.includes(searchLower) ||
      inquiry.fabricDetails?.toLowerCase().includes(searchLower)
    );
  });

  // Table columns configuration
  const columns = [
    {
      key: 'id',
      title: '#',
      dataIndex: 'id',
      render: (value, record, index) => (
        <span className={`font-medium ${themeStyles.text.primary}`}>
          {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
        </span>
      ),
      className: 'w-12'
    },
    {
      key: 'name',
      title: 'Customer',
      dataIndex: 'name',
      sortable: true,
      render: (value, record) => (
        <div className="min-w-0">
          <p className={`font-medium truncate ${themeStyles.text.primary}`}>{value}</p>
          <p className={`text-sm truncate ${themeStyles.text.muted}`}>
            <FiPhone className="inline w-3 h-3 mr-1" />
            {record.contactNumber}
          </p>
        </div>
      ),
      className: 'min-w-48'
    },
    {
      key: 'preferences',
      title: 'Appointment',
      render: (record) => (
        <div className="min-w-0">
          <div className="flex items-center text-sm">
            <FiCalendar className="w-3 h-3 mr-1" />
            <span className={themeStyles.text.secondary}>
              {formatDate(record.preferredDate)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <FiClock className="w-3 h-3 mr-1" />
            <span className={themeStyles.text.muted}>
              {formatTime(record.preferredTime)}
            </span>
          </div>
        </div>
      ),
      className: 'min-w-48'
    },
    {
      key: 'fabric',
      title: 'Fabric',
      render: (record) => (
        <div className="min-w-0">
          <div className={`text-xs px-2 py-1 rounded-full inline-block mb-1 ${
            record.fabricSource === 'to_be_sourced'
              ? theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
              : theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
          }`}>
            {record.fabricSource === 'to_be_sourced' ? 'To Source' : 'Available'}
          </div>
          {record.fabricDetails && (
            <p className={`text-xs truncate ${themeStyles.text.muted}`} title={record.fabricDetails}>
              {record.fabricDetails.substring(0, 30)}...
            </p>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (status, record) => {
        const isLoading = statusLoading[record.id];
        
        return (
          <div className="flex items-center space-x-2">
            <StatusBadge status={status} />
            {status === 'NEW' && (
              <button
                onClick={() => handleStatusUpdate(record.id, 'CONTACTED', 'Marked as contacted')}
                disabled={isLoading}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  theme === 'dark'
                    ? 'bg-green-800 text-green-200 hover:bg-green-700'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? '...' : 'Mark Contacted'}
              </button>
            )}
          </div>
        );
      }
    },
    {
      key: 'createdAt',
      title: 'Submitted',
      dataIndex: 'createdAt',
      sortable: true,
      render: (value) => (
        <span className={themeStyles.text.muted}>
          {formatDate(value)}
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
            to={`/dashboard/design-inquiries/view/${value}`}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-blue-400 hover:bg-blue-900'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </Link>
          
          {/* Edit Button */}
          <Link
            to={`/dashboard/design-inquiries/edit/${value}`}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-green-400 hover:bg-green-900'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title="Edit Inquiry"
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
            title="Delete Inquiry"
            disabled={isDeleting}
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const renderInquiryCard = (inquiry) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg border p-4 shadow-sm hover:shadow-md transition-all ${themeStyles.card}`}
      >
        <div className="flex flex-col space-y-3">
          
          {/* Inquiry Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className={`font-medium truncate ${themeStyles.text.primary}`}>
                  {inquiry.name}
                </h3>
                <StatusBadge status={inquiry.status} size="sm" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <FiPhone className={`w-3 h-3 mr-1 ${themeStyles.text.muted}`} />
                  <span className={themeStyles.text.secondary}>
                    {inquiry.contactNumber}
                  </span>
                  {inquiry.whatsappNumber && inquiry.whatsappNumber !== inquiry.contactNumber && (
                    <span className={`ml-2 text-xs ${themeStyles.text.muted}`}>
                      (WhatsApp: {inquiry.whatsappNumber})
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm">
                  <FiCalendar className={`w-3 h-3 mr-1 ${themeStyles.text.muted}`} />
                  <span className={themeStyles.text.secondary}>
                    {formatDate(inquiry.preferredDate)} at {formatTime(inquiry.preferredTime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Fabric source */}
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              inquiry.fabricSource === 'to_be_sourced'
                ? theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                : theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
            }`}>
              {inquiry.fabricSource === 'to_be_sourced' ? 'To Source' : 'Available'}
            </div>
          </div>

          {/* Fabric Details */}
          {inquiry.fabricDetails && (
            <div className={`text-sm line-clamp-2 ${themeStyles.text.muted}`}>
              <FiFileText className="inline w-3 h-3 mr-1" />
              {inquiry.fabricDetails}
            </div>
          )}

          {/* Reference Picture */}
          {inquiry.referencePicture && (
            <div className="flex items-center text-sm">
              <span className={themeStyles.text.muted}>Reference: </span>
              <a 
                href={inquiry.referencePicture} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`ml-1 underline hover:text-blue-500 ${themeStyles.text.secondary}`}
              >
                View Image
              </a>
            </div>
          )}

          {/* Bottom section: Actions */}
          <div className={`flex items-center justify-between pt-3 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            
            {/* Created date */}
            <span className={`text-xs ${themeStyles.text.muted}`}>
              Submitted: {formatDate(inquiry.createdAt)}
            </span>
            
            {/* Action buttons */}
            <div className="flex space-x-2">
              {inquiry.status === 'NEW' && (
                <button
                  onClick={() => handleStatusUpdate(inquiry.id, 'CONTACTED', 'Marked as contacted')}
                  disabled={statusLoading[inquiry.id]}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    theme === 'dark'
                      ? 'bg-green-800 text-green-200 hover:bg-green-700'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  } ${statusLoading[inquiry.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {statusLoading[inquiry.id] ? '...' : 'Mark Contacted'}
                </button>
              )}
              
              <Link
                to={`/dashboard/design-inquiries/view/${inquiry.id}`}
                className={`p-1 rounded transition-colors ${
                  theme === 'dark' ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <FiEye className="w-4 h-4" />
              </Link>
              
              <button
                onClick={() => openDeleteModal(inquiry)}
                className={`p-1 rounded transition-colors ${
                  theme === 'dark' ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-50'
                }`}
                disabled={isDeleting}
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
                Design Inquiries
              </h1>
              <p className={`mt-1 text-sm sm:text-base ${themeStyles.text.secondary}`}>
                Manage customer design appointment requests • {totalInquiries} total inquiries
              </p>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-3">              
              <button
                onClick={handleRefresh}
                disabled={inquiriesLoading}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <FiRefreshCw className={`w-4 h-4 ${inquiriesLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Design Inquiry Statistics */}
          <div className="mb-6 lg:mb-8">
            <DesignInquiryStats stats={stats} />
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
                placeholder="Search by name, phone, or fabric details..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${themeStyles.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.slice(0, 4).map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusFilterChange(status.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filters.status === status.value
                        ? theme === 'dark' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
                <select
                  value={filters.status}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${themeStyles.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fabric Source Filters */}
              <div className="flex gap-2">
                {FABRIC_SOURCE_OPTIONS.map((source) => (
                  <button
                    key={source.value}
                    onClick={() => handleFabricSourceFilterChange(source.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filters.fabricSource === source.value
                        ? theme === 'dark' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-green-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {source.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Inquiries Display */}
        <div className={`rounded-xl shadow-sm border overflow-hidden ${themeStyles.card}`}>
          {isMobile ? (
            <div className="p-4">
              <DataCard
                data={filteredInquiries}
                renderItem={renderInquiryCard}
                onItemClick={(inquiry) => navigate(`/dashboard/design-inquiries/view/${inquiry.id}`)}
                emptyMessage="No design inquiries found"
                emptyAction={
                  <div className="text-center">
                    <p className={`text-sm mb-4 ${themeStyles.text.muted}`}>
                      {filters.status !== 'ALL' || filters.fabricSource !== 'ALL'
                        ? `No inquiries found with current filters`
                        : 'No design inquiries submitted yet'
                      }
                    </p>
                    {(filters.status !== 'ALL' || filters.fabricSource !== 'ALL') && (
                      <button
                        onClick={() => {
                          handleStatusFilterChange('ALL');
                          handleFabricSourceFilterChange('ALL');
                          setSearchTerm('');
                        }}
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span>Clear Filters</span>
                      </button>
                    )}
                  </div>
                }
                pagination={{
                  serverTotalItems: totalInquiries,
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
              data={filteredInquiries}
              keyField="id"
              loading={inquiriesLoading}
              onRowClick={(inquiry) => navigate(`/dashboard/design-inquiries/view/${inquiry.id}`)}
              emptyMessage={
                <div className="text-center py-12">
                  <div className={`text-lg mb-2 ${themeStyles.text.secondary}`}>No design inquiries found</div>
                  <p className={`text-sm mb-4 ${themeStyles.text.muted}`}>
                    {filters.status !== 'ALL' || filters.fabricSource !== 'ALL' || searchTerm
                      ? 'No inquiries match your current filters'
                      : 'No design inquiries have been submitted yet'
                    }
                  </p>
                  {(filters.status !== 'ALL' || filters.fabricSource !== 'ALL' || searchTerm) && (
                    <button
                      onClick={() => {
                        handleStatusFilterChange('ALL');
                        handleFabricSourceFilterChange('ALL');
                        setSearchTerm('');
                      }}
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>Clear All Filters</span>
                    </button>
                  )}
                </div>
              }
              pagination={{
                serverTotalItems: totalInquiries,
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
          title="Delete Design Inquiry"
          message={
            `Are you sure you want to delete the inquiry from "${deleteModal.inquiry?.name}"? This action cannot be undone.`
          }
          confirmText="Delete Inquiry"
          isLoading={isDeleting}
          theme={theme}
        />
      </motion.div>
    </div>
  );
};

export default AdminDesignInquiries;