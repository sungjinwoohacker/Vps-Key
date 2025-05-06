const fs = require('fs');
const { Client } = require('discord.js-selfbot-v13');
const readline = require('readline');
const fetch = require('node-fetch');
const chalk = require('chalk');
const figlet = require('figlet');

// =====================================================================
// █▄▀ █▀█ █ █▀ █░█ ▄▀█ █▄░█   █▀█ ▄▀█ █░░   █▀ █ █▄░█ █▀▀ █░█
// █░█ █▀▄ █ ▄█ █▀█ █▀█ █░▀█   █▀▀ █▀█ █▄▄   ▄█ █ █░▀█ █▄█ █▀█
// =====================================================================
//          Discord Engagement Bot with AI Message Analysis
// =====================================================================
//         Telegram: @SinghTheSilentShadow
// =====================================================================

// ========== CONFIGURATION ==========
// Messaging timing
const MIN_MSG_DELAY = 120; // 2 minutes in seconds
const MAX_MSG_DELAY = 240; // 4 minutes in seconds
const ACCOUNT_START_DELAY = 120; // 2 minute delay between starting accounts

// Activity cycles 
const WORK_PERIOD = 160; // 2 hours 40 minutes in minutes
const REST_PERIOD = 40; // 40 minutes in minutes
const LONG_WORK_PERIOD = 360; // 6 hours in minutes
const LONG_REST_PERIOD = 120; // 2 hours in minutes

// Human simulation
const TYPING_PROBABILITY = 0.85; // 85% chance to simulate typing
const TYPING_SPEED_MIN = 200; // Min milliseconds per character 
const TYPING_SPEED_MAX = 500; // Max milliseconds per character
const SAME_USER_COOLDOWN = 1800; // 30 minutes before replying to same user (in seconds)
const TYPO_CHANCE = 0.05; // 5% chance to make a typo
const CORRECTION_CHANCE = 0.70; // 70% chance to correct the typo

// Engagement features
const REACTION_PROBABILITY = 0.3; // 30% chance to react instead of replying
const COMMON_EMOJIS = ["👍", "🔥", "💯", "✨", "💪", "🚀", "⚡", "💎", "🙌", "👏"];
const DAILY_MESSAGE_LIMIT = 30; // Maximum messages/reactions per day per account

// Safety features
const EMOJI_SAFETY_MECHANISM = true; // Add occasional emojis for more natural responses
const SAFETY_EMOJIS = ["😊", "👍", "💪", "🙂", "😄", "👋", "👌", "🔥", "✅", "⭐", "🌟"];
const EMOJI_FREQUENCY = 0.4; // 40% chance to add an emoji to the message
const MESSAGE_DELAY_JITTER = 0.2; // 20% random variation in message timing
const UNUSUAL_ACTIVITY_THRESHOLD = 5; // Number of errors before temporary pause

// Message content variation
const USE_GEMINI_API = true; // Set to true to use Google Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDrGgxI463vJBmp5_tiWI2QNsPIPycQ49g'; // Replace with your API key

// Activity logging
const ENABLE_ACTIVITY_LOGGING = true;
const LOG_DIRECTORY = './logs';
const MAX_LOG_FILES = 10;
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB

// Proxy configuration (will be set dynamically based on user choice)
let USE_PROXY = false; // Initially set to false
const PROXY_LIST = [
    "http://fzzugxlw:i2c3t1yhfn3b@188.74.210.21:6100",
    "http://fzzugxlw:i2c3t1yhfn3b@45.151.162.198:6600",
    "http://fzzugxlw:i2c3t1yhfn3b@173.211.0.148:6641",
    "http://fzzugxlw:i2c3t1yhfn3b@198.23.239.134:6540",
    "http://fzzugxlw:i2c3t1yhfn3b@45.127.248.127:5128",
    "http://fzzugxlw:i2c3t1yhfn3b@154.36.110.199:6853",
    "http://fzzugxlw:i2c3t1yhfn3b@216.10.27.159:6837",
    // Add more proxies as needed
];

// Channel ID (all accounts will use this channel)
const TARGET_CHANNEL_ID = '1027161980970205225'; // Replace with your target channel ID

