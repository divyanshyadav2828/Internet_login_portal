require('dotenv').config();
const express = require('express');
const axios = require('axios');
const https = require('https');
const path = require('path');
const ping = require('ping');

const app = express();
const PORT = process.env.PORT || 3000;

// In-Memory Session State
let activeSession = {
    username: '',
    password: '',
    autoReconnect: false
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Bypass SSL certificate errors for the local firewall IP
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// Form Builder (Now accepts dynamic credentials)
const buildFormData = (mode, username, password) => {
    const params = new URLSearchParams();
    params.append('mode', mode);
    params.append('username', username);
    if (mode === '191') {
        params.append('password', password);
    }
    params.append('a', Date.now().toString());
    params.append('producttype', '0');
    return params.toString();
};

// --- WATCHDOG TIMER ---
// Checks connection every 10 seconds if Auto-Reconnect is enabled for the active user
setInterval(async () => {
    if (!activeSession.autoReconnect || !activeSession.username) return;

    try {
        const result = await ping.promise.probe('8.8.8.8', { timeout: 2 });
        if (!result.alive) {
            console.log(`[WATCHDOG] Connection lost. Reconnecting user: ${activeSession.username}`);
            const payload = buildFormData('191', activeSession.username, activeSession.password);
            await axios.post(process.env.PORTAL_URL, payload, { 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
                httpsAgent 
            });
        }
    } catch (error) {
        console.error('[WATCHDOG] Error:', error.message);
    }
}, 10000);

// --- API ENDPOINTS ---

// Check Status
app.get('/api/internet/status', async (req, res) => {
    try {
        const result = await ping.promise.probe('8.8.8.8', { timeout: 2 });
        res.json({ 
            connected: result.alive, 
            autoReconnect: activeSession.autoReconnect,
            currentUser: result.alive ? activeSession.username : null
        });
    } catch (error) {
        res.json({ connected: false, autoReconnect: false, currentUser: null });
    }
});

// Connect (Login)
app.post('/api/internet/on', async (req, res) => {
    const { username, password, autoReconnect } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password are required.' });
    }

    // Save to active session memory
    activeSession = { username, password, autoReconnect: !!autoReconnect };

    try {
        const payload = buildFormData('191', username, password);
        await axios.post(process.env.PORTAL_URL, payload, { 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
            httpsAgent 
        });
        res.json({ success: true, message: 'Authentication successful.' });
    } catch (error) { 
        res.status(500).json({ success: false, error: 'Portal connection failed.' }); 
    }
});

// Disconnect (Logout)
app.post('/api/internet/off', async (req, res) => {
    const usernameToLogout = activeSession.username;
    
    // Clear session memory
    activeSession = { username: '', password: '', autoReconnect: false };

    try {
        const payload = buildFormData('193', usernameToLogout || 'unknown');
        await axios.post(process.env.PORTAL_URL, payload, { 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
            httpsAgent 
        });
        res.json({ success: true, message: 'Disconnected successfully.' });
    } catch (error) { 
        res.status(500).json({ success: false, error: 'Portal connection failed.' }); 
    }
});

app.get('/api/config', (req, res) => {
    res.json({ displayName: process.env.DISPLAY_NAME || 'User' });
});

app.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`); });