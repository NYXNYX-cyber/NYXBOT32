let fetch = require('node-fetch')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  m.reply('🔄 Tes koneksi ke NYX API...')

  try {
    // 1. Coba panggil Endpoint Status
    // Pastikan 'nyx' sesuai dengan nama di config.js
    let url = API('nyx', '/api/status', {}, 'apikey')
    
    console.log(`[DEBUG] URL: ${url}`) // Cek URL di console bot

    let res = await fetch(url)
    if (!res.ok) throw `Server Error: ${res.statusText}`
    
    let json = await res.json()
    
    m.reply(`✅ *KONEKSI SUKSES!*\n\nRespon Server:\n${JSON.stringify(json, null, 2)}`)

  } catch (e) {
    console.error(e)
    m.reply(`❌ *KONEKSI GAGAL*\n\nPenyebab: ${e.message || e}`)
  }
}

handler.help = ['cekapi']
handler.tags = ['info']
handler.command = /^(cekapi)$/i

module.exports = handler