// Messages list
const MESSAGES = [
    "Momentum bullish",
    "Do it",
    "Keep supporting the mission, fren!",
    "Project strong mmt",
    "Strong community",
    "Momentum where money flows",
    "Powerful project with huge potential.",
    "Just grinding here and engage with the community",
    "Never giveup until we achieve it",
    "Keep grinding",
    "For real always got your back this goes hard buddy",
    "Great things takes time and efforts always",
    "Momentum here to stay",
    "No slowing, no stalling, just speed",
    "Hey",
    "Keep smile",
    "Totally vibe on point",
    "Good going",
    "We type, we rise, we conquer",
    "We move with purpose",
    "Momentum 🚀🚀",
    "Consistency is key for building momentum!",
    "Hey Mate!",
    "More passion more money",
    "No rest for the driven",
    "Keep going, crew! Doing your tasks daily makes a difference.",
    "Stay active",
    "Momentum Where Money Flows",
    "Real momentum comes from real action",
    "That was a thoughtful and meaningful contribution.",
    "Let's grow together with MMT.",
    "Step by step, we grow",
    "Momentum Finance is doing some really exciting things lately.",
    "Momentum is the key",
    "Momentum 🌟",
    "Positive vibes",
    "True. The more effort, the bigger the rewards.",
    "We are here from all over the world",
    "Keep Momentum",
    "The project is very good.",
    "Let's keep pushing",
    "Bullish - bullish on Momentum",
    "We like big wave on momentum",
    "Nothing special just trying our best",
    "Momentum good vibes here keep spirit and grind hard spread some love here ❤️",
    "Let's ride this momentum together!",
    "I love the way Momentum Finance is building their ecosystem.",
    "Push your limits every day",
    "Keep up the flow",
    "Momentum Finance's progress has been impressive!",
    "Real momentum is built in silence, let's go",
    "Grind for your future",
    "Momentum where money flows....so don't lose momentum",
    "Profits are made by the early believers.",
    "Keep grinding",
    "Love the chill vibes here! Let's keep it going!",
    "Just keep grinding, success is coming",
    "It's awesome to be part of MMT",
    "Love for MMT community",
    "Every day Momentum Finance gets stronger.",
    "Keep pushing forward, no looking back",
    "Move like water",
    "Keep grinding, you'll hit your goals soon!",
    "Your mind is your garden",
    "Momentum change life",
    "Push until you're proud",
    "This is the definition of commitment",
    "Powerful project with huge potential.",
    "The Sui Universe stays grinding, stays flowing, keeps that MOMENTUM!",
    "Just staked some MMT, feeling optimistic.",
    "We move silently but powerfully",
    "Never give up MMT lights",
    "Momentum on Sui is definitely the right combo",
    "Dance like nobody's watching — even in your chair",
    "Keep pushing, you're closer than you think!",
    "Every small step matters.",
    "You got this!",
    "Stay strong, even when it's tough.",
    "Proud of your efforts!",
    "It's okay to rest, just don't quit.",
    "You're doing better than you realize.",
    "One day at a time.",
    "Believe in your growth.",
    "You're unstoppable.",
    "Challenges make you stronger.",
    "You are your only limit.",
    "Embrace the journey.",
    "Failure is a step to success.",
    "You're capable of amazing things.",
    "Celebrate your progress.",
    "Stay patient, stay focused.",
    "Every moment counts.",
    "Keep aiming higher.",
    "Progress > Perfection.",
    "Dream it. Do it.",
    "You're closer than yesterday.",
    "Keep that energy alive.",
    "Your hard work will pay off.",
    "Mindset is everything.",
    "Strength grows in struggle.",
    "Don't doubt yourself now.",
    "Be your own hero.",
    "Big things take time.",
    "Your future self is proud.",
    "One step, one move, one win.",
    "You are a work in progress, and that's okay.",
    "Trust the process.",
    "You're built for greatness.",
    "Growth happens in discomfort.",
    "Progress feels slow but looks huge looking back.",
    "Be consistent, not perfect.",
    "Keep your head high.",
    "Motivation gets you started, discipline keeps you going.",
    "You're stronger than any obstacle.",
    "Today's effort brings tomorrow's results.",
    "Stay hungry, stay humble.",
    "You're building something incredible.",
    "Push a little harder today.",
    "Your story is just getting started.",
    "Success is the sum of small efforts.",
    "You're a lot more powerful than you think.",
    "How's everyone's day going?",
    "Let's keep winning together!",
    "Sending good vibes to the whole chat.",
    "What's everyone working on today?",
    "Always happy to see familiar faces here!",
    "Let's smash some goals today!",
    "Big respect to everyone grinding quietly.",
    "You're not alone, we're all pushing forward!",
    "If you need a break, take it — your health matters.",
    "Anyone need a little hype? I'm here!",
    "Let's make today count!",
    "Big shoutout to everyone making moves today.",
    "Let's get it!",
    "Stay locked in, legends!",
    "Growth mindset every day!",
    "Who's hitting new milestones lately?",
    "We celebrate even the small wins here!",
    "Let's keep each other accountable.",
    "Woke up today? You're already winning.",
    "Gratitude and grind — best combo!",
    "Tag a buddy and tell them they're awesome.",
    "Keep lifting each other up.",
    "We're all building greatness here!",
    "Never too late to start today!",
    "Time to dominate another day!",
    "Let's crush negativity with positive vibes.",
    "Positivity is contagious, spread it.",
    "Just showing up is powerful — keep going.",
    "Where focus goes, energy flows.",
    "Energy check: who's fired up today?",
    "Let's set the tone for the week!",
    "No one gets left behind here!",
    "Your dreams are valid — chase them hard.",
    "Stay relentless.",
    "Win or learn, never lose.",
    "Progress party in here!",
    "Build, uplift, inspire.",
    "Grind mode: ON.",
    "Today's small wins = tomorrow's big victories.",
    "I see greatness in this chat!",
    "Keep setting the bar higher.",
    "Show yourself some love too.",
    "Respect the hustle, respect the rest.",
    "Let's make history together!",
    "Reminder: You're enough as you are."
];

// Account configuration - Add your account tokens here
const ACCOUNTS = [
    { id: 1, username: "Account1", token: "MTM2ODU1ODM4Mjg4MTE4MTgwNg.GVRsv8.Nz486GYzCi8BqRk1u3J0zElWWnvmH11SHYmNUM", enabled: true },
    { id: 2, username: "Account2", token: "MTM2ODU1NTQ3MzEzNzE3NjYzOA.G3mnXh.WqRUmjclrz6fjVorsrO2y9SaGMOKbrdmNlZaal", enabled: true },
    { id: 3, username: "Account3", token: "MTM2ODU0OTYyOTIzMDA1OTY0MA.Gg1eCt.MYjGQ9SQv3Wgv3sSdQVkOq9rF7E8Gn7XzjNwJs", enabled: true },
    { id: 4, username: "Account4", token: "MTM2ODUzODA5MjY0MTk4MDQyNg.GigwfG._DsuP4GLw0BOQ_oSj2fsvz6pV_wJef0FK1BwjU", enabled: true },
    { id: 5, username: "Account5", token: "MTM2NzcyMDM2ODM5OTQ1MDIxNA.GRE1e3.XiDobKHp5HTdhzDI46LBtCxm_1aWAB-WbNfv6Y", enabled: true },
    // Add more accounts if needed (up to 10)
];

// ========== END OF CONFIGURATION ==========

// Initialize required modules
try {
    if (!fs.existsSync(LOG_DIRECTORY)){
        fs.mkdirSync(LOG_DIRECTORY);
    }
} catch (error) {
    console.error(`Error creating log directory: ${error.message}`);
}

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ============= UTILITY FUNCTIONS =============

// Display colorful banner
function showBanner() {
    console.log('\n\n');
    figlet.text('MOMENTUM BOT', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }, function(err, data) {
        if (err) {
            console.log(chalk.cyan('=================================================================='));
            console.log(chalk.magenta('                 DISCORD ENGAGEMENT BOT WITH AI                     '));
            console.log(chalk.cyan('=================================================================='));
            console.log(chalk.yellow('                Created By: ') + chalk.green('KRISHAN PAL SINGH'));
            console.log(chalk.yellow('                Telegram: ') + chalk.green('@SinghTheSilentShadow'));
            console.log(chalk.cyan('=================================================================='));
        } else {
            console.log(chalk.magenta(data));
            console.log(chalk.cyan('=================================================================='));
            console.log(chalk.yellow('                Created By: ') + chalk.green('KRISHAN PAL SINGH'));
            console.log(chalk.yellow('                Telegram: ') + chalk.green('@SinghTheSilentShadow'));
            console.log(chalk.cyan('=================================================================='));
        }
    });
}

// Activity log management
class ActivityLogger {
    constructor() {
        this.logFile = `${LOG_DIRECTORY}/activity_${new Date().toISOString().split('T')[0]}.log`;
        this.checkLogRotation();
    }

