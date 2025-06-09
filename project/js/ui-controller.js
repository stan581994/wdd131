/**
 * Mindful Habits Tracker - UI Controller
 * This module handles UI updates and rendering of habits.
 */

const UIController = (function() {
  /**
   * Create a habit element for the UI
   * @param {Object} habit - The habit object
   * @returns {HTMLElement} The habit element
   */
  function createHabitElement(habit) {
    const habitElement = document.createElement('div');
    habitElement.className = 'habit-item';
    habitElement.dataset.id = habit.id;
    
    // Check if habit is active today
    const isActive = HabitManager.isHabitActiveToday(habit.id);
    
    // Check if habit is completed today
    const isCompleted = HabitManager.isHabitCompletedToday(habit.id);
    
    // Add classes based on status
    if (isCompleted) {
      habitElement.classList.add('completed');
    } else if (isActive) {
      habitElement.classList.add('active');
    } else {
      habitElement.classList.add('inactive');
    }
    
    // Get category icon class
    const categoryIconClass = getCategoryIconClass(habit.category);
    
    // Create habit content
    habitElement.innerHTML = `
      <div class="habit-header">
        <div class="habit-icon ${categoryIconClass}"></div>
        <h3>${habit.name}</h3>
      </div>
      <div class="habit-details">
        <p class="habit-category">${capitalizeFirstLetter(habit.category)}</p>
        <p class="habit-frequency">${formatFrequency(habit.frequency)}</p>
        ${habit.description ? `<p class="habit-description">${habit.description}</p>` : ''}
      </div>
      <div class="habit-stats">
        <div class="habit-streak">
          <span class="streak-count">${habit.streak}</span>
          <span class="streak-label">day${habit.streak !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div class="habit-actions">
        ${isActive && !isCompleted ? 
          `<button class="complete-habit-btn btn btn-primary">Complete</button>` : 
          isCompleted ? 
          `<button class="completed-label btn" disabled>Completed</button>` :
          `<button class="inactive-label btn" disabled>Not Active Today</button>`
        }
        <div class="habit-menu">
          <button class="edit-habit-btn">Edit</button>
          <button class="delete-habit-btn">Delete</button>
        </div>
      </div>
    `;
    
    return habitElement;
  }
  
  /**
   * Get the icon class for a habit category
   * @param {string} category - The habit category
   * @returns {string} The icon class
   */
  function getCategoryIconClass(category) {
    switch (category) {
      case 'physical':
        return 'exercise';
      case 'mental':
        return 'meditation';
      case 'emotional':
        return 'gratitude';
      case 'productivity':
        return 'productivity';
      default:
        return 'other';
    }
  }
  
  /**
   * Format the frequency for display
   * @param {string} frequency - The habit frequency
   * @returns {string} The formatted frequency
   */
  function formatFrequency(frequency) {
    switch (frequency) {
      case 'daily':
        return 'Every day';
      case 'weekdays':
        return 'Weekdays';
      case 'weekends':
        return 'Weekends';
      case 'weekly':
        return 'Weekly';
      default:
        return frequency;
    }
  }
  
  /**
   * Capitalize the first letter of a string
   * @param {string} string - The string to capitalize
   * @returns {string} The capitalized string
   */
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  /**
   * Render the weekly chart
   * @param {Array} habits - The habits array
   */
  function renderWeeklyChart(habits) {
    const weeklyChartContainer = document.getElementById('weekly-chart');
    
    if (!weeklyChartContainer) {
      return;
    }
    
    // If no habits, show placeholder
    if (habits.length === 0) {
      weeklyChartContainer.innerHTML = `
        <div class="chart-placeholder">
          <p>Add habits to see your weekly progress!</p>
        </div>
      `;
      return;
    }
    
    // Get the last 7 days
    const days = [];
    const completionData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateString = date.toISOString().split('T')[0];
      
      days.push(dayName);
      
      // Count active and completed habits for this day
      const activeCount = habits.filter(habit => {
        const habitDate = new Date(habit.createdAt);
        return habitDate <= date && isActiveDayForHabit(habit, date);
      }).length;
      
      const completedCount = habits.filter(habit => {
        return habit.history.some(entry => entry.date === dateString);
      }).length;
      
      const completionRate = activeCount > 0 ? (completedCount / activeCount) * 100 : 0;
      
      completionData.push({
        date: dateString,
        day: dayName,
        activeCount,
        completedCount,
        completionRate
      });
    }
    
    // Create a simple bar chart
    const chartHTML = `
      <div class="simple-chart">
        <div class="chart-bars">
          ${completionData.map(data => `
            <div class="chart-bar-container" title="${data.completedCount}/${data.activeCount} habits completed on ${data.day}">
              <div class="chart-bar" style="height: ${data.completionRate}%"></div>
              <div class="chart-label">${data.day}</div>
            </div>
          `).join('')}
        </div>
        <div class="chart-legend">
          <div class="legend-item">
            <div class="legend-color"></div>
            <div class="legend-label">Completion Rate</div>
          </div>
        </div>
      </div>
    `;
    
    weeklyChartContainer.innerHTML = chartHTML;
  }
  
  /**
   * Check if a habit is active on a specific day
   * @param {Object} habit - The habit object
   * @param {Date} date - The date to check
   * @returns {boolean} Whether the habit is active on the given day
   */
  function isActiveDayForHabit(habit, date) {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    switch (habit.frequency) {
      case 'daily':
        return true;
      case 'weekdays':
        return dayOfWeek >= 1 && dayOfWeek <= 5;
      case 'weekends':
        return dayOfWeek === 0 || dayOfWeek === 6;
      case 'weekly':
        // If the habit was created on a Monday and the date is a Monday, it's active
        const createdDate = new Date(habit.createdAt);
        return dayOfWeek === createdDate.getDay();
      default:
        return true;
    }
  }
  
  /**
   * Render the monthly chart
   * @param {Array} habits - The habits array
   */
  function renderMonthlyChart(habits) {
    const monthlyChartContainer = document.getElementById('monthly-chart');
    
    if (!monthlyChartContainer) {
      return;
    }
    
    // If no habits, show placeholder
    if (habits.length === 0) {
      monthlyChartContainer.innerHTML = `
        <div class="chart-placeholder">
          <p>Add habits to see your monthly trends!</p>
        </div>
      `;
      return;
    }
    
    // Get data for the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Group habits by category
    const categories = {};
    
    habits.forEach(habit => {
      if (!categories[habit.category]) {
        categories[habit.category] = {
          name: capitalizeFirstLetter(habit.category),
          count: 0,
          completed: 0
        };
      }
      
      categories[habit.category].count++;
      
      // Count completions in the current month
      habit.history.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
          categories[habit.category].completed++;
        }
      });
    });
    
    // Convert to array for rendering
    const categoryData = Object.values(categories).sort((a, b) => b.completed - a.completed);
    
    // Create a simple bar chart
    const chartHTML = `
      <div class="simple-chart">
        <div class="chart-bars horizontal">
          ${categoryData.map(data => {
            const completionRate = data.count > 0 ? (data.completed / (data.count * 30)) * 100 : 0;
            return `
              <div class="chart-bar-container horizontal" title="${data.completed} completions in ${data.name} category">
                <div class="chart-label">${data.name}</div>
                <div class="chart-bar horizontal" style="width: ${completionRate}%"></div>
                <div class="chart-value">${data.completed}</div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="chart-legend">
          <div class="legend-item">
            <div class="legend-color"></div>
            <div class="legend-label">Completions this month</div>
          </div>
        </div>
      </div>
    `;
    
    monthlyChartContainer.innerHTML = chartHTML;
  }
  
  /**
   * Show a notification message
   * @param {string} message - The notification message
   * @param {string} type - The notification type (success, warning, error)
   */
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to the document
    document.body.appendChild(notification);
    
    // Show the notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // Public API
  return {
    /**
     * Render habits to the UI
     * @param {Array} habits - The habits array
     * @param {Object} options - Filter and sort options
     */
    renderHabits: function(habits, options = {}) {
      const habitsGrid = document.getElementById('habits-grid');
      
      if (!habitsGrid) {
        return;
      }
      
      // Get filtered and sorted habits
      const filteredHabits = HabitManager.getFilteredHabits(options);
      
      // Clear the habits grid
      habitsGrid.innerHTML = '';
      
      // If no habits, show placeholder
      if (filteredHabits.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'habit-placeholder';
        
        if (habits.length === 0) {
          placeholder.innerHTML = '<p>No habits added yet. Click "Add New Habit" to get started!</p>';
        } else {
          placeholder.innerHTML = '<p>No habits match the current filter. Try changing the filter or adding more habits.</p>';
        }
        
        habitsGrid.appendChild(placeholder);
      } else {
        // Render each habit
        filteredHabits.forEach(habit => {
          const habitElement = createHabitElement(habit);
          habitsGrid.appendChild(habitElement);
        });
      }
      
      // Render charts
      renderWeeklyChart(habits);
      renderMonthlyChart(habits);
      
      // Update statistics
      this.updateStatistics(habits);
    },
    
    /**
     * Update statistics display
     * @param {Array} habits - The habits array
     */
    updateStatistics: function(habits) {
      const stats = HabitManager.getStatistics();
      
      // Update statistics elements if they exist
      const statsElements = {
        totalHabits: document.getElementById('total-habits'),
        completedToday: document.getElementById('completed-today'),
        activeToday: document.getElementById('active-today'),
        completionRate: document.getElementById('completion-rate'),
        longestStreak: document.getElementById('longest-streak')
      };
      
      // Update each stat element if it exists
      Object.keys(statsElements).forEach(key => {
        if (statsElements[key]) {
          if (key === 'completionRate') {
            statsElements[key].textContent = `${Math.round(stats[key])}%`;
          } else {
            statsElements[key].textContent = stats[key];
          }
        }
      });
    },
    
    /**
     * Show a notification message
     * @param {string} message - The notification message
     * @param {string} type - The notification type (success, warning, error)
     */
    showNotification: showNotification
  };
})();

// Add CSS for notifications
(function() {
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
      transform: translateY(100px);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
      z-index: 1000;
    }
    
    .notification.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .notification.success {
      background-color: var(--color-success, #4CAF50);
    }
    
    .notification.warning {
      background-color: var(--color-warning, #FFC107);
    }
    
    .notification.error {
      background-color: var(--color-error, #F44336);
    }
    
    .notification.info {
      background-color: var(--color-secondary, #2196F3);
    }
    
    .simple-chart {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .chart-bars {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 150px;
      margin-bottom: 10px;
    }
    
    .chart-bars.horizontal {
      flex-direction: column;
      height: auto;
    }
    
    .chart-bar-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 5px;
    }
    
    .chart-bar-container.horizontal {
      flex-direction: row;
      width: 100%;
      margin: 5px 0;
      align-items: center;
    }
    
    .chart-bar {
      width: 30px;
      background-color: var(--color-primary);
      border-radius: 3px 3px 0 0;
      transition: height 0.3s ease;
    }
    
    .chart-bar.horizontal {
      height: 20px;
      width: 0%;
      border-radius: 3px 0 0 3px;
      transition: width 0.3s ease;
    }
    
    .chart-label {
      margin-top: 5px;
      font-size: 0.8rem;
      color: var(--color-text);
    }
    
    .chart-bar-container.horizontal .chart-label {
      margin-top: 0;
      margin-right: 10px;
      width: 80px;
      text-align: right;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .chart-value {
      margin-left: 10px;
      font-family: var(--font-mono);
      font-size: 0.9rem;
    }
    
    .chart-legend {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      margin: 0 10px;
    }
    
    .legend-color {
      width: 15px;
      height: 15px;
      background-color: var(--color-primary);
      border-radius: 3px;
      margin-right: 5px;
    }
    
    .legend-label {
      font-size: 0.8rem;
      color: var(--color-text);
    }
    
    /* Habit item styles */
    .habit-item {
      background-color: var(--color-white);
      border-radius: var(--border-radius-md);
      padding: var(--spacing-md);
      box-shadow: var(--shadow-sm);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .habit-item:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
    }
    
    .habit-item.completed {
      border-left: 4px solid var(--color-success);
    }
    
    .habit-item.active {
      border-left: 4px solid var(--color-primary);
    }
    
    .habit-item.inactive {
      border-left: 4px solid var(--color-medium-gray);
      opacity: 0.7;
    }
    
    .habit-header {
      display: flex;
      align-items: center;
      margin-bottom: var(--spacing-sm);
    }
    
    .habit-header h3 {
      margin: 0;
      color: var(--color-text);
    }
    
    .habit-details {
      margin-bottom: var(--spacing-sm);
    }
    
    .habit-details p {
      margin: var(--spacing-xs) 0;
      font-size: 0.9rem;
    }
    
    .habit-category {
      color: var(--color-secondary);
      font-weight: 600;
    }
    
    .habit-frequency {
      color: var(--color-medium-gray);
    }
    
    .habit-description {
      font-style: italic;
    }
    
    .habit-stats {
      display: flex;
      justify-content: flex-end;
      margin-bottom: var(--spacing-sm);
    }
    
    .habit-streak {
      display: flex;
      align-items: baseline;
      color: var(--color-accent);
    }
    
    .streak-count {
      font-family: var(--font-mono);
      font-size: 1.5rem;
      font-weight: 700;
      margin-right: 5px;
    }
    
    .streak-label {
      font-size: 0.8rem;
    }
    
    .habit-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .completed-label,
    .inactive-label {
      background-color: var(--color-light-gray);
      color: var(--color-medium-gray);
      cursor: not-allowed;
    }
    
    .habit-menu {
      display: flex;
      gap: var(--spacing-sm);
    }
    
    .edit-habit-btn,
    .delete-habit-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-sm);
      transition: background-color 0.3s ease;
    }
    
    .edit-habit-btn {
      color: var(--color-secondary);
    }
    
    .edit-habit-btn:hover {
      background-color: rgba(121, 134, 203, 0.1);
    }
    
    .delete-habit-btn {
      color: var(--color-error);
    }
    
    .delete-habit-btn:hover {
      background-color: rgba(229, 115, 115, 0.1);
    }
  `;
  
  document.head.appendChild(style);
})();
