global.owner = ['6285161232384'] // Nomor Owner
global.mods  = ['6285161232384'] // Moderator
global.prems = ['6285161232384'] // User Premium
global.nameowner = 'DIKA' // Nama Owner
global.numberowner = '6285161232384' // Nomor Owner
global.mail = 'support@nyxhoster.com' 
global.gc = 'https://chat.whatsapp.com/' 
global.instagram = 'https://instagram.com/Dikazxpw' 
global.wm = '© NYX' // Watermark Bot
global.wait = '_*⏳ Tunggu sedang di proses...*_' 
global.eror = '_*❌ Server Error*_' 
global.stiker_wait = '*⫹⫺ Stiker sedang dibuat...*' 
global.packname = 'Made With' 
global.author = 'NYX Bot' 
global.maxwarn = '5' // Peringatan maksimum

// --- PENGATURAN OTOMATIS ---
global.autobio = true // Auto ganti bio bot
global.antiporn = false // Auto delete 18+
global.spam = true // Anti spam
global.gcspam = true // Auto tutup grup jika spam

global.nyxKey = 'NYXAPI32' 


global.APIs = {   
  nyx: 'https://nyxapi.nyxwave.tech', 
  btc: 'https://api.botcahx.eu.org' 
}

global.APIKeys = { 
  'https://nyxapi.nyxwave.tech': global.nyxKey, 
  'https://api.botcahx.eu.org': 'APIKEY_BTC_KAMU' 
}

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})