    checkLogRotation() {
        try {
            // Check if log directory exists
            if (!fs.existsSync(LOG_DIRECTORY)) {
                fs.mkdirSync(LOG_DIRECTORY, { recursive: true });
            }
            
            // Check if current log exists and its size
            if (fs.existsSync(this.logFile)) {
                const stats = fs.statSync(this.logFile);
                if (stats.size > MAX_LOG_SIZE) {
                    this.rotateLog();
                }
            }
            
            // Check if we have too many log files
            const logFiles = fs.readdirSync(LOG_DIRECTORY)
                .filter(file => file.startsWith('activity_'))
                .sort((a, b) => {
                    const timeA = fs.statSync(`${LOG_DIRECTORY}/${a}`).mtime.getTime();
                    const timeB = fs.statSync(`${LOG_DIRECTORY}/${b}`).mtime.getTime();
                    return timeB - timeA; // Sort descending (newest first)
                });
            
            // Remove oldest log files if we have too many
            if (logFiles.length > MAX_LOG_FILES) {
                for (let i = MAX_LOG_FILES; i < logFiles.length; i++) {
                    fs.unlinkSync(`${LOG_DIRECTORY}/${logFiles[i]}`);
                }
            }
        } catch (error) {
            console.error(`Error managing log files: ${error.message}`);
        }
    }

    rotateLog() {
        try {
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            fs.renameSync(this.logFile, `${this.logFile}.${timestamp}`);
        } catch (error) {
            console.error(`Error rotating log file: ${error.message}`);
        }
    }

    logActivity(accountId, activity, details = {}) {
        if (!ENABLE_ACTIVITY_LOGGING) return;

        try {
            const timestamp = new Date().toISOString();
            const logEntry = {
                timestamp,
                accountId,
                activity,
                ...details
            };
            
            fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            console.error(`Error logging activity: ${error.message}`);
        }
    }

    getSummary() {
        if (!ENABLE_ACTIVITY_LOGGING || !fs.existsSync(this.logFile)) {
            return { messagesSent: 0, reactionsAdded: 0, errors: 0 };
        }

        try {
            const content = fs.readFileSync(this.logFile, 'utf-8');
            const lines = content.split('\n').filter(line => line.trim());
            
            const summary = {
                messagesSent: 0,
                reactionsAdded: 0,
                errors: 0,
                accountActivity: {}
            };
            
            for (const line of lines) {
                try {
                    const entry = JSON.parse(line);
                    
                    // Initialize account if not exists
                    if (!summary.accountActivity[entry.accountId]) {
                        summary.accountActivity[entry.accountId] = {
                            messagesSent: 0,
                            reactionsAdded: 0,
                            errors: 0
                        };
                    }
                    
                    // Update counters
                    if (entry.activity === 'message_sent') {
                        summary.messagesSent++;
                        summary.accountActivity[entry.accountId].messagesSent++;
                    } else if (entry.activity === 'reaction_added') {
                        summary.reactionsAdded++;
                        summary.accountActivity[entry.accountId].reactionsAdded++;
                    } else if (entry.activity === 'error') {
                        summary.errors++;
                        summary.accountActivity[entry.accountId].errors++;
                    }
                } catch (err) {
                    // Skip invalid JSON lines
                }
            }
            
            return summary;
        } catch (error) {
            console.error(`Error reading log file: ${error.message}`);
            return { messagesSent: 0, reactionsAdded: 0, errors: 0 };
        }
    }
}

// Initialize activity logger
const activityLogger = new ActivityLogger();

// Countdown timer with visualization
async function countdown(seconds, message, accountId = null) {
    const prefix = accountId ? `[${accountId}] ` : '';
    console.log(chalk.blue(`${prefix}${message}`));
    
    for (let i = seconds; i > 0; i--) {
        process.stdout.write(`\r${prefix}${message} in ${chalk.yellow(i)}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    process.stdout.write(`\r${prefix}${message} starting now!${' '.repeat(20)}\n`);
}

// Dynamic proxy selection with fallback
function getProxyForAccount(accountId) {
    if (!USE_PROXY || PROXY_LIST.length === 0) {
        return null;
    }
    
    try {
        // Use a specific proxy for each account to ensure consistency
        const proxyIndex = (accountId - 1) % PROXY_LIST.length;
        const proxyUrl = PROXY_LIST[proxyIndex];
        
        console.log(chalk.blue(`[${accountId}] Using proxy: ${proxyUrl.replace(/\/\/.*?@/, '//****:****@')}`));
        
        // Import HttpsProxyAgent correctly
        try {
            const { HttpsProxyAgent } = require('https-proxy-agent');
            return new HttpsProxyAgent(proxyUrl);
        } catch (error) {
            console.error(chalk.yellow(`[${accountId}] Error importing HttpsProxyAgent: ${error.message}`));
            console.log(chalk.yellow("Try installing https-proxy-agent with: npm install https-proxy-agent"));
            
            // Log the proxy error
            activityLogger.logActivity(accountId, 'error', {
                type: 'proxy_error',
                message: error.message
            });
            
            return null;
        }
    } catch (error) {
        console.error(chalk.red(`[${accountId}] Error creating proxy agent: ${error.message}`));
        
        // Log the proxy error
        activityLogger.logActivity(accountId, 'error', {
            type: 'proxy_error',
            message: error.message
        });
        
        return null;
    }
}

// Helper functions for more human-like behavior
function makeTypo(message) {
    if (message.length < 5) return message;
    
    // Select a random character to modify
    const pos = Math.floor(Math.random() * message.length);
    const chars = message.split('');
    
    // Choose a typo type
    const typoType = Math.floor(Math.random() * 3);
    
    switch (typoType) {
        case 0: // Character swap
            if (pos < message.length - 1) {
                const temp = chars[pos];
                chars[pos] = chars[pos + 1];
                chars[pos + 1] = temp;
            }
            break;
        case 1: // Character duplication
            chars.splice(pos, 0, chars[pos]);
            break;
        case 2: // Character omission
            chars.splice(pos, 1);
            break;
    }
    
    return chars.join('');
}

function correctTypo(message, originalMessage) {
    // Simulate someone noticing and correcting their typo
    return `${message}\n*${originalMessage}`;
}

// Function to get a random emoji
function getRandomEmoji(emojiList = COMMON_EMOJIS) {
    return emojiList[Math.floor(Math.random() * emojiList.length)];
}

// Add safety emojis to message
function addSafetyEmoji(message) {
    if (!EMOJI_SAFETY_MECHANISM || Math.random() > EMOJI_FREQUENCY) {
        return message;
    }
    
    const emoji = getRandomEmoji(SAFETY_EMOJIS);
    const position = Math.random();
    
    if (position < 0.3) {
        // Add at beginning
        return `${emoji} ${message}`;
    } else if (position < 0.7) {
        // Add at end
        return `${message} ${emoji}`;
    } else {
        // Add in the middle - find a natural break point
        const sentences = message.split(/(?<=[.!?])\s+/);
        if (sentences.length > 1) {
            const insertPoint = Math.floor(Math.random() * (sentences.length - 1)) + 1;
            sentences[insertPoint] = `${emoji} ${sentences[insertPoint]}`;
            return sentences.join(' ');
        } else {
            // If no natural breaks, just add to the end
            return `${message} ${emoji}`;
        }
    }
}

// Advanced function to analyze message context and generate a relevant response with Gemini
async function generateContextualResponse(userMessage, baseMessage, accountId = 1) {
    if (!USE_GEMINI_API || !GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        console.log(chalk.yellow(`[${accountId}] Gemini API not configured, using random message`));
        return addSafetyEmoji(baseMessage);
    }

    try {
        console.log(chalk.blue(`[${accountId}] Starting message analysis...`));
        
        await countdown(3, "Analyzing message content", accountId);
        
        // Create a sophisticated prompt for better message understanding and response generation
        const prompt = `You are a sophisticated AI assistant helping a Discord user respond naturally in a crypto community focused on a project called "Momentum" or "MMT".

ORIGINAL MESSAGE: "${userMessage}"

ANALYSIS REQUESTED:
1. Determine the sentiment (positive, neutral, negative)
2. Identify the main topic of discussion
3. Extract any questions or calls to action
4. Note any specific references to Momentum/MMT

Based on this analysis, create a natural, human-sounding reply that:
- Maintains casual, conversational tone that a real Discord user would use
- Relates directly to what was said (addressing specific points when possible)
- Is brief (1-2 sentences maximum)
- Occasionally includes tiny grammar errors or casual typing styles
- Includes positive sentiment about Momentum when relevant
- Avoids sounding robotic or overly formal
- Uses natural expressions and occasional slang

I have this base message I could use: "${baseMessage}"
But feel free to create something completely different if it would sound more natural and contextual.

YOUR RESPONSE SHOULD BE ONLY THE REPLY TEXT, NOTHING ELSE.`;

        console.log(chalk.blue(`[${accountId}] Contacting Gemini API...`));
        
        // Get a proxy for this request if enabled
        const proxyAgent = getProxyForAccount(accountId);
        
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.85, // Increased randomness for more human-like responses
                    maxOutputTokens: 80, // Allow slightly longer responses when needed
                    topK: 40,
                    topP: 0.95,
                }
            })
        };
        
        // Add proxy agent if available
        if (proxyAgent) {
            fetchOptions.agent = proxyAgent;
        }

        // Make the API call to Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, fetchOptions);

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const generatedMessage = data.candidates[0].content.parts[0].text.trim();
            console.log(chalk.green(`[${accountId}] Generated response: "${generatedMessage}"`));
            
            // Add safety emoji to increase safety
            return addSafetyEmoji(generatedMessage);
        } else {
            console.log(chalk.yellow(`[${accountId}] Gemini API response didn't contain expected data, using base message`));
            if (data.error) {
                console.error(chalk.red(`[${accountId}] API Error: ${data.error.message || JSON.stringify(data.error)}`));
                
                // Log API error
                activityLogger.logActivity(accountId, 'error', {
                    type: 'api_error',
                    message: data.error.message || JSON.stringify(data.error)
                });
            }
            return addSafetyEmoji(baseMessage);
        }
    } catch (error) {
        console.error(chalk.red(`[${accountId}] Error using Gemini API: ${error.message}`));
        
        // Log API error
        activityLogger.logActivity(accountId, 'error', {
            type: 'api_error',
            message: error.message
        });
        
        // Fall back to the original message on error
        return addSafetyEmoji(baseMessage);
    }
}

