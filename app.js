// ==========================================
// NITT Mess Menu PWA - Main Application
// Google Sheets Integration & PWA Features
// ==========================================

// Configuration
const CONFIG = {
    // Google Sheets Configuration
    // Replace with your Google Sheets ID and API Key
    GOOGLE_SHEETS_ID: '1jm7ykHxqB8w6FUOSj7pAcshpsS9cu6tkMXABcrLJk1cE',
    GOOGLE_API_KEY: 'AIzaSyCvmeBF2Ts_rUFnZ--hMOlBbw_ZypEel7s',
    SHEET_RANGE: 'A:D', // Columns: Day, Meal Type, Time, Items
    
    // Cache Configuration
    CACHE_DURATION: 30 * 60 * 1000, // 30 minutes in milliseconds
    CACHE_KEY: 'nitt_menu_cache',
    CACHE_TIMESTAMP_KEY: 'nitt_menu_timestamp',
    
    // Notification Configuration
    NOTIFICATION_TIMES: {
        breakfast: '07:00',
        lunch: '12:30',
        snacks: '16:00',
        dinner: '19:30'
    }
};

// State Management
const state = {
    selectedMess: 'annapurna',
    selectedDay: getCurrentDay(),
    menuData: null,
    notificationsEnabled: false,
    isOnline: navigator.onLine,
    deferredPrompt: null
};

// DOM Elements
const elements = {
    messSelector: document.getElementById('messSelector'),
    dayButtons: document.querySelectorAll('.day-btn'),
    menuContainer: document.getElementById('menuContainer'),
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    emptyState: document.getElementById('emptyState'),
    offlineBanner: document.getElementById('offlineBanner'),
    errorMessage: document.getElementById('errorMessage'),
    lastUpdated: document.getElementById('lastUpdated'),
    refreshBtn: document.getElementById('refreshBtn'),
    retryBtn: document.getElementById('retryBtn'),
    notificationBtn: document.getElementById('notificationBtn'),
    notificationModal: document.getElementById('notificationModal'),
    installBanner: document.getElementById('installBanner'),
    installBtn: document.getElementById('installBtn'),
    closeBanner: document.getElementById('closeBanner')
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 NITT Mess Menu PWA Initialized');
    
    // Register Service Worker
    registerServiceWorker();
    
    // Setup Event Listeners
    setupEventListeners();
    
    // Initialize UI
    initializeUI();
    
    // Load Menu Data
    loadMenuData();
    
    // Check for updates periodically
    setInterval(checkForUpdates, CONFIG.CACHE_DURATION);
    
    // Setup PWA Install Prompt
    setupInstallPrompt();
    
    // Check notification permission
    checkNotificationPermission();
});

// ==========================================
// SERVICE WORKER REGISTRATION
// ==========================================

async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('service-worker.js');
            console.log('✅ Service Worker registered:', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                console.log('🔄 Service Worker update found');
            });
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    }
}

// ==========================================
// EVENT LISTENERS SETUP
// ==========================================

function setupEventListeners() {
    // Mess selector change
    elements.messSelector.addEventListener('change', (e) => {
        state.selectedMess = e.target.value;
        loadMenuData();
    });
    
    // Day selector buttons
    elements.dayButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const day = e.currentTarget.dataset.day;
            selectDay(day);
        });
    });
    
    // Refresh button
    elements.refreshBtn.addEventListener('click', () => {
        loadMenuData(true);
    });
    
    // Retry button
    elements.retryBtn.addEventListener('click', () => {
        loadMenuData(true);
    });
    
    // Notification button
    elements.notificationBtn.addEventListener('click', () => {
        elements.notificationModal.classList.remove('hidden');
    });
    
    // Modal buttons
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('enableNotifications').addEventListener('click', enableNotifications);
    document.getElementById('cancelNotifications').addEventListener('click', closeModal);
    
    // Install banner
    elements.closeBanner.addEventListener('click', () => {
        elements.installBanner.classList.add('hidden');
    });
    
    elements.installBtn.addEventListener('click', installApp);
    
    // Online/Offline detection
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
}

// ==========================================
// UI INITIALIZATION
// ==========================================

function initializeUI() {
    // Set current day as active
    const currentDay = getCurrentDay();
    selectDay(currentDay);
    
    // Update online/offline status
    updateOnlineStatus();
}

