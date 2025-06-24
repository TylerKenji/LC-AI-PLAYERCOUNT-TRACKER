import { fetchCurrentPlayerCount, checkNewAllTimeHigh } from './steamApi.js';

class AIAgent {
    constructor(steamApiKey, notifier, trace) {
        this.steamApiKey = steamApiKey;
        this.notifier = notifier;
        this.trace = typeof trace === 'function' ? trace : () => {};
    }

    startMonitoring(interval) {
        this.trace('Monitoring started. Interval:', interval);
        setInterval(async () => {
            try {
                this.trace('Fetching current player count...');
                const currentCount = await fetchCurrentPlayerCount(this.steamApiKey);
                this.trace('Current player count:', currentCount);
                if (await checkNewAllTimeHigh(currentCount)) {
                    this.trace('New all-time high detected:', currentCount);
                    this.notifier.sendNotification(`New all-time high player count: ${currentCount}`);
                }
            } catch (error) {
                this.trace('Error fetching player count:', error);
                console.error('Error fetching player count:', error);
            }
        }, interval);
    }
}

export default AIAgent;