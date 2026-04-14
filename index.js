const mineflayer = require('mineflayer')
const express = require('express')

// ================= CONFIG =================

const config = {
  host: 'play.royallsmp.fun',
  port: 25565,
  username: 'whoami',
  version: "1.21.1", // auto detect
  loginPassword: 'alif123', // for cracked servers
  reconnectDelay: 10000
}

// ==========================================

let bot
let reconnecting = false

// ========= EXPRESS UPTIME SERVER (RENDER) =========

const app = express()
app.get('/', (req, res) => {
  res.send('Bot is running.')
})

const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
  console.log(`🌐 Uptime server running on port ${PORT}`)
})

// ===================================================

function createBot() {
  console.log("🔄 Creating bot...")

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version
  })

  // ================= BASIC EVENTS =================

  bot.on('login', () => {
    console.log("✅ Successfully logged in!")
  })

  bot.on('spawn', () => {
    console.log("🌍 Spawned in world.")

    // Human-like delay before login
    setTimeout(() => {
      if (config.loginPassword) {
        bot.chat(`/login ${config.loginPassword}`)
        console.log("🔐 Sent login command.")
      }
    }, randomDelay(3000, 6000))

    // Start human simulation
    setTimeout(startHumanBehavior, 8000)
  })

  // ================= CHAT LOGGER =================

  bot.on('message', (jsonMsg) => {
    const text = jsonMsg.toString()
    console.log(`💬 [CHAT] ${text}`)
  })

  bot.on('messagestr', (message) => {
    console.log(`💬 [PLAIN] ${message}`)
  })

  // ================= KICK LOGGER =================

  bot.on('kicked', (reason, loggedIn) => {
    console.log("🚨 BOT WAS KICKED!")
    console.log("Was logged in:", loggedIn)

    try {
      if (typeof reason === 'object') {
        const parsed = parseKickReason(reason)
        console.log("Kick reason (parsed):", parsed)
      } else {
        console.log("Kick reason:", reason)
      }
    } catch (err) {
      console.log("Kick reason (raw):", reason)
    }
  })

  // ================= DISCONNECT LOGGER =================

  bot.on('end', (reason) => {
    console.log("❌ Disconnected from server.")
    console.log("Disconnect reason:", reason)
    reconnect()
  })

  bot.on('error', (err) => {
    console.log("⚠️ Error occurred:")
    console.log(err)
  })

  // ================= PACKET DEBUG =================

  bot._client.on('packet', (data, meta) => {
    if (meta.name === 'disconnect') {
      console.log("📦 Server sent disconnect packet:")
      console.log(data)
    }
  })
}

// ================= RECONNECT SYSTEM =================

function reconnect() {
  if (reconnecting) return
  reconnecting = true

  console.log(`🔁 Reconnecting in ${config.reconnectDelay / 1000} seconds...`)

  setTimeout(() => {
    reconnecting = false
    createBot()
  }, config.reconnectDelay)
}

// ================= HUMAN BEHAVIOR =================

function startHumanBehavior() {
  console.log("🧍 Starting human simulation...")

  setInterval(() => {
    if (!bot.entity) return

    // Random head movement
    const yaw = Math.random() * Math.PI * 2
    const pitch = (Math.random() - 0.5) * Math.PI / 4
    bot.look(yaw, pitch, true)

    // Random small movement
    const move = Math.random()
    if (move < 0.25) bot.setControlState('forward', true)
    else if (move < 0.5) bot.setControlState('back', true)
    else if (move < 0.75) bot.setControlState('left', true)
    else bot.setControlState('right', true)

    setTimeout(() => {
      bot.clearControlStates()
    }, 2000)

  }, randomDelay(10000, 20000))
}

// ================= UTILITIES =================

function parseKickReason(reason) {
  if (reason.text) return reason.text

  if (reason.extra) {
    return reason.extra.map(e => e.text || '').join('')
  }

  return JSON.stringify(reason)
}

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

// ================= START =================

createBot()
