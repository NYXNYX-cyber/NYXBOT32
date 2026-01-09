let fetch = require('node-fetch')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*Contoh:* ${usedPrefix + command} https://www.youtube.com/watch?v=xxxx`;
  
  m.reply(global.wait) 

  try {
    // Panggil API NYX
    let url = API('nyx', '/api/youtube', { url: text }, 'apikey')
    
    let response = await fetch(url)
    let json = await response.json()

    if (!json.status) throw json.message || 'Gagal mengambil data'

    // Ambil Data
    let videoUrl = json.data.video_url
    let title = json.title || 'Video YouTube'
    let thumbnail = json.thumbnail || ''

    // Caption Sederhana (Karena scraper kadang tidak bawa info durasi/views)
    let caption = `🎬 *YOUTUBE DOWNLOADER*\n\n`
    caption += `📌 *Judul:* ${title}\n`
    caption += `_Powered by NYX API_`

    // Kirim Video
    await conn.sendMessage(m.chat, { 
      video: { url: videoUrl }, 
      caption: caption,
      mimetype: 'video/mp4',
      // Tambahkan thumbnail jika ada
      jpegThumbnail: thumbnail ? await (await fetch(thumbnail)).buffer() : false
    }, { quoted: m })

  } catch (error) {
    console.error(error)
    m.reply(`❎ Maaf, gagal mendownload video.\nCoba cari link lain atau server sedang sibuk.`)
  }
};

handler.help = ['ytmp4 <url>', 'youtube <url>'];
handler.tags = ['downloader'];
handler.command = /^(ytmp4|youtube|yt)$/i;
handler.limit = true;

module.exports = handler;