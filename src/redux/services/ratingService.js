// redux/services/ratingService.js - COMPLETE WITH ALL ENDPOINTS
import { apiSlice } from './api';
import { toast } from 'react-toastify';

export const ratingService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get product ratings with filters and pagination
    getProductRatings: builder.query({
      query: ({ productId, page = 1, limit = 10, rating, sortBy = 'newest', verifiedOnly = false }) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        
        if (rating) params.append('rating', rating);
        if (sortBy) params.append('sortBy', sortBy);
        if (verifiedOnly) params.append('verifiedOnly', 'true');
        
        return {
          url: `/ratings/product/${productId}?${params.toString()}`,
        };
      },
      providesTags: (result, error, { productId }) => [
        { type: 'Rating', id: productId },
        { type: 'Rating', id: 'LIST' }
      ],
      // Transform response to include pagination
      transformResponse: (response) => {
        // Handle different response structures
        if (response.data && response.data.ratings) {
          return {
            ratings: response.data.ratings,
            pagination: response.data.pagination || {
              currentPage: 1,
              pages: 1,
              total: response.data.ratings.length
            }
          };
        } else if (Array.isArray(response.data)) {
          return {
            ratings: response.data,
            pagination: {
              currentPage: 1,
              pages: 1,
              total: response.data.length
            }
          };
        } else if (Array.isArray(response)) {
          return {
            ratings: response,
            pagination: {
              currentPage: 1,
              pages: 1,
              total: response.length
            }
          };
        }
        
        // Fallback
        return {
          ratings: response.data || response || [],
          pagination: response.pagination || {
            currentPage: 1,
            pages: 1,
            total: (response.data || response || []).length
          }
        };
      },
    }),

    // Get product rating summary (for product details page)
    getProductRatingSummary: builder.query({
      query: (productId) => `/ratings/product/${productId}/summary`,
      providesTags: (result, error, productId) => [
        { type: 'RatingSummary', id: productId }
      ],
    }),

    // Create a new rating
    createRating: builder.mutation({
      query: (ratingData) => ({
        url: '/ratings',
        method: 'POST',
        body: ratingData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Rating', id: productId },
        { type: 'RatingSummary', id: productId },
        { type: 'Rating', id: 'LIST' }
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Review submitted successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to submit review');
        }
      },
    }),

    // Update a rating
    updateRating: builder.mutation({
      query: ({ ratingId, ratingData }) => ({
        url: `/ratings/${ratingId}`,
        method: 'PUT',
        body: ratingData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result, error, { ratingData }) => [
        { type: 'Rating', id: ratingData.productId },
        { type: 'RatingSummary', id: ratingData.productId },
        { type: 'Rating', id: 'LIST' }
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Review updated successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to update review');
        }
      },
    }),

    // Delete a rating
    deleteRating: builder.mutation({
      query: (ratingId) => ({
        url: `/ratings/${ratingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rating', 'RatingSummary'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Review deleted successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to delete review');
        }
      },
    }),

    // Mark review as helpful
    markReviewHelpful: builder.mutation({
      query: (ratingId) => {
        if (!ratingId) {
          throw new Error('Rating ID is required');
        }
        return {
          url: `/ratings/${ratingId}/helpful`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      invalidatesTags: (result, error, ratingId) => [
        { type: 'Rating', id: ratingId },
        { type: 'Rating', id: 'LIST' }
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Thanks for your feedback!');
        } catch (error) {
          // Don't show error if endpoint doesn't exist
          if (error.status !== 404) {
            toast.error(error.error?.data?.message || 'Failed to mark review as helpful');
          }
        }
      },
    }),

    // Report a review
    reportReview: builder.mutation({
      query: ({ ratingId, reason }) => ({
        url: `/ratings/${ratingId}/report`,
        method: 'POST',
        body: { reason },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Rating'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Review reported. Thank you for your feedback.');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to report review');
        }
      },
    }),

    // Get user's ratings
    getUserRatings: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        
        return {
          url: `/ratings/user/my-ratings?${params.toString()}`,
        };
      },
      providesTags: ['UserRating'],
    }),

    // Check if user can review a product
    canUserReviewProduct: builder.query({
      query: (productId) => `/ratings/can-review/${productId}`,
      providesTags: ['CanReview'],
    }),

    // Check if user has purchased the product (for verified purchase badge)
    hasUserPurchasedProduct: builder.query({
      query: (productId) => `/ratings/has-purchased/${productId}`,
      providesTags: ['PurchaseStatus'],
    }),

    // ADMIN ENDPOINTS

    // Get all ratings (admin)
    getAllRatings: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, status, rating, productId, userId } = params;
        const queryParams = new URLSearchParams();
        
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        
        if (status && status !== 'ALL') {
          queryParams.append('isApproved', status === 'APPROVED' ? 'true' : 'false');
        }
        
        if (rating && rating !== 'ALL') {
          queryParams.append('rating', rating);
        }
        
        if (productId) {
          queryParams.append('productId', productId);
        }
        
        if (userId) {
          queryParams.append('userId', userId);
        }
        
        return {
          url: `/ratings/admin?${queryParams.toString()}`,
        };
      },
      providesTags: ['Rating'],
      transformResponse: (response) => {
        if (response.data && response.data.ratings) {
          return response;
        } else if (Array.isArray(response.data)) {
          return {
            data: {
              ratings: response.data,
              pagination: response.pagination || {
                currentPage: 1,
                pages: 1,
                total: response.data.length
              }
            }
          };
        } else if (Array.isArray(response)) {
          return {
            data: {
              ratings: response,
              pagination: {
                currentPage: 1,
                pages: 1,
                total: response.length
              }
            }
          };
        }
        
        return {
          data: {
            ratings: response.data || response || [],
            pagination: response.pagination || {
              currentPage: 1,
              pages: 1,
              total: (response.data || response || []).length
            }
          }
        };
      },
    }),

    // Get rating by ID (admin)
    getRatingById: builder.query({
      query: (ratingId) => `/ratings/admin/${ratingId}`,
      providesTags: (result, error, id) => [{ type: 'Rating', id }],
    }),

    // Toggle rating approval (admin)
    toggleRatingApproval: builder.mutation({
      query: ({ ratingId, currentApproval }) => ({
        url: `/ratings/admin/${ratingId}/approval`,
        method: 'PATCH',
        body: {
          isApproved: !currentApproval
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Rating'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Rating approval status updated!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to update rating approval');
        }
      },
    }),

    // Bulk update rating approval (admin)
    bulkUpdateRatingApproval: builder.mutation({
      query: (approvalData) => ({
        url: '/ratings/admin/bulk/approval',
        method: 'PATCH',
        body: approvalData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Rating'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Ratings approval status updated!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to update ratings approval');
        }
      },
    }),

    // Get rating stats (admin)
    getRatingStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.productId) queryParams.append('productId', params.productId);
        
        return {
          url: `/ratings/admin/stats?${queryParams.toString()}`,
        };
      },
      providesTags: ['RatingStats'],
    }),

    // Delete rating (admin)
    deleteRatingAdmin: builder.mutation({
      query: (ratingId) => ({
        url: `/ratings/admin/${ratingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rating'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Rating deleted successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to delete rating');
        }
      },
    }),

    // Reply to review (admin/merchant)
    replyToRating: builder.mutation({
      query: ({ ratingId, reply }) => ({
        url: `/ratings/${ratingId}/reply`,
        method: 'POST',
        body: { reply },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result, error, { ratingId }) => [
        { type: 'Rating', id: ratingId }
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Reply submitted successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to submit reply');
        }
      },
    }),
  }),
});

export const {
  // User endpoints
  useGetProductRatingsQuery,
  useGetProductRatingSummaryQuery,
  useCreateRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
  useMarkReviewHelpfulMutation,
  useReportReviewMutation,
  useGetUserRatingsQuery,
  useCanUserReviewProductQuery,
  useHasUserPurchasedProductQuery,
  
  // Admin endpoints
  useGetAllRatingsQuery,
  useGetRatingByIdQuery,
  useToggleRatingApprovalMutation,
  useBulkUpdateRatingApprovalMutation,
  useGetRatingStatsQuery,
  useDeleteRatingAdminMutation,
  useReplyToRatingMutation,
} = ratingService;