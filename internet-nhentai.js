const fetch = require('node-fetch');

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) throw `*Contoh:* ${usedPrefix + command} milf`;

  try {
    let teks = '*Pencarian Nhentai (via API NYX)*\n\n';
    const api = `https://api.botcahx.eu.org/api/webzone/nhentai-search?query=${encodeURIComponent(text)}&apikey=${btc}`; // Gunakan variabel btc dari file terpisah

    const response = await fetch(api);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();

    // Debugging respons API (Hapus/komentari setelah selesai)
    console.log('API Response:', JSON.stringify(json, null, 2));

    if (json.status && json.result && json.result.result && json.result.result.length > 0) {
      let results = json.result.result.slice(0, 3); // Ambil 3 hasil teratas

      results.forEach((result, index) => {
        teks += `*${index + 1}. ${result.title.pretty || result.title.english || result.title.japanese}*\n`;
        teks += `  ◦ *ID:* ${result.id || 'N/A'}\n`;
        teks += `  ◦ *Jumlah Halaman:* ${result.num_pages || 'N/A'}\n`;
        teks += `  ◦ *Bahasa:* ${result.lang || 'N/A'}\n`;
        teks += `  ◦ *Sampul:* ${result.cover?.t || 'Tidak ada gambar'}\n`;
        teks += `  ◦ *Media ID:* ${result.media_id || 'N/A'}\n\n`;
      });

      let thumb = results[0].cover?.t;

      if (thumb) {
        await conn.relayMessage(m.chat, {
          extendedTextMessage: {
            text: teks.trim(),
            contextInfo: {
              externalAdReply: {
                title: 'Pencarian Nhentai (via API NYX)',
                mediaType: 1,
                previewType: 0,
                renderLargerThumbnail: true,
                thumbnailUrl: thumb,
                sourceUrl: 'https://nhentai.net/', // URL sumber
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

handler.command = handler.help = ['nhentai'];
handler.tags = ['internet'];
handler.premium = false; // Sesuaikan sesuai kebutuhan
handler.limit = true;

module.exports = handler;