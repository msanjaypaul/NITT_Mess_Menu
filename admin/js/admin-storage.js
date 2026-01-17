// Admin Storage Manager
class AdminStorageManager {
  constructor() {
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem('adminMenuData')) {
      const defaultData = {
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
        },
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('adminMenuData', JSON.stringify(defaultData));
    }
  }

  getData() {
    const data = localStorage.getItem('adminMenuData');
    return data ? JSON.parse(data) : {};
  }

  saveData(data) {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem('adminMenuData', JSON.stringify(data));
  }

  getMesses() {
    const data = this.getData();
    return data.messes || [];
  }

  addMess(id, name) {
    const data = this.getData();
    
    // Check if already exists
    if (data.messes.some(m => m.id === id)) {
      throw new Error('Mess already exists');
    }

    data.messes.push({ id, name });
    data.menu[id] = {};

    // Initialize with empty days
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
      data.menu[id][day] = {
        'Breakfast': { time: '', items: [] },
        'Lunch': { time: '', items: [] },
        'Snacks': { time: '', items: [] },
        'Dinner': { time: '', items: [] }
      };
    });

    this.saveData(data);
    return data.messes;
  }

  deleteMess(messId) {
    const data = this.getData();
    data.messes = data.messes.filter(m => m.id !== messId);
    delete data.menu[messId];
    this.saveData(data);
  }

  getMenuForMess(messId) {
    const data = this.getData();
    return data.menu[messId] || {};
  }

  getMenuForMessDay(messId, day) {
    const data = this.getData();
    return data.menu?.[messId]?.[day] || null;
  }

  updateMenuForMessDay(messId, day, menuData) {
    const data = this.getData();
    if (!data.menu[messId]) {
      data.menu[messId] = {};
    }
    data.menu[messId][day] = menuData;
    this.saveData(data);
  }

  getStatistics() {
    const data = this.getData();
    const messes = data.messes || [];
    let menuCount = 0;

    messes.forEach(mess => {
      const messMenu = data.menu[mess.id] || {};
      Object.keys(messMenu).forEach(day => {
        Object.keys(messMenu[day]).forEach(mealType => {
          if (messMenu[day][mealType].items.length > 0) {
            menuCount++;
          }
        });
      });
    });

    return {
      totalMesses: messes.length,
      totalMenuEntries: menuCount,
      lastUpdated: data.lastUpdated
    };
  }

  exportData() {
    const data = this.getData();
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      // Validate structure
      if (!data.messes || !Array.isArray(data.messes)) {
        throw new Error('Invalid data format: missing messes array');
      }
      
      if (!data.menu || typeof data.menu !== 'object') {
        throw new Error('Invalid data format: missing menu object');
      }

      this.saveData(data);
      return true;
    } catch (error) {
      throw new Error('Failed to import data: ' + error.message);
    }
  }

  getRecentUpdates() {
    const data = this.getData();
    const updates = [];
    
    Object.entries(data.menu || {}).forEach(([messId, messMenu]) => {
      Object.entries(messMenu).forEach(([day, dayMenu]) => {
        Object.entries(dayMenu).forEach(([mealType, mealData]) => {
          if (mealData.items && mealData.items.length > 0) {
            updates.push({
              mess: data.messes.find(m => m.id === messId)?.name || messId,
              day,
              mealType
            });
          }
        });
      });
    });

    return updates.slice(0, 5); // Return last 5
  }
}

// Create global instance
window.storageManager = new AdminStorageManager();
