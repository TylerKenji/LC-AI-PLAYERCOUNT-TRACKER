const config = {
    steamApiKey: process.env.STEAM_API_KEY,
    notificationThreshold: process.env.NOTIFICATION_THRESHOLD || 1000,
    checkInterval: 60000, // 1 minute in milliseconds
    notifierService: process.env.NOTIFIER_SERVICE || 'email',
    notifierEmail: process.env.NOTIFIER_EMAIL,
};

export default config;