// redux/services/faqService.js
import { apiSlice } from './api';
import { toast } from 'react-toastify';

export const faqService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all FAQs with pagination
    getAllFaqs: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, category, status } = params;
        const queryParams = new URLSearchParams();
        
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        
        if (category && category !== 'ALL') {
          queryParams.append('category', category);
        }
        
        if (status && status !== 'ALL') {
          queryParams.append('isActive', status === 'ACTIVE' ? 'true' : 'false');
        }
        
        return {
          url: `/faqs?${queryParams.toString()}`,
        };
      },
      providesTags: ['FAQ'],
      transformResponse: (response) => {
        // Handle different response structures
        if (response.data && response.data.faqs) {
          return response;
        } else if (Array.isArray(response.data)) {
          return {
            data: {
              faqs: response.data,
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
              faqs: response,
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
            faqs: response.data || response || [],
            pagination: response.pagination || {
              currentPage: 1,
              pages: 1,
              total: (response.data || response || []).length
            }
          }
        };
      },
    }),

    getFaqById: builder.query({
      query: (faqId) => `/faqs/${faqId}`,
      providesTags: (result, error, id) => [{ type: 'FAQ', id }],
    }),

    createFaq: builder.mutation({
      query: (faqData) => ({
        url: '/faqs/admin',
        method: 'POST',
        body: faqData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['FAQ'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('FAQ created successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to create FAQ');
        }
      },
    }),

    updateFaq: builder.mutation({
      query: ({ faqId, faqData }) => ({
        url: `/faqs/admin/${faqId}`,
        method: 'PUT',
        body: faqData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['FAQ'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('FAQ updated successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to update FAQ');
        }
      },
    }),

    deleteFaq: builder.mutation({
      query: (faqId) => ({
        url: `/faqs/admin/${faqId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FAQ'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('FAQ deleted successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to delete FAQ');
        }
      },
    }),

    toggleFaqStatus: builder.mutation({
      query: ({ faqId, currentStatus }) => ({
        url: `/faqs/admin/${faqId}/status`,
        method: 'PATCH',
        body: {
          isActive: !currentStatus
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['FAQ'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('FAQ status updated!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to update FAQ status');
        }
      },
    }),

    getFaqStats: builder.query({
      query: () => '/faqs/admin/stats',
      providesTags: ['FAQ'],
    }),

    // Get FAQ categories for dropdown
    getFaqCategories: builder.query({
      query: () => '/faqs/categories',
      transformResponse: (response) => {
        return response.data || response || [];
      },
    }),
  }),
});

export const {
  useGetAllFaqsQuery,
  useGetFaqByIdQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useToggleFaqStatusMutation,
  useGetFaqStatsQuery,
  useGetFaqCategoriesQuery,
} = faqService;