// Test Gemini API at startup
async function testGeminiAPI() {
    if (!USE_GEMINI_API) {
        console.log(chalk.yellow("Gemini API integration is disabled."));
        return;
    }
    
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        console.log(chalk.yellow("Gemini API key not set. Using fallback message generation."));
        return;
    }
    
    console.log(chalk.green("Gemini API integration is enabled."));
    
    try {
        console.log(chalk.blue("Testing Gemini API connection..."));
        await countdown(3, "Preparing API test");
        
        // Try a simple test with the API
        const testMessage = await generateContextualResponse("Hello everyone!", "Great to see you!");
        console.log(chalk.green("✅ Gemini API test successful!"));
    } catch (error) {
        console.error(chalk.red(`❌ Error testing Gemini API: ${error.message}`));
        console.log(chalk.yellow("Continuing with fallback message generation."));
        
        // Log API test error
        activityLogger.logActivity('system', 'error', {
            type: 'api_test_error',
            message: error.message
        });
    }
}

// Helper function to intelligently select a user message to respond to
async function selectRandomUserMessage(channel, botUserId, accountId, recentlyEngagedUsers) {
    try {
        console.log(chalk.blue(`[${accountId}] Finding eligible users to engage with...`));
        
        // Get recent messages
        const messages = await channel.messages.fetch({ limit: 50 });
        
        // Filter out bot messages and your own messages
        const userMessages = Array.from(messages.values()).filter(msg => 
            !msg.author.bot && 
            msg.author.id !== botUserId &&
            msg.content.length > 0 && // Message must have content
            !recentlyEngagedUsers.has(msg.author.id) // Haven't engaged with this user recently
        );
        
        if (userMessages.length === 0) {
            console.log(chalk.yellow(`[${accountId}] No eligible users found to engage with`));
            return null;
        }
        
        // Select a random message with preference for more recent ones
        // This uses weighted selection, giving higher chance to more recent messages
        const weightedMessages = userMessages.map((msg, index) => ({
            message: msg,
            weight: userMessages.length - index // Higher weight for more recent messages
        }));
        
        const totalWeight = weightedMessages.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const item of weightedMessages) {
            random -= item.weight;
            if (random <= 0) {
                return item.message;
            }
        }
        
        // Fallback to completely random if the weighted selection somehow fails
        return userMessages[Math.floor(Math.random() * userMessages.length)];
    } catch (error) {
        console.error(chalk.red(`[${accountId}] Error selecting random user message: ${error.message}`));
        
        // Log the error
        activityLogger.logActivity(accountId, 'error', {
            type: 'message_selection_error',
            message: error.message
        });
        
        return null;
    }
}

// Create accounts configuration file if it doesn't exist
if (!fs.existsSync('accounts.json')) {
    fs.writeFileSync('accounts.json', JSON.stringify(ACCOUNTS, null, 2));
    console.log(chalk.yellow("Created accounts.json file. Please edit with your account tokens."));
    console.log(chalk.yellow("After editing, restart the script."));
    process.exit(0);
} else {
    try {
        const accountData = JSON.parse(fs.readFileSync('accounts.json', 'utf8'));
        if (accountData.length > 0 && accountData[0].token === "ACCOUNT_1_TOKEN") {
            console.log(chalk.yellow("Please edit accounts.json with your account tokens."));
            console.log(chalk.yellow("After editing, restart the script."));
            process.exit(0);
        }
    } catch (err) {
        console.error(chalk.red(`Error reading accounts.json. Please delete the file and restart. Error: ${err.message}`));
        process.exit(1);
    }
}

