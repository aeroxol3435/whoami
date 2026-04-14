const mineflayer = require('mineflayer')
const express = require('express')

// ===== EXPRESS SERVER (RENDER PORT FIX) =====
const app = express()

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Bot is running!')
})

app.listen(PORT, () => {
  console.log(`Uptime server running on port ${PORT}`)
})

// ===== CREATE BOT =====
const bot = mineflayer.createBot({
  host: 'play.royallsmp.fun',
  port: 25565,
  username: 'whoami'
})

// ===== WHEN BOT SPAWNS =====
bot.on('spawn', () => {
  console.log('Bot joined server!')

  // Wait 5 sec
  setTimeout(() => {
    bot.chat('/login alif123')
    console.log('Login command sent.')

    // Wait 3 sec then AFK
    setTimeout(() => {
      console.log('AFK mode started.')
      startAfk()
    }, 3000)

  }, 5000)
})

// ===== SIMPLE SAFE AFK =====
function startAfk() {
  setInterval(() => {
    bot.setControlState('jump', true)

    setTimeout(() => {
      bot.setControlState('jump', false)
    }, 500)

  }, 30000)
}

// ===== PRIVATE MESSAGE LISTENER (FIXED) =====
bot.on('messagestr', (message) => {

  // Example format usually:
  // alifthepro123 -> you: hello
  // or
  // [alifthepro123 -> whoami] hello

  if (message.includes('alifthepro123') && message.includes('->')) {

    // Extract message after colon
    const parts = message.split(': ')
    if (parts.length > 1) {
      const msgText = parts.slice(1).join(': ')

      console.log('PM from alifthepro123:', msgText)

      bot.chat(msgText)
    }
  }

})

// ===== AUTO RECONNECT =====
bot.on('end', () => {
  console.log('Bot disconnected. Reconnecting in 10 seconds...')
  setTimeout(() => {
    process.exit(1) // Let Render restart it
  }, 10000)
})

bot.on('error', err => {
  console.log('Error:', err)
})
