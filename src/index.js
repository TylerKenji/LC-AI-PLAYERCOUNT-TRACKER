import dotenv from 'dotenv';
import http from 'http';
import AIAgent from './aiAgent.js';
import notifier from './notifier.js';
import config from './config/index.js';
import { loadAllTimeHigh } from './steamApi.js';

dotenv.config();

const TRACING_ENABLED = process.env.TRACING === 'true';

function trace(...args) {
    if (TRACING_ENABLED) {
        console.log('[TRACE]', ...args);
    }
}

const PORT = process.env.PORT || 3000;

trace('Starting application with config:', config);

// Load all-time high from file before starting monitoring
await loadAllTimeHigh();
trace('All-time high loaded from file.');

const aiAgent = new AIAgent(config.steamApiKey, notifier, trace);

trace('AIAgent initialized. Starting monitoring...');
aiAgent.startMonitoring(config.checkInterval);

// Minimal HTTP server for Azure health checks
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});