const mineflayer = require('mineflayer')
const express = require('express')

// ===== EXPRESS SERVER (UPTIME PING) =====
const app = express()

app.get('/', (req, res) => {
  res.send('Bot is running!')
})

app.listen(3000, () => {
  console.log('Uptime server running on port 3000')
})

// ===== CREATE BOT =====
const bot = mineflayer.createBot({
  host: 'play.royallsmp.fun',
  port: 25565,
  username: 'whoami'
})

// ===== WHEN BOT JOINS =====
bot.on('spawn', () => {
  console.log('Bot joined server!')

  // Wait 5 seconds then login
  setTimeout(() => {
    bot.chat('/login alif123')
    console.log('Logged in')

    // Wait 3 seconds after login
    setTimeout(() => {
      console.log('Now AFK forever...')
      startAfk()
    }, 3000)

  }, 5000)
})

// ===== SIMPLE AFK SYSTEM =====
function startAfk() {
  setInterval(() => {
    bot.setControlState('jump', true)

    setTimeout(() => {
      bot.setControlState('jump', false)
    }, 500)

  }, 30000) // jump every 30 sec
}

// ===== PRIVATE MESSAGE LISTENER =====
bot.on('message', (jsonMsg) => {
  const msg = jsonMsg.toString()

  // Check if message contains private message format
  // Example format usually:
  // [alifthepro123 -> you] hello

  if (msg.includes('alifthepro123') && msg.includes('->')) {

    // Extract message text after ]
    const split = msg.split('] ')
    if (split.length > 1) {
      const messageText = split[1]

      console.log('Message from alifthepro123:', messageText)

      // Reply with same text
      bot.chat(messageText)
    }
  }
})

// ===== ERROR HANDLING =====
bot.on('kicked', console.log)
bot.on('error', console.log)