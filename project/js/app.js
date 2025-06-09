/**
 * Mindful Habits Tracker - Main Application Script
 * This file serves as the entry point for the application and handles initialization.
 */

// Wait for the DOM to be fully loaded before initializing the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Mindful Habits Tracker initialized');
  
  // Initialize the mobile menu toggle functionality
  initMobileMenu();
  
  // Initialize the habit tracker if we're on the tracker page
  if (document.querySelector('.habit-tracker')) {
    initHabitTracker();
  }
});

/**
 * Initialize the mobile menu toggle functionality
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      
      // Change the toggle icon based on menu state
      if (nav.classList.contains('active')) {
        menuToggle.innerHTML = '&times;'; // × symbol
      } else {
        menuToggle.innerHTML = '☰'; // ☰ symbol
      }
    });
    
    // Close the mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideMenu = nav.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);
      
      if (!isClickInsideMenu && !isClickOnToggle && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.innerHTML = '☰';
      }
    });
  }
}

/**
 * Initialize the habit tracker functionality
 */
function initHabitTracker() {
  // Initialize the habit modal
  initHabitModal();
  
  // Load habits from localStorage
  HabitManager.loadHabits();
  
  // Render habits to the UI
  UIController.renderHabits(HabitManager.getHabits());
  
  // Set up event listeners for the habit tracker
  setupTrackerEventListeners();
}

/**
 * Initialize the habit modal for adding/editing habits
 */
function initHabitModal() {
  const modal = document.getElementById('habit-modal');
  const addHabitBtn = document.getElementById('add-habit-btn');
  const closeModal = document.querySelector('.close-modal');
  const cancelBtn = document.querySelector('.cancel-btn');
  const habitForm = document.getElementById('habit-form');
  
  if (modal && addHabitBtn && closeModal && cancelBtn && habitForm) {
    // Open modal when clicking the add habit button
    addHabitBtn.addEventListener('click', function() {
      modal.style.display = 'block';
      // Reset the form when opening the modal
      habitForm.reset();
      // Set the form mode to 'add'
      habitForm.dataset.mode = 'add';
      // Update the modal title
      document.querySelector('.modal-content h2').textContent = 'Add New Habit';
    });
    
    // Close modal when clicking the close button
    closeModal.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Close modal when clicking the cancel button
    cancelBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // Handle form submission
    habitForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const habitName = document.getElementById('habit-name').value.trim();
      const habitCategory = document.getElementById('habit-category').value;
      const habitFrequency = document.getElementById('habit-frequency').value;
      const habitDescription = document.getElementById('habit-description').value.trim();
      
      if (habitName) {
        if (habitForm.dataset.mode === 'add') {
          // Add new habit
          const newHabit = HabitManager.addHabit(habitName, habitCategory, habitFrequency, habitDescription);
          UIController.renderHabits(HabitManager.getHabits());
          UIController.showNotification(`Habit "${habitName}" added successfully!`, 'success');
        } else if (habitForm.dataset.mode === 'edit') {
          // Edit existing habit
          const habitId = habitForm.dataset.habitId;
          HabitManager.updateHabit(habitId, {
            name: habitName,
            category: habitCategory,
            frequency: habitFrequency,
            description: habitDescription
          });
          UIController.renderHabits(HabitManager.getHabits());
          UIController.showNotification(`Habit "${habitName}" updated successfully!`, 'success');
        }
        
        // Close the modal
        modal.style.display = 'none';
      }
    });
  }
}

/**
 * Set up event listeners for the habit tracker
 */
function setupTrackerEventListeners() {
  const habitsGrid = document.getElementById('habits-grid');
  const habitFilter = document.getElementById('habit-filter');
  const habitSort = document.getElementById('habit-sort');
  
  if (habitsGrid) {
    // Event delegation for habit actions (complete, edit, delete)
    habitsGrid.addEventListener('click', function(event) {
      // Check if the clicked element is a complete button
      if (event.target.classList.contains('complete-habit-btn')) {
        const habitId = event.target.closest('.habit-item').dataset.id;
        HabitManager.completeHabit(habitId);
        UIController.renderHabits(HabitManager.getHabits());
        UIController.showNotification('Habit completed for today!', 'success');
      }
      
      // Check if the clicked element is an edit button
      if (event.target.classList.contains('edit-habit-btn')) {
        const habitItem = event.target.closest('.habit-item');
        const habitId = habitItem.dataset.id;
        const habit = HabitManager.getHabitById(habitId);
        
        if (habit) {
          // Open the modal in edit mode
          const modal = document.getElementById('habit-modal');
          const habitForm = document.getElementById('habit-form');
          
          // Set form values
          document.getElementById('habit-name').value = habit.name;
          document.getElementById('habit-category').value = habit.category;
          document.getElementById('habit-frequency').value = habit.frequency;
          document.getElementById('habit-description').value = habit.description || '';
          
          // Set the form mode to 'edit'
          habitForm.dataset.mode = 'edit';
          habitForm.dataset.habitId = habitId;
          
          // Update the modal title
          document.querySelector('.modal-content h2').textContent = 'Edit Habit';
          
          // Show the modal
          modal.style.display = 'block';
        }
      }
      
      // Check if the clicked element is a delete button
      if (event.target.classList.contains('delete-habit-btn')) {
        const habitItem = event.target.closest('.habit-item');
        const habitId = habitItem.dataset.id;
        const habit = HabitManager.getHabitById(habitId);
        
        if (habit && confirm(`Are you sure you want to delete the habit "${habit.name}"?`)) {
          HabitManager.deleteHabit(habitId);
          UIController.renderHabits(HabitManager.getHabits());
          UIController.showNotification(`Habit "${habit.name}" deleted.`, 'warning');
        }
      }
    });
  }
  
  // Filter habits
  if (habitFilter) {
    habitFilter.addEventListener('change', function() {
      UIController.renderHabits(HabitManager.getHabits(), {
        filter: habitFilter.value,
        sort: habitSort ? habitSort.value : 'name'
      });
    });
  }
  
  // Sort habits
  if (habitSort) {
    habitSort.addEventListener('change', function() {
      UIController.renderHabits(HabitManager.getHabits(), {
        filter: habitFilter ? habitFilter.value : 'all',
        sort: habitSort.value
      });
    });
  }
}
