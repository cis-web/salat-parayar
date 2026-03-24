// Service Worker بۆ ئاگادارکردنەوەکان

self.addEventListener('install', function(event) {
    console.log('Service Worker نصب کرا');
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker چالاک کرا');
    event.waitUntil(clients.claim());
});

// کۆنتڕۆڵکردنی کلیکی ئاگادارکردنەوە
self.addEventListener('notificationclick', function(event) {
    console.log('ئاگادارکردنەوە کرتە کرا');
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function(clientList) {
                // ئەگەر پەنجەرەیەکی کراوە هەیە، بیخەرە پێشەوە
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url && 'focus' in client) {
                        return client.focus();
                    }
                }
                // ئەگەر نەبوو، پەنجەرەیەکی نوێ بکەرەوە
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});

// ئاگادارکردنەوە کاتێک وەردەگیرێت
self.addEventListener('notification', function(event) {
    console.log('ئاگادارکردنەوە وەرگیرا');
});
