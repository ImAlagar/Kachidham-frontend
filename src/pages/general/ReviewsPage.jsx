// src/pages/Product/ReviewsPage.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  ChevronLeft, 
  User, 
  Calendar, 
  ThumbsUp, 
  MessageCircle, 
  CheckCircle,
  Clock,
  Filter,
  SortAsc,
  Edit,
  Trash2,
  Send,
  X,
  Home,
  ShoppingBag
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { useGetProductBySlugQuery } from '../../redux/services/productService';
import { 
  useGetProductRatingsQuery, 
  useCreateRatingMutation, 
  useUpdateRatingMutation, 
  useDeleteRatingMutation,
  useMarkReviewHelpfulMutation 
} from '../../redux/services/ratingService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ReviewForm from '../../pages/general/ReviewForm';

const ReviewsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id || user?.id;

  // States
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [filters, setFilters] = useState({
    rating: null,
    sortBy: 'newest',
    verifiedOnly: false
  });
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch product details
  const { data: productData, isLoading: productLoading, error: productError } = useGetProductBySlugQuery(productId, {
    skip: !productId
  });

  // Fetch reviews with filters
  const { 
    data: reviewsData, 
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch 
  } = useGetProductRatingsQuery({
    productId,
    page,
    limit,
    rating: filters.rating,
    sortBy: filters.sortBy,
    verifiedOnly: filters.verifiedOnly
  }, {
    skip: !productId
  });

  // Mutations
  const [updateRating, { isLoading: isUpdating }] = useUpdateRatingMutation();
  const [deleteRating, { isLoading: isDeleting }] = useDeleteRatingMutation();
  const [markHelpful] = useMarkReviewHelpfulMutation();

  // Helper function to get review ID (handles both _id and id)
  const getReviewId = (review) => {
    return review?._id || review?.id;
  };

  // Helper function to get user ID from review
  const getReviewUserId = (review) => {
    return review?.user?._id || review?.user?.id || review?.userId || review?.user;
  };

  // Safely get product data
  const product = React.useMemo(() => {
    if (!productData) return { name: 'Product' };
    
    if (productData.data && typeof productData.data === 'object') {
      return productData.data;
    }
    
    return productData || { name: 'Product' };
  }, [productData]);

  // Safely get reviews data
  const reviews = React.useMemo(() => {
    if (!reviewsData) return [];
    
    if (reviewsData.data && Array.isArray(reviewsData.data.ratings)) {
      return reviewsData.data.ratings;
    }
    
    if (reviewsData.ratings && Array.isArray(reviewsData.ratings)) {
      return reviewsData.ratings;
    }
    
    if (Array.isArray(reviewsData.data)) {
      return reviewsData.data;
    }
    
    if (Array.isArray(reviewsData)) {
      return reviewsData;
    }
    
    return [];
  }, [reviewsData]);

  // Safely get pagination
  const pagination = React.useMemo(() => {
    if (!reviewsData) return { currentPage: 1, pages: 1, total: 0 };
    
    if (reviewsData.pagination) {
      return reviewsData.pagination;
    }
    
    if (reviewsData.data && reviewsData.data.pagination) {
      return reviewsData.data.pagination;
    }
    
    return {
      currentPage: page,
      pages: Math.ceil(reviews.length / limit),
      total: reviews.length
    };
  }, [reviewsData, reviews, page, limit]);

  // Check if user has already reviewed
  const userReview = React.useMemo(() => {
    if (!user || !reviews.length) return null;
    return reviews.find(review => getReviewUserId(review) === userId);
  }, [reviews, user, userId]);

  // Calculate rating stats
  const calculateRatingStats = () => {
    if (!reviews.length) return null;

    const total = reviews.length;
    const average = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total;
    const distribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    return { total, average, distribution };
  };

  const stats = calculateRatingStats();

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  // Handle edit review
  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  // Handle delete review
  const handleDeleteReview = async (review) => {
    const reviewId = getReviewId(review);
    if (!reviewId) {
      console.error('Cannot delete review: No review ID found', review);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteRating(reviewId).unwrap();
      refetch();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Handle mark as helpful - FIXED to use correct ID
  const handleMarkHelpful = async (review) => {
    const reviewId = getReviewId(review);
    
    if (!reviewId) {
      console.error('Cannot mark as helpful: No review ID found', review);
      return;
    }

    try {
      // Try to call the backend endpoint
      await markHelpful(reviewId).unwrap().catch(async (error) => {
        console.warn('Helpful endpoint not available, handling locally:', error);
        
        // If backend endpoint doesn't exist, handle locally
        alert('Thank you for your feedback!');
      });
      
      // Refetch reviews to get updated data
      refetch();
    } catch (error) {
      console.error('Error marking as helpful:', error);
      // Don't show error toast for 404 (endpoint not found)
      if (error.status !== 404) {
        alert('Failed to mark review as helpful');
      }
    }
  };

  // Handle review form submission
  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    refetch();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  // Get product name safely
  const getProductName = () => {
    if (!product) return 'Product';
    if (typeof product.name === 'string') return product.name;
    if (typeof product.title === 'string') return product.title;
    return 'Product';
  };

  // Theme styles
  const themeStyles = {
    light: {
      bg: {
        primary: 'bg-white',
        secondary: 'bg-gray-50',
        card: 'bg-white'
      },
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        muted: 'text-gray-500'
      },
      border: 'border-gray-200'
    },
    dark: {
      bg: {
        primary: 'bg-gray-900',
        secondary: 'bg-gray-800',
        card: 'bg-gray-800'
      },
      text: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        muted: 'text-gray-400'
      },
      border: 'border-gray-700'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  // Handle errors
  if (productError || reviewsError) {
    return (
      <div className={`min-h-screen ${currentTheme.bg.primary}`}>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">😕</div>
            <h2 className={`text-2xl font-bold ${currentTheme.text.primary} mb-4`}>
              Error Loading Reviews
            </h2>
            <p className={`${currentTheme.text.secondary} mb-6`}>
              {productError?.data?.message || reviewsError?.data?.message || 'Failed to load reviews. Please try again.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={`/product/${productId}`}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Back to Product
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productLoading || reviewsLoading) {
    return (
      <div className={`min-h-screen ${currentTheme.bg.primary}`}>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
            <span className={`ml-4 ${currentTheme.text.primary}`}>
              Loading reviews...
            </span>
          </div>
        </div>
      </div>
    );
  }

  const productName = getProductName();

  return (
    <div className={`min-h-screen ${currentTheme.bg.primary}`}>
      {/* Breadcrumb */}
      <div className={`border-b ${currentTheme.border} ${currentTheme.bg.secondary}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm">
            <Link 
              to="/" 
              className={`${currentTheme.text.secondary} hover:${currentTheme.text.primary} transition-colors`}
            >
              Home
            </Link>
            <ChevronLeft className="w-4 h-4 mx-2 text-gray-400" />
            <Link 
              to="/shop" 
              className={`${currentTheme.text.secondary} hover:${currentTheme.text.primary} transition-colors`}
            >
              Shop
            </Link>
            <ChevronLeft className="w-4 h-4 mx-2 text-gray-400" />
            <Link 
              to={`/product/${productId}`}
              className={`${currentTheme.text.secondary} hover:${currentTheme.text.primary} transition-colors`}
            >
              {productName}
            </Link>
            <ChevronLeft className="w-4 h-4 mx-2 text-gray-400" />
            <span className={`font-medium ${currentTheme.text.primary}`}>
              Reviews
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${currentTheme.text.primary}`}>
                Customer Reviews
              </h1>
              <p className={currentTheme.text.secondary}>
                {productName} - {stats?.total || 0} {stats?.total === 1 ? 'review' : 'reviews'}
              </p>
            </div>
            
            {/* Back to Product Button */}
            <Link
              to={`/product/${productId}`}
              className={`mt-4 md:mt-0 px-4 py-2 border ${currentTheme.border} rounded-lg ${currentTheme.text.secondary} hover:${currentTheme.text.primary} transition-colors flex items-center space-x-2`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Product</span>
            </Link>
          </div>

          {/* Rating Summary */}
          <div className={`p-6 rounded-xl ${currentTheme.bg.card} ${currentTheme.border} border mb-8`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Overall Rating */}
              <div className="text-center">
                <div className={`text-5xl font-bold mb-2 ${currentTheme.text.primary}`}>
                  {stats ? stats.average.toFixed(1) : '0.0'}
                  <span className="text-2xl font-normal">/5</span>
                </div>
                <div className="flex items-center justify-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 ${
                        star <= Math.floor(stats?.average || 0)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <p className={currentTheme.text.muted}>
                  Based on {stats?.total || 0} ratings
                </p>
              </div>

              {/* Rating Distribution */}
              <div>
                <h3 className={`font-semibold mb-4 ${currentTheme.text.primary}`}>Rating Breakdown</h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = stats?.distribution[star] || 0;
                    const percentage = stats?.total ? (count / stats.total) * 100 : 0;
                    
                    return (
                      <div key={star} className="flex items-center">
                        <div className="flex items-center w-16">
                          <span className={`text-sm mr-2 ${currentTheme.text.secondary}`}>{star}</span>
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-3">
                          <div 
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className={`text-sm w-10 ${currentTheme.text.muted}`}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Review Form Section - Using your ReviewForm component */}
          {user && !userReview && !showReviewForm && (
            <div className="mb-8">
              <ReviewForm 
                productId={productId} 
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
          )}

          {/* Edit Review Form Modal */}
          {showReviewForm && editingReview && (
            <div className="mb-8">
              <div className={`p-6 rounded-xl ${currentTheme.bg.card} ${currentTheme.border} border`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-semibold ${currentTheme.text.primary}`}>
                    Edit Your Review
                  </h2>
                  <button
                    onClick={() => {
                      setShowReviewForm(false);
                      setEditingReview(null);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <ReviewForm 
                  productId={productId} 
                  onReviewSubmitted={handleReviewSubmitted}
                  editData={editingReview}
                />
              </div>
            </div>
          )}
        </div>

        {/* Filters and Write Review Button */}
        <div className={`p-4 rounded-xl ${currentTheme.bg.card} ${currentTheme.border} border mb-6`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Write Review Button - Only show if user hasn't reviewed */}
            {user && !userReview && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Write a Review
              </button>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Rating Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filters.rating || ''}
                  onChange={(e) => handleFilterChange('rating', e.target.value || null)}
                  className={`px-3 py-2 border ${currentTheme.border} rounded bg-transparent ${currentTheme.text.primary}`}
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center space-x-2">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className={`px-3 py-2 border ${currentTheme.border} rounded bg-transparent ${currentTheme.text.primary}`}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="mostHelpful">Most Helpful</option>
                </select>
              </div>

              {/* Verified Only */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className={currentTheme.text.secondary}>Verified Purchase Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className={`text-center py-12 rounded-xl ${currentTheme.bg.card} ${currentTheme.border} border`}>
            <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className={`text-xl font-semibold mb-2 ${currentTheme.text.primary}`}>
              No Reviews Yet
            </h3>
            <p className={`mb-6 ${currentTheme.text.secondary}`}>
              Be the first to share your thoughts about this product!
            </p>
            {user ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Write First Review
              </button>
            ) : (
              <p className={currentTheme.text.secondary}>
                Please login to write a review
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {reviews.map((review) => {
                const reviewId = getReviewId(review);
                const reviewUserId = getReviewUserId(review);
                const isUsersReview = reviewUserId === userId;
                
                return (
                  <div
                    key={reviewId || Math.random()}
                    className={`p-6 rounded-xl border ${currentTheme.border} ${currentTheme.bg.card}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full ${currentTheme.bg.secondary} flex items-center justify-center`}>
                          {review.user?.avatar ? (
                            <img 
                              src={review.user.avatar} 
                              alt={review.user?.name || 'User'} 
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${currentTheme.text.primary}`}>
                            {review.isAnonymous ? 'Anonymous User' : review.user?.name || review.userName || 'User'}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= (review.rating || 0)
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`text-sm ${currentTheme.text.muted}`}>
                              {formatDate(review.createdAt || review.date)}
                            </span>
                            {review.title && (
                              <span className={`text-sm font-medium ${currentTheme.text.primary}`}>
                                - {review.title}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Edit/Delete buttons for user's own review */}
                      {user && isUsersReview && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className={`p-2 rounded-lg ${currentTheme.bg.secondary} ${currentTheme.text.secondary} hover:opacity-80`}
                            title="Edit review"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review)}
                            disabled={isDeleting}
                            className={`p-2 rounded-lg ${currentTheme.bg.secondary} text-red-500 hover:opacity-80 disabled:opacity-50`}
                            title="Delete review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Review Title */}
                    {review.title && (
                      <h5 className={`text-lg font-semibold mb-2 ${currentTheme.text.primary}`}>
                        {review.title}
                      </h5>
                    )}

                    {/* Review Content */}
                    <p className={`mb-4 ${currentTheme.text.secondary} whitespace-pre-wrap`}>
                      {review.comment || review.review || 'No review text provided.'}
                    </p>

                    {/* Review Images (if any) */}
                    {review.images && Array.isArray(review.images) && review.images.length > 0 && (
                      <div className="flex space-x-2 mb-4">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t ${currentTheme.border}">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleMarkHelpful(review)}
                          className={`flex items-center space-x-1 ${currentTheme.text.muted} hover:${currentTheme.text.primary}`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>Helpful ({review.helpfulCount || 0})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`p-2 rounded ${currentTheme.border} ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(Math.min(5, pagination.pages))].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`w-10 h-10 rounded ${page === pageNumber ? 'bg-blue-600 text-white' : `${currentTheme.border} hover:bg-gray-100 dark:hover:bg-gray-800`}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                {pagination.pages > 5 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className={`p-2 rounded ${currentTheme.border} ${page === pagination.pages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;