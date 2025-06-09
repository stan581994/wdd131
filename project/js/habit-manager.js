/**
 * Mindful Habits Tracker - Habit Manager
 * This module handles habit data management, including CRUD operations and localStorage persistence.
 */

const HabitManager = (function() {
  // Private variables
  let habits = [];
  const STORAGE_KEY = 'mindful-habits';
  
  /**
   * Generate a unique ID for a new habit
   * @returns {string} A unique ID
   */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  
  /**
   * Get today's date in YYYY-MM-DD format
   * @returns {string} Today's date
   */
  function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  
  /**
   * Check if a habit should be active today based on its frequency
   * @param {Object} habit - The habit to check
   * @returns {boolean} Whether the habit is active today
   */
  function isActiveToday(habit) {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    switch (habit.frequency) {
      case 'daily':
        return true;
      case 'weekdays':
        return dayOfWeek >= 1 && dayOfWeek <= 5;
      case 'weekends':
        return dayOfWeek === 0 || dayOfWeek === 6;
      case 'weekly':
        // If the habit was created on a Monday and today is Monday, it's active
        const createdDate = new Date(habit.createdAt);
        return dayOfWeek === createdDate.getDay();
      default:
        return true;
    }
  }
  
  /**
   * Calculate the current streak for a habit
   * @param {Object} habit - The habit to calculate streak for
   * @returns {number} The current streak
   */
  function calculateStreak(habit) {
    if (!habit.history || habit.history.length === 0) {
      return 0;
    }
    
    // Sort history by date (newest first)
    const sortedHistory = [...habit.history].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if the habit was completed today
    const todayString = getTodayString();
    const completedToday = sortedHistory.some(entry => entry.date === todayString);
    
    // If not completed today and should be active today, streak is broken
    if (!completedToday && isActiveToday(habit)) {
      return 0;
    }
    
    // Calculate streak by checking consecutive days
    let currentDate = new Date(today);
    
    // If completed today, start counting from today
    if (completedToday) {
      streak = 1;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Check previous days
    while (true) {
      const dateString = currentDate.toISOString().split('T')[0];
      const shouldBeActive = isActiveToday(Object.assign({}, habit, { createdAt: currentDate }));
      
      // If the habit should be active on this day
      if (shouldBeActive) {
        const completed = sortedHistory.some(entry => entry.date === dateString);
        
        // If not completed on a day it should be active, break the streak
        if (!completed) {
          break;
        }
        
        streak++;
      }
      
      // Move to the previous day
      currentDate.setDate(currentDate.getDate() - 1);
      
      // Don't go back further than the habit creation date
      if (currentDate < new Date(habit.createdAt)) {
        break;
      }
    }
    
    return streak;
  }
  
  /**
   * Save habits to localStorage
   */
  function saveHabits() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Failed to save habits to localStorage:', error);
    }
  }
  
  // Public API
  return {
    /**
     * Load habits from localStorage
     */
    loadHabits: function() {
      try {
        const storedHabits = localStorage.getItem(STORAGE_KEY);
        habits = storedHabits ? JSON.parse(storedHabits) : [];
        
        // Calculate current streak for each habit
        habits.forEach(habit => {
          habit.streak = calculateStreak(habit);
        });
      } catch (error) {
        console.error('Failed to load habits from localStorage:', error);
        habits = [];
      }
    },
    
    /**
     * Get all habits
     * @returns {Array} Array of habit objects
     */
    getHabits: function() {
      return habits;
    },
    
    /**
     * Get a habit by ID
     * @param {string} id - The habit ID
     * @returns {Object|null} The habit object or null if not found
     */
    getHabitById: function(id) {
      return habits.find(habit => habit.id === id) || null;
    },
    
    /**
     * Add a new habit
     * @param {string} name - The habit name
     * @param {string} category - The habit category
     * @param {string} frequency - The habit frequency
     * @param {string} description - The habit description
     * @returns {Object} The newly created habit
     */
    addHabit: function(name, category, frequency, description = '') {
      const newHabit = {
        id: generateId(),
        name,
        category,
        frequency,
        description,
        createdAt: new Date().toISOString(),
        history: [],
        streak: 0
      };
      
      habits.push(newHabit);
      saveHabits();
      
      return newHabit;
    },
    
    /**
     * Update an existing habit
     * @param {string} id - The habit ID
     * @param {Object} updates - Object containing the properties to update
     * @returns {Object|null} The updated habit or null if not found
     */
    updateHabit: function(id, updates) {
      const habitIndex = habits.findIndex(habit => habit.id === id);
      
      if (habitIndex === -1) {
        return null;
      }
      
      // Create a new habit object with the updates
      habits[habitIndex] = {
        ...habits[habitIndex],
        ...updates,
        // Ensure these properties aren't overwritten
        id: habits[habitIndex].id,
        createdAt: habits[habitIndex].createdAt,
        history: habits[habitIndex].history,
        // Recalculate streak
        streak: calculateStreak(habits[habitIndex])
      };
      
      saveHabits();
      
      return habits[habitIndex];
    },
    
    /**
     * Delete a habit
     * @param {string} id - The habit ID
     * @returns {boolean} Whether the deletion was successful
     */
    deleteHabit: function(id) {
      const habitIndex = habits.findIndex(habit => habit.id === id);
      
      if (habitIndex === -1) {
        return false;
      }
      
      habits.splice(habitIndex, 1);
      saveHabits();
      
      return true;
    },
    
    /**
     * Mark a habit as complete for today
     * @param {string} id - The habit ID
     * @returns {Object|null} The updated habit or null if not found
     */
    completeHabit: function(id) {
      const habit = this.getHabitById(id);
      
      if (!habit) {
        return null;
      }
      
      const today = getTodayString();
      
      // Check if already completed today
      if (habit.history.some(entry => entry.date === today)) {
        return habit;
      }
      
      // Add completion to history
      habit.history.push({
        date: today,
        completed: true
      });
      
      // Recalculate streak
      habit.streak = calculateStreak(habit);
      
      saveHabits();
      
      return habit;
    },
    
    /**
     * Get filtered and sorted habits
     * @param {Object} options - Filter and sort options
     * @returns {Array} Filtered and sorted habits
     */
    getFilteredHabits: function(options = {}) {
      const { filter = 'all', sort = 'name' } = options;
      const today = getTodayString();
      
      // Filter habits
      let filteredHabits = [...habits];
      
      switch (filter) {
        case 'active':
          filteredHabits = filteredHabits.filter(habit => 
            isActiveToday(habit) && !habit.history.some(entry => entry.date === today)
          );
          break;
        case 'completed':
          filteredHabits = filteredHabits.filter(habit => 
            habit.history.some(entry => entry.date === today)
          );
          break;
        case 'physical':
        case 'mental':
        case 'emotional':
        case 'productivity':
        case 'other':
          filteredHabits = filteredHabits.filter(habit => habit.category === filter);
          break;
      }
      
      // Sort habits
      switch (sort) {
        case 'name':
          filteredHabits.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'streak':
          filteredHabits.sort((a, b) => b.streak - a.streak);
          break;
        case 'created':
          filteredHabits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }
      
      return filteredHabits;
    },
    
    /**
     * Check if a habit is active today
     * @param {string} id - The habit ID
     * @returns {boolean} Whether the habit is active today
     */
    isHabitActiveToday: function(id) {
      const habit = this.getHabitById(id);
      return habit ? isActiveToday(habit) : false;
    },
    
    /**
     * Check if a habit is completed today
     * @param {string} id - The habit ID
     * @returns {boolean} Whether the habit is completed today
     */
    isHabitCompletedToday: function(id) {
      const habit = this.getHabitById(id);
      if (!habit) return false;
      
      const today = getTodayString();
      return habit.history.some(entry => entry.date === today);
    },
    
    /**
     * Get statistics for all habits
     * @returns {Object} Statistics object
     */
    getStatistics: function() {
      const totalHabits = habits.length;
      const today = getTodayString();
      
      // Count completed habits today
      const completedToday = habits.filter(habit => 
        habit.history.some(entry => entry.date === today)
      ).length;
      
      // Count active habits today
      const activeToday = habits.filter(habit => isActiveToday(habit)).length;
      
      // Calculate completion rate
      const completionRate = activeToday > 0 ? (completedToday / activeToday) * 100 : 0;
      
      // Find longest streak
      const longestStreak = habits.reduce((max, habit) => 
        habit.streak > max ? habit.streak : max, 0
      );
      
      return {
        totalHabits,
        completedToday,
        activeToday,
        completionRate,
        longestStreak
      };
    }
  };
})();
