import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { HelmetProvider } from "react-helmet-async";   // ⭐ add this

import { router } from "./routes/Router.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { Provider } from "react-redux";
import store from "./redux/Store.js";
import AuthInitializer from "./components/AuthInitializer.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthInitializer>
          <HelmetProvider>
                      <RouterProvider router={router} />
          {/* Global Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          </HelmetProvider>
        </AuthInitializer>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
