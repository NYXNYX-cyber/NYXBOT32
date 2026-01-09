let fetch = require('node-fetch')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} Naruto`

    // Deteksi command (anime atau manga)
    let isManga = command.includes('manga')
    let typeName = isManga ? 'Manga' : 'Anime'
    let endpoint = isManga ? '/api/manga' : '/api/anime'

    // Beri reaksi loading
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        // 1. Panggil API NYX Kamu
        // Otomatis menempelkan apikey dari config.js
        let url = API('nyx', endpoint, { q: text }, 'apikey')
        
        let res = await fetch(url)
        if (!res.ok) throw 'Server API sedang sibuk.'
        
        let json = await res.json()

        // 2. Validasi Data
        if (!json.status) throw json.message || `${typeName} tidak ditemukan!`

        let data = json.data
        let topResult = data[0]

        // 3. Logika Cerdas (List vs Detail)
        // Jika user mengetik judul persis sama, atau pakai tag --detail
        let isSpecific = topResult.title.toLowerCase() === text.toLowerCase() || 
                         (topResult.title_english && topResult.title_english.toLowerCase() === text.toLowerCase())

        if (isSpecific || text.includes('--detail')) {
            // --- TAMPILAN DETAIL (KARTU LENGKAP) ---
            let caption = `🇯🇵 *${topResult.title}* 🇯🇵\n\n`
            
            if (isManga) {
                caption += `📚 *Type:* ${topResult.type} (Vol: ${topResult.volumes})\n`
                caption += `✍️ *Author:* ${topResult.authors}\n`
                caption += `📅 *Rilis:* ${topResult.published}\n`
            } else {
                caption += `📺 *Type:* ${topResult.type} (${topResult.episodes} eps)\n`
                caption += `⭐ *Score:* ${topResult.score}\n`
                caption += `🏢 *Studio:* ${topResult.studio}\n`
                caption += `📅 *Tahun:* ${topResult.year}\n`
            }

            caption += `🎭 *Genre:* ${topResult.genres}\n\n`
            caption += `📝 *Sinopsis:*\n${topResult.synopsis}\n\n`
            caption += `🔗 *Link:* ${topResult.url}\n`
            caption += `_Powered by NYX API_`

            await conn.sendMessage(m.chat, {
                image: { url: topResult.image },
                caption: caption
            }, { quoted: m })

        } else {
            // --- TAMPILAN LIST (DAFTAR PILIHAN) ---
            let txt = `🔍 *HASIL PENCARIAN ${typeName.toUpperCase()}*\n`
            txt += `Kata kunci: "${text}"\n\n`
            
            // Tampilkan maksimal 5-6 hasil
            data.forEach((item, i) => {
                txt += `${i + 1}. *${item.title}*\n`
                if (isManga) {
                    txt += `   📘 ${item.type} | ⭐ ${item.score}\n`
                } else {
                    txt += `   📺 ${item.type} | ⭐ ${item.score}\n`
                }
            })

            txt += `\n💡 *Tips:* Ketik judul lengkap untuk melihat detail.\n`
            txt += `Contoh: *${usedPrefix}${command} ${topResult.title}*`

            // Kirim list dengan thumbnail hasil pertama
            await conn.sendMessage(m.chat, {
                text: txt,
                contextInfo: {
                    externalAdReply: {
                        title: `Klik untuk detail ${typeName}`,
                        body: topResult.title,
                        thumbnailUrl: topResult.image,
                        sourceUrl: topResult.url,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m })
        }

    } catch (e) {
        console.error(e)
        m.reply(`❎ Maaf, ${typeName} tidak ditemukan atau terjadi kesalahan server.`)
    }
}

handler.help = ['anime <judul>', 'manga <judul>']
handler.tags = ['internet', 'anime']
handler.command = /^(anime|manga)$/i
handler.limit = true

module.exports = handler
