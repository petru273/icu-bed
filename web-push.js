// web-push.js

if (!firebase || !firebase.messaging) {
  throw new Error("Firebase and Messaging SDK must be loaded before this file!");
}
const messaging = firebase.messaging();

// Must be called after user gesture, e.g., button click or on load if you want to prompt immediately.
function subscribeForPushNotifications() {
  if (Notification.permission === "granted") {
    getTokenAndSave();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        getTokenAndSave();
      } else {
        alert("Notifications are blocked.");
      }
    });
  } else {
    alert("Notifications are blocked in your browser settings.");
  }
}

function getTokenAndSave() {
  messaging.getToken({
    vapidKey: 'BAUZnuNjH_QWiWcumNwqtFZtjkd7BasgXQvFufDmZTgw_QnfyzneF8XHc0wuS5MRvrdSQUAZ2brKtD3qiMMq5ZI' 
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

// Export if needed
window.subscribeForPushNotifications = subscribeForPushNotifications;
