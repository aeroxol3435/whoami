const mineflayer = require('mineflayer')
const express = require('express')

// ========= CONFIG =========

const config = {
  host: 'play.royallsmp.fun',   // <-- change this
  port: 25565,
  username: 'whoami',
  version: "1.21.1",
  reconnectDelay: 10000
}

let bot
let reconnecting = false

// ========= RENDER UPTIME SERVER =========

const app = express()
app.get('/', (req, res) => {
  res.send('Bot is running.')
})

const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
  console.log(`🌐 Uptime server running on port ${PORT}`)
})

// ========= CREATE BOT FUNCTION =========

function createBot() {

  console.log("🔄 Creating bot...")

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version
  })

  // ===== LOGIN SUCCESS =====

  bot.on('login', () => {
    console.log("✅ Successfully connected to server!")
  })

  // ===== SPAWN EVENT =====

  bot.on('spawn', () => {
    console.log("🌍 Spawned in world.")

    // Send login after 5 seconds
    setTimeout(() => {
      console.log("🔐 Sending /login alif123")
      bot.chat("/login alif123")
    }, 5000)
  })

  // ===== CHAT LOGGER =====

  bot.on('messagestr', (message) => {
    console.log("💬", message)
  })

  // ===== KICK LOGGER =====

  bot.on('kicked', (reason, loggedIn) => {
    console.log("🚨 BOT WAS KICKED!")
    console.log("Was logged in:", loggedIn)

    try {
      if (typeof reason === 'object') {
        console.log("Kick reason:", JSON.stringify(reason))
      } else {
        console.log("Kick reason:", reason)
      }
    } catch {
      console.log("Kick reason (raw):", reason)
    }
  })

  // ===== DISCONNECT LOGGER =====

  bot.on('end', (reason) => {
    console.log("❌ Disconnected from server.")
    console.log("Disconnect reason:", reason)
    reconnect()
  })

  bot.on('error', (err) => {
    console.log("⚠️ Error:", err)
  })
}

// ========= RECONNECT SYSTEM =========

function reconnect() {
  if (reconnecting) return
  reconnecting = true

  console.log(`🔁 Reconnecting in ${config.reconnectDelay / 1000} seconds...`)

  setTimeout(() => {
    reconnecting = false
    createBot()
  }, config.reconnectDelay)
}

// ========= START =========

createBot()
