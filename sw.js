/* ==================== درود — Service Worker ==================== */
'use strict';

const CACHE_NAME = 'droood-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    
    // CSS
    '/css/style.css',
    '/css/home.css',
    '/css/adhkar.css',
    '/css/dua.css',
    '/css/settings.css',
    
    // JS
    '/script.js',
    
    // ئایکۆنەکان
    '/icons/icon-32.png',
    '/icons/icon-180.png',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/apple-touch-icon.png',
    
    // فۆنتەکان
    'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap',
    'https://fonts.gstatic.com/s/notonaskharabic/v33/RrQ5bpV-9Dd1b1OAGA6M9PkyDuVBePeKNaxcsss0Y7bwvc5f.ttf'
];

// ==================== INSTALL ====================
self.addEventListener('install', event => {
    console.log('✅ Service Worker نصب دەبێت...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 کاش کردن فایلەکان...');
                return cache.addAll(ASSETS);
            })
            .then(() => {
                console.log('✅ هەموو فایلەکان کاش کران');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ هەڵە لە کاش کردن:', error);
            })
    );
});

// ==================== ACTIVATE ====================
self.addEventListener('activate', event => {
    console.log('✅ Service Worker چالاک دەبێت...');
    
    // پاککردنەوەی کاشە کۆنەکان
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ کاشی کۆن دەسڕدرێتەوە:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// ==================== FETCH (کارکردن بێ ئینتەرنێت) ====================
self.addEventListener('fetch', event => {
    // پشکنین بۆ ئەوەی تەنها فایلە خۆماڵیەکان کاش بکات
    if (event.request.url.startsWith('http') && !event.request.url.includes('chrome-extension')) {
        
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    // ئەگەر لە کاشدا هەیە، لە کاشەوە بدە
                    if (cachedResponse) {
                        // بەڵام هەوڵی نوێکردنەوە بدە
                        fetch(event.request)
                            .then(networkResponse => {
                                if (networkResponse && networkResponse.status === 200) {
                                    caches.open(CACHE_NAME).then(cache => {
                                        cache.put(event.request, networkResponse);
                                    });
                                }
                            })
                            .catch(() => {});
                        
                        return cachedResponse;
                    }
                    
                    // ئەگەر لە کاشدا نییە، لە ئینتەرنێتەوە وەربگرە
                    return fetch(event.request)
                        .then(networkResponse => {
                            // کاش کردنی وەڵامەکە بۆ جاری داهاتوو
                            if (networkResponse && networkResponse.status === 200) {
                                const responseClone = networkResponse.clone();
                                caches.open(CACHE_NAME).then(cache => {
                                    cache.put(event.request, responseClone);
                                });
                            }
                            return networkResponse;
                        })
                        .catch(error => {
                            console.log('❌ ئینتەرنێت نییە و فایل لە کاشدا نییە:', event.request.url);
                            
                            // ئەگەر فایلێکی HTML بوو، پەڕەی ئۆفلاین پیشان بدە
                            if (event.request.headers.get('accept').includes('text/html')) {
                                return caches.match('/offline.html');
                            }
                            
                            return new Response('ئینتەرنێت نییە', {
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: new Headers({
                                    'Content-Type': 'text/plain; charset=utf-8'
                                })
                            });
                        });
                })
        );
    }
});

// ==================== NOTIFICATION CLICK ====================
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            if (clientList.length > 0) {
                clientList[0].focus();
            } else {
                clients.openWindow('/');
            }
        })
    );
});

// ==================== PUSH NOTIFICATION ====================
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'کاتی نوێژ گەیشت!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [300, 100, 300],
        data: { url: '/' }
    };
    
    event.waitUntil(
        self.registration.showNotification('🕌 درود', options)
    );
});