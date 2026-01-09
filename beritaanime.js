let fetch = require('node-fetch')

let handler = async (m, { conn }) => {
    // Reaksi loading biar user tau bot hidup
    await conn.sendMessage(m.chat, { react: { text: '📰', key: m.key } })

    try {
        // Panggil API NYX
        let url = API('nyx', '/api/animenews', {}, 'apikey')
        let res = await fetch(url)
        let json = await res.json()

        if (!json.status) throw 'Gagal mengambil berita.'

        let data = json.data
        let sourceName = json.source || 'Internet'
        let headline = data[0] // Berita pertama untuk cover

        // --- SUSUN CAPTION ---
        let caption = `📢 *BERITA ANIME TERKINI* 📢\n`
        caption += `_Sumber: ${sourceName}_\n\n`
        
        // Bagian Headline (Berita Utama)
        caption += `🔥 *HEADLINE:*\n`
        caption += `*${headline.title}*\n`
        caption += `🗓️ ${headline.date}\n`
        caption += `✍️ ${headline.author}\n`
        caption += `📝 "${headline.snippet}"\n`
        caption += `🔗 ${headline.link}\n\n`
        caption += `----------------------------------------\n\n`

        // Bagian List Berita Lainnya (No 2-5)
        caption += `📰 *BERITA LAINNYA:*\n`
        data.slice(1).forEach((item, i) => {
            caption += `${i + 1}. *${item.title}*\n`
            caption += `   👉 ${item.link}\n\n`
        })

        caption += `_Powered by NYX API_`

        // Kirim Pesan
        // Kita gunakan gambar dari headline sebagai thumbnail
        await conn.sendMessage(m.chat, {
            text: caption,
            contextInfo: {
                externalAdReply: {
                    title: `Hot News: ${sourceName}`,
                    body: headline.title,
                    thumbnailUrl: headline.image, // URL Gambar dari API
                    sourceUrl: headline.link,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply('❎ Maaf, server berita sedang sibuk. Coba lagi nanti.')
    }
}

handler.help = ['animenews', 'beritaanime']
handler.tags = ['internet', 'anime']
handler.command = /^(animenews|beritaanime|wibunews)$/i
handler.limit = true

module.exports = handler