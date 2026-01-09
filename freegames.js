let fetch = require('node-fetch')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    // --- MODE 1: DETAIL GAME (By ID) ---
    if (command == 'gamedetail') {
        if (!text) throw `*Contoh:* ${usedPrefix}gamedetail 452`
        m.reply('⏳ Mengambil info game...')
        try {
            let url = API('nyx', '/api/freegame', { id: text }, 'apikey')
            let res = await fetch(url)
            let json = await res.json()
            if (!json.status) throw 'Game ID tidak valid.'
            
            let data = json.data
            let caption = `🎮 *${data.title.toUpperCase()}* 🎮\n\n`
            caption += `🏢 *Publisher:* ${data.publisher}\n`
            caption += `📅 *Rilis:* ${data.release_date}\n`
            caption += `🎭 *Genre:* ${data.genre}\n`
            caption += `💻 *Platform:* ${data.platform}\n\n`
            caption += `📝 *Deskripsi:*\n${data.description}\n\n`
            if (data.requirements) {
                caption += `⚙️ *Min Specs:*\nOS: ${data.requirements.os}\nRAM: ${data.requirements.memory}\nStorage: ${data.requirements.storage}\n\n`
            }
            caption += `📥 *Download:* ${data.download_link}\n`
            caption += `_Powered by NYX API_`
            
            await conn.sendMessage(m.chat, { image: { url: data.image }, caption: caption }, { quoted: m })
        } catch (e) { m.reply('❎ Error mengambil detail.') }
        return
    }

    // --- MODE 2: SMART SEARCH (List/Search) ---
    m.reply(`⏳ Mencari game...`)

    try {
        let url = ''
        let titleMode = ''
        
        // Daftar Kategori Resmi FreeToGame (Agar bot tau bedanya Kategori vs Judul)
        const categories = ['mmorpg', 'shooter', 'strategy', 'moba', 'racing', 'sports', 'social', 'sandbox', 'open-world', 'survival', 'pvp', 'pve', 'pixel', 'voxel', 'zombie', 'turn-based', 'first-person', 'third-person', 'top-down', 'tank', 'space', 'sailing', 'side-scroller', 'superhero', 'permadeath', 'card', 'battle-royale', 'mmo', 'mmofps', 'mmotps', '3d', '2d', 'anime', 'fantasy', 'sci-fi', 'fighting', 'action-rpg', 'action', 'military', 'martial-arts', 'flight', 'low-spec', 'tower-defense', 'horror', 'mmorts']
        
        // LOGIKA PINTAR:
        if (!text) {
            // Jika kosong -> Ambil Populer
            url = API('nyx', '/api/freegames', { sort: 'popularity' }, 'apikey')
            titleMode = 'POPULER'
        } else if (categories.includes(text.toLowerCase())) {
            // Jika text ada di daftar kategori -> Ambil Kategori
            url = API('nyx', '/api/freegames', { category: text }, 'apikey')
            titleMode = `KATEGORI: ${text.toUpperCase()}`
        } else {
            // Jika text BUKAN kategori -> Cari Judul (Search)
            url = API('nyx', '/api/freegame/search', { q: text }, 'apikey')
            titleMode = `PENCARIAN: "${text.toUpperCase()}"`
        }

        let res = await fetch(url)
        let json = await res.json()
        
        if (!json.status) throw `Game tidak ditemukan!`
        
        let games = json.data
        let txt = `🎮 *FREE GAMES LIST* 🎮\n`
        txt += `Mode: ${titleMode}\n\n`
        
        games.forEach((g, i) => {
            txt += `${i + 1}. *${g.title}* (ID: ${g.id})\n`
            txt += `   🎭 ${g.genre} | 📅 ${g.release_date}\n`
        })
        
        txt += `\n💡 *Tips:* Ketik *${usedPrefix}gamedetail <ID>* untuk info lengkap.\n`
        txt += `Contoh: *${usedPrefix}gamedetail ${games[0].id}*`
        
        await conn.sendMessage(m.chat, {
            text: txt,
            contextInfo: {
                externalAdReply: {
                    title: "Game Finder",
                    body: titleMode,
                    thumbnailUrl: games[0].thumbnail,
                    sourceUrl: "https://www.freetogame.com",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m })
        
    } catch (e) {
        m.reply(`❎ Maaf, game "${text}" tidak ditemukan.\nCoba cari judul lain atau gunakan kategori valid (shooter, mmorpg, anime).`)
    }
}

handler.help = ['freegames <judul/kategori>', 'gamedetail <id>']
handler.tags = ['internet', 'games']
handler.command = /^(freegames|fg|gamedetail)$/i
handler.limit = true

module.exports = handler