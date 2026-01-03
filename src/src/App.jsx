
// export default App;
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Login } from "./components/core/Auth_frontend/Login";
import MainLayout from "./pages/MainLayout";
import P1 from "./components/core/Auth_frontend/Profile/p1";
import { useDispatch, useSelector } from "react-redux";
import Signup from "./components/core/Auth_frontend/sinup";
import { restoreUser } from "./utils/restore";
import VerifyOtp from "./components/core/Auth_frontend/verify-otp";
import ForgotPassword from "./pages/forgotpassword";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/about";
import Contactus from "./pages/contactus";
import GoogleAuth from "./pages/GoogleAuth";
import MyProfile from "./components/core/Dashboard/myprofile";
import Dashboard from "./pages/dashboard";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Error from "./pages/Error";
import EditProfile from "./pages/setting";
import EnrolledCourses from "./components/core/Dashboard/EnroilledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import StudentOnly from "./Warning/one";
import AccountDeactivated from "./pages/AccountDeactivated";
import Authrecovery from "./pages/Auth-recovery";
import EmailVerification from "./pages/EmailVerification";
import Mycourses from "./pages/Mycourses";
import fetchCategories from "./services/ThunkApi/categoryThunk";
import Course from "./pages/course";
function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);
  const status = useSelector((state) => state.profile.status);
  useEffect(() => {
    if (token && !user) {
      restoreUser(dispatch);
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  });
  return (
    <div className="w-screen min-h-screen flex flex-col font-inter">
      <Routes>
        {/* Public layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/account-deactivated" element={<AccountDeactivated />} />
          <Route
            path="/support/reactivate-account"
            element={<Authrecovery />}
          />
          <Route
            path="/recover-account/:token"
            element={<EmailVerification />}
          />
          {/* <Route path="/dashboard/my-profile" element={<MyProfile/>} /> */}
          <Route path="/contact" element={<Contactus />} />
          <Route path="/google-auth" element={<GoogleAuth />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Error />} />

          {/* Auth */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password/:token" element={<UpdatePassword />} />

          {/*  PROTECTED DASHBOARD (FIXED) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="my-profile" element={<MyProfile />} />

            <Route path="settings" element={<EditProfile />} />
            {user?.accountType !== ACCOUNT_TYPE.STUDENT && (
              <Route path="cart" element={<StudentOnly />} />
            )}
            {user?.accountType !== ACCOUNT_TYPE.STUDENT && (
              <>
                {" "}
                <Route path="my-courses" element={<Mycourses />} />
                <Route path="add-course" element={<Course />} />
              </>
            )}
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="enrolled-courses" element={<EnrolledCourses />} />
                <Route path="cart" element={<Cart />} />
              </>
            )}
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
