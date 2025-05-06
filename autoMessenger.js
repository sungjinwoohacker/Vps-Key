require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');

// Load messages from file
const messages = [
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

// Configuration
const config = {
  TOKEN: process.env.DISCORD_TOKEN, // Your Discord account token
  TARGET_CHANNEL_ID: process.env.TARGET_CHANNEL_ID, // The channel ID where messages will be sent
  MIN_DELAY_MINUTES: 2,
  MAX_DELAY_MINUTES: 3.8,
  LOG_FILE: path.join(__dirname, 'message_log.txt')
};

// Create a new client instance
const client = new Client({
  checkUpdate: false,
});

// Variable to control message sending
let isRunning = false;
let messageInterval = null;

// Function to get a random message
function getRandomMessage() {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

// Function to get a random delay (in milliseconds)
function getRandomDelay() {
  const minDelay = config.MIN_DELAY_MINUTES * 60 * 1000;
  const maxDelay = config.MAX_DELAY_MINUTES * 60 * 1000;
  return Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
}

// Function to log messages
function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  fs.appendFile(config.LOG_FILE, logEntry, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
  
  console.log(`[${timestamp}] ${message}`);
}

// Function to start message sending
function startMessaging() {
  if (isRunning) {
    console.log('Message sending is already running.');
    return;
  }
  
  isRunning = true;
  console.log('Starting automated messaging...');
  
  // Send first message immediately
  sendRandomMessage();
}

// Function to stop message sending
function stopMessaging() {
  if (!isRunning) {
    console.log('Message sending is not running.');
    return;
  }
  
  isRunning = false;
  if (messageInterval) {
    clearTimeout(messageInterval);
    messageInterval = null;
  }
  
  console.log('Stopped automated messaging.');
}

// Function to send a random message and schedule the next one
async function sendRandomMessage() {
  if (!isRunning) return;
  
  try {
    const channel = await client.channels.fetch(config.TARGET_CHANNEL_ID);
    if (!channel || !channel.isText()) {
      console.error('Channel not found or is not a text channel.');
      return;
    }
    
    const message = getRandomMessage();
    await channel.send(message);
    
    logMessage(`Sent message: "${message}"`);
    
    // Schedule next message
    const delay = getRandomDelay();
    const nextMinutes = (delay / 60000).toFixed(2);
    logMessage(`Next message scheduled in ${nextMinutes} minutes.`);
    
    messageInterval = setTimeout(sendRandomMessage, delay);
  } catch (error) {
    console.error('Error sending message:', error);
    // Retry after a short delay
    setTimeout(sendRandomMessage, 60000);
  }
}

// Event: Client is ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log('Type "start" to begin sending messages.');
  console.log('Type "stop" to stop sending messages.');
  console.log('Type "exit" to quit the program.');
});

// Handle user commands from console
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const command = input.trim().toLowerCase();
  
  switch (command) {
    case 'start':
      startMessaging();
      break;
    case 'stop':
      stopMessaging();
      break;
    case 'exit':
      stopMessaging();
      client.destroy();
      rl.close();
      process.exit(0);
      break;
    default:
      console.log('Unknown command. Available commands: start, stop, exit');
  }
});

// Login to Discord
client.login(config.TOKEN).catch(error => {
  console.error('Failed to log in to Discord:', error);
  process.exit(1);
});

// Handle program termination
process.on('SIGINT', () => {
  stopMessaging();
  client.destroy();
  rl.close();
  console.log('\nProgram terminated.');
  process.exit(0);
});
