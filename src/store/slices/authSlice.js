import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../lib/http";

/**
 * The admin shell is a client bundle, but Next still renders it once on the
 * server where there is no localStorage - so every read is guarded.
 */
const readStored = (key) => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key) || null;
  } catch {
    return null;
  }
};

const readStoredJson = (key) => {
  const raw = readStored(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/login", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/logout");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: readStored("token"),
    user: readStoredJson("user"),
    error: null,
    loading: false,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const userData = action.payload.user;
        const token = action.payload.user.uuid;
        state.user = userData;
        state.token = token;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
