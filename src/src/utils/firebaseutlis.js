/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDlO__qF2NyUkis6684CO-xeiZE_61UAco",
  authDomain: "notification-d3fa5.firebaseapp.com",
  projectId: "notification-d3fa5",
  storageBucket: "notification-d3fa5.firebasestorage.app",
  messagingSenderId: "293753448104",
  appId: "1:293753448104:web:0ed03002f4cd5dfc5e449d",
  measurementId: "G-FMX0JW7LT4"
};


const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestFCMToken = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification not granted");
  }

  return getToken(messaging, {
    vapidKey: 'BDgUnloUtRuE7AjsTrwfWS5oXtKM81TEoOiwCVkQEL2pKxFBfEuPO6nt1T-CUYTD4g73nzbo-GiAAJftrCZlqQ8',
  });
};

// FIXED: This should set up a listener, not return a Promise
export const onMessageListner = (callback) => {
  onMessage(messaging, (payload) => {
    callback(payload);
  });
};