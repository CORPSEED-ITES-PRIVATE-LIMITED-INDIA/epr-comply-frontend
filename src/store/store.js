import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import authReducer from "./slices/authSlice";
import serviceReducer from "./slices/serviceSlice";
import blogReducer from "./slices/blogSlice";
import settingReducer from "./slices/settingSlice";

/**
 * redux-persist reaches for `localStorage` at import time, which does not exist
 * while the admin shell is server-rendered. Fall back to a no-op store there
 * and let the real one take over once hydration happens in the browser.
 */
const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
};

const storage =
  typeof window !== "undefined" ? createWebStorage("local") : noopStorage;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  service: serviceReducer,
  blogs: blogReducer,
  setting: settingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
