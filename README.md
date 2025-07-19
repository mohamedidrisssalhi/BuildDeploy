# Professional Todo Manager

A modern, feature-rich todo application with time block management and professional styling inspired by Apple's design system.

## ✨ Features

### 🎯 **Core Functionality**
- **Time Block Management** - Organize tasks by Day, Week, Month, and Year
- **Quick Entry System** - Add multiple tasks with bullet-point syntax
- **Project Organization** - Tag tasks with @project syntax
- **Subtask Support** - Nested task structure with indentation
- **Smart Filtering** - View tasks by time periods and projects

### 🎨 **User Interface**
- **Professional Design** - Clean, Apple-inspired interface
- **Dark/Light Mode** - Toggle between themes with smooth transitions
- **Responsive Layout** - Works on desktop and mobile devices
- **Interactive Elements** - Hover effects and smooth animations
- **Keyboard Shortcuts** - Efficient task management with hotkeys

### 📊 **Management Features**
- **Bulk Operations** - Select and move/delete multiple tasks
- **Progress Tracking** - Visual progress indicators and statistics
- **Data Export** - Export tasks to JSON format
- **Week Navigation** - Navigate through different weeks
- **Offline Support** - PWA with service worker

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- VS Code with Live Server extension (recommended for development)

### Installation
1. Clone or download the project files
2. Open the project folder in VS Code
3. Right-click on `index.html` and select "Open with Live Server"
4. The app will open at `http://127.0.0.1:5500`

### Alternative Setup
1. Open `index.html` directly in your browser
2. All features work offline without a server

## 📝 Usage

### Adding Tasks
Use the quick entry box with this syntax:
```
- Complete project proposal
  - Research competitors
  - Create slides
  - Schedule meeting @work
- Buy groceries @personal
- Plan vacation @family
```

### Time Block Navigation
- **Today** - Current day tasks
- **This Week** - Current week overview
- **This Month** - Monthly planning
- **This Year** - Long-term goals
- **Daily View** - Navigate specific days
- **Future Planning** - 6 weeks/months ahead

### Keyboard Shortcuts
- `Ctrl/Cmd + N` - Focus quick entry
- `Ctrl/Cmd + A` - Select all visible tasks
- `Ctrl/Cmd + Backspace` - Delete selected tasks
- `Escape` - Clear selections
- `Ctrl/Cmd + Enter` - Add tasks from quick entry

### Project Management
1. Tag tasks with `@projectname` syntax
2. View project-specific tasks in the sidebar
3. Create new projects with descriptions
4. Filter tasks by project

## 🎨 Themes

### Light Mode (Default)
- Clean white background
- Blue accent colors (#007AFF)
- High contrast text
- Professional appearance

### Dark Mode
- Dark background (#0D1117)
- Enhanced contrast
- White text for readability
- Blue accent preserved
- Smooth transitions

Toggle themes using the 🌙/☀️ button in the top-right corner.

## 📁 Project Structure

```
toDoApp/
├── index.html          # Main application file
├── style.css           # Styles with light/dark themes
├── script.js           # TodoManager class and functionality
├── manifest.json       # PWA manifest
├── sw.js              # Service worker for offline support
├── README.md          # This documentation
└── spec.md            # Technical specifications
```

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - ES6+ features, Classes
- **PWA** - Service Worker, Web App Manifest
- **Local Storage** - Data persistence

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Data Storage
- Tasks and projects stored in `localStorage`
- Automatic saving on all changes
- Theme preference persistence
- No external database required

## 🎯 Development

### File Organization
- **HTML** - Semantic structure with accessibility features
- **CSS** - BEM-like naming, CSS custom properties
- **JavaScript** - Class-based architecture, modular design

### Key Classes
- `TodoManager` - Main application controller
- Methods for CRUD operations, filtering, theming
- Event handling and DOM manipulation
- Data persistence and export functionality

### Customization
- Modify CSS custom properties for color schemes
- Extend TodoManager class for new features
- Add new time block periods
- Customize keyboard shortcuts

## 📱 PWA Features

### Installation
- Install as a standalone app on desktop/mobile
- Add to home screen on mobile devices
- Offline functionality with service worker

### Manifest Features
- Custom app icon
- Standalone display mode
- Theme color integration
- Start URL configuration

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

### Common Issues
- **CSS not loading**: Hard refresh (Ctrl+F5) to clear cache
- **Dark mode not working**: Check browser localStorage support
- **Tasks not saving**: Ensure localStorage is enabled

### Browser Cache
If you see outdated styles:
1. Hard refresh with `Ctrl+F5` or `Cmd+Shift+R`
2. Clear browser cache for the site
3. Restart Live Server if using VS Code

## 🎉 Acknowledgments

- Inspired by Apple's design system
- Uses system fonts for native feel
- Color palette based on Apple Human Interface Guidelines
- Icons and emojis for visual feedback

---