const nhentai = require('nhentai-js');
const fetch = require('node-fetch');

let handler = async (m, { text, conn, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} 123456`;

    try {
        if (!await nhentai.exists(text)) {
            return conn.reply(m.chat, '❌ Doujin dengan ID tersebut tidak ditemukan.', m);
        }

        const dojin = await nhentai.getDoujin(text);

        if (!dojin || !dojin.pages || dojin.pages.length === 0) {
            console.error("Data doujin tidak valid atau halaman tidak ditemukan:", dojin);
            return conn.reply(m.chat, '❌ Terjadi kesalahan saat mengambil data doujin atau tidak ada gambar.', m);
        }

        const title = dojin.title.pretty || dojin.title.english || dojin.title.japanese;
        const pages = dojin.pages;

        let currentImageIndex = 0;
        async function sendNextImage() {
            if (currentImageIndex < pages.length) {
                try {
                    let originalUrl = pages[currentImageIndex];
                    if(typeof originalUrl !== 'string'){
                        console.error(`Tipe data pages bukan string ${originalUrl}`)
                        currentImageIndex++
                        return sendNextImage()
                    }
                    let imageUrl = originalUrl;
                    const domainRegex = /(https?:\/\/[ti]\d\.nhentai\.net\/galleries\/\d+\/\d+\.(jpg|png))/i;

                    const matches = imageUrl.match(domainRegex);
                    if(!matches){
                        console.error("Url tidak sesuai format")
                        currentImageIndex++
                        return sendNextImage()
                    }
                    const domains = ["i", "i2", "i3", "i4", "t", "t1", "t2", "t3", "t4", "t5"];
                    let imageResponse;
                    for (const domain of domains) {
                        const testUrl = imageUrl.replace(/(https?:\/\/[ti]\d\.nhentai\.net)/i, `https://${domain}.nhentai.net`);
                        try {
                            imageResponse = await fetch(testUrl);
                            if (imageResponse.ok) {
                                imageUrl = testUrl;
                                break;
                            }
                        } catch (testError) {
                            console.error(`Error testing URL ${testUrl}:`, testError);
                        }
                    }
                    if(!imageResponse || !imageResponse.ok){
                        console.error(`Semua url gagal di akses untuk ${originalUrl}`)
                        currentImageIndex++
                        return sendNextImage()
                    }
                    console.log("Mengirim Gambar ke : "+imageUrl)
                    const imageBuffer = await imageResponse.buffer();

                    await conn.sendMessage(m.chat, { image: imageBuffer, caption: `[${title}](ID: ${text})\nHalaman ${currentImageIndex + 1} dari ${pages.length}`, mentions: [m.sender] }, { quoted: m });

                    currentImageIndex++;
                    sendNextImage();

                } catch (imageError) {
                    console.error(`Error processing image: ${imageError}`);
                    currentImageIndex++;
                    sendNextImage();
                }
            }else{
                console.log("Semua gambar telah terkirim")
            }
        }

        await conn.reply(m.chat, `Mengirim ${pages.length} gambar, mohon tunggu...`, m);
        sendNextImage();

    } catch (error) {
        console.error('Error:', error);
        if (error.message === 'Gallery not found') {
            return conn.reply(m.chat, '❌ Doujin dengan ID tersebut tidak ditemukan.', m);
        }
        m.reply('Terjadi kesalahan saat memproses data!', m);
    }
};

handler.command = handler.help = ['nuklir'];
handler.tags = ['internet'];
handler.premium = true;
handler.limit = true;

module.exports = handler;