// Bot account management
class DiscordBot {
    constructor(accountInfo, channelId) {
        this.accountInfo = accountInfo;
        this.channelId = channelId;
        this.client = new Client({ checkUpdate: false });
        this.connected = false;
        this.isRunning = false;
        this.messagesSent = 0;
        this.reactionsAdded = 0;
        this.errorCount = 0;
        this.dailyMessageCount = 0;
        this.messageTimeout = null;
        this.lastMessageTime = null;
        this.restTimeout = null;
        this.longRestTimeout = null;
        this.workStartTime = null;
        this.recentlyMessagedUsers = new Map();
        this.recentlyReactedUsers = new Map();
        this.inRestPeriod = false;
        this.workSessionCount = 0;
        this.lastResetDate = new Date().toDateString();
        
        // Check daily reset every hour
        setInterval(() => this.checkDailyReset(), 60 * 60 * 1000);
    }
    
    // Check if we need to reset daily message count
    checkDailyReset() {
        const today = new Date().toDateString();
        if (today !== this.lastResetDate) {
            console.log(chalk.blue(`[${this.accountInfo.id}] Resetting daily message count`));
            this.dailyMessageCount = 0;
            this.lastResetDate = today;
        }
    }

    // Initialize the bot
    async init() {
        try {
            this.client.on('ready', () => {
                this.connected = true;
                console.log(chalk.green(`[${this.accountInfo.id}] Logged in as ${this.client.user.tag}`));
                
                // Log successful login
                activityLogger.logActivity(this.accountInfo.id, 'login', {
                    username: this.client.user.tag,
                    success: true
                });
            });

            console.log(chalk.blue(`[${this.accountInfo.id}] Connecting to Discord...`));
            
            // Get a proxy for this account
            const proxyAgent = getProxyForAccount(this.accountInfo.id);
            
            const loginOptions = {};
            if (proxyAgent) {
                loginOptions.agent = proxyAgent;
            }

            await countdown(3, "Discord login", this.accountInfo.id);
            await this.client.login(this.accountInfo.token, loginOptions);
            return true;
        } catch (error) {
            console.error(chalk.red(`[${this.accountInfo.id}] Login error: ${error.message}`));
            
            // Log login error
            activityLogger.logActivity(this.accountInfo.id, 'login', {
                success: false,
                error: error.message
            });
            
            return false;
        }
    }

    // Start the bot's messaging cycle
    start() {
        if (!this.connected) {
            console.log(chalk.yellow(`[${this.accountInfo.id}] Not connected, can't start`));
            return false;
        }

        if (this.isRunning) {
            console.log(chalk.yellow(`[${this.accountInfo.id}] Already running`));
            return false;
        }

        this.isRunning = true;
        this.workStartTime = Date.now();
        this.workSessionCount = 0;
        this.errorCount = 0;
        
        console.log(chalk.green(`[${this.accountInfo.id}] Bot started`));
        
        // Log bot start
        activityLogger.logActivity(this.accountInfo.id, 'bot_started', {
            timestamp: new Date().toISOString()
        });
        
        this.scheduleNextMessage();
        this.scheduleRest();
        this.scheduleLongRest();
        
        return true;
    }

    // Stop the bot's messaging cycle
    stop() {
        if (!this.isRunning) {
            console.log(chalk.yellow(`[${this.accountInfo.id}] Already stopped`));
            return false;
        }

        this.isRunning = false;
        
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
            this.messageTimeout = null;
        }

        if (this.restTimeout) {
            clearTimeout(this.restTimeout);
            this.restTimeout = null;
        }

        if (this.longRestTimeout) {
            clearTimeout(this.longRestTimeout);
            this.longRestTimeout = null;
        }

        console.log(chalk.yellow(`[${this.accountInfo.id}] Bot stopped`));
        
        // Log bot stop
        activityLogger.logActivity(this.accountInfo.id, 'bot_stopped', {
            timestamp: new Date().toISOString(),
            messagesSent: this.messagesSent,
            reactionsAdded: this.reactionsAdded,
            runningTime: this.workStartTime ? Math.floor((Date.now() - this.workStartTime) / 1000 / 60) : 0
        });
        
