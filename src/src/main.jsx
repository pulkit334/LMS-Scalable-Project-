import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // FIX
import App from "./App";
import store, { persistor } from "./store/store";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { EnrollmentProvider } from "./context/EnrollmentCourseContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate  loading={null} persistor={persistor}>
          <Toaster position="top-center" reverseOrder={false} />
          <EnrollmentProvider>
            <App  />
          </EnrollmentProvider>
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
