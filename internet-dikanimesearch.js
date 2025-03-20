let fetch = require('node-fetch');

let handler = async (m, { text, conn, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} Naruto`;

    try {
        let teks = '*MyAnimeList Search (via Jikan API)*\n\n';
        const api = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}`);
        if (!api.ok) {
            throw new Error(`HTTP error! status: ${api.status}`);
        }
        const json = await api.json();

        // Debugging respons API (Hapus/komentari setelah selesai)
        console.log('API Response:', JSON.stringify(json, null, 2));

        if (json.data && json.data.length > 0) {
            let results = json.data.slice(0, 1); // Ambil 3 hasil teratas

            results.forEach((anime, index) => {
                teks += `*${index + 1}. ${anime.title}*\n`;
                teks += `  ◦ *ID MAL:* ${anime.mal_id}\n`;

                // Potong sinopsis menjadi 1 paragraf
                let sinopsis = anime.synopsis || 'Tidak ada sinopsis';
                let shortSinopsis = sinopsis.split('\n')[0]; 
                teks += `  ◦ *Sinopsis:* ${shortSinopsis}\n`; 

                teks += `  ◦ *Tipe:* ${anime.type || 'N/A'}\n`;
                teks += `  ◦ *Skor:* ${anime.score || 'N/A'}\n`;
                teks += `  ◦ *Status:* ${anime.status || 'N/A'}\n`;

                // Menambahkan informasi Studio dan Genre
                teks += `  ◦ *Studio:* ${anime.studios?.map(studio => studio.name).join(', ') || 'N/A'}\n`;
                teks += `  ◦ *Genre:* ${anime.genres?.map(genre => genre.name).join(', ') || 'N/A'}\n`;

                teks += `  ◦ *Gambar:* ${anime.images?.jpg?.image_url || 'Tidak ada gambar'}\n`;
                teks += `  ◦ *URL MAL:* ${anime.url || 'N/A'}\n\n`;
            });

            let thumb = results[0].images?.jpg?.image_url;
            let sourceUrl = results[0].url;

            if (thumb) {
                await conn.relayMessage(m.chat, {
                    extendedTextMessage: {
                        text: teks.trim(),
                        contextInfo: {
                            externalAdReply: {
                                title: 'Dikanime Search X NYX API',
                                mediaType: 1,
                                previewType: 0,
                                renderLargerThumbnail: true,
                                thumbnailUrl: thumb,
                                sourceUrl: sourceUrl || 'https://myanimelist.net/',
                            }
                        },
                        mentions: [m.sender]
                    }
                }, {});
            } else {
                await conn.sendMessage(m.chat, teks.trim(), { quoted: m });
            }
        } else {
            teks += '❌ Tidak ada hasil ditemukan!';
            await conn.sendMessage(m.chat, teks.trim(), { quoted: m });
        }

    } catch (error) {
        console.error('Error:', error);
        m.reply('Terjadi kesalahan saat memproses data!');
    }
};

handler.command = handler.help = ['dikanime'];
handler.tags = ['internet'];
handler.premium = false;
handler.group = false;
handler.limit = true;

module.exports = handler;