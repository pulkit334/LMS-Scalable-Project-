/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDlO__qF2NyUkis6684CO-xeiZE_61UAco",
  authDomain: "notification-d3fa5.firebaseapp.com",
  projectId: "notification-d3fa5",
  storageBucket: "notification-d3fa5.firebasestorage.app",
  messagingSenderId: "293753448104",
  appId: "1:293753448104:web:0ed03002f4cd5dfc5e449d",
  measurementId: "G-FMX0JW7LT4"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const title =
    payload.notification?.title ||
    payload.data?.title ||
    "New Notification";

  const body =
    payload.notification?.body ||
    payload.data?.body ||
    "You have a new message";

  const notificationOptions = {
    body,
    icon: "/download.png",
    badge: "/logo192.png",
    requireInteraction: true,
  };

  self.registration.showNotification(title, notificationOptions);
});


// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open') {
    // Open your app
    event.waitUntil(
      clients.openWindow('/') // Opens your app root
    );
  } else if (event.action === 'close') {
    // Just close the notification
    event.notification.close();
  } else {
    // Default action when notification body is clicked
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});