// Trace environment variable loading
function maskValue(key, value) {
    if (key.toLowerCase().includes('key') || key.toLowerCase().includes('token') || key.toLowerCase().includes('password')) {
        return value ? value.slice(0, 3) + '***' : undefined;
    }
    return value;
}

const config = {
    steamApiKey: process.env.STEAM_API_KEY,
    notificationThreshold: process.env.NOTIFICATION_THRESHOLD || 1000,
    checkInterval: 60000, // 1 minute in milliseconds
    notifierService: process.env.NOTIFIER_SERVICE || 'email',
    notifierEmail: process.env.NOTIFIER_EMAIL,
};

// Log environment variables (tracing)
Object.entries(config).forEach(([key, value]) => {
    console.log(`[ENV TRACE] ${key}:`, maskValue(key, value));
});

export default config;