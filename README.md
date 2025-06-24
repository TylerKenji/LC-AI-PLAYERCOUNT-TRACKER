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

## License

This project is licensed under the MIT License. See the LICENSE file for more details.