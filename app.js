// Sample Menu Data
const sampleMenuData = {
    "main-mess": {
        sunday: {
            breakfast: [{ name: "Idli & Sambar", type: "veg" }],
            lunch: [{ name: "Rice & Dal Tadka", type: "veg" }],
            snacks: [{ name: "Samosa", type: "veg" }],
            dinner: [{ name: "Paneer Butter Masala", type: "veg" }]
        },
        monday: {
            breakfast: [{ name: "Poha", type: "veg" }],
            lunch: [{ name: "Rajma & Rice", type: "veg" }],
            snacks: [{ name: "Pakora", type: "veg" }],
            dinner: [{ name: "Chicken Curry", type: "non-veg" }]
        },
        tuesday: {
            breakfast: [{ name: "Upma", type: "veg" }],
            lunch: [{ name: "Chole Bhature", type: "veg" }],
            snacks: [{ name: "Bread Pakora", type: "veg" }],
            dinner: [{ name: "Mix Veg", type: "veg" }]
        },
        wednesday: {
            breakfast: [{ name: "Aloo Paratha", type: "veg" }],
            lunch: [{ name: "Fish Curry & Rice", type: "non-veg" }],
            snacks: [{ name: "Bun Maska", type: "veg" }],
            dinner: [{ name: "Kadhi Pakora", type: "veg" }]
        },
        thursday: {
            breakfast: [{ name: "Dosa", type: "veg" }],
            lunch: [{ name: "Biryani", type: "veg" }],
            snacks: [{ name: "Vada Pav", type: "veg" }],
            dinner: [{ name: "Egg Curry", type: "non-veg" }]
        },
        friday: {
            breakfast: [{ name: "Puri Bhaji", type: "veg" }],
            lunch: [{ name: "Mutton Curry", type: "non-veg" }],
            snacks: [{ name: "Spring Roll", type: "veg" }],
            dinner: [{ name: "Palak Paneer", type: "veg" }]
        },
        saturday: {
            breakfast: [{ name: "Special Breakfast", type: "veg" }],
            lunch: [{ name: "Special Thali", type: "veg" }],
            snacks: [{ name: "Pizza", type: "veg" }],
            dinner: [{ name: "Dal Makhani", type: "veg" }]
        }
    },
    "special-mess": {
        sunday: { breakfast: [{ name: "Pancakes", type: "veg" }], lunch: [{ name: "Tandoori Chicken", type: "non-veg" }], snacks: [{ name: "Momos", type: "veg" }], dinner: [{ name: "Fried Rice", type: "veg" }] },
        monday: { breakfast: [{ name: "Oats", type: "veg" }], lunch: [{ name: "Pasta", type: "veg" }], snacks: [{ name: "Cheese Toast", type: "veg" }], dinner: [{ name: "Thai Curry", type: "veg" }] },
        tuesday: { breakfast: [{ name: "Eggs", type: "non-veg" }], lunch: [{ name: "Tandoori Chicken", type: "non-veg" }], snacks: [{ name: "Fries", type: "veg" }], dinner: [{ name: "Barbecue", type: "non-veg" }] },
        wednesday: { breakfast: [{ name: "Cornflakes", type: "veg" }], lunch: [{ name: "Keema", type: "non-veg" }], snacks: [{ name: "Cutlet", type: "veg" }], dinner: [{ name: "Dum Biryani", type: "non-veg" }] },
        thursday: { breakfast: [{ name: "Waffles", type: "veg" }], lunch: [{ name: "Grill Chicken", type: "non-veg" }], snacks: [{ name: "Brownie", type: "veg" }], dinner: [{ name: "Shrimp", type: "non-veg" }] },
        friday: { breakfast: [{ name: "French Toast", type: "non-veg" }], lunch: [{ name: "Mixed Grill", type: "non-veg" }], snacks: [{ name: "Ice Cream", type: "veg" }], dinner: [{ name: "Surf & Turf", type: "non-veg" }] },
        saturday: { breakfast: [{ name: "Full Breakfast", type: "non-veg" }], lunch: [{ name: "Roast Chicken", type: "non-veg" }], snacks: [{ name: "Churro", type: "veg" }], dinner: [{ name: "Fish & Chips", type: "non-veg" }] }
    },
    "hostel-1-mess": {
        sunday: { breakfast: [{ name: "Eggs", type: "non-veg" }], lunch: [{ name: "Mix Veg", type: "veg" }], snacks: [{ name: "Biscuits", type: "veg" }], dinner: [{ name: "Rice & Sambar", type: "veg" }] },
        monday: { breakfast: [{ name: "Paratha", type: "veg" }], lunch: [{ name: "Rajma", type: "veg" }], snacks: [{ name: "Popcorn", type: "veg" }], dinner: [{ name: "Roti & Aloo Gobi", type: "veg" }] },
        tuesday: { breakfast: [{ name: "Idli", type: "veg" }], lunch: [{ name: "Fish", type: "non-veg" }], snacks: [{ name: "Chips", type: "veg" }], dinner: [{ name: "Dal & Roti", type: "veg" }] },
        wednesday: { breakfast: [{ name: "Dosa", type: "veg" }], lunch: [{ name: "Chicken", type: "non-veg" }], snacks: [{ name: "Cake", type: "veg" }], dinner: [{ name: "Roti & Paneer", type: "veg" }] },
        thursday: { breakfast: [{ name: "Upma", type: "veg" }], lunch: [{ name: "Meat Curry", type: "non-veg" }], snacks: [{ name: "Samosa", type: "veg" }], dinner: [{ name: "Dal & Rice", type: "veg" }] },
        friday: { breakfast: [{ name: "Puri", type: "veg" }], lunch: [{ name: "Biryani", type: "veg" }], snacks: [{ name: "Jalebi", type: "veg" }], dinner: [{ name: "Rice & Dal", type: "veg" }] },
        saturday: { breakfast: [{ name: "Special", type: "veg" }], lunch: [{ name: "Special Curry", type: "veg" }], snacks: [{ name: "Sweets", type: "veg" }], dinner: [{ name: "Roti & Mix Veg", type: "veg" }] }
    },
    "hostel-2-mess": {
        sunday: { breakfast: [{ name: "Cereal", type: "veg" }], lunch: [{ name: "Noodles", type: "veg" }], snacks: [{ name: "Tea & Biscuit", type: "veg" }], dinner: [{ name: "Rice & Dal", type: "veg" }] },
        monday: { breakfast: [{ name: "Bread", type: "veg" }], lunch: [{ name: "Pasta", type: "veg" }], snacks: [{ name: "Snack Bar", type: "veg" }], dinner: [{ name: "Roti & Aloo", type: "veg" }] },
        tuesday: { breakfast: [{ name: "Omelette", type: "non-veg" }], lunch: [{ name: "Hakka", type: "veg" }], snacks: [{ name: "Cookies", type: "veg" }], dinner: [{ name: "Dal & Rice", type: "veg" }] },
        wednesday: { breakfast: [{ name: "Cheese Toast", type: "veg" }], lunch: [{ name: "Fried Rice", type: "veg" }], snacks: [{ name: "Wafer", type: "veg" }], dinner: [{ name: "Roti & Sabzi", type: "veg" }] },
        thursday: { breakfast: [{ name: "Pancake", type: "veg" }], lunch: [{ name: "Pizza", type: "veg" }], snacks: [{ name: "Donut", type: "veg" }], dinner: [{ name: "Dal & Rice", type: "veg" }] },
        friday: { breakfast: [{ name: "Waffles", type: "veg" }], lunch: [{ name: "Tandoori", type: "veg" }], snacks: [{ name: "Icecream", type: "veg" }], dinner: [{ name: "Roti & Dal", type: "veg" }] },
        saturday: { breakfast: [{ name: "Full Platter", type: "veg" }], lunch: [{ name: "Special", type: "veg" }], snacks: [{ name: "Brownies", type: "veg" }], dinner: [{ name: "Dal Makhani", type: "veg" }] }
    }
};

