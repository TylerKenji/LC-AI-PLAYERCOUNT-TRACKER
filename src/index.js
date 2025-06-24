import dotenv from 'dotenv';
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