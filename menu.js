let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let moment = require('moment-timezone')

let handler = async (m, { conn, usedPrefix, command }) => {
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    
    // Sapaan Waktu
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    
    // Tentukan Ucapan
    let greeting = ''
    let hours = d.getHours()
    if (hours >= 4 && hours < 11) greeting = 'Selamat Pagi 🌄'
    else if (hours >= 11 && hours < 15) greeting = 'Selamat Siang ☀️'
    else if (hours >= 15 && hours < 18) greeting = 'Selamat Sore 🌇'
    else greeting = 'Selamat Malam 🌙'

    // Header Menu yang Estetik
    let header = `
┏━━━ ⚡ *NYX BOT DASHBOARD* ⚡ ━━━
┃
┃ 👋 *Hi, ${m.pushName || 'User'}*
┃ ${greeting}
┃
┃ 🤖 *Status:* Online
┃ ⏱️ *Runtime:* ${uptime}
┃ 📅 *Date:* ${moment().tz('Asia/Jakarta').format('DD/MM/YYYY')}
┃ 👑 *Owner:* NYX Owner
┃
┗━━━━━━━━━━━━━━━━━━━━━━━`

    // Isi Menu (Dikelompokkan biar rapi)
    let menu = `
╭─── 〔 📥 *DOWNLOADER* 〕 ───
│
│ 🔸 ${usedPrefix}yt <url>
│    (Download YouTube Video)
│ 🔸 ${usedPrefix}tt <url>
│    (Download TikTok No WM)
│
╰─────────────────────

╭─── 〔 ⛩️ *ANIME & MANGA* 〕 ───
│
│ 🔹 ${usedPrefix}anime <judul>
│    (Cari Info Anime / Jikan)
│ 🔹 ${usedPrefix}manga <judul>
│    (Cari Info Manga)
│ 🔹 ${usedPrefix}animenews
│    (Berita Anime Terkini)
│
╰─────────────────────

╭─── 〔 🎮 *GAMING ZONE* 〕 ───
│
│ 🎮 ${usedPrefix}steam <judul>
│    (Cek Harga & Specs Game Steam)
│ 🎮 ${usedPrefix}steamdetail <id>
│    (Detail Game Steam by ID)
│ 🎮 ${usedPrefix}freegames
│    (List Game Gratis Populer)
│ 🎮 ${usedPrefix}freegames <genre>
│    (Cari Game Gratis by Genre)
│    _Ex: .freegames shooter_
│ 🎮 ${usedPrefix}gamedetail <id>
│    (Info & Link Download Game)
│
╰─────────────────────

╭─── 〔 ℹ️ *SYSTEM* 〕 ───
│
│ ⚙️ ${usedPrefix}cekapi
│    (Cek Koneksi ke Server NYX)
│ ⚙️ ${usedPrefix}owner
│    (Kontak Pemilik)
│
╰─────────────────────

_Powered by NYX API_
_Server: nyxapi.nyxwave.tech_
`

    // Kirim Menu dengan Gambar Thumbnail Keren
    // Ganti url gambar di bawah dengan gambar bot kamu sendiri jika mau
    await conn.sendMessage(m.chat, {
        image: { url: 'https://wallpaperaccess.com/full/1556608.jpg' }, // Contoh Gambar Cyberpunk/Tech
        caption: header + menu,
        contextInfo: {
            externalAdReply: {
                title: "NYX MULTI-DEVICE BOT",
                body: "Klik di sini untuk sewa bot",
                thumbnailUrl: "https://wallpaperaccess.com/full/1556608.jpg",
                sourceUrl: "https://instagram.com/Dikazxpw", // Link IG/Group kamu
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m })
}

handler.help = ['menu', 'help']
handler.tags = ['main']
handler.command = /^(menu|help|list)$/i

module.exports = handler

// Fungsi Helper untuk Uptime
function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}