// App State
let currentMess = 'main-mess';
let currentDay = 'sunday';

// Load menu data from localStorage or use sample data
let menuData = (() => {
    try {
        const stored = localStorage.getItem('menuData');
        if (stored) {
            const parsed = JSON.parse(stored);
            console.log('Loaded menu from localStorage');
            return parsed;
        }
    } catch (e) {
        console.error('Error reading localStorage:', e);
    }
    
    // Fallback to sample data
    console.log('Using sample data');
    localStorage.setItem('menuData', JSON.stringify(sampleMenuData));
    return sampleMenuData;
})();

// Day info
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayShort = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// DOM Elements
const splashScreen = document.getElementById('splash-screen');
const messSelect = document.getElementById('mess-select');
const dayPrevBtn = document.getElementById('day-prev');
const dayNextBtn = document.getElementById('day-next');
const dayDisplayName = document.getElementById('day-display-name');
const lastUpdated = document.getElementById('last-updated');

// Initialize on page load
window.addEventListener('load', () => {
    console.log('Page loaded, initializing app...');
    
    // Hide splash screen
    setTimeout(() => {
        if (splashScreen) {
            splashScreen.style.display = 'none';
        }
    }, 2200);

    // Set current day
    const today = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    currentDay = days[today.getDay()];
    console.log('Current day:', currentDay);

    // Update display
    updateDayDisplay();
    loadMenu();

    // Add event listeners
    if (messSelect) messSelect.addEventListener('change', handleMessChange);
    if (dayPrevBtn) dayPrevBtn.addEventListener('click', handlePrevDay);
    if (dayNextBtn) dayNextBtn.addEventListener('click', handleNextDay);

    // Check for updates from admin every 5 seconds
    setInterval(checkForUpdates, 5000);

    console.log('App initialized');
});

