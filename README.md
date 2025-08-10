# Steam Limbus AI Notifier

This project is an AI agent that monitors the online player count for the game Limbus Company using the Steam API. It notifies the user whenever the player count reaches an all-time new high.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [License](#license)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/steam-limbus-ai-notifier.git
   ```

2. Navigate to the project directory:

   ```
   cd steam-limbus-ai-notifier
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your configuration settings (see Configuration section).

## Usage

To start the AI agent, run the following command:

```
node src/index.js
```

The agent will begin monitoring the online player count for Limbus Company and will send notifications when a new high is reached.

## Configuration

You need to set up your environment variables in the `.env` file. Here are the required variables:

- `STEAM_API_KEY`: Your Steam API key.
- `NOTIFICATION_SERVICE`: The service you want to use for notifications (e.g., email, SMS).
- `THRESHOLD`: The threshold for notifications (optional).

## Recent Changes

### August 2025 - Background Image Fix

**Fixed:** Background image not displaying on web interface

**Changes Made:**

- ✅ Fixed ES module `__dirname` compatibility issue in `src/webInterface.js`
- ✅ Updated `src/index.js` to use proper web interface server with static asset handling
- ✅ Verified static file serving for `/assets/maxresdefault-2.jpg`
- ✅ Added comprehensive path resolution for different deployment environments
- ✅ Enhanced error logging and debugging capabilities

**Result:** Background image now displays correctly on the web interface at `http://localhost:3000`

## Known Issues

### Background Image Not Displaying ✅ **FIXED**

- **Request:** Add a background image to the web app using the following URL: `https://i.postimg.cc/sxvscGhm/maxresdefault-2.jpg`.
- **Request:** Fix the background so it appears correctly by moving styles to the `<body>` tag.
- **Request:** Change the background image to use a local file (`/assets/maxresdefault-2.jpg`) instead of a URL-hosted one, and update the server to serve static assets.
- **Previous Issue:** Despite these changes, the background image still did not appear on the web app.

#### **Fix Applied (August 2025):**

**Root Causes Identified:**

1. **ES Module `__dirname` Issue**: The `__dirname` variable is not available in ES modules, causing path resolution failures for static assets.
2. **Wrong Server Implementation**: The `index.js` was using a simple HTTP server instead of the comprehensive `webInterface.js` server that handles static file serving.

**Solutions Implemented:**

1. **Fixed ES Module Path Resolution** in `src/webInterface.js`:

   ```javascript
   import { fileURLToPath } from "url";
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);
   ```

2. **Updated Server Architecture** in `src/index.js`:
   - Removed the simple HTTP server that only handled the root route
   - Implemented proper use of `createWebInterfaceServer()` which includes:
     - Static asset serving from `/assets/` directory
     - Multiple path resolution for different deployment scenarios
     - Proper MIME type detection for images
     - CORS headers and caching support
     - Comprehensive error logging and debugging

**Result:** The background image now loads correctly at `http://localhost:3000/assets/maxresdefault-2.jpg` and displays as the page background. Server logs confirm the image file (104KB) is properly detected and served with `image/jpeg` content type.

### Background Music Not Playing

- **Request:** Add background music to the web app interface using a user-provided audio file and a volume slider.
- **Request:** Change the background music source to a Catbox-hosted MP3 file and enable autoplay.
- **Request:** Make the audio automatically play for the user upon entering the web app interface.
- **Note:** Despite these changes, the background music cannot be heard and the audio slider cannot be seen on the web app. This may be due to browser autoplay restrictions, audio hosting issues, or rendering problems. Further investigation is needed.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
