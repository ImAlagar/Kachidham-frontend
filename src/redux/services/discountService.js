// redux/services/discountService.js
import { apiSlice } from './api';
import { toast } from 'react-toastify';

export const discountService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all discounts with pagination
    getAllDiscounts: builder.query({
      query: (params = {}) => {
        const { 
          page = 1, 
          limit = 10, 
          discountType, 
          status,
          search 
        } = params;
        const queryParams = new URLSearchParams();
        
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        
        if (discountType && discountType !== 'ALL') {
          queryParams.append('discountType', discountType);
        }
        
        if (status && status !== 'ALL') {
          queryParams.append('isActive', status === 'ACTIVE' ? 'true' : 'false');
        }
        
        if (search) {
          queryParams.append('search', search);
        }
        
        return {
          url: `/discounts?${queryParams.toString()}`,
        };
      },
      providesTags: ['DISCOUNT'],
      transformResponse: (response) => {
        // Handle different response structures
        if (response.data && response.data.discounts) {
          return response;
        } else if (Array.isArray(response.data)) {
          return {
            data: {
              discounts: response.data,
              pagination: response.pagination || {
                currentPage: 1,
                pages: 1,
                total: response.data.length
              }
            }
          };
        }
        
        return {
          data: {
            discounts: response.data?.discounts || response.data || [],
            pagination: response.data?.pagination || response.pagination || {
              currentPage: 1,
              pages: 1,
              total: (response.data?.discounts || response.data || []).length
            }
          }
        };
      },
    }),

    // Get discount by ID
    getDiscountById: builder.query({
      query: (discountId) => `/discounts/${discountId}`,
      providesTags: (result, error, id) => [{ type: 'DISCOUNT', id }],
    }),

    // Create discount
    createDiscount: builder.mutation({
      query: (discountData) => ({
        url: '/discounts',
        method: 'POST',
        body: discountData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['DISCOUNT'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Discount created successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to create discount');
        }
      },
    }),

    // Update discount
    updateDiscount: builder.mutation({
      query: ({ discountId, discountData }) => ({
        url: `/discounts/${discountId}`,
        method: 'PUT',
        body: discountData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['DISCOUNT'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Discount updated successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to update discount');
        }
      },
    }),

    // Delete discount
    deleteDiscount: builder.mutation({
      query: (discountId) => ({
        url: `/discounts/${discountId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DISCOUNT'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Discount deleted successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to delete discount');
        }
      },
    }),

    // Toggle discount status
    toggleDiscountStatus: builder.mutation({
      query: ({ discountId, currentStatus }) => ({
        url: `/discounts/${discountId}/toggle`,
        method: 'PATCH',
        body: {
          isActive: !currentStatus
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['DISCOUNT'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Discount status updated!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to update discount status');
        }
      },
    }),

    // Get discount statistics
    getDiscountStats: builder.query({
      query: () => '/discounts/stats',
      providesTags: ['DISCOUNT'],
    }),

    // Validate discount code
    validateDiscount: builder.query({
      query: ({ code, userId, orderAmount }) => ({
        url: `/discounts/validate/${code}`,
        params: { userId, orderAmount },
      }),
    }),

    // Apply discount to order
    applyDiscount: builder.mutation({
      query: ({ orderId, discountId }) => ({
        url: `/discounts/apply/${orderId}/${discountId}`,
        method: 'POST',
      }),
    }),

    // Get discount types for dropdown
    getDiscountTypes: builder.query({
      query: () => '/discounts/types',
      transformResponse: (response) => {
        return response.data || response || [];
      },
    }),

    // Get user types for discount
    getUserTypes: builder.query({
      query: () => '/discounts/user-types',
      transformResponse: (response) => {
        return response.data || response || [];
      },
    }),

    getProductDiscounts: builder.query({
  query: (productId) => ({
    url: `/discounts/product/${productId}/discounts`,
  }),
  providesTags: (result, error, productId) => [
    { type: 'PRODUCT_DISCOUNT', id: productId }
  ],
        }),

        getActiveDiscounts: builder.query({
        query: (params = {}) => ({
            url: '/discounts/active',
            params: params,
        }),
        providesTags: ['ACTIVE_DISCOUNTS'],
        }),

        calculateCartDiscount: builder.mutation({
        query: (cartData) => ({
            url: '/discounts/calculate-cart',
            method: 'POST',
            body: cartData,
        }),
        }),

           // ✅ UPDATED: Validate discount code
    validateDiscount: builder.query({
      query: ({ code, orderAmount }) => ({
        url: `/discounts/validate/${code}`,
        params: { 
          orderAmount 
        },
      }),
    }),

    // ✅ NEW: Get active discounts for user
    getActiveDiscounts: builder.query({
      query: (params = {}) => ({
        url: '/discounts/active',
        params: params,
      }),
      providesTags: ['ACTIVE_DISCOUNTS'],
    }),

    // ✅ NEW: Calculate cart discounts
    calculateCartDiscount: builder.mutation({
      query: (cartData) => ({
        url: '/discounts/calculate-cart',
        method: 'POST',
        body: cartData,
      }),
    }),

    // ✅ NEW: Get available discounts for cart
    getAvailableDiscounts: builder.mutation({
      query: (cartData) => ({
        url: '/discounts/available',
        method: 'POST',
        body: cartData,
      }),
    }),

    // Get product discounts with calculation
      getProductDiscountsWithCalculation: builder.query({
        query: (productId) => ({
          url: `/discounts/product/${productId}/calculate`,
        }),
        providesTags: (result, error, productId) => [
          { type: 'PRODUCT_DISCOUNT', id: productId }
        ],
      }),

      // Calculate cart with discounts
      calculateCartDiscounts: builder.mutation({
        query: (cartData) => ({
          url: '/discounts/calculate-cart',
          method: 'POST',
          body: cartData,
        }),
      }),

      // Get best discount for cart
      getBestCartDiscount: builder.mutation({
        query: (cartData) => ({
          url: '/discounts/best-discount',
          method: 'POST',
          body: cartData,
        }),
      }),

      // Validate and apply discount code
      applyDiscountCode: builder.mutation({
        query: ({ cartData, couponCode  }) => ({
          url: `/discounts/apply-code`,
          method: 'POST',
          body: { cartData, couponCode  },
        }),
      }),
          validateDiscountCode: builder.mutation({
      query: ({ code, cartData }) => ({
        url: `/discounts/validate/${code}`,
        method: 'POST',
        body: cartData,
      }),
    }),

  }),
});

export const {
  useGetAllDiscountsQuery,
  useGetDiscountByIdQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
  useToggleDiscountStatusMutation,
  useGetDiscountStatsQuery,
  useApplyDiscountMutation,
  useGetDiscountTypesQuery,
  useGetUserTypesQuery,
  useGetProductDiscountsQuery,
  useValidateDiscountQuery,
  useGetActiveDiscountsQuery,
  useCalculateCartDiscountMutation,
  useGetAvailableDiscountsMutation,
  useCalculateCartDiscountsMutation,
  useValidateDiscountCodeMutation
} = discountService;