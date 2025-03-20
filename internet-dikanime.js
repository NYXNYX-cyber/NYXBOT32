const fetch = require('node-fetch');

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) throw `*🚩 Contoh:* ${usedPrefix + command} Sword Art Online`;

  let teks = '';
  try {
    const api = await fetch(`https://api.botcahx.eu.org/api/webzone/samehadaku-search?query=${text}&apikey=${btc}`);
    let json = await api.json();
    let results = json.result;

    if (!results || results.length === 0) {
      throw '🚩 Tidak ditemukan hasil yang cocok!';
    }

    results.forEach(item => {
      teks += `*🎥 Title:* ${item.title}\n`;
      teks += `*📄 Description:* ${item.description}\n`;
      teks += `*⭐ Rating:* ${item.star}\n`;
      teks += `*👀 Views:* ${item.views}\n`;
      teks += `*🎭 Genre:* ${item.genre.join(', ')}\n`;
      teks += `*📺 Type:* ${item.type.join(', ')}\n`;
      teks += `*🔗 Link:* ${item.link}\n`;
      teks += `*🖼️ Thumbnail:* ${item.thumbnail}\n\n`;
    });

    await conn.relayMessage(m.chat, {
      extendedTextMessage: {
        text: teks,
        contextInfo: {
          externalAdReply: {
            title: 'ANIME INFORMATION',
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: results[0].thumbnail,
            sourceUrl: results[0].link
          }
        },
        mentions: [m.sender]
      }
    }, {});
  } catch (e) {
    console.error(e);
    throw `🚩 *Gagal Memuat Data!*`;
  }
};

handler.command = handler.help = ['dikanime'];
handler.tags = ['internet'];
handler.premium = false;
handler.group = false;
handler.limit = true;

module.exports = handler;
