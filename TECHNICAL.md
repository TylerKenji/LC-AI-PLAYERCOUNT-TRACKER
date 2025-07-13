# Technical Documentation

## Architecture Overview

This application follows a modular architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Interface │    │   AI Agent      │    │   Steam API     │
│   (Express-free)│    │   (Monitoring)  │    │   (Data Source) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Notifier      │
                    │   (Alerts)      │
                    └─────────────────┘
```

## Key Design Decisions

### 1. ES Modules Over CommonJS
- **Rationale**: Modern JavaScript standards, better tree-shaking, cleaner syntax
- **Implementation**: `"type": "module"` in package.json
- **Challenge Solved**: `__dirname` compatibility using `fileURLToPath`

### 2. Single HTTP Server Architecture
- **Previous Issue**: Dual server setup (basic + rich interface)
- **Solution**: Consolidated to use `webInterface.js` exclusively
- **Benefits**: Consistent UI, proper asset serving, maintainable codebase

### 3. Environment-Based Configuration
- **Pattern**: Centralized config with environment variable overrides
- **File**: `src/config/index.js`
- **Security**: Automatic masking of sensitive values in logs

## Component Details

### webInterface.js
**Purpose**: Rich web interface with asset serving capabilities

**Key Features**:
- Background image serving from `/assets/`
- Audio controls with volume management
- Semi-transparent UI overlays
- Extensive path resolution for different deployment environments
- Detailed logging for debugging asset loading issues

**Asset Resolution Strategy**:
```javascript
const possiblePaths = [
    path.join(__dirname, '..', 'assets', fileName),
    path.join(process.cwd(), 'assets', fileName),
    path.join(process.cwd(), 'steam-limbus-ai-notifier', 'assets', fileName),
    path.join(process.env.HOME || '', 'site', 'wwwroot', 'assets', fileName),
    path.join(process.env.WEBSITE_ROOT_PATH || '', 'assets', fileName)
];
```

### index.js
**Purpose**: Main application orchestrator

**Responsibilities**:
- Environment setup and configuration loading
- AI agent initialization and monitoring start
- Web server instantiation using `createWebInterfaceServer`
- Graceful startup sequence with proper async/await handling

### aiAgent.js
**Purpose**: Core monitoring logic

**Expected Features** (based on imports):
- Steam API integration for player count fetching
- All-time high detection and persistence
- Notification triggering via notifier service
- Configurable monitoring intervals

### steamApi.js
**Purpose**: Steam API integration and data persistence

**Key Functions**:
- `loadAllTimeHigh()`: Loads persisted data on startup
- `getAllTimeHigh()`: Returns current all-time high value
- `getHighHistory()`: Returns historical records for display

## Development Fixes Applied

### 1. Dependency Issues
**Problem**: Missing and vulnerable dependencies
**Solution**: 
- Added missing `dotenv` and `axios` packages
- Updated `axios` from `0.21.1` to latest secure version
- Resolved security vulnerabilities

### 2. ES Module Compatibility
**Problem**: `__dirname` undefined in ES modules
**Solution**:
```javascript
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

### 3. Server Architecture
**Problem**: Dual server setup causing rich interface to be unused
**Solution**: Replaced basic HTTP server in `index.js` with call to `createWebInterfaceServer()`

## Environment Variables

### Required
- `STEAM_API_KEY`: Steam Web API key for accessing player statistics

### Optional
- `NOTIFICATION_THRESHOLD`: Minimum player count to trigger notifications (default: 1000)
- `NOTIFIER_SERVICE`: Notification delivery method (default: 'email')
- `NOTIFIER_EMAIL`: Email address for notifications
- `TRACING`: Enable detailed debug logging (default: false)
- `PORT`: Web server port (default: 3000)

## Browser Compatibility Notes

### Audio Autoplay
Modern browsers restrict autoplay to prevent unwanted audio. The application implements:
- User interaction requirement detection
- Graceful fallback when autoplay fails
- Manual controls always available

### CORS and Security
- CORS headers included for asset serving: `'Access-Control-Allow-Origin': '*'`
- Cache headers for optimal asset loading: `'Cache-Control': 'public, max-age=31536000'`

## Deployment Considerations

### Asset Serving
The application includes multiple fallback paths for asset resolution to support various deployment environments:
- Local development
- Azure App Service
- Container deployments
- Custom hosting environments

### Process Management
- Single process application
- Background monitoring via AI agent
- HTTP server for web interface
- Graceful startup sequence ensuring data loading before monitoring begins

## Future Enhancements

### Potential Improvements
1. **Database Integration**: Replace file-based persistence with proper database
2. **Real-time Updates**: WebSocket integration for live UI updates
3. **Multiple Games**: Extend monitoring to other Steam games
4. **Enhanced Notifications**: Support for Discord, Slack, SMS
5. **Analytics Dashboard**: Detailed historical analysis and trending
6. **API Endpoints**: RESTful API for external integrations

### Performance Optimizations
1. **Caching**: Implement intelligent caching for Steam API responses
2. **Rate Limiting**: Respect Steam API rate limits with backoff strategies
3. **Memory Management**: Optimize historical data storage and cleanup
4. **Asset Optimization**: Image compression and lazy loading
