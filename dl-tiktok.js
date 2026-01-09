let fetch = require('node-fetch')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*Contoh:* ${usedPrefix + command} https://vm.tiktok.com/xxxx`
  
  m.reply(global.wait)

  try {
    // 1. Panggil API NYX
    let url = API('nyx', '/api/tiktok', { url: text }, 'apikey')
    
    // 2. Fetch Data
    let response = await fetch(url)
    let json = await response.json()

    // 3. Cek Status
    if (!json.status) throw json.message || 'Gagal mengambil data'

    // 4. Ambil Data & PERBAIKI LINK
    let videoUrl = json.result.video[0] 
    let audioUrl = json.result.audio[0]
    let title = json.result.title || 'Video TikTok'

    // --- LOGIKA FIX LINK RELATIF ---
    // TikWM sering kasih link depannya "/video/...", kita harus tambah domain
    const domain = 'https://www.tikwm.com'
    
    if (videoUrl && !videoUrl.startsWith('http')) {
        videoUrl = domain + videoUrl
    }
    
    if (audioUrl && !audioUrl.startsWith('http')) {
        audioUrl = domain + audioUrl
    }

    // 5. Susun Caption
    let caption = `🎵 *TIKTOK DOWNLOAD*\n\n`
    caption += `📌 *Caption:* ${title}\n`
    caption += `_Powered by NYX API_`

    // 6. Kirim Video
    await conn.sendMessage(m.chat, { 
      video: { url: videoUrl }, 
      caption: caption 
    }, { quoted: m })

    // (Opsional: Kirim Audio juga sebagai VN/Musik)
    // await conn.sendMessage(m.chat, { 
    //    audio: { url: audioUrl }, 
    //    mimetype: 'audio/mpeg', 
    //    fileName: 'tiktok_audio.mp3' 
    // }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❎ Gagal mendownload video TikTok. Pastikan link benar.')
  }
}

handler.help = ['tiktok <url>', 'tt <url>']
handler.tags = ['downloader']
handler.command = /^(tiktok|tt|ttdl)$/i
handler.limit = true

module.exports = handler