        return true;
    }

    // Schedule regular rest periods (2h40m work, 40m rest)
    async scheduleRest() {
        if (this.restTimeout) {
            clearTimeout(this.restTimeout);
        }

        const workPeriodMs = WORK_PERIOD * 60 * 1000;
        console.log(chalk.blue(`[${this.accountInfo.id}] Scheduled regular rest after ${WORK_PERIOD} minutes of work`));

        // Schedule start of rest period
        this.restTimeout = setTimeout(async () => {
            if (!this.isRunning) return;
            
            console.log(chalk.blue(`[${this.accountInfo.id}] Starting regular rest period (${REST_PERIOD} minutes)`));
            this.inRestPeriod = true;
            
            // Log start of rest period
            activityLogger.logActivity(this.accountInfo.id, 'rest_started', {
                type: 'regular',
                duration: REST_PERIOD
            });
            
            await countdown(REST_PERIOD * 60, "Regular rest period", this.accountInfo.id);
            
            if (!this.isRunning) return;
            
            console.log(chalk.green(`[${this.accountInfo.id}] Ending regular rest period, resuming activity`));
            this.inRestPeriod = false;
            this.workSessionCount++;
            
            // Log end of rest period
            activityLogger.logActivity(this.accountInfo.id, 'rest_ended', {
                type: 'regular'
            });
            
            this.scheduleNextMessage();
            this.scheduleRest(); // Schedule next rest period
        }, workPeriodMs);
    }

    // Schedule long rest periods (6h work, 2h rest)
    async scheduleLongRest() {
        if (this.longRestTimeout) {
            clearTimeout(this.longRestTimeout);
        }

        const longWorkPeriodMs = LONG_WORK_PERIOD * 60 * 1000;
        console.log(chalk.blue(`[${this.accountInfo.id}] Scheduled long rest after ${LONG_WORK_PERIOD} minutes of work`));

        // Schedule start of long rest period
        this.longRestTimeout = setTimeout(async () => {
            if (!this.isRunning) return;
            
            console.log(chalk.blue(`[${this.accountInfo.id}] Starting LONG rest period (${LONG_REST_PERIOD} minutes)`));
            this.inRestPeriod = true;
            
            // Log start of long rest period
            activityLogger.logActivity(this.accountInfo.id, 'rest_started', {
                type: 'long',
                duration: LONG_REST_PERIOD
            });
            
            await countdown(LONG_REST_PERIOD * 60, "Long rest period", this.accountInfo.id);
            
            if (!this.isRunning) return;
            
            console.log(chalk.green(`[${this.accountInfo.id}] Ending LONG rest period, resuming activity`));
            this.inRestPeriod = false;
            this.workSessionCount = 0; // Reset work session count
            
            // Log end of long rest period
            activityLogger.logActivity(this.accountInfo.id, 'rest_ended', {
                type: 'long'
            });
            
            this.scheduleNextMessage();
            this.scheduleLongRest(); // Schedule next long rest period
        }, longWorkPeriodMs);
    }

    // Get a random delay for messages with jitter
    getRandomDelay() {
        // Base delay between MIN and MAX
        const baseDelay = Math.floor(Math.random() * (MAX_MSG_DELAY - MIN_MSG_DELAY + 1) + MIN_MSG_DELAY);
        
        // Add some randomization based on jitter setting
        const jitterRange = baseDelay * MESSAGE_DELAY_JITTER;
        const jitterAmount = (Math.random() * jitterRange * 2) - jitterRange; // Between -jitterRange and +jitterRange
        
        return Math.max(MIN_MSG_DELAY * 0.5, Math.floor(baseDelay + jitterAmount));
    }

    // Get a random message
    getRandomMessage() {
        return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    }

    // Schedule the next message
    async scheduleNextMessage() {
        if (!this.isRunning) return;
        
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
            this.messageTimeout = null;
        }
        
        // If in rest period, don't schedule next message
        if (this.inRestPeriod) {
            console.log(chalk.blue(`[${this.accountInfo.id}] In rest period, not scheduling messages`));
            return;
        }
        
        // Check if we've had too many errors
        if (this.errorCount >= UNUSUAL_ACTIVITY_THRESHOLD) {
            console.log(chalk.red(`[${this.accountInfo.id}] Too many errors (${this.errorCount}), pausing for safety`));
            
            // Log safety pause
            activityLogger.logActivity(this.accountInfo.id, 'safety_pause', {
                reason: 'too_many_errors',
                errorCount: this.errorCount
            });
            
            // Reset error count and pause for 30 minutes
            this.errorCount = 0;
            
            await countdown(30 * 60, "Safety pause due to errors", this.accountInfo.id);
            
            if (!this.isRunning) return;
            console.log(chalk.green(`[${this.accountInfo.id}] Resuming after safety pause`));
        }
        
        // Check daily message limit
        if (this.dailyMessageCount >= DAILY_MESSAGE_LIMIT) {
            console.log(chalk.yellow(`[${this.accountInfo.id}] Daily message limit reached, waiting until tomorrow`));
            
            // Log daily limit reached
            activityLogger.logActivity(this.accountInfo.id, 'daily_limit_reached', {
                messageCount: this.dailyMessageCount,
                limit: DAILY_MESSAGE_LIMIT
            });
            
            // Schedule next attempt for after midnight
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            tomorrow.setHours(0, 5, 0, 0); // 12:05 AM
            
            const msUntilTomorrow = tomorrow.getTime() - now.getTime();
            
            this.messageTimeout = setTimeout(() => {
                // Reset the counter (just in case the hourly check missed it)
                this.dailyMessageCount = 0;
                this.scheduleNextMessage();
            }, msUntilTomorrow);
            
            return;
        }
        
        const delaySeconds = this.getRandomDelay();
        
        console.log(chalk.blue(`[${this.accountInfo.id}] Next message in ${delaySeconds} seconds (${(delaySeconds/60).toFixed(1)} minutes)`));
        
        // Log next message schedule
        activityLogger.logActivity(this.accountInfo.id, 'message_scheduled', {
            delaySeconds: delaySeconds,
            scheduledTime: new Date(Date.now() + delaySeconds * 1000).toISOString()
        });
        
        // Use countdown timer for better visualization
        await countdown(delaySeconds, "Next message", this.accountInfo.id);
        
        if (this.isRunning) {
            this.sendRandomMessage();
        }
    }

    // Simulate typing and send a message
    async simulateTypingThenSend(channel, message, content) {
        try {
            // Randomly decide whether to simulate typing
            if (Math.random() < TYPING_PROBABILITY) {
                // Calculate typing time based on message length and random typing speed
                const typingSpeed = Math.floor(Math.random() * (TYPING_SPEED_MAX - TYPING_SPEED_MIN + 1) + TYPING_SPEED_MIN);
                const typingTime = Math.min(10000, content.length * typingSpeed);
                
                console.log(chalk.blue(`[${this.accountInfo.id}] Simulating typing for ${(typingTime/1000).toFixed(1)} seconds...`));
                await message.channel.sendTyping();
                
                // Use countdown for typing
                await countdown(Math.ceil(typingTime/1000), "Typing", this.accountInfo.id);
            }
            
            // Send the message
            return await message.reply(content);
        } catch (error) {
            console.error(chalk.red(`[${this.accountInfo.id}] Error while typing/sending: ${error.message}`));
            
            // Log sending error
            activityLogger.logActivity(this.accountInfo.id, 'error', {
                type: 'send_error',
                message: error.message
            });
            
            this.errorCount++;
            throw error;
        }
    }

    // Add a reaction to a message
    async addReaction(message) {
        try {
            const emoji = getRandomEmoji();
            
            await countdown(2, "Adding reaction", this.accountInfo.id);
            await message.react(emoji);
            
            // Update tracking
            this.reactionsAdded++;
            this.dailyMessageCount++; // Count reactions toward daily limit
            this.lastMessageTime = Date.now();
            this.recentlyReactedUsers.set(message.author.id, Date.now());
            
            // Log reaction added
            activityLogger.logActivity(this.accountInfo.id, 'reaction_added', {
                emoji: emoji,
                messageId: message.id,
                userId: message.author.id,
                username: message.author.username
            });
            
            console.log(chalk.cyan(`[${this.accountInfo.id}] Reacted to @${message.author.username} with ${emoji}`));
            return true;
        } catch (error) {
            console.error(chalk.red(`[${this.accountInfo.id}] Error adding reaction: ${error.message}`));
            
            // Log reaction error
            activityLogger.logActivity(this.accountInfo.id, 'error', {
                type: 'reaction_error',
                message: error.message
            });
            
            this.errorCount++;
            return false;
        }
    }

    // Create a combined map of recently engaged users
    getRecentlyEngagedUsers() {
        const combinedMap = new Map();
        const now = Date.now();
        
        // Add users we've messaged recently
        this.recentlyMessagedUsers.forEach((timestamp, userId) => {
            if (now - timestamp < SAME_USER_COOLDOWN * 1000) {
                combinedMap.set(userId, timestamp);
            }
        });
        
        // Add users we've reacted to recently
        this.recentlyReactedUsers.forEach((timestamp, userId) => {
            if (now - timestamp < SAME_USER_COOLDOWN * 1000) {
                combinedMap.set(userId, timestamp);
            }
        });
        
        return combinedMap;
    }

    // Send a random message to a random user
    async sendRandomMessage() {
        if (!this.isRunning || this.inRestPeriod) {
            return;
        }
        
        try {
            console.log(chalk.green(`[${this.accountInfo.id}] Finding someone to interact with...`));
            
            // Get the channel
            const channel = await this.client.channels.fetch(this.channelId);
            if (!channel) {
                console.error(chalk.red(`[${this.accountInfo.id}] Channel not found!`));
                
                // Log channel error
                activityLogger.logActivity(this.accountInfo.id, 'error', {
                    type: 'channel_not_found',
                    channelId: this.channelId
                });
                
                this.errorCount++;
                this.scheduleNextMessage();
                return;
            }
            
            // Get a random message to reply to
            const recentlyEngagedUsers = this.getRecentlyEngagedUsers();
            const randomUserMsg = await selectRandomUserMessage(channel, this.client.user.id, this.accountInfo.id, recentlyEngagedUsers);
            
            if (!randomUserMsg) {
                console.log(chalk.yellow(`[${this.accountInfo.id}] No eligible users found to engage with`));
                this.scheduleNextMessage();
                return;
            }
            
            console.log(chalk.blue(`[${this.accountInfo.id}] Selected message from @${randomUserMsg.author.username}: "${randomUserMsg.content.substring(0, 50)}${randomUserMsg.content.length > 50 ? '...' : ''}"`));
            
            // Decide whether to react or reply
            const shouldReact = Math.random() < REACTION_PROBABILITY;
            
            if (shouldReact) {
                // Add a reaction
                await this.addReaction(randomUserMsg);
            } else {
                // Get a random base message
                const baseMessage = this.getRandomMessage();
                
                // Generate a contextual response using Gemini
                let messageContent = baseMessage;
                if (USE_GEMINI_API && GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
                    messageContent = await generateContextualResponse(randomUserMsg.content, baseMessage, this.accountInfo.id);
                }
                
                // Randomly introduce and maybe correct a typo
                if (Math.random() < TYPO_CHANCE) {
                    const originalMessage = messageContent;
                    const messageWithTypo = makeTypo(messageContent);
                    
                    console.log(chalk.yellow(`[${this.accountInfo.id}] Added typo: "${messageWithTypo}" (original: "${originalMessage}")`));
                    
                    // Chance to "correct" the typo
                    if (Math.random() < CORRECTION_CHANCE) {
                        messageContent = correctTypo(messageWithTypo, originalMessage);
                        console.log(chalk.yellow(`[${this.accountInfo.id}] Corrected typo`));
                    } else {
                        messageContent = messageWithTypo;
                    }
                }
                
                // Send the message
                const sentMessage = await this.simulateTypingThenSend(channel, randomUserMsg, messageContent);
                
                // Update tracking
                this.messagesSent++;
                this.dailyMessageCount++;
                this.lastMessageTime = Date.now();
                this.recentlyMessagedUsers.set(randomUserMsg.author.id, Date.now());
                
                // Log message sent
                activityLogger.logActivity(this.accountInfo.id, 'message_sent', {
                    content: messageContent,
                    responseToUserId: randomUserMsg.author.id,
                    responseToUsername: randomUserMsg.author.username,
                    originalMessage: randomUserMsg.content.substring(0, 100),
                    messageId: sentMessage ? sentMessage.id : null
                });
                
                console.log(chalk.green(`[${this.accountInfo.id}] Replied to @${randomUserMsg.author.username}: "${messageContent}"`));
            }
            
            // Schedule next message
            this.scheduleNextMessage();
            
        } catch (error) {
            console.error(chalk.red(`[${this.accountInfo.id}] Error sending message: ${error.message}`));
            
            // Log general error
            activityLogger.logActivity(this.accountInfo.id, 'error', {
                type: 'message_error',
                message: error.message
            });
            
            // If we got rate limited or encountered another error, back off
            this.errorCount++;
            console.log(chalk.yellow(`[${this.accountInfo.id}] Backing off due to error (error count: ${this.errorCount})`));
            
            // Exponential backoff based on error count (2^errorCount minutes, max 60 minutes)
            const backoffMinutes = Math.min(Math.pow(2, this.errorCount), 60);
            console.log(chalk.yellow(`[${this.accountInfo.id}] Backing off for ${backoffMinutes} minutes`));
            
            // Log backoff
            activityLogger.logActivity(this.accountInfo.id, 'backoff', {
                errorCount: this.errorCount,
                durationMinutes: backoffMinutes
            });
            
            await countdown(backoffMinutes * 60, "Error backoff period", this.accountInfo.id);
            
            if (this.isRunning) {
                this.scheduleNextMessage();
            }
        }
    }

    // Get bot status
    getStatus() {
        let status = {
            id: this.accountInfo.id,
            username: this.client.user?.tag || this.accountInfo.username,
            connected: this.connected,
            running: this.isRunning,
            messagesSent: this.messagesSent,
            reactionsAdded: this.reactionsAdded,
            dailyMessageCount: this.dailyMessageCount,
            lastMessageTime: this.lastMessageTime ? new Date(this.lastMessageTime).toLocaleTimeString() : 'Never',
            inRestPeriod: this.inRestPeriod,
            workSessionCount: this.workSessionCount,
            errorCount: this.errorCount
        };
        
        if (this.workStartTime) {
            const uptime = Math.floor((Date.now() - this.workStartTime) / 1000 / 60); // minutes
            status.uptime = `${uptime} minutes`;
        }
        
        return status;
    }

    // Disconnect the bot
    disconnect() {
        this.stop();
        this.client.destroy();
        this.connected = false;
        
        // Log disconnect
        activityLogger.logActivity(this.accountInfo.id, 'disconnected', {
            timestamp: new Date().toISOString()
        });
    }
}