function selectDay(day) {
    state.selectedDay = day;
    
    // Update UI
    elements.dayButtons.forEach(btn => {
        if (btn.dataset.day === day) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Render menu
    renderMenu();
}

// ==========================================
// DATA FETCHING - GOOGLE SHEETS
// ==========================================

async function loadMenuData(forceRefresh = false) {
    // Show loading state
    showLoading();
    
    try {
        // Check cache first (if not forcing refresh)
        if (!forceRefresh) {
            const cachedData = getCachedData();
            if (cachedData) {
                console.log('📦 Using cached data');
                state.menuData = cachedData;
                renderMenu();
                updateLastUpdated(new Date(parseInt(localStorage.getItem(CONFIG.CACHE_TIMESTAMP_KEY))));
                return;
            }
        }
        
        // Fetch from Google Sheets
        if (!state.isOnline) {
            throw new Error('No internet connection');
        }
        
        const data = await fetchFromGoogleSheets();
        state.menuData = data;
        
        // Cache the data
        cacheData(data);
        
        // Render menu
        renderMenu();
        
        // Update timestamp
        updateLastUpdated(new Date());
        
        console.log('✅ Menu data loaded successfully');
        
    } catch (error) {
        console.error('❌ Error loading menu:', error);
        handleError(error);
    }
}

async function fetchFromGoogleSheets() {
    // If API key is not configured, use sample data
    if (CONFIG.GOOGLE_SHEETS_ID === 'YOUR_GOOGLE_SHEETS_ID_HERE' || 
        CONFIG.GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
        console.log('⚠️ Google Sheets not configured, using sample data');
        return getSampleData();
    }
    
    // Construct Google Sheets API URL
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.GOOGLE_SHEETS_ID}/values/${state.selectedMess}!${CONFIG.SHEET_RANGE}?key=${CONFIG.GOOGLE_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Parse the data
    return parseSheetData(result.values);
}

function parseSheetData(rows) {
    const menuData = {};
    
    // Skip header row
    for (let i = 1; i < rows.length; i++) {
        const [day, mealType, time, items] = rows[i];
        
        if (!day || !mealType || !items) continue;
        
        const dayLower = day.toLowerCase();
        
        if (!menuData[dayLower]) {
            menuData[dayLower] = {};
        }
        
        const mealLower = mealType.toLowerCase();
        menuData[dayLower][mealLower] = {
            time: time || 'N/A',
            items: items.split(',').map(item => item.trim())
        };
    }
    
    return menuData;
}

// ==========================================
// SAMPLE DATA (For Demo/Testing)
// ==========================================

function getSampleData() {
    return {
        monday: {
            breakfast: {
                time: '7:30 AM - 9:30 AM',
                items: ['Idli', 'Sambar', 'Coconut Chutney', 'Tea/Coffee']
            },
            lunch: {
                time: '12:30 PM - 2:30 PM',
                items: ['Rice', 'Sambar', 'Rasam', 'Curd', 'Vegetable Curry', 'Pickle']
            },
            snacks: {
                time: '4:00 PM - 5:30 PM',
                items: ['Bajji', 'Tea/Coffee']
            },
            dinner: {
                time: '7:30 PM - 9:30 PM',
                items: ['Chapati', 'Rice', 'Dal', 'Vegetable Curry', 'Curd']
            }
        },
        tuesday: {
            breakfast: {
                time: '7:30 AM - 9:30 AM',
                items: ['Pongal', 'Sambar', 'Chutney', 'Tea/Coffee']
            },
            lunch: {
                time: '12:30 PM - 2:30 PM',
                items: ['Rice', 'Sambar', 'Rasam', 'Curd', 'Paneer Butter Masala', 'Papad']
            },
            snacks: {
                time: '4:00 PM - 5:30 PM',
                items: ['Bonda', 'Tea/Coffee']
            },
            dinner: {
                time: '7:30 PM - 9:30 PM',
                items: ['Chapati', 'Rice', 'Dal Fry', 'Mixed Veg', 'Raita']
            }
        },
        wednesday: {
            breakfast: {
                time: '7:30 AM - 9:30 AM',
                items: ['Dosa', 'Sambar', 'Chutney', 'Tea/Coffee']
            },
            lunch: {
                time: '12:30 PM - 2:30 PM',
                items: ['Rice', 'Sambar', 'Rasam', 'Curd', 'Aloo Gobi', 'Pickle']
            },
            snacks: {
                time: '4:00 PM - 5:30 PM',
                items: ['Vada', 'Tea/Coffee']
            },
            dinner: {
                time: '7:30 PM - 9:30 PM',
                items: ['Chapati', 'Rice', 'Rajma', 'Vegetable Pulao', 'Raita']
            }
        },
        thursday: {
            breakfast: {
                time: '7:30 AM - 9:30 AM',
                items: ['Upma', 'Chutney', 'Banana', 'Tea/Coffee']
            },
            lunch: {
                time: '12:30 PM - 2:30 PM',
                items: ['Rice', 'Sambar', 'Rasam', 'Curd', 'Chana Masala', 'Papad']
            },
            snacks: {
                time: '4:00 PM - 5:30 PM',
                items: ['Cutlet', 'Tea/Coffee']
            },
            dinner: {
                time: '7:30 PM - 9:30 PM',
                items: ['Chapati', 'Rice', 'Dal Tadka', 'Bhindi Masala', 'Curd']
            }
        },
        friday: {
            breakfast: {
                time: '7:30 AM - 9:30 AM',
                items: ['Poha', 'Tea/Coffee']
            },
            lunch: {
                time: '12:30 PM - 2:30 PM',
                items: ['Rice', 'Sambar', 'Rasam', 'Curd', 'Veg Biryani', 'Raita']
            },
            snacks: {
                time: '4:00 PM - 5:30 PM',
                items: ['Samosa', 'Tea/Coffee']
            },
            dinner: {
                time: '7:30 PM - 9:30 PM',
                items: ['Chapati', 'Rice', 'Chole', 'Jeera Rice', 'Curd']
            }
        },
        saturday: {
            breakfast: {
                time: '7:30 AM - 9:30 AM',
                items: ['Paratha', 'Curd', 'Pickle', 'Tea/Coffee']
            },
            lunch: {
                time: '12:30 PM - 2:30 PM',
                items: ['Rice', 'Sambar', 'Rasam', 'Curd', 'Mushroom Curry', 'Papad']
            },
            snacks: {
                time: '4:00 PM - 5:30 PM',
                items: ['Pakoda', 'Tea/Coffee']
            },
            dinner: {
                time: '7:30 PM - 9:30 PM',
                items: ['Chapati', 'Rice', 'Dal Makhani', 'Palak Paneer', 'Raita']
            }
        },
        sunday: {
            breakfast: {
                time: '7:30 AM - 9:30 AM',
                items: ['Poori', 'Aloo Masala', 'Kesari', 'Tea/Coffee']
            },
            lunch: {
                time: '12:30 PM - 2:30 PM',
                items: ['Rice', 'Sambar', 'Rasam', 'Curd', 'Special Curry', 'Sweet', 'Papad']
            },
            snacks: {
                time: '4:00 PM - 5:30 PM',
                items: ['Biscuit', 'Tea/Coffee']
            },
            dinner: {
                time: '7:30 PM - 9:30 PM',
                items: ['Chapati', 'Rice', 'Dal', 'Mix Veg', 'Curd']
            }
        }
    };
}

// ==========================================
// RENDERING
// ==========================================

function renderMenu() {
    hideAllStates();
    
    if (!state.menuData) {
        elements.emptyState.classList.remove('hidden');
        return;
    }
    
    const dayMenu = state.menuData[state.selectedDay];
    
    if (!dayMenu || Object.keys(dayMenu).length === 0) {
        elements.emptyState.classList.remove('hidden');
        return;
    }
    
    // Clear container
    elements.menuContainer.innerHTML = '';
    
    // Meal order
    const mealOrder = ['breakfast', 'lunch', 'snacks', 'dinner'];
    const mealIcons = {
        breakfast: '🌅',
        lunch: '☀️',
        snacks: '🍪',
        dinner: '🌙'
    };
    const mealNames = {
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        snacks: 'Snacks',
        dinner: 'Dinner'
    };
    
    // Render each meal
    mealOrder.forEach(mealType => {
        if (dayMenu[mealType]) {
            const meal = dayMenu[mealType];
            const card = createMealCard(
                mealNames[mealType],
                mealIcons[mealType],
                meal.time,
                meal.items
            );
            elements.menuContainer.appendChild(card);
        }
    });
}

function createMealCard(name, icon, time, items) {
    const card = document.createElement('div');
    card.className = 'meal-card';
    
    card.innerHTML = `
        <div class="meal-header">
            <span class="meal-icon">${icon}</span>
            <div class="meal-info">
                <h3 class="meal-name">${name}</h3>
                <span class="meal-time">${time}</span>
            </div>
        </div>
        <div class="meal-items">
            ${items.map(item => `<div class="item">${item}</div>`).join('')}
        </div>
    `;
    
    return card;
}

// ==========================================
// UI STATE MANAGEMENT
// ==========================================

function showLoading() {
    hideAllStates();
    elements.loadingState.classList.remove('hidden');
}

function hideAllStates() {
    elements.loadingState.classList.add('hidden');
    elements.errorState.classList.add('hidden');
    elements.emptyState.classList.add('hidden');
}

function handleError(error) {
    hideAllStates();
    elements.errorState.classList.remove('hidden');
    elements.errorMessage.textContent = error.message || 'An error occurred while loading the menu';
}

function updateOnlineStatus() {
    if (state.isOnline) {
        elements.offlineBanner.classList.add('hidden');
    } else {
        elements.offlineBanner.classList.remove('hidden');
    }
}

function updateLastUpdated(date) {
    const timeString = date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const dateString = date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
    });
    elements.lastUpdated.textContent = `${dateString} at ${timeString}`;
}

