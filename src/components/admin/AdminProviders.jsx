"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store/store";
import { ToastProvider } from "@/components/ui/ToastProvider";

/**
 * Client boundary for the admin console. Everything behind it is a normal
 * Redux app, exactly as it was in the Vite build - none of this code is loaded
 * by the public site, so the marketing pages stay free of it.
 */
const AdminProviders = ({ children }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastProvider>{children}</ToastProvider>
    </PersistGate>
  </Provider>
);

export default AdminProviders;
