// web-push.js

// 1. Setup Firebase Messaging
if (typeof firebase === "undefined" || !firebase.messaging) {
    throw new Error("Firebase and Messaging SDK must be loaded before this file!");
}

const messaging = firebase.messaging();

// 2. Register service worker (needed for push)
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then(registration => {
                messaging.useServiceWorker(registration);
                //console.log("Service worker registered:", registration);
            })
            .catch(err => {
                console.error("Service worker registration failed:", err);
            });
    }
}

// 3. Request permission and get FCM token
function subscribeForPushNotifications() {
    registerServiceWorker();

    messaging.requestPermission()
        .then(() => messaging.getToken({ vapidKey: 'BAUZnuNjH_QWiWcumNwqtFZtjkd7BasgXQvFufDmZTgw_QnfyzneF8XHc0wuS5MRvrdSQUAZ2brKtD3qiMMq5ZI' }))
        .then(token => {
            // You should send this token to your server/db for later use!
            console.log("Push notification permission granted. Token:", token);
            // Optionally save to Firestore, or a global variable, etc.
            window.currentPushToken = token;
        })
        .catch(err => {
            console.warn("Push notification permission denied or failed:", err);
        });
}

// 4. Listen for incoming messages (foreground)
messaging.onMessage(payload => {
    // Show a toast or display notification
    if (payload.notification) {
        alert("🔔 " + payload.notification.title + "\n" + payload.notification.body);
    }
});

// 5. Utility: Show a notification (to current user only)
function sendLocalTestNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    }
}

// 6. Utility: Send push notification via FCM (requires backend for other users)
async function sendBedNotification({ title, body, roomId, bedIndex, type }) {
    // This only works for current client (browsers can't push to other clients directly!)
    sendLocalTestNotification(title, body);

    // In production, you would POST to your backend, and your backend would call the FCM API.
    // Example payload for backend:
    /*
    await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title, body, roomId, bedIndex, type,
            // and ideally, target tokens for all interested clients!
        })
    });
    */
}

// Export functions to window for use in HTML/inline scripts
window.subscribeForPushNotifications = subscribeForPushNotifications;
window.sendBedNotification = sendBedNotification;
