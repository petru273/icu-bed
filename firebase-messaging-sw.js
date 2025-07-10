// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAhoL_pZudfm53_6tuzgoCGsWOagL6AjZ8",
  authDomain: "icubedtracker.firebaseapp.com",
  projectId: "icubedtracker",
  storageBucket: "icubedtracker.firebasestorage.app",
  messagingSenderId: "237624609130",
  appId: "1:237624609130:web:0f39d97d24443907f1bd13"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(
    payload.notification.title,
    { body: payload.notification.body }
  );
});
