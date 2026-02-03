// Admin Dashboard JavaScript

// Demo credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Get stored menu data or use sample data from app.js
let menuData = JSON.parse(localStorage.getItem('menuData')) || {};

// Current selections
let currentMess = 'main-mess';
let currentDay = 'monday';

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const navItems = document.querySelectorAll('.nav-item');
const adminMessSelect = document.getElementById('admin-mess-select');
const adminDaySelect = document.getElementById('admin-day-select');
const saveMenuBtn = document.getElementById('save-menu-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Initialize
window.addEventListener('load', () => {
    checkAuth();
    setupEventListeners();
});

// Check authentication
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
}

// Setup event listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    
    navItems.forEach(item => {
        item.addEventListener('click', handleNavClick);
    });

    adminMessSelect.addEventListener('change', handleMessChange);
    adminDaySelect.addEventListener('change', handleDayChange);
    saveMenuBtn.addEventListener('click', handleSaveMenu);

    // Add item buttons
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', handleAddItem);
    });
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
        showToast('Login successful!', 'success');
    } else {
        showToast('Invalid credentials!', 'error');
    }
}

// Handle logout
function handleLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    loginScreen.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
    loginForm.reset();
    showToast('Logged out successfully', 'success');
}

// Show dashboard
function showDashboard() {
    loginScreen.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    loadMenuEditor();
}

// Handle navigation
function handleNavClick(e) {
    const targetSection = e.currentTarget.dataset.section;
    
    // Update nav items
    navItems.forEach(item => item.classList.remove('active'));
    e.currentTarget.classList.add('active');

    // Update sections
    document.querySelectorAll('.panel-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(targetSection).classList.add('active');
}

// Handle mess change
function handleMessChange(e) {
    currentMess = e.target.value;
    loadMenuEditor();
}

// Handle day change
function handleDayChange(e) {
    currentDay = e.target.value;
    loadMenuEditor();
}

// Load menu editor
function loadMenuEditor() {
    const meals = ['breakfast', 'lunch', 'snacks', 'dinner'];
    
    meals.forEach(meal => {
        const container = document.getElementById(`${meal}-editor`);
        const items = menuData[currentMess]?.[currentDay]?.[meal] || [];
        
        container.innerHTML = items.map((item, index) => createItemEditor(meal, item, index)).join('');
    });

    // Add delete event listeners
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', handleDeleteItem);
    });
}

// Create item editor HTML
function createItemEditor(meal, item, index) {
    return `
        <div class="item-editor" data-meal="${meal}" data-index="${index}">
            <div class="item-controls">
                <input type="text" 
                       class="item-name-input" 
                       value="${item.name}" 
                       placeholder="Item name"
                       data-field="name">
                <input type="text" 
                       class="item-description-input" 
                       value="${item.description || ''}" 
                       placeholder="Description"
                       data-field="description">
                <select class="item-type-select" data-field="type">
                    <option value="veg" ${item.type === 'veg' ? 'selected' : ''}>Veg</option>
                    <option value="non-veg" ${item.type === 'non-veg' ? 'selected' : ''}>Non-Veg</option>
                </select>
                <div class="checkbox-group">
                    <input type="checkbox" 
                           id="${meal}-${index}-special" 
                           ${item.special ? 'checked' : ''}
                           data-field="special">
                    <label for="${meal}-${index}-special">Special</label>
                </div>
                <button class="btn-delete" data-meal="${meal}" data-index="${index}">Delete</button>
            </div>
        </div>
    `;
}

// Handle add item
function handleAddItem(e) {
    const meal = e.target.dataset.meal;
    
    // Initialize structure if it doesn't exist
    if (!menuData[currentMess]) {
        menuData[currentMess] = {};
    }
    if (!menuData[currentMess][currentDay]) {
        menuData[currentMess][currentDay] = {
            breakfast: [],
            lunch: [],
            snacks: [],
            dinner: []
        };
    }
    if (!menuData[currentMess][currentDay][meal]) {
        menuData[currentMess][currentDay][meal] = [];
    }

    // Add new item
    menuData[currentMess][currentDay][meal].push({
        name: 'New Item',
        description: '',
        type: 'veg',
        special: false
    });

    loadMenuEditor();
    showToast('Item added! Don\'t forget to save.', 'success');
}

