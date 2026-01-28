// redux/slices/discountSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  },
  filters: {
    discountType: 'ALL',
    status: 'ALL',
    search: '',
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
};

const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    setSort: (state, action) => {
      state.sort = { ...state.sort, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    },
  },
});

export const { setPagination, setFilters, setSort, resetFilters } = discountSlice.actions;
export default discountSlice.reducer;