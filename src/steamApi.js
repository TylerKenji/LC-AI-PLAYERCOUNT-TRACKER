// steamApi.js
// Module for interacting with the Steam Web API to fetch player counts for Limbus Company.
// Provides functions to retrieve the current player count and check for new all-time highs.

import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

// Steam API endpoint for current player count
const STEAM_API_URL = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/';
// App ID for Limbus Company (1973530)
const APP_ID = '1973530';

// File path for storing the all-time high player count
const HIGH_FILE = path.resolve('./allTimeHigh.json');

// In-memory variable to track the all-time high player count during runtime
let allTimeHigh = 0;
let highHistory = [];

// Load all-time high from file at startup
export async function loadAllTimeHigh() {
    try {
        const data = await fs.readFile(HIGH_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        allTimeHigh = typeof parsed.allTimeHigh === 'number' ? parsed.allTimeHigh : 0;
        highHistory = Array.isArray(parsed.highHistory) ? parsed.highHistory : [];
    } catch (err) {
        allTimeHigh = 0;
        highHistory = [];
    }
}

// Save all-time high to file
async function saveAllTimeHigh() {
    await fs.writeFile(HIGH_FILE, JSON.stringify({ allTimeHigh, highHistory }), 'utf-8');
}

/**
 * Fetches the current player count for Limbus Company using axios.
 * Optionally accepts a Steam API key.
 * @param {string} [steamApiKey] - Optional Steam Web API key.
 * @returns {Promise<number>} The current player count.
 * @throws Will throw an error if the API request fails.
 */
export const fetchCurrentPlayerCount = async (steamApiKey) => {
    try {
        let url = `${STEAM_API_URL}?appid=${APP_ID}`;
        if (steamApiKey) {
            url += `&key=${steamApiKey}`;
        }
        const response = await axios.get(url);
        return response.data.response.player_count;
    } catch (error) {
        console.error('Error fetching player count:', error);
        throw error;
    }
};

/**
 * Checks if the provided player count is a new all-time high.
 * Updates the in-memory allTimeHigh and saves to file if so.
 * @param {number} currentCount - The current player count.
 * @returns {boolean} True if a new all-time high is reached, false otherwise.
 */
export const checkNewAllTimeHigh = async (currentCount) => {
    if (currentCount > allTimeHigh) {
        allTimeHigh = currentCount;
        highHistory.unshift({ value: currentCount, timestamp: new Date().toISOString() });
        highHistory = highHistory.slice(0, 5);
        await saveAllTimeHigh();
        return true;
    }
    return false;
};

/**
 * Gets the current all-time high player count.
 * @returns {number} The all-time high player count.
 */
export function getAllTimeHigh() {
    return allTimeHigh;
}

/**
 * Gets the history of the last 5 all-time highs.
 * @returns {Array} The array of the last 5 all-time highs with timestamps.
 */
export function getHighHistory() {
    return highHistory;
}