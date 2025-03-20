let fetch = require('node-fetch');

let handler = async (m, { text, conn, usedPrefix, command }) => {
    if (!text) throw `*🚩 Contoh:* ${usedPrefix + command} https://nekopoi.care/hentai/yabai-fukushuu-yami-site/`;

    try {
        let teks = '*DIKAPOI DETAIL*\n\n';
        const api = await fetch(`https://api.botcahx.eu.org/api/webzone/nekopoi-detail?query=${text}&apikey=${btc}`);
        let json = await api.json();

        // Debugging respons API
        console.log('API Response:', JSON.stringify(json, null, 2));

        let result = json.result; // Ambil detail hasil dari API
        if (result) {
            teks += ` ◦  *Title:* ${result.title || 'N/A'}\n`;
            teks += ` ◦  *Status:* ${result.status || 'N/A'}\n`;
            teks += ` ◦  *Genre:* ${result.genre || 'N/A'}\n`;
            teks += ` ◦  *Rating:* ${result.score || 'N/A'}\n`;
            teks += ` ◦  *Duration:* ${result.duration || 'N/A'}\n`;
            teks += ` ◦  *Producer:* ${result.producer || 'N/A'}\n`;
            teks += ` ◦  *Aired:* ${result.aired || 'N/A'}\n`;
            teks += ` ◦  *Japanese Title:* ${result.japanese || 'N/A'}\n`;
            teks += ` ◦  *Views:* ${result.views || 'N/A'}\n`;

            // Tambahkan URL list jika tersedia
            if (result.url && result.url.length > 0) {
                teks += '\n ◦  *Episodes:*';
                result.url.forEach((episodeUrl, index) => {
                    teks += `\n     - Episode ${index + 1}: ${episodeUrl}`;
                });
            }

            let thumb = result.img; // Gambar dari respons
            let sourceUrl = text; // Gunakan query asli sebagai sumber URL

            await conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: teks.trim(),
                    contextInfo: {
                        externalAdReply: {
                            title: 'DIKAPOI DETAIL',
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
        console.error('Error:', e);
        throw 'Terjadi kesalahan saat memproses data!';
    }
};

handler.command = handler.help = ['dikapoidetail'];
handler.tags = ['internet'];
handler.premium = true;
handler.group = false;
handler.limit = true;

module.exports = handler;