// Update day display
function updateDayDisplay() {
    const dayIndex = dayShort.indexOf(currentDay);
    if (dayDisplayName && dayIndex !== -1) {
        dayDisplayName.textContent = dayNames[dayIndex];
        console.log('Updated day display to:', dayNames[dayIndex]);
    }
}

// Handle mess change
function handleMessChange(e) {
    currentMess = e.target.value;
    console.log('Changed mess to:', currentMess);
    loadMenu();
}

// Handle next day
function handleNextDay() {
    let dayIndex = dayShort.indexOf(currentDay);
    dayIndex = (dayIndex + 1) % 7;
    currentDay = dayShort[dayIndex];
    console.log('Next day:', currentDay);
    updateDayDisplay();
    loadMenu();
}

// Handle previous day
function handlePrevDay() {
    let dayIndex = dayShort.indexOf(currentDay);
    dayIndex = (dayIndex - 1 + 7) % 7;
    currentDay = dayShort[dayIndex];
    console.log('Previous day:', currentDay);
    updateDayDisplay();
    loadMenu();
}

// Load menu
function loadMenu() {
    console.log('Loading menu for', currentMess, currentDay);
    
    if (menuData[currentMess] && menuData[currentMess][currentDay]) {
        const menu = menuData[currentMess][currentDay];
        
        updateMealSection('breakfast', menu.breakfast || []);
        updateMealSection('lunch', menu.lunch || []);
        updateMealSection('snacks', menu.snacks || []);
        updateMealSection('dinner', menu.dinner || []);
    }

    updateLastUpdatedTime();
}

// Update meal section
function updateMealSection(mealType, items) {
    const container = document.getElementById(mealType + '-items');
    
    if (!container) {
        console.log('Container not found:', mealType + '-items');
        return;
    }

    if (items.length === 0) {
        container.innerHTML = '<div class="menu-item-card"><div class="item-name">No items</div></div>';
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="menu-item-card">
            <div class="item-name">${item.name}</div>
            <div>
                ${item.type === 'veg' ? '<span class="item-badge badge-veg">VEG</span>' : ''}
                ${item.type === 'non-veg' ? '<span class="item-badge badge-non-veg">NON-VEG</span>' : ''}
            </div>
        </div>
    `).join('');
}

// Update time
function updateLastUpdatedTime() {
    if (lastUpdated) {
        const now = new Date();
        lastUpdated.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
}

// Check for updates from localStorage (admin changes)
function checkForUpdates() {
    try {
        const stored = localStorage.getItem('menuData');
        if (stored) {
            const newData = JSON.parse(stored);
            // Check if data has changed
            if (JSON.stringify(newData) !== JSON.stringify(menuData)) {
                menuData = newData;
                console.log('Menu updated from localStorage');
                loadMenu();
            }
        }
    } catch (e) {
        console.error('Error checking for updates:', e);
    }
}
