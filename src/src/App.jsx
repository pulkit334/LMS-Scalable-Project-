import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom"; //
import Home from "./pages/Home";
import { Login } from "./components/core/Auth_frontend/Login";
import MainLayout from "./pages/MainLayout";
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
import AccountDeactivated from "./pages/AccountDeactivated";
import Authrecovery from "./pages/Auth-recovery";
import EmailVerification from "./pages/EmailVerification";
import Mycourses from "./pages/Mycourses";
import fetchCategories from "./services/ThunkApi/categoryThunk";
import Course from "./pages/course";
import { hydrateAuth } from "./appInit";
import OpenRoute from "./utils/openRoutes";
import EditCourse from "./components/core/Dashboard/editcourse";
import Catalog from "./pages/catalog";
import Coursebuy from "./components/core/Student/courseBuy";
import ViewDetails from "./components/core/ViewCourse/VedioDEtails";
import ViewCourses from "./pages/ViewCourses";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import Purchasehistory from "./components/core/Student/PaymentHistory/purchasehistory";
import Admin from "./pages/Adminpage/Admin";
import AdminLayout from "./components/Admin/AdminInsights";
import AdminRoute from "./components/Auth/AdminRoute";
import StudentGuard from "./components/Auth/studentonly";
import AdminInsights from "./components/Admin/Admin-Components/AdminInsightPage";
import Instructormangment from "./components/Admin/Admin-Components/Instructormangment";
import Admin_usermangemt from "./components/Admin/Admin-Components/Admin_usermangemt";
import Course_mangment from "./components/Admin/Admin-Components/Course_mangment";
import UserNotification from "./components/core/Notification/userNotification";
import { requestFCMToken, onMessageListner } from "./utils/firebaseutlis";
import { toast } from "react-toastify";
import { NotificationAuth } from "./services/Notificaiton/Notificaitonservice";
import TeacherLive from "./components/LiveClass/LiveTeacher";
import  Warning from "./utils/Warning"
import { GoogleOAuthProvider } from "@react-oauth/google";
import StudentLive from "./components/LiveClass/StudentLive";
function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);
  const status = useSelector((state) => state.profile.status);
  const role = user?.accountType?.trim()?.toLowerCase();

  useEffect(() => {
    if (token && !user) {
      restoreUser(dispatch);
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  useEffect(() => {
    hydrateAuth(dispatch);
  }, [dispatch]);

  //Notification usefffect
  useEffect(() => {
    onMessageListner((payload) => {
      console.log("Foreground notification:", payload);

      toast(
        <div>
          <strong>{payload?.notification?.title}</strong>
          <p>{payload?.notification?.body}</p>
        </div>,
      );
    });
  }, []);

  useEffect(() => {
    const setupFCM = async () => {
      try {
        if (!token || !user) return;

        const fcmToken = await requestFCMToken();
        if (!fcmToken) return;

   

        await NotificationAuth(fcmToken);
      } catch (err) {
        console.error("FCM setup failed:", err);
      }
    };

    setupFCM();
  }, [token, user]);

 return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <div className="w-screen min-h-screen flex flex-col font-inter">
      <Routes>
        {/* PUBLIC LAYOUT */}
        <Route element={<MainLayout />}>
          {/* ADMIN REDIRECT HANDLED HERE */}
          <Route
            path="/"
            element={
              role === ACCOUNT_TYPE.ADMIN ? (
                <Navigate to="/admin/insight" replace />
              ) : (
                <Home />
              )
            }
          />

          <Route path="/signup" element={<Signup />} />
          <Route path="/catalog/:catalogName" element={<Catalog />} />
          <Route
            path="/user/view-notifications"
            element={<UserNotification />}
          />
          <Route
            path="/login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/account-deactivated" element={<AccountDeactivated />} />
          <Route
            path="/support/reactivate-account"
            element={<Authrecovery />}
          />
          <Route path="/courses/:Course" element={<Coursebuy />} />
          <Route
            path="/recover-account/:token"
            element={<EmailVerification />}
          />
          <Route path="/contact" element={<Contactus />} />
          <Route path="/google-auth" element={<GoogleAuth />} />
          <Route path="/about" element={<About />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password/:token" element={<UpdatePassword />} />

          <Route path="*" element={<Error />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<MyProfile />} />
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="settings" element={<EditProfile />} />
            <Route path="edit-course/:courseId" element={<EditCourse />} />

            {/* STUDENT ONLY */}
            <Route
              path="cart"
              element={
                <StudentGuard>
                  <Cart />
                </StudentGuard>
              }
            />

            <Route
              path="enrolled-courses"
              element={
                <StudentGuard>
                  <EnrolledCourses />
                </StudentGuard>
              }
            />

            <Route
              path="purchase-history"
              element={
                <StudentGuard>
                  <Purchasehistory />
                </StudentGuard>
              }
            />

            {/* INSTRUCTOR / ADMIN */}
            <Route path="instructor" element={<Instructor />} />
            <Route path="my-courses" element={<Mycourses />} />
            <Route path="add-course" element={<Course />} />
          </Route>

          {/* VIEW COURSE */}
          <Route
            element={
              <PrivateRoute>
                <ViewCourses />
              </PrivateRoute>
            }
          >
            <Route
              path="view-course/:courseId/section/:sectionId"
              element={
                <StudentGuard>
                  <ViewDetails />
                </StudentGuard>
              }
            />

            <Route
              path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={
                <StudentGuard>
                  <ViewDetails />
                </StudentGuard>
              }
            />
          </Route>
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        >
          {/* sidebar layout */}
          <Route element={<AdminLayout />}>
            <Route path="insight" element={<AdminInsights />} />
            <Route path="instructors" element={<Instructormangment />} />
            <Route path="users" element={<Admin_usermangemt />} />
            <Route path="courses" element={<Course_mangment />} />
          </Route>
        </Route>
     

       {/* Live  Class APi */}

       <Route path="/live/:classId/start" element = { role === ACCOUNT_TYPE.INSTRUCTOR ?    <TeacherLive/> : <Warning/>}/>
      <Route path="/live/:classId/watch" element={<StudentLive />} />
      </Routes>
    </div>
    </GoogleOAuthProvider>
  );
}

export default App;