// ==========================================
// CACHING
// ==========================================

function cacheData(data) {
    try {
        localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CONFIG.CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
        console.error('Failed to cache data:', error);
    }
}

function getCachedData() {
    try {
        const timestamp = localStorage.getItem(CONFIG.CACHE_TIMESTAMP_KEY);
        if (!timestamp) return null;
        
        const age = Date.now() - parseInt(timestamp);
        if (age > CONFIG.CACHE_DURATION) {
            console.log('Cache expired');
            return null;
        }
        
        const cached = localStorage.getItem(CONFIG.CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.error('Failed to retrieve cached data:', error);
        return null;
    }
}

// ==========================================
// NOTIFICATIONS
// ==========================================

function checkNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            state.notificationsEnabled = true;
            updateNotificationButton();
        }
    }
}

async function enableNotifications() {
    if (!('Notification' in window)) {
        alert('Your browser does not support notifications');
        closeModal();
        return;
    }
    
    try {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            state.notificationsEnabled = true;
            updateNotificationButton();
            scheduleNotifications();
            
            // Show confirmation notification
            new Notification('NITT Mess Menu', {
                body: 'Notifications enabled! You\'ll be reminded about meal times.',
                icon: 'icons/icon-192x192.png',
                badge: 'icons/icon-96x96.png'
            });
        }
        
        closeModal();
    } catch (error) {
        console.error('Error enabling notifications:', error);
        alert('Failed to enable notifications');
        closeModal();
    }
}

