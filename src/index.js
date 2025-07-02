import dotenv from 'dotenv';
import http from 'http';
import AIAgent from './aiAgent.js';
import notifier from './notifier.js';
import config from './config/index.js';
import { loadAllTimeHigh } from './steamApi.js';
import { createWebInterfaceServer } from './webInterface.js';

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

// Minimal HTTP server for Azure health checks and web interface
const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        // Serve the all-time high web interface
        const high = getAllTimeHigh();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
            <head><title>Limbus Company All-Time High</title></head>
            <body style="font-family:sans-serif;text-align:center;margin-top:10%">
                <h1>Limbus Company All-Time High Player Count</h1>
                <p style="font-size:2em;">${high}</p>
            </body>
            </html>
        `);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});