// Multi-bot manager
class BotManager {
    constructor() {
        this.bots = [];
        this.isStarting = false;
        this.isInitialized = false;
    }

    // Initialize all bots
    async initialize() {
        if (this.isInitialized) return;
        
        showBanner();
        console.log(chalk.cyan("Setting up Discord multi-account bot manager with Gemini AI integration..."));
        
        // Ask user if they want to use proxies
        await new Promise((resolve) => {
            rl.question(chalk.yellow("Do you want to use proxies? (yes/no): "), (answer) => {
                USE_PROXY = answer.toLowerCase().startsWith('y');
                if (USE_PROXY) {
                    console.log(chalk.green("Proxy support enabled. Make sure your proxies are configured correctly."));
                } else {
                    console.log(chalk.yellow("Running without proxies. This may increase the risk of account detection."));
                }
                resolve();
            });
        });
        
        console.log("Loading account configuration from accounts.json...");
        
        try {
            const accountData = JSON.parse(fs.readFileSync('accounts.json', 'utf8'));
            
            // Test Gemini API
            await testGeminiAPI();
            
            // Filter enabled accounts
            const enabledAccounts = accountData.filter(account => account.enabled);
            console.log(`Found ${enabledAccounts.length} enabled accounts in configuration.`);
            
            // Initialize each bot
            for (const account of enabledAccounts) {
                console.log(`Initializing bot for account ${account.id} (${account.username})...`);
                
                const bot = new DiscordBot(account, TARGET_CHANNEL_ID);
                const success = await bot.init();
                
                if (success) {
                    this.bots.push(bot);
                    console.log(chalk.green(`Successfully initialized account ${account.id}`));
                } else {
                    console.log(chalk.red(`Failed to initialize account ${account.id}.`));
                }
                
                // Slight delay between initializing accounts
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            console.log(chalk.green(`Successfully initialized ${this.bots.length} bots.`));
            this.isInitialized = true;
            
            // Start command interface
            this.showCommandInterface();
        } catch (error) {
            console.error(`Error initializing bots: ${error.message}`);
            process.exit(1);
        }
    }

    // Start all bots with staggered timing
    async startAllBots() {
        if (this.isStarting) return;
        if (this.bots.length === 0) {
            console.log(chalk.yellow("No bots to start."));
            return;
        }
        
        this.isStarting = true;
        console.log(chalk.green("Starting all bots with staggered timing..."));
        
        for (let i = 0; i < this.bots.length; i++) {
            const bot = this.bots[i];
            console.log(chalk.blue(`Starting bot ${i+1} of ${this.bots.length} (Account ${bot.accountInfo.id})...`));
            
            bot.start();
            
            // Wait between starting bots
            if (i < this.bots.length - 1) {
                console.log(`Waiting ${ACCOUNT_START_DELAY} seconds before starting next account...`);
                await countdown(ACCOUNT_START_DELAY, "Next account startup");
            }
        }
        
        this.isStarting = false;
    }

    // Stop all bots
    stopAllBots() {
        console.log(chalk.yellow("Stopping all bots..."));
        
        for (const bot of this.bots) {
            bot.stop();
        }
        
        console.log(chalk.yellow("All bots stopped."));
    }

    // Disconnect all bots
    disconnectAllBots() {
        console.log(chalk.yellow("Disconnecting all bots..."));
        
        for (const bot of this.bots) {
            bot.disconnect();
        }
        
        console.log(chalk.yellow("All bots disconnected."));
    }

    // Show status of all bots
    showStatus() {
        console.log(chalk.cyan("\nBot Status:"));
        console.log(chalk.cyan("==================================================="));
        
        if (this.bots.length === 0) {
            console.log(chalk.yellow("No bots initialized."));
            return;
        }
        
        for (const bot of this.bots) {
            const status = bot.getStatus();
            
            console.log(chalk.cyan(`Account ${status.id} (${status.username}):`));
            console.log(chalk.cyan(`  Connected: ${status.connected ? chalk.green('Yes') : chalk.red('No')}`));
            console.log(chalk.cyan(`  Running: ${status.running ? chalk.green('Yes') : chalk.red('No')}`));
            console.log(chalk.cyan(`  Messages Sent: ${status.messagesSent}`));
            console.log(chalk.cyan(`  Reactions Added: ${status.reactionsAdded}`));
            console.log(chalk.cyan(`  Daily Message Count: ${status.dailyMessageCount}/${DAILY_MESSAGE_LIMIT}`));
            console.log(chalk.cyan(`  Last Activity: ${status.lastMessageTime}`));
            console.log(chalk.cyan(`  In Rest Period: ${status.inRestPeriod ? chalk.yellow('Yes') : 'No'}`));
            
            if (status.uptime) {
                console.log(chalk.cyan(`  Uptime: ${status.uptime}`));
            }
            
            console.log(chalk.cyan(`  Errors: ${status.errorCount}`));
            console.log(chalk.cyan("---------------------------------------------------"));
        }
        
        // Show activity summary
        const summary = activityLogger.getSummary();
        console.log(chalk.cyan("Activity Summary:"));
        console.log(chalk.cyan(`  Total Messages Sent: ${summary.messagesSent}`));
        console.log(chalk.cyan(`  Total Reactions Added: ${summary.reactionsAdded}`));
        console.log(chalk.cyan(`  Total Errors: ${summary.errors}`));
        console.log(chalk.cyan("==================================================="));
    }

    // Show help message
    showHelp() {
        console.log(chalk.cyan("\n==================================================="));
        console.log(chalk.cyan("MULTI-ACCOUNT DISCORD MESSAGING BOT"));
        console.log(chalk.cyan("==================================================="));
        console.log(chalk.cyan("Available commands:"));
        console.log(chalk.cyan("  start      - Start all bots"));
        console.log(chalk.cyan("  stop       - Stop all bots"));
        console.log(chalk.cyan("  status     - Show status of all bots"));
        console.log(chalk.cyan("  help       - Show this help message"));
        console.log(chalk.cyan("  exit       - Stop all bots and exit"));
        console.log(chalk.cyan("==================================================="));
    }

    // Start command interface
    showCommandInterface() {
        this.showHelp();
        
        rl.on('line', async (line) => {
            const command = line.trim().toLowerCase();
            
            if (command === 'start') {
                await this.startAllBots();
            } else if (command === 'stop') {
                this.stopAllBots();
            } else if (command === 'status') {
                this.showStatus();
            } else if (command === 'help') {
                this.showHelp();
            } else if (command === 'exit') {
                console.log(chalk.yellow("Stopping all bots and exiting..."));
                this.stopAllBots();
                setTimeout(() => {
                    this.disconnectAllBots();
                    rl.close();
                    process.exit(0);
                }, 1000);
            } else {
                console.log(chalk.red("Unknown command. Type 'help' for available commands."));
            }
            
            // Re-display prompt
            process.stdout.write("> ");
        });
        
        // Display initial prompt
        process.stdout.write("> ");
    }
}

// Create and initialize the bot manager
const botManager = new BotManager();
botManager.initialize();

// Handle process termination
process.on('SIGINT', () => {
    console.log(chalk.yellow("\nReceived SIGINT. Stopping all bots and exiting..."));
    botManager.stopAllBots();
    setTimeout(() => {
        botManager.disconnectAllBots();
        process.exit(0);
    }, 1000);
});
