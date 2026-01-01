import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Star, MessageCircle, ThumbsUp, Calendar, User, Edit, Trash2, Send, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGetProductRatingsQuery, useCreateRatingMutation, useUpdateRatingMutation, useDeleteRatingMutation } from '../../redux/services/ratingService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const ProductReviews = ({ productId }) => {
  const { theme } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Fetch reviews
  const { data: reviewsData, isLoading, refetch } = useGetProductRatingsQuery(productId, {
    skip: !productId,
    refetchOnMountOrArgChange: true
  });

  // Mutations
  const [createRating, { isLoading: isCreating }] = useCreateRatingMutation();
  const [updateRating, { isLoading: isUpdating }] = useUpdateRatingMutation();
  const [deleteRating, { isLoading: isDeleting }] = useDeleteRatingMutation();

  // Get reviews from response
  const reviews = reviewsData?.data?.ratings || reviewsData?.ratings || reviewsData || [];

  // Check if user has already reviewed
  const userReview = reviews.find(review => review.user?._id === userId || review.userId === userId);

  // Calculate rating stats
  const calculateRatingStats = () => {
    if (!reviews.length) return null;

    const total = reviews.length;
    const average = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
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

  // Handle submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      alert('Please select a rating');
      return;
    }

    if (!review.trim()) {
      alert('Please write a review');
      return;
    }

    try {
      if (editingReview) {
        // Update existing review
        await updateRating({
          ratingId: editingReview._id,
          ratingData: {
            rating,
            comment: review
          }
        }).unwrap();
        setEditingReview(null);
      } else {
        // Create new review
        await createRating({
          productId,
          rating,
          comment: review
        }).unwrap();
      }

      // Reset form
      setRating(0);
      setReview('');
      refetch();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // Handle edit review
  const handleEditReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setReview(review.comment);
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteRating(reviewId).unwrap();
      refetch();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      border: 'border-gray-200',
      btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
      btnSecondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
      border: 'border-gray-700',
      btnPrimary: 'bg-blue-700 hover:bg-blue-600 text-white',
      btnSecondary: 'bg-gray-800 hover:bg-gray-700 text-gray-300'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="md" />
        <span className={`ml-4 ${currentTheme.text.primary}`}>Loading reviews...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Average Rating */}
        <div className={`p-6 rounded-xl ${currentTheme.bg.card} ${currentTheme.border} border`}>
          <h3 className={`text-2xl font-bold mb-2 ${currentTheme.text.primary}`}>
            {stats ? stats.average.toFixed(1) : '0.0'}
            <span className="text-sm font-normal ml-2">out of 5</span>
          </h3>
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.floor(stats?.average || 0)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <p className={`text-sm ${currentTheme.text.muted}`}>
            Based on {stats?.total || 0} {stats?.total === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className={`p-6 rounded-xl ${currentTheme.bg.card} ${currentTheme.border} border md:col-span-2`}>
          <h4 className={`font-semibold mb-4 ${currentTheme.text.primary}`}>Rating Breakdown</h4>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center">
                <div className="flex items-center w-16">
                  <span className={`text-sm mr-2 ${currentTheme.text.secondary}`}>{star}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-3">
                  <div 
                    className="h-full bg-yellow-500"
                    style={{ 
                      width: stats ? `${(stats.distribution[star] / stats.total) * 100}%` : '0%' 
                    }}
                  />
                </div>
                <span className={`text-sm w-10 ${currentTheme.text.muted}`}>
                  {stats ? stats.distribution[star] : 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Form - Only show if user is logged in and hasn't reviewed yet */}
      {user && !userReview && (
        <div className={`p-6 rounded-xl ${currentTheme.bg.card} ${currentTheme.border} border`}>
          <h3 className={`text-xl font-semibold mb-4 ${currentTheme.text.primary}`}>
            Write a Review
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating Stars */}
            <div>
              <label className={`block mb-2 ${currentTheme.text.secondary}`}>
                Your Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className={`block mb-2 ${currentTheme.text.secondary}`}>
                Your Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="4"
                className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.bg.primary} ${currentTheme.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Share your experience with this product..."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreating || !rating || !review.trim()}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isCreating || !rating || !review.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : currentTheme.btnPrimary
                }`}
              >
                {isCreating ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Submitting...</span>
                  </span>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form - Show when editing */}
      {editingReview && (
        <div className={`p-6 rounded-xl ${currentTheme.bg.card} ${currentTheme.border} border`}>
          <h3 className={`text-xl font-semibold mb-4 ${currentTheme.text.primary}`}>
            Edit Your Review
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating Stars */}
            <div>
              <label className={`block mb-2 ${currentTheme.text.secondary}`}>
                Your Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className={`block mb-2 ${currentTheme.text.secondary}`}>
                Your Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="4"
                className={`w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.bg.primary} ${currentTheme.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Share your experience with this product..."
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setEditingReview(null);
                  setRating(0);
                  setReview('');
                }}
                className={`px-6 py-2 rounded-lg font-medium border ${currentTheme.border} ${currentTheme.btnSecondary}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || !rating || !review.trim()}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isUpdating || !rating || !review.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : currentTheme.btnPrimary
                }`}
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Updating...</span>
                  </span>
                ) : (
                  'Update Review'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className={`text-xl font-semibold mb-6 ${currentTheme.text.primary}`}>
          Customer Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className={`text-center py-12 ${currentTheme.bg.card} rounded-xl`}>
            <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className={`${currentTheme.text.secondary} mb-4`}>
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className={`p-6 rounded-xl border ${currentTheme.border} ${currentTheme.bg.card}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full ${currentTheme.bg.secondary} flex items-center justify-center mr-4`}>
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${currentTheme.text.primary}`}>
                        {review.user?.name || 'Anonymous User'}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-sm ${currentTheme.text.muted}`}>
                          {formatDate(review.createdAt)}
                        </span>

                      </div>
                    </div>
                  </div>

                  {/* Edit/Delete buttons for user's own review */}
                  {user && (review.user?._id === userId || review.userId === userId) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className={`p-2 rounded-lg ${currentTheme.bg.secondary} ${currentTheme.text.secondary} hover:opacity-80`}
                        title="Edit review"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        disabled={isDeleting}
                        className={`p-2 rounded-lg ${currentTheme.bg.secondary} text-red-500 hover:opacity-80 disabled:opacity-50`}
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <p className={`mb-4 ${currentTheme.text.secondary}`}>
                  {review.comment}
                </p>

                <div className="flex items-center justify-between pt-4 border-t ${currentTheme.border}">
                  <div className="flex items-center space-x-4">
                    <button className={`flex items-center space-x-1 ${currentTheme.text.muted} hover:${currentTheme.text.primary}`}>
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpfulCount || 0})</span>
                    </button>
                    <button className={`flex items-center space-x-1 ${currentTheme.text.muted} hover:${currentTheme.text.primary}`}>
                      <MessageCircle className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;