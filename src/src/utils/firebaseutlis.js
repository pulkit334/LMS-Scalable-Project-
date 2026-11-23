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

let messaging = null

try {
  messaging = getMessaging(app)
} catch(err) {
  console.log('Firebase messaging not supported on HTTP',err)
}

export const requestFCMToken = async () => {
  if (!messaging) return null  // ← guard check!

  const permission = await Notification.requestPermission()
  if (permission !== "granted") throw new Error("Notification not granted")

  return getToken(messaging, {
    vapidKey: 'BDgUnloUtRuE7AjsTrwfWS5oXtKM81TEoOiwCVkQEL2pKxFBfEuPO6nt1T-CUYTD4g73nzbo-GiAAJftrCZlqQ8',
  })
}

export const onMessageListner = (callback) => {
  if (!messaging) return  // ← guard check!
  
  onMessage(messaging, (payload) => {
    callback(payload)
  })
}