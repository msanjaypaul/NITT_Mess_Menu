// Admin Panel Main Script
class AdminPanel {
  constructor() {
    this.currentMess = null;
    this.currentDay = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadDashboard();
    this.populateMesses();
  }

  setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.navigateTo(section);
      });
    });

    // Sync button
    document.getElementById('syncBtn').addEventListener('click', () => {
      this.publishMenuData();
    });

    // Menu toggle for mobile
    document.getElementById('menuToggle').addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('open');
    });

    // Close mobile menu when navigation occurs
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.remove('open');
      });
    });

    // Editor selectors
    document.getElementById('editorMessSelect').addEventListener('change', (e) => {
      this.currentMess = e.target.value;
    });

    document.getElementById('editorDaySelect').addEventListener('change', (e) => {
      this.currentDay = e.target.value;
    });
  }

  navigateTo(section) {
    // Update active section
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');

    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Update title
    const titles = {
      'dashboard': 'Dashboard',
      'menu-editor': 'Edit Menu',
      'mess-manager': 'Manage Messes',
      'export-import': 'Export/Import'
    };
    document.getElementById('sectionTitle').textContent = titles[section] || 'Dashboard';

    // Load section-specific content
    if (section === 'menu-editor') {
      this.populateEditorMesses();
    } else if (section === 'mess-manager') {
      this.populateMessesList();
    }
  }

  loadDashboard() {
    const stats = window.storageManager.getStatistics();
    
    document.getElementById('totalMesses').textContent = stats.totalMesses;
    document.getElementById('totalMenus').textContent = stats.totalMenuEntries;
    
    const lastUpdated = new Date(stats.lastUpdated);
    document.getElementById('lastUpdateTime').textContent = lastUpdated.toLocaleTimeString();

    // Load recent updates
    const updates = window.storageManager.getRecentUpdates();
    const updatesList = document.getElementById('recentUpdates');
    
    if (updates.length === 0) {
      updatesList.innerHTML = '<p class="placeholder">No updates yet</p>';
    } else {
      updatesList.innerHTML = updates.map(u => 
        `<div class="list-item">
          <span>${u.mess} - ${u.day} (${u.mealType})</span>
          <span>✓</span>
        </div>`
      ).join('');
    }

    // Update timestamp
    document.getElementById('lastUpdate').textContent = 
      `Last updated: ${lastUpdated.toLocaleString()}`;
  }

  populateMesses() {
    const messes = window.storageManager.getMesses();
    const select = document.getElementById('editorMessSelect');
    select.innerHTML = '<option value="">Select a mess...</option>';

    messes.forEach(mess => {
      const option = document.createElement('option');
      option.value = mess.id;
      option.textContent = mess.name;
      select.appendChild(option);
    });
  }

  populateEditorMesses() {
    const messes = window.storageManager.getMesses();
    const select = document.getElementById('editorMessSelect');
    select.innerHTML = '<option value="">Select a mess...</option>';

    messes.forEach(mess => {
      const option = document.createElement('option');
      option.value = mess.id;
      option.textContent = mess.name;
      select.appendChild(option);
    });
  }

  populateMessesList() {
    const messes = window.storageManager.getMesses();
    const messesList = document.getElementById('messesList');

    if (messes.length === 0) {
      messesList.innerHTML = '<p class="placeholder">No messes added yet</p>';
      return;
    }

    messesList.innerHTML = messes.map(mess => `
      <div class="list-item">
        <div>
          <div class="list-item-name">${mess.name}</div>
          <div style="font-size: 0.8rem; color: #757575;">${mess.id}</div>
        </div>
        <div class="list-item-actions">
          <button class="btn-delete" onclick="deleteMessConfirm('${mess.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }

  publishMenuData() {
    const data = window.storageManager.getData();
    
    // Format for the app
    const appData = {
      messes: data.messes,
      menu: data.menu
    };

    // Save to localStorage as API response
    localStorage.setItem('publishedMenuData', JSON.stringify(appData));

    // Also store in sessionStorage for immediate availability
    sessionStorage.setItem('menuDataUpdate', JSON.stringify(appData));

    this.showToast('Menu data published successfully!', 'success');
    
    // Simulate API call
    this.simulateAPIPublish(appData);
  }

  simulateAPIPublish(data) {
    // In production, this would POST to an API endpoint
    console.log('Publishing menu data:', data);
  }

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  showConfirm(title, message, callback) {
    const dialog = document.getElementById('confirmDialog');
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    
    dialog.style.display = 'flex';

    const confirmBtn = document.getElementById('confirmBtn');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', () => {
      callback();
      dialog.style.display = 'none';
    });
  }
}

// Global functions for menu editor
function loadMenuForEdit() {
  const messId = document.getElementById('editorMessSelect').value;
  const day = document.getElementById('editorDaySelect').value;

  if (!messId || !day) {
    document.getElementById('mealEditors').innerHTML = '<p class="placeholder">Please select a mess and day</p>';
    return;
  }

  const menuData = window.storageManager.getMenuForMessDay(messId, day);

  if (!menuData) {
    document.getElementById('mealEditors').innerHTML = '<p class="placeholder">No menu found</p>';
    return;
  }

  const mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  const editorsHTML = mealTypes.map(mealType => {
    const meal = menuData[mealType] || { time: '', items: [] };
    const itemsText = meal.items.join('\n');

    return `
      <div class="meal-editor">
        <h4>🍽️ ${mealType}</h4>
        <div class="meal-editor-group">
          <label>Time</label>
          <input type="text" class="meal-time-${mealType}" value="${meal.time}" placeholder="e.g., 7:00 AM - 9:00 AM">
        </div>
        <div class="meal-editor-group">
          <label>Items (one per line)</label>
          <textarea class="meal-items-${mealType}" placeholder="Item 1&#10;Item 2&#10;Item 3">${itemsText}</textarea>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('mealEditors').innerHTML = editorsHTML;
}

function saveMenuChanges() {
  const messId = document.getElementById('editorMessSelect').value;
  const day = document.getElementById('editorDaySelect').value;

  if (!messId || !day) {
    adminPanel.showToast('Please select a mess and day', 'error');
    return;
  }

  const mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  const menuData = {};

  mealTypes.forEach(mealType => {
    const time = document.querySelector(`.meal-time-${mealType}`).value;
    const itemsText = document.querySelector(`.meal-items-${mealType}`).value;
    const items = itemsText
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    menuData[mealType] = { time, items };
  });

  window.storageManager.updateMenuForMessDay(messId, day, menuData);
  adminPanel.showToast('Menu saved successfully!', 'success');
  adminPanel.loadDashboard();
}

// Global functions for mess manager
function addMess() {
  const messId = document.getElementById('messId').value.trim();
  const messName = document.getElementById('messName').value.trim();

  if (!messId || !messName) {
    adminPanel.showToast('Please fill in all fields', 'error');
    return;
  }

  try {
    window.storageManager.addMess(messId, messName);
    adminPanel.showToast('Mess added successfully!', 'success');
    
    // Clear form
    document.getElementById('messId').value = '';
    document.getElementById('messName').value = '';
    
    // Refresh lists
    adminPanel.populateMessesList();
    adminPanel.populateMesses();
  } catch (error) {
    adminPanel.showToast(error.message, 'error');
  }
}

function deleteMessConfirm(messId) {
  adminPanel.showConfirm(
    'Delete Mess',
    'Are you sure you want to delete this mess? This action cannot be undone.',
    () => deleteMess(messId)
  );
}

function deleteMess(messId) {
  try {
    window.storageManager.deleteMess(messId);
    adminPanel.showToast('Mess deleted successfully!', 'success');
    adminPanel.populateMessesList();
    adminPanel.populateMesses();
    adminPanel.loadDashboard();
  } catch (error) {
    adminPanel.showToast(error.message, 'error');
  }
}

// Export/Import functions
function exportData() {
  const jsonData = window.storageManager.exportData();
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nitt-mess-menu-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  adminPanel.showToast('Data exported successfully!', 'success');
}

function importData() {
  const fileInput = document.getElementById('importFile');
  const file = fileInput.files[0];

  if (!file) {
    adminPanel.showToast('Please select a file', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const jsonData = e.target.result;
      window.storageManager.importData(jsonData);
      adminPanel.showToast('Data imported successfully!', 'success');
      fileInput.value = '';
      adminPanel.loadDashboard();
      adminPanel.populateMesses();
    } catch (error) {
      adminPanel.showToast(error.message, 'error');
    }
  };
  reader.readAsText(file);
}

// Utility functions
function goToSection(section) {
  adminPanel.navigateTo(section);
}

function clearAllData() {
  adminPanel.showConfirm(
    'Clear All Data',
    'Are you sure you want to delete all menu data? This action cannot be undone.',
    () => {
      localStorage.removeItem('adminMenuData');
      window.location.reload();
    }
  );
}

function cancelConfirm() {
  document.getElementById('confirmDialog').style.display = 'none';
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('confirmDialog');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
  window.adminPanel = new AdminPanel();
});
