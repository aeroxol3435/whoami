const mineflayer = require('mineflayer')
const express = require('express')

// ================= EXPRESS SERVER =================
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Bot is running.')
})

app.listen(PORT, () => {
  console.log(`🌐 Uptime server running on port ${PORT}`)
})

// ================= CONFIG =================
const HOST = 'play.royallsmp.fun'
const PORT_MC = 25565
const USERNAME = 'whoami'
const PASSWORD = 'alif123'
const OWNER = 'alifthepro123'

// ================= CREATE BOT =================
function startBot() {

  console.log("🔄 Creating bot...")

  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT_MC,
    username: USERNAME,
    version: false
  })

  let loggedIn = false

  // ================= SPAWN =================
  bot.once('spawn', () => {
    console.log("✅ Bot spawned into server.")
  })

  // ================= ADVANCED CHAT LOGGER =================
  bot.on('messagestr', (message, position) => {
    console.log(`💬 [${position}] ${message}`)

    const lower = message.toLowerCase()

    // ===== AUTO LOGIN DETECTION =====
    if (!loggedIn && lower.includes('login')) {
      console.log("🔐 Login requested. Sending password...")
      setTimeout(() => {
        bot.chat(`/login ${PASSWORD}`)
      }, 2000)
    }

    // ===== AUTO REGISTER DETECTION =====
    if (!loggedIn && lower.includes('register')) {
      console.log("📝 Register requested. Registering...")
      setTimeout(() => {
        bot.chat(`/register ${PASSWORD} ${PASSWORD}`)
      }, 2000)
    }

    // ===== SUCCESS LOGIN DETECTION =====
    if (lower.includes('success') || lower.includes('logged')) {
      loggedIn = true
      console.log("🟢 Successfully logged in.")
      enableAfk(bot)
    }

    // ===== PRIVATE MESSAGE SYSTEM =====
    // Works for formats like:
    // alifthepro123 -> whoami: hello
    // [alifthepro123 -> whoami] hello

    if (message.includes(OWNER) && message.includes('->')) {

      const parts = message.split(': ')
      if (parts.length > 1) {
        const text = parts.slice(1).join(': ')
        console.log(`📩 PRIVATE MESSAGE from ${OWNER}: ${text}`)

        // Reply publicly (as requested)
        bot.chat(text)
      }
    }
  })

  // ================= HUMAN-LIKE AFK =================
  function enableAfk(bot) {
    console.log("🟢 AFK system activated.")

    setInterval(() => {
      // Random look movement
      const yaw = Math.random() * Math.PI * 2
      const pitch = (Math.random() - 0.5) * 0.5
      bot.look(yaw, pitch, true)

      // Small jump occasionally
      if (Math.random() > 0.6) {
        bot.setControlState('jump', true)
        setTimeout(() => bot.setControlState('jump', false), 400)
      }

    }, 30000)
  }

  // ================= KICK LOGGER =================
  bot.on('kicked', (reason, loggedInState) => {
    console.log("🚨 BOT WAS KICKED!")
    console.log("Was logged in:", loggedInState)

    try {
      console.log("Kick reason:", JSON.stringify(reason))
    } catch {
      console.log("Kick reason raw:", reason)
    }
  })

  // ================= DISCONNECT LOGGER =================
  bot.on('end', (reason) => {
    console.log("❌ Disconnected from server.")
    console.log("Disconnect reason:", reason)

    console.log("🔁 Reconnecting in 10 seconds...")
    setTimeout(() => {
      startBot()
    }, 10000)
  })

  // ================= ERROR LOGGER =================
  bot.on('error', (err) => {
    console.log("⚠ Error:", err.message)
  })
}

// ================= START =================
startBot()
