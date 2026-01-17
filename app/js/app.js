// NITT Mess Menu App
class NittMessApp {
  constructor() {
    this.messes = [];
    this.menuData = {};
    this.currentMess = null;
    this.currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    this.mealEmojis = {
      'Breakfast': '🌅',
      'Lunch': '🍽️',
      'Snacks': '🍪',
      'Dinner': '🌙'
    };
    this.init();
  }

  async init() {
    this.loadSettings();
    this.setupEventListeners();
    await this.loadMenuData();
    this.populateMesses();
    this.populateDays();
    this.setupInstallPrompt();
  }

  setupEventListeners() {
    // Mess selector
    document.getElementById('messSelect').addEventListener('change', (e) => {
      this.currentMess = e.target.value;
      localStorage.setItem('selectedMess', this.currentMess);
      this.displayMenu();
    });

    // Profile button (combined settings and notifications)
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        document.getElementById('profileModal').style.display = 'flex';
      });
    }

    // Navigation arrows
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateDay(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateDay(1));
    }

    // Dark mode toggle
    document.getElementById('darkMode').addEventListener('change', (e) => {
      this.toggleDarkMode(e.target.checked);
    });

    // Enable notifications toggle
    const enableNotifications = document.getElementById('enableNotifications');
    if (enableNotifications) {
      enableNotifications.addEventListener('change', (e) => {
        document.getElementById('notificationTypeGroup').style.display = 
          e.target.checked ? 'block' : 'none';
      });
    }

    // Service Worker message listener for menu updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'MENU_DATA_UPDATED') {
          this.loadMenuData();
          this.showSuccessMessage('Menu data updated!');
        }
      });
    }

    // Handle visibility change for background sync
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.syncMenuData();
      }
    });
  }

  async loadMenuData() {
    try {
      // Load data from localStorage (published by admin panel)
      const publishedData = localStorage.getItem('publishedMenuData');
      
      if (publishedData) {
        this.menuData = JSON.parse(publishedData);
        console.log('✅ Menu data loaded successfully');
        this.extractMesses();
      } else {
        console.log('⚠️ No published data found, loading defaults');
        // If no published data, load default data
        this.loadDefaultMenuData();
      }
    } catch (error) {
      console.error('❌ Error loading menu data:', error);
      // Load default data if there's an error
      this.loadDefaultMenuData();
    }
  }

  loadDefaultMenuData() {
    // Default sample data for demonstration
    this.menuData = {
      messes: [
        { id: 'annapurna', name: 'Annapurna' },
        { id: 'sabari', name: 'Sabari' },
        { id: 'mm1_gf', name: 'MM1 GF' },
        { id: 'mm2_gf', name: 'MM2 GF' },
        { id: 'mm1_ff', name: 'MM1 FF' },
        { id: 'mm2_ff', name: 'MM2 FF' }
      ],
      menu: {
        'annapurna': {
          'Monday': {
            'Breakfast': {
              time: '7:00 AM - 9:00 AM',
              items: ['Idli', 'Sambar', 'Chutney', 'Coffee']
            },
            'Lunch': {
              time: '12:00 PM - 2:00 PM',
              items: ['Rice', 'Rasam', 'Mixed Vegetable Curry', 'Pickle']
            },
            'Snacks': {
              time: '4:00 PM - 5:00 PM',
              items: ['Bread', 'Butter', 'Tea']
            },
            'Dinner': {
              time: '7:30 PM - 9:00 PM',
              items: ['Chapati', 'Dal Makhani', 'Salad']
            }
          },
          'Tuesday': {
            'Breakfast': {
              time: '7:00 AM - 9:00 AM',
              items: ['Dosa', 'Sambar', 'Chutney', 'Coffee']
            },
            'Lunch': {
              time: '12:00 PM - 2:00 PM',
              items: ['Rice', 'Dal', 'Paneer Curry', 'Pickle']
            },
            'Snacks': {
              time: '4:00 PM - 5:00 PM',
              items: ['Biscuits', 'Tea']
            },
            'Dinner': {
              time: '7:30 PM - 9:00 PM',
              items: ['Rice', 'Chicken Curry', 'Raita']
            }
          }
        },
        'sabari': {
          'Monday': {
            'Breakfast': {
              time: '7:00 AM - 9:00 AM',
              items: ['Poori', 'Aloo Curry', 'Tea']
            },
            'Lunch': {
              time: '12:00 PM - 2:00 PM',
              items: ['Rice', 'Sambar', 'Vegetable Fry', 'Pickle']
            },
            'Snacks': {
              time: '4:00 PM - 5:00 PM',
              items: ['Bonda', 'Coffee']
            },
            'Dinner': {
              time: '7:30 PM - 9:00 PM',
              items: ['Roti', 'Butter Chicken', 'Salad']
            }
          }
        }
      }
    };
    localStorage.setItem('menuData', JSON.stringify(this.menuData));
  }

  extractMesses() {
    if (this.menuData.messes) {
      this.messes = this.menuData.messes;
    } else {
      // Extract from menu data if structure is different
      this.messes = Object.keys(this.menuData.menu || {}).map(id => ({
        id: id,
        name: id.replace(/_/g, ' ').toUpperCase()
      }));
    }
  }

  populateMesses() {
    const messSelect = document.getElementById('messSelect');
    messSelect.innerHTML = '';

    this.messes.forEach(mess => {
      const option = document.createElement('option');
      option.value = mess.id;
      option.textContent = mess.name;
      messSelect.appendChild(option);
    });

    // Restore previously selected mess
    const savedMess = localStorage.getItem('selectedMess');
    if (savedMess && this.messes.some(m => m.id === savedMess)) {
      messSelect.value = savedMess;
      this.currentMess = savedMess;
    } else if (this.messes.length > 0) {
      this.currentMess = this.messes[0].id;
      messSelect.value = this.currentMess;
    }

    if (this.currentMess) {
      this.displayMenu();
    }
  }

  populateDays() {
    const daySelector = document.getElementById('daySelector');
    daySelector.innerHTML = '';

    this.days.forEach(day => {
      const btn = document.createElement('button');
      btn.className = 'day-btn';
      btn.textContent = day.substring(0, 3);
      btn.dataset.day = day;

      if (day === this.currentDay) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', () => {
        document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentDay = day;
        this.displayMenu();
      });

      daySelector.appendChild(btn);
    });
  }

  navigateDay(direction) {
    const currentIndex = this.days.indexOf(this.currentDay);
    let newIndex = currentIndex + direction;
    
    // Wrap around
    if (newIndex < 0) newIndex = this.days.length - 1;
    if (newIndex >= this.days.length) newIndex = 0;
    
    this.currentDay = this.days[newIndex];
    
    // Update active button
    document.querySelectorAll('.day-btn').forEach((btn, index) => {
      btn.classList.toggle('active', index === newIndex);
    });
    
    this.displayMenu();
  }

  displayMenu() {
    const menuContainer = document.getElementById('menuContainer');
    const loading = document.getElementById('loadingSpinner');

    if (!this.currentMess || !this.currentDay) {
      menuContainer.innerHTML = '<div class="placeholder"><p>📋 Select a mess and day to view the menu</p></div>';
      return;
    }

    console.log('Displaying menu for:', this.currentMess, this.currentDay);
    loading.style.display = 'flex';

    // Simulate loading delay for better UX
    setTimeout(() => {
      const messMenu = this.menuData.menu?.[this.currentMess]?.[this.currentDay];

      if (!messMenu) {
        console.log('❌ No menu data found for', this.currentMess, this.currentDay);
        menuContainer.innerHTML = '<div class="placeholder"><p>🚫 No menu available for this day</p></div>';
        loading.style.display = 'none';
        return;
      }

      console.log('✅ Menu found:', messMenu);
      menuContainer.innerHTML = '';

      // Define meal order
      const mealOrder = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

      mealOrder.forEach(mealType => {
        if (messMenu[mealType]) {
          const mealData = messMenu[mealType];
          const card = document.createElement('div');
          card.className = 'meal-card';

          // Create header
          const header = document.createElement('div');
          header.className = 'meal-header';

          const title = document.createElement('div');
          title.className = 'meal-title';

          const typeEl = document.createElement('h3');
          typeEl.className = 'meal-type';
          typeEl.textContent = mealType;

          const timeEl = document.createElement('p');
          timeEl.className = 'meal-time';
          // Count items instead of showing time
          const itemCount = mealData.items?.length || 0;
          timeEl.textContent = `${itemCount} items`;

          title.appendChild(typeEl);
          title.appendChild(timeEl);
          header.appendChild(title);
          card.appendChild(header);

          // Add click handler to show details
          card.addEventListener('click', () => {
            this.showMealDetails(mealType, mealData);
          });

          menuContainer.appendChild(card);
        }
      });

      loading.style.display = 'none';
    }, 300);
  }

  showMealDetails(mealType, mealData) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${this.mealEmojis[mealType]} ${mealType}</h2>
          <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-weight: 600; margin-bottom: 1rem; color: var(--text-secondary);">${mealData.time}</p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem;">
            ${mealData.items.map(item => `
              <li style="padding: 0.75rem; background: var(--bg-light); border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.25rem;">🍽️</span>
                <span style="color: var(--text-primary);">${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    document.body.appendChild(modal);
  }

  loadSettings() {
    const darkModeToggle = document.getElementById('darkMode');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
      darkModeToggle.checked = true;
      document.body.classList.add('dark-mode');
    }
  }

  toggleDarkMode(enabled) {
    localStorage.setItem('darkMode', enabled);
    if (enabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  async syncMenuData() {
    try {
      // Reload menu data from localStorage (published by admin)
      await this.loadMenuData();
      this.populateMesses();
      this.displayMenu();
      this.showSuccessMessage('Menu data synced!');
    } catch (error) {
      console.log('Sync failed:', error);
    }
  }

  showSuccessMessage(message) {
    const container = document.getElementById('menuContainer');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'success-message';
    msgDiv.textContent = message;
    container.insertBefore(msgDiv, container.firstChild);

    setTimeout(() => {
      msgDiv.remove();
    }, 3000);
  }

  showErrorMessage(message) {
    const container = document.getElementById('menuContainer');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'error-message';
    msgDiv.textContent = message;
    container.insertBefore(msgDiv, container.firstChild);

    setTimeout(() => {
      msgDiv.remove();
    }, 3000);
  }

  setupInstallPrompt() {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      this.showInstallPrompt(deferredPrompt);
    });

    window.addEventListener('appinstalled', () => {
      console.log('App installed');
      deferredPrompt = null;
    });
  }

  showInstallPrompt(deferredPrompt) {
    if (localStorage.getItem('installPromptDismissed') === 'true') {
      return;
    }

    const prompt = document.createElement('div');
    prompt.className = 'install-prompt';
    prompt.innerHTML = `
      <div class="install-prompt-content">
        <div class="install-prompt-icon">📱</div>
        <div class="install-prompt-text">
          <h3>Install NITT Mess</h3>
          <p>Quick access from home screen</p>
        </div>
        <button class="install-prompt-btn" id="installBtn">Install</button>
        <button class="install-prompt-btn" style="background: #ccc; color: #333; margin-left: 0.5rem;" id="dismissBtn">×</button>
      </div>
    `;

    document.body.appendChild(prompt);

    document.getElementById('installBtn').addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          prompt.remove();
          localStorage.setItem('installPromptDismissed', 'true');
        });
      }
    });

    document.getElementById('dismissBtn').addEventListener('click', () => {
      prompt.remove();
      localStorage.setItem('installPromptDismissed', 'true');
    });

    setTimeout(() => {
      if (prompt.parentNode) {
        prompt.remove();
      }
    }, 5000);
  }
}

// Global functions for modal management
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function saveSettings() {
  // Save notification settings
  const notificationSettings = {
    enabled: document.getElementById('enableNotifications').checked
  };
  localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  
  // Request notification permission if enabled
  if (notificationSettings.enabled && window.notificationsManager) {
    window.notificationsManager.requestPermission();
  }
  
  // Close modal
  closeModal('profileModal');
  
  // Show toast
  const app = window.app;
  if (app) {
    app.showSuccessMessage('Settings saved successfully!');
  }
}

function clearCache() {
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  // Clear app settings but keep menu data
  localStorage.removeItem('selectedMess');
  localStorage.removeItem('darkMode');
  localStorage.removeItem('notificationSettings');
  location.reload();
}

function syncMenuData() {
  const app = window.app;
  if (app) {
    app.syncMenuData();
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new NittMessApp();
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});
