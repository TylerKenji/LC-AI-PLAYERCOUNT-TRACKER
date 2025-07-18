# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-07-12

### 🎉 Major Fixes
- **Fixed web interface integration**: Application now properly uses the rich web interface from `webInterface.js` instead of the basic HTML server
- **Resolved ES module compatibility**: Fixed `__dirname` undefined issue in ES modules by implementing proper `fileURLToPath` import
- **Enhanced security**: Updated vulnerable `axios` dependency from `0.21.1` to latest secure version

### ✨ Added
- **Comprehensive documentation**: Added detailed README with setup instructions, troubleshooting, and project structure
- **Technical documentation**: Created TECHNICAL.md with architecture details and development notes
- **Environment template**: Added `.env.example` with all required environment variables
- **Changelog**: Added this changelog to track project evolution

### 🔧 Fixed
- **Dependency management**: Resolved missing npm dependencies issue
- **Server architecture**: Eliminated duplicate server setup, now uses single rich interface server
- **Asset serving**: Background image and audio now properly served from local assets
- **Import statements**: Cleaned up unused imports in main entry point

### 🗂️ Project Structure
- ✅ Rich web interface with background image and audio controls
- ✅ Proper ES module support throughout the codebase
- ✅ Centralized configuration management
- ✅ Asset serving for static files
- ✅ Comprehensive error handling and logging

### 🧪 Tested
- ✅ Application starts without errors
- ✅ Web interface accessible on localhost:3000
- ✅ Background image loads correctly from `/assets/maxresdefault-2.jpg`
- ✅ Audio controls display and function properly
- ✅ All-time high display works (pending Steam API key configuration)

### 📋 Migration Notes
If updating from a previous version:
1. Run `npm install` to update dependencies
2. Create `.env` file based on `.env.example`
3. Add your Steam API key to the `.env` file
4. Restart the application

### 🔜 Next Steps
- Configure Steam API key for full functionality
- Set up notification email if desired
- Consider adding database integration for better data persistence

---

## [1.0.0] - Initial Release

### Features
- Basic Steam API monitoring for Limbus Company
- All-time high player count tracking
- Web interface (basic version)
- Email notification system
- File-based data persistence
