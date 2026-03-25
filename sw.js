// Service Worker
self.addEventListener('install', function(event) {
    console.log('Service Worker نصب کرا');
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker چالاک کرا');
    event.waitUntil(clients.claim());
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function(clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});
