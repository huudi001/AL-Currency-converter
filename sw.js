const staticCacheName = 'assets-v1';
const allCaches = [
    staticCacheName
];

self.addEventListener('install', event => {
    
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            return cache.addAll([
                'https://huudi001.github.io/AL-Currency-converter/',
                'https://huudi001.github.io/AL-Currency-converter/index.html',
                'https://huudi001.github.io/AL-Currency-converter/js/index.js',
                'https://huudi001.github.io/AL-Currency-converter/images/currency-icon.png'
                
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

self.addEventListener('fetch', e => {
    console.log('[ServiceWorker] Fetch', e.request.url);

    let requestUrl = new URL(e.request.url);

    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            e.respondWith(caches.match('/index.html'));
            return;
        }
    }

    
    e.respondWith(
        
        caches.match(e.request)
            .then(response => {
                
                if (response) {
                    console.log("[ServiceWorker] Found in Cache", e.request.url, response);
                    
                    return response;
                }

                

                let requestClone = e.request.clone();
                return fetch(requestClone)
                    .then(response => {

                        if ( !response ) {
                            console.log("[ServiceWorker] No response from fetch ")
                            return response;
                        }

                        let responseClone = response.clone();

                        
                        caches.open(staticCacheName).then(cache => {

                            
                            cache.put(e.request, responseClone);
                            console.log('[ServiceWorker] New Data Cached', e.request.url);

                            
                            return response;

                        }); 

                    })
                    .catch(err => {
                        console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
                    });

            }) 
    ) 
})





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

