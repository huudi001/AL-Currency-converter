const staticCacheName = 'assets-v1';
const allCaches = [
    staticCacheName
];

self.addEventListener('install', event => {
    
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            return cache.addAll([
                '/huudi001.github.io/',
                '/huudi001.github.io/index.html',
                '/huudi001.github.io/js/index.js',
                '/huudi001.github.io/css/style.css',
            ]).then(() => self.skipWaiting());
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    cacheName.startsWith('assets-') && !allCaches.includes(cacheName);
                }).map(cacheName => caches.delete(cacheName))
            )
        })
    );
});




self.addEventListener('fetch', event => {
    let requestUrl = new URL(event.request.url);

    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            event.respondWith(caches.match('/index.html'));
            return;
        }
    }

    event.respondWith(
      
        caches.match(event.request).then(res => {
            return res || fetch(event.request)
        })

    );
});

