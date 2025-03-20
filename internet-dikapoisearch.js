let fetch = require('node-fetch');

let handler = async (m, { text, conn, usedPrefix, command }) => {
    if (!text) throw `*🚩 Contoh:* ${usedPrefix + command} Overflow`;

    try {
        let teks = '*DIKAPOI S E A R C H*\n\n';
        const api = await fetch(`https://api.botcahx.eu.org/api/webzone/nekopoi-search?query=${text}&apikey=${btc}`);
        let json = await api.json();

        // Debugging respons API
        console.log('API Response:', JSON.stringify(json, null, 2));

        let results = json.result; // Ambil array hasil dari API
        if (results && results.length > 0) {
            for (let i = 0; i < results.length; i++) {
                teks += ` ◦  *Title:* ${results[i].title || 'N/A'}\n`;
                teks += ` ◦  *URL:* ${results[i].url || 'N/A'}\n\n`;
            }

            let thumb = results[0].img; // Thumbnail dari item pertama
            let sourceUrl = results[0].url; // URL dari item pertama

            await conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: teks.trim(),
                    contextInfo: {
                        externalAdReply: {
                            title: 'DIKAPOI S E A R C H',
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnailUrl: thumb,
                            sourceUrl: sourceUrl
                        }
                    },
                    mentions: [m.sender]
                }
            }, {});
        } else {
            teks += '❌ Tidak ada hasil ditemukan!';
            await conn.sendMessage(m.chat, teks.trim(), { quoted: m });
        }
    } catch (e) {
        console.error(e);
        throw 'Terjadi kesalahan saat memproses data!';
    }
};

handler.command = handler.help = ['dikapoi'];
handler.tags = ['internet'];
handler.premium = true;
handler.group = false;
handler.limit = true;

module.exports = handler;
