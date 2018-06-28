const staticCacheName = 'assets-v1';
const allCaches = [
    staticCacheName
];

self.addEventListener('install', e => {
    
    e.waitUntil(
        caches.open(staticCacheName).then(cache => {
            return cache.addAll([
                '/huudi001.github.io/',
                '/huudi001.github.io/index.html',
                '/huudi001.github.io/js/index.js',
                '/huudi001.github.io/css/style.css',
                'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css',
                'https://fonts.googleapis.com/css?family=Roboto:400,700'
            ]).then(() => self.skipWaiting());
        })
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
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
    var requestUrl = new URL(event.request.url);

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

