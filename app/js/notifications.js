// Notifications Manager
class NotificationsManager {
  constructor() {
    this.settings = this.loadSettings();
    this.init();
  }

  init() {
    this.setupNotificationUI();
    this.requestPermission();
    if (this.settings.enabled) {
      this.scheduleNotifications();
    }
  }

  loadSettings() {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      enabled: false
    };
  }

  setupNotificationUI() {
    const enableCheckbox = document.getElementById('enableNotifications');
    if (enableCheckbox) {
      enableCheckbox.checked = this.settings.enabled;
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return;
    }

    if (Notification.permission === 'granted') {
      return;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  }

  scheduleNotifications() {
    if (!this.settings.enabled || Notification.permission !== 'granted') {
      return;
    }

    // Send notifications at each meal time with that meal's menu
    this.scheduleMealTimeNotifications();
  }



  scheduleMealTimeNotifications() {
    const mealTimes = {
      'Breakfast': { hour: 7, minute: 0 },
      'Lunch': { hour: 12, minute: 0 },
      'Snacks': { hour: 16, minute: 0 },
      'Dinner': { hour: 19, minute: 30 }
    };

    const checkAndNotify = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      Object.entries(mealTimes).forEach(([mealType, time]) => {
        if (currentHour === time.hour && currentMinute === time.minute) {
          this.sendMealNotification(mealType);
        }
      });
    };

    // Check every minute
    setInterval(checkAndNotify, 60 * 1000);
    checkAndNotify(); // Check immediately
  }

  sendMealNotification(mealType) {
    const menuData = this.getTodaysMenu();
    let body = `It's ${mealType} time!`;
    
    if (menuData && menuData[mealType]?.items?.length) {
      const items = menuData[mealType].items;
      const timing = menuData[mealType].timing || '';
      
      // Format: Timing on first line, then all items
      const menuText = items.join('\n');
      body = timing ? `${timing}\n\n${menuText}` : menuText;
    }

    const icons = {
      'Breakfast': '🍳',
      'Lunch': '🍛',
      'Snacks': '🍪',
      'Dinner': '🍽️'
    };

    this.sendNotification(`${icons[mealType]} ${mealType} Menu`, {
      body: body,
      tag: `${mealType.toLowerCase()}-reminder`
    });
  }

  getTodaysMenu() {
    try {
      const publishedData = localStorage.getItem('publishedMenuData');
      if (!publishedData) return null;

      const data = JSON.parse(publishedData);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = days[new Date().getDay()];

      // Get default mess or first available
      const defaultMess = localStorage.getItem('defaultMess') || Object.keys(data)[0];
      
      if (data[defaultMess] && data[defaultMess][today]) {
        return data[defaultMess][today];
      }

      return null;
    } catch (error) {
      console.error('Error getting today\'s menu:', error);
      return null;
    }
  }

  async sendNotification(title, options = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Use service worker for background notifications
        navigator.serviceWorker.controller.postMessage({
          type: 'SEND_NOTIFICATION',
          title: title,
          options: {
            icon: '/Logo.png',
            badge: '/Logo.png',
            ...options
          }
        });
      } else {
        // Fallback to regular notification
        new Notification(title, {
          icon: '/Logo.png',
          badge: '/Logo.png',
          ...options
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  testNotification() {
    // Test with current or next meal
    const currentHour = new Date().getHours();
    let mealType = 'Breakfast';
    
    if (currentHour >= 19) mealType = 'Dinner';
    else if (currentHour >= 16) mealType = 'Snacks';
    else if (currentHour >= 12) mealType = 'Lunch';
    
    this.sendMealNotification(mealType);
  }
}

// Initialize notifications manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.notificationsManager = new NotificationsManager();
});

// Test button (for development)
if (new URLSearchParams(window.location.search).has('test-notification')) {
  setTimeout(() => {
    if (window.notificationsManager) {
      window.notificationsManager.testNotification();
    }
  }, 1000);
}