// Handle delete item
function handleDeleteItem(e) {
    const meal = e.target.dataset.meal;
    const index = parseInt(e.target.dataset.index);

    if (confirm('Are you sure you want to delete this item?')) {
        menuData[currentMess][currentDay][meal].splice(index, 1);
        loadMenuEditor();
        showToast('Item deleted! Don\'t forget to save.', 'success');
    }
}

// Handle save menu
function handleSaveMenu() {
    // Collect all current values from inputs
    const meals = ['breakfast', 'lunch', 'snacks', 'dinner'];
    
    meals.forEach(meal => {
        const container = document.getElementById(`${meal}-editor`);
        const itemEditors = container.querySelectorAll('.item-editor');
        
        itemEditors.forEach((editor, index) => {
            const nameInput = editor.querySelector('[data-field="name"]');
            const descInput = editor.querySelector('[data-field="description"]');
            const typeSelect = editor.querySelector('[data-field="type"]');
            const specialCheckbox = editor.querySelector('[data-field="special"]');

            if (menuData[currentMess]?.[currentDay]?.[meal]?.[index]) {
                menuData[currentMess][currentDay][meal][index] = {
                    name: nameInput.value,
                    description: descInput.value,
                    type: typeSelect.value,
                    special: specialCheckbox.checked
                };
            }
        });
    });

    // Save to localStorage
    localStorage.setItem('menuData', JSON.stringify(menuData));
    
    // Update timestamp
    localStorage.setItem('lastUpdated', new Date().toISOString());

    showToast('Menu saved successfully! Changes are now live.', 'success');
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'menuData',
        newValue: JSON.stringify(menuData)
    }));
}

// Show toast notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Initialize menu data if empty
if (!localStorage.getItem('menuData')) {
    // Copy sample data from the main app
    const sampleData = {
        "main-mess": {
            monday: {
                breakfast: [
                    { name: "Idli & Sambar", description: "Steamed rice cakes with lentil curry", type: "veg" },
                    { name: "Chutney", description: "Coconut chutney", type: "veg" },
                    { name: "Tea/Coffee", description: "Hot beverages", type: "veg" }
                ],
                lunch: [
                    { name: "Rice", description: "Steamed white rice", type: "veg" },
                    { name: "Dal Tadka", description: "Yellow lentil curry", type: "veg" },
                    { name: "Mix Veg Curry", description: "Seasonal vegetables", type: "veg" },
                    { name: "Roti", description: "Whole wheat flatbread", type: "veg" },
                    { name: "Salad", description: "Fresh vegetables", type: "veg" }
                ],
                snacks: [
                    { name: "Samosa", description: "Crispy fried pastry", type: "veg" },
                    { name: "Tea", description: "Hot tea", type: "veg" }
                ],
                dinner: [
                    { name: "Roti/Rice", description: "Choice of flatbread or rice", type: "veg" },
                    { name: "Paneer Butter Masala", description: "Cottage cheese in tomato gravy", type: "veg", special: true },
                    { name: "Dal", description: "Lentil curry", type: "veg" },
                    { name: "Raita", description: "Yogurt side dish", type: "veg" }
                ]
            },
            tuesday: {
                breakfast: [
                    { name: "Poha", description: "Flattened rice with spices", type: "veg" },
                    { name: "Bread & Jam", description: "Toast with preserves", type: "veg" }
                ],
                lunch: [
                    { name: "Rice", description: "Steamed white rice", type: "veg" },
                    { name: "Rajma", description: "Kidney beans curry", type: "veg" }
                ],
                snacks: [
                    { name: "Pakora", description: "Mixed vegetable fritters", type: "veg" }
                ],
                dinner: [
                    { name: "Roti/Rice", description: "Choice of flatbread or rice", type: "veg" },
                    { name: "Chicken Curry", description: "Spicy chicken gravy", type: "non-veg", special: true }
                ]
            }
        },
        "special-mess": {},
        "hostel-1-mess": {},
        "hostel-2-mess": {}
    };

    localStorage.setItem('menuData', JSON.stringify(sampleData));
    menuData = sampleData;
}
