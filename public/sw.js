// Simple service worker for Zipline CI/CD
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // For now, just pass through all requests
    // You can add caching strategies here later if needed
});
