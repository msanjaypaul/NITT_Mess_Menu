// Firebase Configuration and Real-time Updates
// This file provides Firebase setup instructions and implementation

/*
==========================================
FIREBASE SETUP INSTRUCTIONS
==========================================

1. Create a Firebase Project:
   - Go to https://firebase.google.com/
   - Click "Get Started" and create a new project
   - Name it something like "daily-gamble-mess-menu"

2. Enable Firestore Database:
   - In Firebase Console, go to "Firestore Database"
   - Click "Create Database"
   - Start in "Test Mode" for development (change to production rules later)
   - Choose a location close to your users

3. Get Firebase Configuration:
   - In Project Settings > General
   - Scroll to "Your apps" section
   - Click the web icon (</>)
   - Copy the firebaseConfig object

4. Replace the config in this file:
   - Paste your Firebase config below
   - Uncomment the Firebase initialization code

5. Add Firebase SDK to your HTML:
   Add these script tags before your app.js in index.html and admin.html:
   
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>

==========================================
*/

// STEP 1: Replace this with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
};

// STEP 2: Uncomment this when you have Firebase configured
/*
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Reference to the menu collection
const menuRef = db.collection('menus');

// Function to load menu from Firebase
async function loadMenuFromFirebase(mess, day) {
    try {
        const doc = await menuRef.doc(`${mess}_${day}`).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error('Error loading menu:', error);
        return null;
    }
}

// Function to save menu to Firebase
async function saveMenuToFirebase(mess, day, menuData) {
    try {
        await menuRef.doc(`${mess}_${day}`).set({
            mess: mess,
            day: day,
            meals: menuData,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error saving menu:', error);
        return false;
    }
}

// Function to listen for real-time updates
function listenForMenuUpdates(mess, day, callback) {
    return menuRef.doc(`${mess}_${day}`).onSnapshot((doc) => {
        if (doc.exists) {
            callback(doc.data());
        }
    }, (error) => {
        console.error('Error listening to updates:', error);
    });
}

// Integration with app.js
// Replace the loadMenu function in app.js with:
async function loadMenu() {
    const firebaseMenu = await loadMenuFromFirebase(currentMess, currentDay);
    
    if (firebaseMenu && firebaseMenu.meals) {
        // Use Firebase data
        updateMealSection('breakfast', firebaseMenu.meals.breakfast || []);
        updateMealSection('lunch', firebaseMenu.meals.lunch || []);
        updateMealSection('snacks', firebaseMenu.meals.snacks || []);
        updateMealSection('dinner', firebaseMenu.meals.dinner || []);
    } else {
        // Fallback to localStorage
        const menu = menuData[currentMess]?.[currentDay];
        if (menu) {
            updateMealSection('breakfast', menu.breakfast || []);
            updateMealSection('lunch', menu.lunch || []);
            updateMealSection('snacks', menu.snacks || []);
            updateMealSection('dinner', menu.dinner || []);
        }
    }
    
    updateLastUpdatedTime();
}

// Set up real-time listener
let unsubscribe = null;
function setupRealtimeUpdates() {
    if (unsubscribe) {
        unsubscribe(); // Unsubscribe from previous listener
    }
    
    unsubscribe = listenForMenuUpdates(currentMess, currentDay, (data) => {
        if (data && data.meals) {
            updateMealSection('breakfast', data.meals.breakfast || []);
            updateMealSection('lunch', data.meals.lunch || []);
            updateMealSection('snacks', data.meals.snacks || []);
            updateMealSection('dinner', data.meals.dinner || []);
            updateLastUpdatedTime();
            showUpdateNotification();
        }
    });
}

// Integration with admin.js
// Replace the handleSaveMenu function in admin.js with:
async function handleSaveMenu() {
    const meals = ['breakfast', 'lunch', 'snacks', 'dinner'];
    const menuToSave = {};
    
    meals.forEach(meal => {
        const container = document.getElementById(`${meal}-editor`);
        const itemEditors = container.querySelectorAll('.item-editor');
        const items = [];
        
        itemEditors.forEach((editor) => {
            const nameInput = editor.querySelector('[data-field="name"]');
            const descInput = editor.querySelector('[data-field="description"]');
            const typeSelect = editor.querySelector('[data-field="type"]');
            const specialCheckbox = editor.querySelector('[data-field="special"]');

            items.push({
                name: nameInput.value,
                description: descInput.value,
                type: typeSelect.value,
                special: specialCheckbox.checked
            });
        });
        
        menuToSave[meal] = items;
    });

    // Save to Firebase
    const success = await saveMenuToFirebase(currentMess, currentDay, menuToSave);
    
    if (success) {
        // Also save to localStorage as backup
        if (!menuData[currentMess]) {
            menuData[currentMess] = {};
        }
        if (!menuData[currentMess][currentDay]) {
            menuData[currentMess][currentDay] = {};
        }
        menuData[currentMess][currentDay] = menuToSave;
        localStorage.setItem('menuData', JSON.stringify(menuData));
        
        showToast('Menu saved successfully! Changes are now live.', 'success');
    } else {
        showToast('Error saving menu. Please try again.', 'error');
    }
}
*/

// STEP 3: Security Rules for Firestore
/*
Add these rules in Firebase Console > Firestore Database > Rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Menu collection - read by everyone, write by authenticated admins only
    match /menus/{menuId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}

For testing, you can use these permissive rules (NOT for production):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
*/

console.log('Firebase configuration file loaded. Follow instructions above to enable Firebase.');
