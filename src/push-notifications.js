import { updatePushNotificationSubscription } from "./api";

const VAPID_PUBLIC_KEY = 'BM5bTVwSadL32BFJaO7zmrTUd9NW1rksd6BxhTaf-vKmaPgJVTArkbB2GqkcVk6axyX7GI20bF1lrlugUanwaY8';

// https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#requesting_permission
// "..the API recently changed from taking a callback to returning a Promise... so you have to implement both and handle both"
export const requestNotificationsPermission = async () => {
    return new Promise((resolve, reject) => {
        const permissionResult = Notification.requestPermission(result => resolve(result));

        if (permissionResult) permissionResult.then(resolve, reject);
    }).then(permissionResult => {
        return permissionResult;
    });
};

// https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const subscribeToPushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    try {
        const registration = await navigator.serviceWorker.register('./service-worker.js', {
            scope: '/',
        });

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        updatePushNotificationSubscription(subscription);
    } catch (err) {
        console.error(`subscription to push notifications failed with err: ${JSON.stringify(err)}`);
    }
};