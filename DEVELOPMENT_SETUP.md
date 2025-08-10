# Setting Up for Local Development

This page provides step-by-step instructions for setting up your local development environment for the Steam Limbus AI Notifier project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Repository Setup](#repository-setup)
- [Environment Configuration](#environment-configuration)
- [Installation and Dependencies](#installation-and-dependencies)
- [Development Tools Setup](#development-tools-setup)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## Prerequisites

### Required Software

It's recommended that you have the following installed on your development machine:

#### Core Development Tools

- **[Visual Studio Code](https://code.visualstudio.com/)** (VSCode) - Primary code editor

  ```powershell
  winget install --exact Microsoft.VisualStudioCode
  ```

- **[PowerShell 7](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell)** - Enhanced shell for Windows

  ```powershell
  winget install --exact Microsoft.PowerShell
  ```

- **[Git](https://git-scm.com/download/win)** - Version control system

  ```powershell
  winget install --exact Git.Git
  ```

- **[GitHub CLI](https://cli.github.com/)** - Command line tool for GitHub (recommended)
  ```powershell
  winget install --exact GitHub.cli
  ```
  > 💡 **Benefits**: Simplifies GitHub operations like cloning, creating PRs, managing issues, and authentication directly from the command line.

#### Runtime Requirements

- **[Node.js V20.X LTS](https://nodejs.org/en/download/releases)** - JavaScript runtime (required)
  ```powershell
  winget install --exact OpenJS.NodeJS.LTS --version 20.17.0
  winget pin add OpenJS.NodeJS.LTS --version 20.* --force
  ```
  > 📝 **Note**: Node.js 20.x comes with npm, but you should update npm to the latest version (11.x) after installation:
  ```powershell
  npm install -g npm@latest
  ```

### Required VSCode Extensions

Install these extensions to enhance your development experience:

- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)** - JavaScript linting

  ```powershell
  code --install-extension dbaeumer.vscode-eslint
  ```

- **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)** - Code formatting

  ```powershell
  code --install-extension esbenp.prettier-vscode
  ```

- **[npm](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script)** - npm script runner

  ```powershell
  code --install-extension eg2.vscode-npm-script
  ```

- **[npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)** - Auto-completion for npm modules

  ```powershell
  code --install-extension christian-kohler.npm-intellisense
  ```

- **[Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client)** - API testing (optional)

  ```powershell
  code --install-extension rangav.vscode-thunder-client
  ```

- **[GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)** - Enhanced Git capabilities
  ```powershell
  code --install-extension eamodio.gitlens
  ```

**Install all extensions at once:**

```powershell
code --install-extension dbaeumer.vscode-eslint --install-extension esbenp.prettier-vscode --install-extension eg2.vscode-npm-script --install-extension christian-kohler.npm-intellisense --install-extension rangav.vscode-thunder-client --install-extension eamodio.gitlens
```

> 📝 **Note**: This guide uses command line tools for `git` and `npm` operations. While graphical interfaces exist for these tools, they won't be covered in this documentation.

## Repository Setup

### Forking the Repository (if contributing)

> 💡 **Info**: If you plan to contribute to the project, you'll want to work on a [forked copy](https://docs.github.com/en/get-started/quickstart/fork-a-repo) of the repository.

### Cloning the Repository

1. **Choose your development directory** (replace with your preferred path):

   ```powershell
   cd "C:\Development"
   mkdir "LimbusProjects"
   cd "LimbusProjects"
   ```

2. **Clone the repository**:

   ```powershell
   # Clone the main repository
   git clone https://github.com/yourusername/steam-limbus-ai-notifier.git
   cd steam-limbus-ai-notifier
   ```

3. **Add upstream remote** (if working with a fork):
   ```powershell
   git remote add upstream https://github.com/originalowner/steam-limbus-ai-notifier.git
   ```

### GitHub CLI Setup (Recommended)

If you installed GitHub CLI, you can use it for easier GitHub operations:

1. **Authenticate with GitHub**:

   ```powershell
   gh auth login
   ```

   Follow the prompts to authenticate via web browser or token.

2. **Alternative cloning with GitHub CLI**:

   ```powershell
   # Clone your fork (if you forked the repo)
   gh repo clone yourusername/steam-limbus-ai-notifier
   cd steam-limbus-ai-notifier

   # Automatically sets up upstream remote
   gh repo set-default TylerKenji/LC-AI-PLAYERCOUNT-TRACKER
   ```

3. **Useful GitHub CLI commands for development**:

   ```powershell
   # Create a new branch and switch to it
   gh repo create-branch feature/new-feature

   # Create a pull request
   gh pr create --title "Your PR Title" --body "Description"

   # View repository issues
   gh issue list

   # View pull requests
   gh pr list
   ```

### Directory Structure

After cloning, your project structure should look like this:

```
steam-limbus-ai-notifier/
├── src/
│   ├── aiAgent.js
│   ├── index.js
│   ├── notifier.js
│   ├── steamApi.js
│   ├── webInterface.js
│   └── config/
│       └── index.js
├── assets/
│   └── maxresdefault-2.jpg
├── .env (you'll create this)
├── .env.example (template)
├── allTimeHigh.json
├── package.json
├── README.md
└── DEVELOPMENT_SETUP.md (this file)
```

## Environment Configuration

### Creating Your Environment File

1. **Copy the environment template**:

   ```powershell
   copy .env.example .env
   ```

2. **Edit the `.env` file** with your specific configuration:

   ```properties
   # Steam API Configuration
   STEAM_API_KEY=your_actual_steam_api_key_here

   # Notification Settings
   NOTIFIER_EMAIL=your.email@example.com
   CHECK_INTERVAL=60000
   NOTIFICATION_THRESHOLD=1000

   # Development Settings
   TRACING=true
   PORT=3000

   # Azure Configuration (for deployment)
   AZURE_WEBAPP_NAME=YourWebAppName
   AZURE_RESOURCE_GROUP=your-resource-group
   AZURE_WEBAPP_URL=your-app-url.azurewebsites.net
   ```

### Required API Keys

#### Steam Web API Key

1. **Visit the Steam Web API Key page**: [https://steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey)
2. **Sign in** with your Steam account
3. **Enter a domain name** (can be localhost for development)
4. **Copy the generated API key** to your `.env` file

> ⚠️ **Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

## Installation and Dependencies

### Install Project Dependencies

1. **Verify Node.js installation**:

   ```powershell
   node --version
   npm --version
   ```

   > Expected output: Node.js v20.x.x and npm v11.x.x or later

2. **Install project dependencies**:

   ```powershell
   npm install
   ```

3. **Verify installation**:
   ```powershell
   npm list
   ```

### Understanding Dependencies

The project uses these key dependencies:

- **axios** (^0.21.1) - HTTP client for API requests
- **dotenv** (^10.0.0) - Environment variable management

> ⚠️ **Security Note**: Some dependencies may have security vulnerabilities. Run `npm audit` to check and `npm audit fix` to resolve them.

## Development Tools Setup

### Opening the Project in VSCode

1. **Open VSCode in the project directory**:

   ```powershell
   code .
   ```

2. **Install recommended extensions** when prompted

3. **Verify the workspace setup**:
   - You should see all project files in the Explorer panel
   - The integrated terminal should open in the project root
   - Git integration should show the current branch

### VSCode Configuration

Create a `.vscode/settings.json` file for project-specific settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.exclude": {
    "node_modules": true,
    ".env": false
  }
}
```

## Running the Application

### Development Mode

1. **Start the application**:

   ```powershell
   npm start
   ```

2. **Verify it's running**:
   - Check the console output for startup messages
   - Look for tracing information if `TRACING=true`
   - The web interface should be available at `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the application
- `npm test` - Runs tests (if configured)
- `npm run lint` - Lints the code (if configured)

### Development Workflow

1. **Make your changes** in the `src/` directory
2. **Test locally** using `npm start`
3. **Check for errors** in the console
4. **Commit your changes**:

   **Traditional Git approach:**

   ```powershell
   git add .
   git commit -m "Description of changes"
   git push origin your-branch-name
   ```

   **GitHub CLI approach:**

   ```powershell
   # Create a new branch for your feature
   gh repo create-branch feature/your-feature-name

   # Make your changes, then commit
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature-name

   # Create a pull request directly
   gh pr create --title "Your Feature Title" --body "Detailed description of changes"
   ```

5. **Creating Pull Requests** (GitHub CLI):

   ```powershell
   # View your PR status
   gh pr status

   # View PR checks
   gh pr checks

   # Merge when ready (if you have permissions)
   gh pr merge --merge  # or --squash or --rebase
   ```

## Troubleshooting

### Common Issues

#### Node.js Version Issues

**Problem**: Application fails to start with module errors
**Solution**: Ensure you're using Node.js v20.x LTS:

```powershell
node --version
# Should output v20.x.x
```

#### Missing Steam API Key

**Problem**: Steam API requests fail
**Solution**:

1. Verify your `.env` file exists and contains `STEAM_API_KEY`
2. Check that the API key is valid at [Steam Web API](https://steamcommunity.com/dev/apikey)

#### Port Already in Use

**Problem**: Error "EADDRINUSE: address already in use :::3000"
**Solution**:

1. Kill the process using the port:
   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   ```
2. Or change the port in your `.env` file:
   ```properties
   PORT=3001
   ```

#### Permission Errors

**Problem**: Cannot install packages or run commands
**Solution**:

1. Run PowerShell as Administrator
2. Or use a different installation directory with proper permissions

### Getting Help

If you encounter issues:

1. **Check the console output** for error messages
2. **Verify your environment configuration**
3. **Check the project's Issues page** on GitHub
4. **Review the main README.md** for additional information

## Next Steps

Now that your development environment is set up:

1. **Explore the codebase**:

   - `src/index.js` - Main application entry point
   - `src/aiAgent.js` - AI monitoring logic
   - `src/steamApi.js` - Steam API integration
   - `src/notifier.js` - Notification system

2. **Understand the data flow**:

   - Steam API → Player count monitoring → AI analysis → Notifications

3. **Start developing**:

   - Add new features
   - Improve existing functionality
   - Write tests
   - Update documentation

4. **Testing your changes**:
   - Run the application locally
   - Test with different player count scenarios
   - Verify notifications work correctly

---

**Happy coding!** 🚀

> 💡 **Tip**: Keep this guide updated as the project evolves. If you discover better practices or encounter new issues, consider updating this documentation to help future developers.
