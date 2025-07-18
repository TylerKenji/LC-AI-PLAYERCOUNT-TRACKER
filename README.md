# Limbus Company Player Count Tracker

An AI-powered monitoring application that tracks the all-time high player count for Limbus Company on Steam. Features a rich web interface with background visuals and audio, plus intelligent notifications when new records are reached.

## ✨ Features

- **Real-time Steam API monitoring** - Tracks Limbus Company player counts
- **All-time high detection** - Automatically detects and records new player count records
- **Rich web interface** - Beautiful UI with background image and audio controls
- **Historical tracking** - Displays the last 5 all-time high records with timestamps
- **AI-powered notifications** - Smart alerting system when new highs are reached
- **Asset serving** - Serves static assets including images and audio files

## 🖥️ Web Interface

The application provides a rich web interface featuring:
- Background image from local assets (`/assets/maxresdefault-2.jpg`)
- Background music with volume controls
- Semi-transparent overlays for better readability
- Real-time display of current all-time high
- Historical record display with timestamps

## 📋 Prerequisites

- Node.js (version 14 or higher)
- Steam API key (get one at https://steamcommunity.com/dev/apikey)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TylerKenji/LC-AI-PLAYERCOUNT-TRACKER.git
   cd LC-AI-PLAYERCOUNT-TRACKER
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   STEAM_API_KEY=your_steam_api_key_here
   NOTIFICATION_THRESHOLD=1000
   NOTIFIER_SERVICE=email
   NOTIFIER_EMAIL=your_email@example.com
   TRACING=false
   PORT=3000
   ```

## 🏃‍♂️ Usage

**Start the application:**
```bash
npm start
```

**Access the web interface:**
Open your browser and navigate to `http://localhost:3000`

The application will:
- Begin monitoring Limbus Company player counts via Steam API
- Display the current all-time high on the web interface
- Show historical records of the last 5 all-time highs
- Send notifications when new records are detected

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `STEAM_API_KEY` | Your Steam API key | - | ✅ |
| `NOTIFICATION_THRESHOLD` | Minimum player count for notifications | 1000 | ❌ |
| `NOTIFIER_SERVICE` | Notification service type | email | ❌ |
| `NOTIFIER_EMAIL` | Email address for notifications | - | ❌ |
| `TRACING` | Enable debug tracing | false | ❌ |
| `PORT` | Web server port | 3000 | ❌ |

### Getting a Steam API Key

1. Visit https://steamcommunity.com/dev/apikey
2. Log in with your Steam account
3. Enter a domain name (can be localhost for development)
4. Copy the generated API key to your `.env` file

## 🏗️ Project Structure

```
LC-AI-PLAYERCOUNT-TRACKER/
├── src/
│   ├── index.js           # Main application entry point
│   ├── webInterface.js    # Rich web interface server
│   ├── aiAgent.js         # AI monitoring agent
│   ├── steamApi.js        # Steam API integration
│   ├── notifier.js        # Notification system
│   └── config/
│       └── index.js       # Configuration management
├── assets/
│   └── maxresdefault-2.jpg # Background image
├── package.json
├── .env.example           # Example environment file
└── README.md
```

## 🔧 Technical Details

### Architecture

- **ES Modules**: Uses modern JavaScript module syntax
- **Express-free**: Lightweight HTTP server using Node.js built-in `http` module
- **Environment-based config**: Flexible configuration via environment variables
- **Asset serving**: Built-in static file serving for images and media

### Key Components

1. **Web Interface** (`webInterface.js`): Serves the rich UI with background image and audio
2. **AI Agent** (`aiAgent.js`): Monitors player counts and detects new records
3. **Steam API** (`steamApi.js`): Handles Steam API integration and data persistence
4. **Notifier** (`notifier.js`): Manages notification delivery systems

## 🐛 Troubleshooting

### Common Issues

**Background image not loading:**
- Ensure `assets/maxresdefault-2.jpg` exists in the project directory
- Check file permissions and accessibility
- Verify the web server is serving static assets correctly

**Steam API errors:**
- Verify your Steam API key is correct and active
- Check internet connectivity
- Ensure the Steam API service is available

**Audio not playing:**
- Modern browsers require user interaction before playing audio
- Check browser autoplay policies
- Verify the audio URL is accessible

**Port already in use:**
- Change the `PORT` environment variable to use a different port
- Kill any existing processes using port 3000

## 🔄 Recent Updates

- ✅ Fixed web interface integration - now properly uses rich UI from `webInterface.js`
- ✅ Resolved ES module compatibility issues with `__dirname`
- ✅ Updated dependencies and fixed security vulnerabilities
- ✅ Added proper asset serving for background images
- ✅ Enhanced documentation and setup instructions

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for more details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.