import { apiSlice } from './api';
import { toast } from 'react-toastify';

export const designInquiryService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all design inquiries with pagination
    getAllDesignInquiries: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, status, fabricSource } = params;
        const queryParams = new URLSearchParams();
        
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        
        if (status && status !== 'ALL') {
          queryParams.append('status', status);
        }
        
        if (fabricSource && fabricSource !== 'ALL') {
          queryParams.append('fabricSource', fabricSource);
        }
        
        return {
          url: `/design-inquiries/admin?${queryParams.toString()}`,
        };
      },
      providesTags: ['DesignInquiry'],
      transformResponse: (response) => {
        return {
          data: response.data || [],
          pagination: response.pagination || {
            currentPage: 1,
            pages: 1,
            total: response.data?.length || 0
          }
        };
      },
    }),

    // Get single design inquiry by ID
    getDesignInquiryById: builder.query({
      query: (inquiryId) => `/design-inquiries/admin/${inquiryId}`,
      providesTags: (result, error, id) => [{ type: 'DesignInquiry', id }],
    }),

    // Update design inquiry (status, adminNotes, or other fields)
    updateDesignInquiry: builder.mutation({
      query: ({ inquiryId, updateData }) => ({
        url: `/design-inquiries/admin/${inquiryId}`,
        method: 'PUT',
        body: updateData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['DesignInquiry'],
      async onQueryStarted(arg, { queryFulfilled }) {
    try {
      await queryFulfilled;
      toast.success('Design inquiry status updated!');
    } catch (error) {
      if (error.error?.data?.errors?.length > 0) {
        const firstError = error.error.data.errors[0];
        toast.error(firstError.msg || 'Failed to update status');
      } else if (error.error?.data?.message) {
        toast.error(error.error.data.message);
      } else {
        toast.error('Failed to update design inquiry status');
      }
    }
      },
    }),

    // Delete design inquiry
    deleteDesignInquiry: builder.mutation({
      query: (inquiryId) => ({
        url: `/design-inquiries/admin/${inquiryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DesignInquiry'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Inquiry deleted successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to delete inquiry');
        }
      },
    }),

    // Get design inquiry statistics
    getDesignInquiryStats: builder.query({
      query: () => '/design-inquiries/admin/stats',
      providesTags: ['DesignInquiry'],
    }),

    // Update inquiry status
    updateInquiryStatus: builder.mutation({
      query: ({ inquiryId, status, adminNotes }) => ({
        url: `/design-inquiries/admin/${inquiryId}`,
        method: 'PUT',
        body: { status, adminNotes },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['DesignInquiry'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Status updated successfully!');
        } catch (error) {
          toast.error(error.error?.data?.message || 'Failed to update status');
        }
      },
    }),
  }),
});

export const {
  useGetAllDesignInquiriesQuery,
  useGetDesignInquiryByIdQuery,
  useUpdateDesignInquiryMutation,
  useDeleteDesignInquiryMutation,
  useGetDesignInquiryStatsQuery,
  useUpdateInquiryStatusMutation,
} = designInquiryService;