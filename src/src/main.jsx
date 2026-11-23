import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store, { persistor } from "./store/store";
import "./index.css";
import toast, { Toaster, ToastBar } from "react-hot-toast";
import { EnrollmentProvider } from "./context/EnrollmentCourseContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PersistGate loading={null} persistor={persistor}>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: "#0f172a",
                  color: "#f8fafc",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  fontSize: "13px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
                },
              }}
            >
              {(t) => (
                <ToastBar toast={t}>
                  {({ icon, message }) => (
                    <div className="flex items-center gap-2">
                      {icon}
                      <span className="flex-1">{message}</span>
                      {t.type !== "loading" && (
                        <button
                          onClick={() => toast.dismiss(t.id)}
                          aria-label="Close notification"
                          className="ml-1.5 w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-xs leading-none"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  )}
                </ToastBar>
              )}
            </Toaster>
            <EnrollmentProvider>
              <GoogleOAuthProvider>
                <App />
              </GoogleOAuthProvider>
            </EnrollmentProvider>
          </PersistGate>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
