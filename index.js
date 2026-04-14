const mineflayer = require('mineflayer')
const express = require('express')

// ================= EXPRESS (RENDER SAFE) =================
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Bot is alive.')
})

app.listen(PORT, () => {
  console.log(`🌐 Uptime server running on port ${PORT}`)
})

// ================= BOT FUNCTION =================
function createBot() {

  console.log("🔄 Creating bot...")

  const bot = mineflayer.createBot({
    host: 'play.royallsmp.fun',
    port: 25565,
    username: 'whoami',
    version: 1.21.1 // auto detect
  })

  // ===== WHEN SPAWNED =====
  bot.once('spawn', () => {
    console.log("✅ Bot spawned successfully!")

    setTimeout(() => {
      console.log("🔐 Sending login...")
      bot.chat('/login alif123')

      setTimeout(() => {
        console.log("🟢 AFK mode enabled.")
        startAfk(bot)
      }, 4000)

    }, 6000)
  })

  // ===== ADVANCED CHAT LOGGER =====
  bot.on('messagestr', (message, position) => {
    console.log(`💬 [${position}] ${message}`)

    // PRIVATE MESSAGE CHECK
    if (
      message.includes('alifthepro123') &&
      message.includes('->')
    ) {
      const parts = message.split(': ')
      if (parts.length > 1) {
        const text = parts.slice(1).join(': ')
        console.log(`📩 PM from alifthepro123: ${text}`)
        bot.chat(text)
      }
    }
  })

  // ===== KICK LOGGER =====
  bot.on('kicked', (reason, loggedIn) => {
    console.log("🚨 BOT WAS KICKED!")
    console.log("Was logged in:", loggedIn)

    try {
      console.log("Kick reason:", reason.toString())
    } catch {
      console.log("Kick reason (raw):", reason)
    }
  })

  // ===== DISCONNECT LOGGER =====
  bot.on('end', (reason) => {
    console.log("❌ Disconnected from server.")
    console.log("Disconnect reason:", reason)

    console.log("🔁 Reconnecting in 10 seconds...")
    setTimeout(() => {
      createBot()
    }, 10000)
  })

  // ===== ERROR LOGGER =====
  bot.on('error', (err) => {
    console.log("⚠ Bot error:", err.message)
  })
}

// ================= AFK SYSTEM =================
function startAfk(bot) {
  setInterval(() => {
    bot.setControlState('jump', true)
    setTimeout(() => {
      bot.setControlState('jump', false)
    }, 500)
  }, 30000)
}

// ================= START BOT =================
createBot()