function updateNotificationButton() {
    if (state.notificationsEnabled) {
        elements.notificationBtn.classList.add('active');
        elements.notificationBtn.querySelector('.notification-status').textContent = 'On';
    } else {
        elements.notificationBtn.classList.remove('active');
        elements.notificationBtn.querySelector('.notification-status').textContent = 'Off';
    }
}

function scheduleNotifications() {
    // This is a simple implementation
    // For production, use Service Worker Push API or a proper scheduling library
    console.log('Notifications scheduled for meal times');
}

function closeModal() {
    elements.notificationModal.classList.add('hidden');
}

// ==========================================
// PWA INSTALLATION
// ==========================================

function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        state.deferredPrompt = e;
        
        // Show install banner
        elements.installBanner.classList.remove('hidden');
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA installed successfully');
        state.deferredPrompt = null;
        elements.installBanner.classList.add('hidden');
    });
}

async function installApp() {
    if (!state.deferredPrompt) {
        return;
    }
    
    state.deferredPrompt.prompt();
    
    const { outcome } = await state.deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    state.deferredPrompt = null;
    elements.installBanner.classList.add('hidden');
}

// ==========================================
// NETWORK STATUS
// ==========================================

function handleOnline() {
    state.isOnline = true;
    updateOnlineStatus();
    loadMenuData();
}

function handleOffline() {
    state.isOnline = false;
    updateOnlineStatus();
}

// ==========================================
// UTILITIES
// ==========================================

function getCurrentDay() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
}

function checkForUpdates() {
    if (state.isOnline) {
        console.log('🔄 Checking for updates...');
        loadMenuData(true);
    }
}

// ==========================================
// EXPORT FOR DEBUGGING (Dev Mode)
// ==========================================

window.nittApp = {
    state,
    config: CONFIG,
    reload: () => loadMenuData(true),
    clearCache: () => {
        localStorage.removeItem(CONFIG.CACHE_KEY);
        localStorage.removeItem(CONFIG.CACHE_TIMESTAMP_KEY);
        console.log('Cache cleared');
    }
};
