// ==========================================
// NITT Mess Menu - Service Worker
// Offline Support & Caching Strategy
// ==========================================

const CACHE_NAME = 'nitt-menu-v1';
const RUNTIME_CACHE = 'nitt-runtime-v1';

// Files to cache for offline support
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// ==========================================
// INSTALL EVENT
// Cache static assets
// ==========================================

self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker: Installation complete');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('❌ Service Worker: Installation failed', error);
            })
    );
});

// ==========================================
// ACTIVATE EVENT
// Clean up old caches
// ==========================================

self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activation complete');
                return self.clients.claim(); // Take control immediately
            })
    );
});

// ==========================================
// FETCH EVENT
// Network-first strategy for API calls
// Cache-first strategy for static assets
// ==========================================

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle API requests (Google Sheets)
    if (url.hostname === 'sheets.googleapis.com') {
        event.respondWith(networkFirstStrategy(request));
        return;
    }
    
    // Handle static assets
    event.respondWith(cacheFirstStrategy(request));
});

// ==========================================
// CACHING STRATEGIES
// ==========================================

// Network-first: Try network, fallback to cache
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('📡 Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page or error response
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'No cached data available'
            }),
            {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Cache-first: Try cache, fallback to network
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Update cache in background
        fetchAndCache(request);
        return cachedResponse;
    }
    
    // Not in cache, fetch from network
    try {
        const networkResponse = await fetch(request);
        
        // Cache the response
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Failed to fetch:', request.url, error);
        
        // Return offline fallback if available
        return caches.match('/index.html');
    }
}

// Background fetch and cache update
async function fetchAndCache(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response);
        }
    } catch (error) {
        // Silently fail - cache update is not critical
    }
}

// ==========================================
// MESSAGE HANDLER
// Communication with main app
// ==========================================

self.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

// ==========================================
// PUSH NOTIFICATIONS
// Handle push events for meal reminders
// ==========================================

self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Check today\'s mess menu',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        vibrate: [200, 100, 200],
        tag: 'meal-reminder',
        actions: [
            {
                action: 'view',
                title: 'View Menu'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('NITT Mess Menu', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// ==========================================
// BACKGROUND SYNC
// Sync data when connection is restored
// ==========================================

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-menu') {
        event.waitUntil(syncMenuData());
    }
});

async function syncMenuData() {
    console.log('🔄 Background sync: Updating menu data');
    // Implement sync logic here
    // This would typically notify the main app to refresh data
}

// ==========================================
// PERIODIC BACKGROUND SYNC
// Auto-update menu at intervals
// ==========================================

self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-menu') {
        event.waitUntil(updateMenuPeriodically());
    }
});

async function updateMenuPeriodically() {
    console.log('⏰ Periodic sync: Checking for menu updates');
    // Implement periodic update logic
}

console.log('✅ Service Worker script loaded');
