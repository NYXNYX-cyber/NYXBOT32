global.owner = ['6285161232384']  
global.mods = ['6285161232384'] 
global.prems = ['6285161232384']
global.nameowner = 'Dika'
global.numberowner = '6285161232384' 
global.mail = 'nyx@nyxhosting.site' 
global.gc = 'https://chat.whatsapp.com/-'
global.instagram = 'https://instagram.com/Dikazxpw'
global.wm = '© NYX'
global.wait = '_*Tunggu sedang di proses...*_'
global.eror = '_*Server Error*_'
global.stiker_wait = '*⫹⫺ Stiker sedang dibuat...*'
global.packname = 'Made With'
global.author = 'Bot WhatsApp'
global.autobio = false // Set true untuk mengaktifkan autobio
global.maxwarn = '3' // Peringatan maksimum
global.antiporn = true // Auto delete pesan porno (bot harus admin)

//INI WAJIB DI ISI!//
global.btc = 'NYXBOT32' 
//Daftar terlebih dahulu https://api.botcahx.eu.org

//INI OPTIONAL BOLEH DI ISI BOLEH JUGA ENGGA//
global.lann = 'NYXBOT32'
//Daftar https://api.betabotz.eu.org 

//jangan diganti!
global.APIs = {   
  btc: 'https://api.botcahx.eu.org'
}

//ini tidak di isi juga tidak apa-apa
global.APIKeys = { 
  'https://api.botcahx.eu.org': 'NYXBOT32' 
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
