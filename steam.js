let fetch = require('node-fetch')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    // --- MODE 1: DETAIL MANUAL (Jika pakai command .steamdetail) ---
    if (command == 'steamdetail') {
        if (!text) throw `*Contoh:* ${usedPrefix}steamdetail 271590`
        m.reply('⏳ Mengambil data Steam...')
        
        try {
            let url = API('nyx', '/api/steam/detail', { appid: text }, 'apikey')
            let res = await fetch(url)
            let json = await res.json()
            if (!json.status) throw 'ID Game tidak valid.'

            let data = json.data
            showDetail(m, conn, data)
        } catch (e) { m.reply('❎ Error mengambil detail.') }
        return
    }

    // --- MODE 2: SEARCH (Jika pakai command .steam) ---
    if (!text) throw `*Contoh:* ${usedPrefix + command} Black Myth Wukong`
    
    m.reply('⏳ Mencari di Steam Store...')
    
    try {
        let url = API('nyx', '/api/steam/search', { q: text }, 'apikey')
        let res = await fetch(url)
        let json = await res.json()
        
        if (!json.status) throw 'Game tidak ditemukan.'
        
        let games = json.data
        let topResult = games[0]

        // Cek apakah judulnya mirip banget? (Smart Search)
        let isMatch = topResult.title.toLowerCase() === text.toLowerCase()

        if (isMatch) {
            // Jika mirip, langsung ambil detailnya pakai endpoint detail
            let detailUrl = API('nyx', '/api/steam/detail', { appid: topResult.id }, 'apikey')
            let detailRes = await fetch(detailUrl)
            let detailJson = await detailRes.json()
            
            if (detailJson.status) {
                showDetail(m, conn, detailJson.data)
            } else {
                // Fallback kalau detail gagal
                m.reply(`Ketemu: ${topResult.title} (ID: ${topResult.id})\nTapi gagal ambil detail lengkap.`)
            }
        } else {
            // Jika belum spesifik, tampilkan LIST
            let txt = `🚂 *STEAM SEARCH RESULT* 🚂\n`
            txt += `Query: "${text}"\n\n`
            
            games.forEach((g, i) => {
                txt += `${i + 1}. *${g.title}*\n`
                txt += `   💰 Harga: ${g.price} | ⭐ Metascore: ${g.score}\n`
                txt += `   🆔 ID: ${g.id}\n\n`
            })
            
            txt += `💡 *Tips:* Ketik judul lengkap untuk detail otomatis.\n`
            txt += `Atau ketik: *${usedPrefix}steamdetail ${games[0].id}*`
            
            await conn.sendMessage(m.chat, {
                text: txt,
                contextInfo: {
                    externalAdReply: {
                        title: "Steam Store Indonesia",
                        body: "PC Games Database",
                        thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png",
                        sourceUrl: "https://store.steampowered.com",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m })
        }

    } catch (e) {
        m.reply('❎ Game tidak ditemukan.')
    }
}

// Fungsi Helper Tampilan Detail
async function showDetail(m, conn, data) {
    let caption = `🚂 *${data.title.toUpperCase()}* 🚂\n\n`
    caption += `💰 *Harga:* ${data.price}\n`
    caption += `📅 *Rilis:* ${data.release_date}\n`
    caption += `🏢 *Dev:* ${data.developer}\n`
    caption += `📝 *Deskripsi:*\n${data.description}\n\n`
    
    if (data.pc_requirements && data.pc_requirements !== '-') {
        caption += `⚙️ *PC Specs (Min):*\n${data.pc_requirements}\n\n`
    }
    
    caption += `🔗 *Steam:* https://store.steampowered.com/app/${data.id}\n`
    caption += `_Powered by NYX API_`

    await conn.sendMessage(m.chat, {
        image: { url: data.screenshot },
        caption: caption
    }, { quoted: m })
}

handler.help = ['steam <judul>', 'steamdetail <appid>']
handler.tags = ['internet', 'games']
handler.command = /^(steam|steamdetail)$/i
handler.limit = true

module.exports = handler