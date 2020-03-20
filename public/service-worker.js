self.addEventListener('push', e => {
    const { title, body } = e.data.json();

    const notificationPromise = self.registration.showNotification(title, {
        body,
    });

    // https://developers.google.com/web/fundamentals/codelabs/push-notifications
    // "...extends the lifetime of the push event until the showNotification promise resolves. In general, we use the waitUntil method to ensure the service worker doesn't terminate before an asynchronous operation has completed."
    e.waitUntil(notificationPromise);
});