// Professional Todo Manager with Time Blocks and Dark Mode
class TodoManager {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem('professional-todos')) || [];
    this.projects = JSON.parse(localStorage.getItem('todo-projects')) || [];
    this.currentWeek = new Date();
    this.currentView = { block: 'day', period: 'today' };
    this.selectedTodos = new Set();
    
    this.init();
  }
  
  init() {
    // Clear any cached notifications or old data
    document.querySelectorAll('.theme-notification').forEach(el => el.remove());
    
    this.cacheDOMElements();
    this.bindEvents();
    this.initTheme();
    this.updateWeekDisplay();
    this.renderProjects();
    this.renderTodos();
    this.registerServiceWorker();
  }
  
  cacheDOMElements() {
    // Cache frequently used elements
    const elements = {
      // Navigation
      prevWeekBtn: 'prev-week',
      nextWeekBtn: 'next-week', 
      currentWeekDisplay: 'current-week',
      
      // Quick entry
      quickInput: 'quick-input',
      addTodosBtn: 'add-todos',
      clearEntryBtn: 'clear-entry',
      
      // Todo list
      todoList: 'todo-list',
      viewTitle: 'view-title',
      totalCount: 'total-count',
      completedCount: 'completed-count',
      progressPercentage: 'progress-percentage',
      
      // Controls
      selectAllBtn: 'select-all',
      deleteSelectedBtn: 'delete-selected',
      moveSelectedBtn: 'move-selected',
      collapseAllBtn: 'collapse-all',
      expandAllBtn: 'expand-all',
      
      // Modals
      moveModal: 'move-modal',
      projectModal: 'project-modal',
      moveTarget: 'move-target',
      
      // Projects
      projectsList: 'projects-list',
      addProjectBtn: 'add-project-btn',
      projectNameInput: 'project-name',
      projectDescInput: 'project-description',
      
      // Theme
      themeToggleBtn: 'theme-toggle',
      exportBtn: 'export-data'
    };
    
    // Efficiently cache all elements
    Object.entries(elements).forEach(([prop, id]) => {
      this[prop] = document.getElementById(id);
    });
    
    // Cache NodeLists separately
    this.timeBlockBtns = document.querySelectorAll('.time-block-btn');
    this.dayBtns = document.querySelectorAll('.day-btn');
  }
  
  bindEvents() {
    // Optimized event binding with batch processing
    const eventBindings = [
      // Week navigation
      [this.prevWeekBtn, 'click', () => this.changeWeek(-1)],
      [this.nextWeekBtn, 'click', () => this.changeWeek(1)],
      
      // Quick entry
      [this.addTodosBtn, 'click', () => this.addTodosFromQuickEntry()],
      [this.clearEntryBtn, 'click', () => this.clearQuickEntry()],
      [this.quickInput, 'keydown', (e) => e.ctrlKey && e.key === 'Enter' && this.addTodosFromQuickEntry()],
      
      // Todo controls
      [this.selectAllBtn, 'click', () => this.selectAllTodos()],
      [this.deleteSelectedBtn, 'click', () => this.deleteSelectedTodos()],
      [this.moveSelectedBtn, 'click', () => this.showMoveModal()],
      [this.collapseAllBtn, 'click', () => this.collapseAllTodos()],
      [this.expandAllBtn, 'click', () => this.expandAllTodos()],
      
      // Projects and theme
      [this.addProjectBtn, 'click', () => this.showProjectModal()],
      [this.themeToggleBtn, 'click', () => this.toggleTheme()],
      [this.exportBtn, 'click', () => this.exportData()]
    ];
    
    // Bind events efficiently
    eventBindings.forEach(([element, event, handler]) => {
      element?.addEventListener(event, handler);
    });
    
    // Time block navigation with delegation
    this.timeBlockBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTimeBlock(e.target));
    });
    
    // Modal events
    this.bindModalEvents();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }
  
  bindModalEvents() {
    // Move modal
    const closeMoveModal = document.getElementById('close-move-modal');
    const confirmMove = document.getElementById('confirm-move');
    const cancelMove = document.getElementById('cancel-move');
    
    if (closeMoveModal) closeMoveModal.addEventListener('click', () => this.hideModal('move-modal'));
    if (confirmMove) confirmMove.addEventListener('click', () => this.confirmMove());
    if (cancelMove) cancelMove.addEventListener('click', () => this.hideModal('move-modal'));
    
    // Project modal
    const closeProjectModal = document.getElementById('close-project-modal');
    const createProject = document.getElementById('create-project');
    const cancelProject = document.getElementById('cancel-project');
    
    if (closeProjectModal) closeProjectModal.addEventListener('click', () => this.hideModal('project-modal'));
    if (createProject) createProject.addEventListener('click', () => this.createProject());
    if (cancelProject) cancelProject.addEventListener('click', () => this.hideModal('project-modal'));
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.hideModal(modal.id);
      });
    });
  }

  // Theme Management
  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Add transition class for smooth theme change
    document.documentElement.classList.add('theme-transition');
    
    this.setTheme(newTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (this.themeToggleBtn) {
      // Add rotation animation
      this.themeToggleBtn.style.transform = 'rotate(360deg)';
      this.themeToggleBtn.textContent = theme === 'light' ? '🌙' : '☀️';
      
      setTimeout(() => {
        this.themeToggleBtn.style.transform = 'rotate(0deg)';
      }, 300);
    }
  }
  
  // Week Navigation
  changeWeek(direction) {
    const newWeek = new Date(this.currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    this.currentWeek = newWeek;
    this.updateWeekDisplay();
    this.renderTodos();
  }
  
  updateWeekDisplay() {
    if (!this.currentWeekDisplay) return;
    
    const startOfWeek = new Date(this.currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    this.currentWeekDisplay.textContent = `Week of ${startOfWeek.toLocaleDateString('en-US', options)}`;
    
    // Update day buttons
    this.dayBtns.forEach((btn, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(dayDate.getDate() + index);
      
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index];
      const dayNum = dayDate.getDate();
      const isToday = dayDate.toDateString() === new Date().toDateString();
      
      btn.textContent = `${dayName} ${dayNum}`;
      btn.classList.toggle('today', isToday);
    });
  }
  
  // Time Block Management
  switchTimeBlock(btn) {
    // Remove active class from all buttons
    this.timeBlockBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update current view
    this.currentView = {
      block: btn.dataset.block,
      period: btn.dataset.period || 'current',
      day: btn.dataset.day
    };
    
    // Update view title
    this.updateViewTitle();
    
    // Re-render todos
    this.renderTodos();
  }
  
  updateViewTitle() {
    if (!this.viewTitle) return;
    
    const { block, period, day } = this.currentView;
    
    if (block === 'day' && day !== undefined) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      this.viewTitle.textContent = dayNames[parseInt(day)];
    } else if (block === 'day' && period === 'today') {
      this.viewTitle.textContent = 'Today';
    } else if (block === 'week') {
      this.viewTitle.textContent = period === 'current' ? 'This Week' : 'Next 6 Weeks';
    } else if (block === 'month') {
      this.viewTitle.textContent = period === 'current' ? 'This Month' : 'Next 6 Months';
    } else if (block === 'year') {
      this.viewTitle.textContent = 'This Year';
    }
  }
  
  // Quick Entry Parser
  addTodosFromQuickEntry() {
    if (!this.quickInput) return;
    
    const text = this.quickInput.value.trim();
    if (!text) return;
    
    const lines = text.split('\n');
    const todos = this.parseQuickEntry(lines);
    
    todos.forEach(todo => {
      this.todos.push(todo);
    });
    
    this.saveTodos();
    this.renderTodos();
    this.clearQuickEntry();
  }
  
  parseQuickEntry(lines) {
    const todos = [];
    let currentTodo = null;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      const isSubtask = trimmedLine.startsWith('  ') && !trimmedLine.startsWith('- ');
      const isTodo = trimmedLine.startsWith('- ');
      
      if (isTodo || (!isSubtask && trimmedLine)) {
        const cleanText = trimmedLine.replace(/^- /, '');
        const { text, project } = this.extractProject(cleanText);
        
        const todo = {
          id: this.generateId(),
          text: text,
          completed: false,
          project: project,
          subtasks: [],
          timeBlock: this.currentView.block || 'day',
          timePeriod: this.currentView.period || 'today',
          day: this.currentView.day,
          createdAt: new Date().toISOString()
        };
        
        if (currentTodo && isSubtask) {
          currentTodo.subtasks.push({
            id: this.generateId(),
            text: cleanText,
            completed: false,
            project: project
          });
        } else {
          todos.push(todo);
          currentTodo = todo;
        }
      }
    });
    
    return todos;
  }
  
  extractProject(text) {
    const projectMatch = text.match(/@(\w+)/);
    if (projectMatch) {
      const project = projectMatch[1];
      const cleanText = text.replace(`@${project}`, '').trim();
      return { text: cleanText, project: project };
    }
    return { text: text, project: null };
  }
  
  clearQuickEntry() {
    if (this.quickInput) {
      this.quickInput.value = '';
    }
  }
  
  // Todo Rendering
  renderTodos() {
    if (!this.todoList) return;
    
    const filteredTodos = this.getFilteredTodos();
    
    if (filteredTodos.length === 0) {
      this.todoList.innerHTML = `
        <div class="empty-state">
          <h3>No tasks yet</h3>
          <p>Use the quick entry above to add your first task, or click on a different time block to see other tasks.</p>
        </div>
      `;
      this.updateStats(0, 0);
      return;
    }
    
    this.todoList.innerHTML = filteredTodos.map(todo => this.renderTodo(todo)).join('');
    this.updateStats(filteredTodos.length, filteredTodos.filter(t => t.completed).length);
  }
  
  getFilteredTodos() {
    const { block, period, day } = this.currentView;
    
    return this.todos.filter(todo => {
      // Handle different time block filtering
      if (block === 'day' && day !== undefined) {
        return todo.day === day;
      } else if (block === 'day' && period === 'today') {
        return todo.timeBlock === 'day' && todo.timePeriod === 'today';
      } else if (block === 'week') {
        if (period === 'current') {
          return todo.timeBlock === 'week' || (todo.timeBlock === 'day' && this.isInCurrentWeek(todo));
        } else {
          return todo.timeBlock === 'week' && todo.timePeriod === 'next-6';
        }
      } else if (block === 'month') {
        if (period === 'current') {
          return todo.timeBlock === 'month' || todo.timeBlock === 'week' || (todo.timeBlock === 'day' && this.isInCurrentMonth(todo));
        } else {
          return todo.timeBlock === 'month' && todo.timePeriod === 'next-6';
        }
      } else if (block === 'year') {
        return todo.timeBlock === 'year' || todo.timeBlock === 'month' || todo.timeBlock === 'week' || todo.timeBlock === 'day';
      }
      
      return true;
    });
  }
  
  isInCurrentWeek(todo) {
    return true; // Simplified for now
  }
  
  isInCurrentMonth(todo) {
    return true; // Simplified for now
  }
  
  renderTodo(todo) {
    const isSelected = this.selectedTodos.has(todo.id);
    const subtasksHtml = todo.subtasks.length > 0 ? this.renderSubtasks(todo.subtasks) : '';
    
    return `
      <div class="todo-item ${todo.completed ? 'completed' : ''} ${isSelected ? 'selected' : ''}" 
           data-id="${todo.id}">
        <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
             onclick="todoManager.toggleTodo('${todo.id}')"></div>
        <div class="todo-content">
          <div class="todo-text">${todo.text}</div>
          <div class="todo-meta">
            ${todo.project ? `<span class="todo-project">${todo.project}</span>` : ''}
            <span class="todo-timeblock">${this.getTimeBlockLabel(todo)}</span>
          </div>
          ${subtasksHtml}
        </div>
        <div class="todo-actions">
          <button class="action-btn" onclick="todoManager.toggleSelection('${todo.id}')" title="Select">
            ${isSelected ? '✓' : '□'}
          </button>
          <button class="action-btn delete-action" onclick="todoManager.deleteTodo('${todo.id}')" title="Delete">
            ×
          </button>
        </div>
      </div>
    `;
  }
  
  renderSubtasks(subtasks) {
    return `
      <div class="subtasks">
        ${subtasks.map(subtask => `
          <div class="subtask-item ${subtask.completed ? 'completed' : ''}">
            <div class="subtask-checkbox ${subtask.completed ? 'checked' : ''}" 
                 onclick="todoManager.toggleSubtask('${subtask.id}')"></div>
            <div class="subtask-text">${subtask.text}</div>
            ${subtask.project ? `<span class="todo-project">${subtask.project}</span>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }
  
  getTimeBlockLabel(todo) {
    const { timeBlock } = todo;
    
    if (timeBlock === 'day') return 'Day';
    if (timeBlock === 'week') return 'Week';
    if (timeBlock === 'month') return 'Month';
    if (timeBlock === 'year') return 'Year';
    
    return 'Day';
  }
  
  // Todo Operations
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
      this.renderTodos();
    }
  }
  
  toggleSubtask(id) {
    this.todos.forEach(todo => {
      const subtask = todo.subtasks.find(s => s.id === id);
      if (subtask) {
        subtask.completed = !subtask.completed;
        this.saveTodos();
        this.renderTodos();
      }
    });
  }
  
  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.selectedTodos.delete(id);
    this.saveTodos();
    this.renderTodos();
  }
  
  toggleSelection(id) {
    if (this.selectedTodos.has(id)) {
      this.selectedTodos.delete(id);
    } else {
      this.selectedTodos.add(id);
    }
    this.renderTodos();
  }
  
  selectAllTodos() {
    const visibleTodos = this.getFilteredTodos();
    visibleTodos.forEach(todo => this.selectedTodos.add(todo.id));
    this.renderTodos();
  }
  
  deleteSelectedTodos() {
    if (this.selectedTodos.size === 0) return;
    
    if (confirm(`Delete ${this.selectedTodos.size} selected task(s)?`)) {
      this.selectedTodos.forEach(id => {
        this.todos = this.todos.filter(t => t.id !== id);
      });
      this.selectedTodos.clear();
      this.saveTodos();
      this.renderTodos();
    }
  }
  
  // Modal Operations
  showMoveModal() {
    if (this.selectedTodos.size === 0) return;
    this.showModal('move-modal');
  }
  
  confirmMove() {
    const targetBlock = this.moveTarget?.value;
    
    this.selectedTodos.forEach(id => {
      const todo = this.todos.find(t => t.id === id);
      if (todo) {
        todo.timeBlock = targetBlock;
        todo.timePeriod = 'current';
      }
    });
    
    this.selectedTodos.clear();
    this.saveTodos();
    this.renderTodos();
    this.hideModal('move-modal');
  }
  
  showProjectModal() {
    this.showModal('project-modal');
    if (this.projectNameInput) {
      this.projectNameInput.focus();
    }
  }
  
  createProject() {
    if (!this.projectNameInput) return;
    
    const name = this.projectNameInput.value.trim();
    if (!name) return;
    
    const project = {
      id: this.generateId(),
      name: name,
      description: this.projectDescInput?.value.trim() || '',
      createdAt: new Date().toISOString()
    };
    
    this.projects.push(project);
    this.saveProjects();
    this.renderProjects();
    this.hideModal('project-modal');
    
    this.projectNameInput.value = '';
    if (this.projectDescInput) {
      this.projectDescInput.value = '';
    }
  }
  
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
    }
  }
  
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  // Project Management
  renderProjects() {
    if (!this.projectsList) return;
    
    if (this.projects.length === 0) {
      this.projectsList.innerHTML = '<div class="empty-projects">No projects yet</div>';
      return;
    }
    
    this.projectsList.innerHTML = this.projects.map(project => {
      const todoCount = this.todos.filter(t => t.project === project.name).length;
      return `
        <div class="project-item" onclick="todoManager.filterByProject('${project.name}')">
          <span class="project-name">${project.name}</span>
          <span class="project-count">${todoCount}</span>
        </div>
      `;
    }).join('');
  }
  
  filterByProject(projectName) {
    // This would filter todos by project - simplified for now
    console.log('Filtering by project:', projectName);
  }
  
  exportData() {
    const data = {
      todos: this.todos,
      projects: this.projects,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  // Service Worker Registration
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('./sw.js');
        console.log('Service Worker registered');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }
  
  // Utility Functions
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  updateStats(total, completed) {
    if (this.totalCount) this.totalCount.textContent = total;
    if (this.completedCount) this.completedCount.textContent = completed;
    if (this.progressPercentage) {
      this.progressPercentage.textContent = total > 0 ? Math.round((completed / total) * 100) + '%' : '0%';
    }
  }
  
  collapseAllTodos() {
    document.querySelectorAll('.subtasks').forEach(el => {
      el.style.display = 'none';
    });
  }
  
  expandAllTodos() {
    document.querySelectorAll('.subtasks').forEach(el => {
      el.style.display = 'block';
    });
  }
  
  handleKeyboard(e) {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'a':
          e.preventDefault();
          this.selectAllTodos();
          break;
        case 'Backspace':
          e.preventDefault();
          this.deleteSelectedTodos();
          break;
        case 'n':
          e.preventDefault();
          if (this.quickInput) {
            this.quickInput.focus();
          }
          break;
      }
    }
    
    if (e.key === 'Escape') {
      this.selectedTodos.clear();
      this.renderTodos();
    }
  }
  
  // Data Persistence
  saveTodos() {
    localStorage.setItem('professional-todos', JSON.stringify(this.todos));
  }
  
  saveProjects() {
    localStorage.setItem('todo-projects', JSON.stringify(this.projects));
  }
}

// Initialize the app
const todoManager = new TodoManager();

// Global functions for inline event handlers
window.todoManager = todoManager;

// Cache buster - 07/19/2025 00:42:37
