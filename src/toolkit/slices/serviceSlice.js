import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../httpcommon";

export const getAllCategories = createAsyncThunk(
  "categories/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/categories`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const addCategories = createAsyncThunk(
  "categories/addCategories",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/categories?userId=${userId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to add categories"
      );
    }
  }
);

export const updateCategories = createAsyncThunk(
  "categories/updateCategories",
  async ({ id, userId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/categories/${id}?userId=${userId}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update categories"
      );
    }
  }
);

export const deleteCategories = createAsyncThunk(
  "categories/deleteCategories",
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/categories/${id}?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete categories"
      );
    }
  }
);

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    loading: "",
    categoryList: [],
  },
  extraReducers: (builder) => {
    builder.addCase(getAllCategories.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getAllCategories.fulfilled, (state, action) => {
      state.loading = "success";
      state.categoryList = action.payload;
    });
    builder.addCase(getAllCategories.rejected, (state) => {
      state.loading = "rejected";
    });
  },
});

export default serviceSlice.reducer;
