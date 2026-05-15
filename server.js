require('dotenv').config();
const express = require('express');
const axios = require('axios');
const https = require('https');
const path = require('path');
const ping = require('ping');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Global State
let autoReconnectActive = false;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const buildFormData = (mode) => {
    const params = new URLSearchParams();
    params.append('mode', mode);
    params.append('username', process.env.PORTAL_USERNAME);
    if (mode === '191') params.append('password', process.env.PORTAL_PASSWORD);
    params.append('a', Date.now().toString());
    params.append('producttype', '0');
    return params.toString();
};

// --- WATCHDOG TIMER ---
// Checks connection every 10 seconds if Auto-Reconnect is ON
setInterval(async () => {
    if (!autoReconnectActive) return;

    try {
        const result = await ping.promise.probe('8.8.8.8', { timeout: 2 });
        if (!result.alive) {
            console.log('[WATCHDOG] Connection lost. Attempting auto-reconnect...');
            await axios.post(process.env.PORTAL_URL, buildFormData('191'), { 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
                httpsAgent 
            });
        }
    } catch (error) {
        console.error('[WATCHDOG] Error during ping check:', error.message);
    }
}, 10000); // 10,000 ms = 10 seconds

// --- API ENDPOINTS ---

app.get('/api/internet/status', async (req, res) => {
    try {
        const result = await ping.promise.probe('8.8.8.8', { timeout: 2 });
        res.json({ connected: result.alive, autoReconnect: autoReconnectActive });
    } catch (error) {
        res.json({ connected: false, autoReconnect: autoReconnectActive });
    }
});

// NEW: Toggle Auto-Reconnect
app.post('/api/system/autologin', (req, res) => {
    autoReconnectActive = !autoReconnectActive;
    res.json({ success: true, active: autoReconnectActive, message: `Auto-Reconnect is now ${autoReconnectActive ? 'ON' : 'OFF'}` });
});

// GET: Server Config (User Display Name)
app.get('/api/config', (req, res) => {
    res.json({ displayName: process.env.DISPLAY_NAME || 'User' });
});


app.post('/api/internet/on', async (req, res) => {
    try {
        await axios.post(process.env.PORTAL_URL, buildFormData('191'), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, httpsAgent });
        res.json({ success: true, message: 'Login command sent.' });
    } catch (error) { res.status(500).json({ success: false, error: 'Portal error.' }); }
});

app.post('/api/internet/off', async (req, res) => {
    try {
        // Automatically disable auto-reconnect if you manually turn off the internet
        autoReconnectActive = false;
        await axios.post(process.env.PORTAL_URL, buildFormData('193'), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, httpsAgent });
        res.json({ success: true, message: 'Logout command sent. Auto-reconnect disabled.' });
    } catch (error) { res.status(500).json({ success: false, error: 'Portal error.' }); }
});

app.post('/api/system/lock', async (req, res) => {
    try {
        autoReconnectActive = false;
        await axios.post(process.env.PORTAL_URL, buildFormData('193'), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, httpsAgent });
        exec('rundll32.exe user32.dll,LockWorkStation', (err) => {});
        res.json({ success: true, message: 'Disconnected & Locked.' });
    } catch (error) { res.status(500).json({ success: false, error: 'Command failed.' }); }
});

app.post('/api/system/signout', async (req, res) => {
    try {
        autoReconnectActive = false;
        await axios.post(process.env.PORTAL_URL, buildFormData('193'), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, httpsAgent });
        exec('shutdown /l', (err) => {});
        res.json({ success: true, message: 'Disconnected & Signed Out.' });
    } catch (error) { res.status(500).json({ success: false, error: 'Command failed.' }); }
});

app.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`); });