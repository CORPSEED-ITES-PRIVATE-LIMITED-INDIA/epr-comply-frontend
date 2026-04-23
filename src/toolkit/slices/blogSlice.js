import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../httpcommon";

export const getBlogList = createAsyncThunk(
  "getBlogList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/blogs`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const addBlog = createAsyncThunk(
  "addBlog",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/blogs?userId=${userId}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  "updateBlog",
  async ({ id, userId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/blogs/${id}?userId=${userId}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "deleteBlog",
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/blogs/${id}userId=${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getBlogDetailById = createAsyncThunk(
  "getBlogDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/blogs/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getClientBlogList = createAsyncThunk(
  "getClientBlogList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/client/blogs`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getClientBlogDetailBySlug = createAsyncThunk(
  "getClientBlogDetailBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/client/blogs/${slug}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const addBlogFAQS = createAsyncThunk(
  "addBlogFAQS",
  async ({ blogId, userId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/blogs/${blogId}/faqs?userId=${userId}`,
        data
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const updateBlogFAQS = createAsyncThunk(
  "updateBlogFAQS",
  async ({ blogId, faqId, userId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/blogs/${blogId}/faqs/${faqId}?userId=${userId}`,
        data
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const deleteBlogFAQ = createAsyncThunk(
  "deleteBlogFAQ",
  async ({ blogId, faqId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/blogs/${blogId}/faqs/${faqId}?userId=${userId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getBlogFaqsList = createAsyncThunk(
  "getBlogFaqsList",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/blogs/${blogId}/faqs`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getClientBlogFAQSList = createAsyncThunk(
  "getClientBlogFAQSList",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/client/blogs/${slug}/faqs`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);


export const getBlogs = createAsyncThunk(
  "getBlogs",
  async (pageNum = 0, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/blogs/getAllBlogs?page=${pageNum}&size=6&sortBy=postDate&direction=desc`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch blogs"
      );
    }
  }
);


const blogSlice = createSlice({
  name: "blogs",
  initialState: {
  loading: "",
  blogList: [],
  blogDetail: {},
  clientBlogList: [],
  clientBlogDetail: {},
  blogFaqList: [],
  clientBlogFAQList: [],
  blogsList: [],
  currPage: 0,
  totalPage: 0,
  totalElements: 0,
  first: true,
  last: false,
  error: null,
  
  },
  extraReducers: (builder) => {
    builder.addCase(getBlogList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getBlogList.fulfilled, (state, action) => {
      state.loading = "success";
      state.blogList = action.payload;
    });
    builder.addCase(getBlogList.rejected, (state) => {
      state.loading = "error";
    });

    builder.addCase(getBlogDetailById.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getBlogDetailById.fulfilled, (state, action) => {
      state.loading = "success";
      state.blogDetail = action.payload;
    });
    builder.addCase(getBlogDetailById.rejected, (state) => {
      state.loading = "error";
    });

    builder.addCase(getClientBlogList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getClientBlogList.fulfilled, (state, action) => {
      state.loading = "success";
      state.clientBlogList = action.payload;
    });
    builder.addCase(getClientBlogList.rejected, (state) => {
      state.loading = "error";
    });

    builder.addCase(getClientBlogDetailBySlug.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getClientBlogDetailBySlug.fulfilled, (state, action) => {
      state.loading = "success";
      state.clientBlogDetail = action.payload;
    });
    builder.addCase(getClientBlogDetailBySlug.rejected, (state) => {
      state.loading = "error";
    });
   
    builder.addCase(getBlogFaqsList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getBlogFaqsList.fulfilled, (state, action) => {
      state.loading = "success";
      state.blogFaqList = action.payload;
    });
    builder.addCase(getBlogFaqsList.rejected, (state) => {
      state.loading = "error";
    });

    builder.addCase(getClientBlogFAQSList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getClientBlogFAQSList.fulfilled, (state, action) => {
      state.loading = "success";
      state.clientBlogFAQList = action.payload;
    });
    builder.addCase(getClientBlogFAQSList.rejected, (state) => {
      state.loading = "error";
    });
    
    builder.addCase(getBlogs.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getBlogs.fulfilled, (state, action) => {
      state.loading = "success";
      state.blogsList = action.payload.content || [];
      state.currPage = action.payload.number || 0;
      state.totalPage = action.payload.totalPages || 0;
      state.totalElements = action.payload.totalElements || 0;
      state.first = action.payload.first ?? true;
      state.last = action.payload.last ?? false;
    });
    builder.addCase(getBlogs.rejected, (state) => {
      state.loading = "error";
    });

  },
});

export default blogSlice.reducer;
