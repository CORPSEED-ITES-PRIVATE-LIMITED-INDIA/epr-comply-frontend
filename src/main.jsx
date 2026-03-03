import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Loader from "./components/Loader";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./toolkit/store.js";
import { ToastProvider } from "./components/ToastProvider.jsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <div className="overflow-x-hidden md:overflow-x-visible">
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={<Loader />} persistor={persistor}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </div>
);
