// web-push.js

if (!firebase || !firebase.messaging) {
  throw new Error("Firebase and Messaging SDK must be loaded before this file!");
}

const messaging = firebase.messaging();

function subscribeForPushNotifications() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);

        // Now prompt for notification permission
        if (Notification.permission === "granted") {
          getTokenAndSave(registration);
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              getTokenAndSave(registration);
            } else {
              alert("Notifications are blocked.");
            }
          });
        } else {
          alert("Notifications are blocked in your browser settings.");
        }

      }).catch(function(err) {
        console.error("Service Worker registration failed:", err);
      });
  } else {
    alert("Service workers are not supported in this browser.");
  }
}

function getTokenAndSave(registration) {
  messaging.getToken({
    vapidKey: 'BAUZnuNjH_QWiWcumNwqtFZtjkd7BasgXQvFufDmZTgw_QnfyzneF8XHc0wuS5MRvrdSQUAZ2brKtD3qiMMq5ZI',
    serviceWorkerRegistration: registration
  }).then((currentToken) => {
    if (currentToken) {
      console.log("Notification token:", currentToken);
      // Save token to your Firestore or use as needed
    } else {
      console.warn("No registration token available.");
    }
  }).catch((err) => {
    console.error("An error occurred while retrieving token.", err);
  });
}

function sendBedNotification({title, body, roomId, bedIndex, type}) {
  // Only notify if permission is granted
  if (Notification.permission === "granted") {
    // Optional: use a service worker if registered (for best results on Chrome)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(function(reg) {
        if (reg) {
          reg.showNotification(title, {
            body: body,
            icon: 'https://cdn-icons-png.flaticon.com/512/196/196594.png', // ICU/hospital icon or any icon
            data: { roomId, bedIndex, type }
          });
        } else {
          // fallback to direct Notification
          new Notification(title, {
            body: body,
            icon: 'https://cdn-icons-png.flaticon.com/512/196/196594.png'
          });
        }
      });
    } else {
      new Notification(title, {
        body: body,
        icon: 'https://cdn-icons-png.flaticon.com/512/196/196594.png'
      });
    }
  } else {
    // Optionally request permission
    // Notification.requestPermission();
    // or just do nothing
  }
}

window.subscribeForPushNotifications = subscribeForPushNotifications;
