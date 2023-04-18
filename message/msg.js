"use strict";
process.on('uncaughtException', console.error)
const { downloadContentFromMessage, downloadMediaMessage } = require("@adiwajshing/baileys");
const { color, bgcolor } = require("../lib/color");
const fetch = require("node-fetch");
const fs = require("fs");
const moment = require("moment-timezone");
const util = require("util");
const { exec, spawn, execSync } = require("child_process");
let setting;
const { ownerNumber, MAX_TOKEN, OPENAI_KEY, LOLHUMAN_KEY } = setting = require('../config.json');
const speed = require("performance-now");
const ffmpeg = require("fluent-ffmpeg");
let { ytmp4, ytmp3, ytplay, ytplayvid } = require('../lib/youtube')
const { mediafireDl, getGroupAdmins } = require('../lib/myfunc')
const axios = require("axios");
const cheerio = require("cheerio");
moment.tz.setDefault("Africa/Nairobi").locale("id");

module.exports = async (conn, msg, m, openai) => {
  try {
    //if (msg.key.fromMe) return
    const { type, isQuotedMsg, quotedMsg, mentioned, now, fromMe } = msg;
    const toJSON = (j) => JSON.stringify(j, null, "\t");
    const from = msg.key.remoteJid;
    const chats = type === "conversation" && msg.message.conversation ? msg.message.conversation : type === "imageMessage" && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : type === "videoMessage" && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : type === "extendedTextMessage" && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : type === "buttonsResponseMessage" && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : type === "templateButtonReplyMessage" && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : type === "messageContextInfo" ? msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId : type == "listResponseMessage" && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : "";
    const args = chats.split(" ");
    const args22 = chats.trim().split(/ +/).slice(1)
    const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~+×_*!#%^&./\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓=|~+×_*!#,|÷?;:%^&./\\©^]/gi) : null;
    const command = prefix ? chats.slice(1).trim().split(' ').shift().toLowerCase() : ''
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    const groupMetadata = msg.isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
    const groupName = msg.isGroup ? groupMetadata.subject : ''  
    const sender = isGroup ? msg.key.participant ? msg.key.participant : msg.participant : msg.key.remoteJid;
    const userId = sender.split("@")[0]
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    const isOwner = [botNumber,...ownerNumber].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)
    const pushname = msg.pushName;
    const q = chats.slice(command.length + 1, chats.length);
    const textoo = args22.join(" ")  
    const isCmd = chats.startsWith(prefix)
    const content = JSON.stringify(msg.message)
    const isImage = (type == 'imageMessage')
    const isVideo = (type == 'videoMessage')
    const isAudio = (type == 'audioMessage')
    const isSticker = (type == 'stickerMessage')
    const isDocument = (type == 'documentMessage')
    const isLocation = (type == 'locationMessage')
    const isViewOnce = (type == 'viewOnceMessageV2')
    const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false    
    const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
    const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
    const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false
    const textolink = decodeURIComponent(chats.replace(command, '').replace(prefix, '').split(' ').join(''))  
    const textosinespacio = decodeURIComponent(chats.replace(command, '').replace(prefix, ''))
    const participants = msg.isGroup ? await groupMetadata.participants : ''
    const groupAdmins = msg.isGroup ? await getGroupAdmins(participants) : ''
    const isAdmin = msg.isGroup ? groupAdmins.includes(sender) : false
    const isBotAdmin = msg.isGroup ? groupAdmins.includes(botNumber) : false
    const restrictTOF = global.db.data.settings[conn.user.id].restrict
    let senderJid;
    if (msg.isGroup) {
    senderJid = msg.key.participant;
    } else {
    senderJid = msg.sender;}
    
/* Baneo de chats */

try {    
let banned = global.db.data.chats[from].mute  
if (banned && !chats.includes('unmute')) return  
} catch { 
}  
  
/* Envios de mensajes */ 
    
const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: msg });
};
const tempButton = async (remoteJid, text, footer, content) => {
const templateMessage = { viewOnceMessage: { message: { templateMessage: { hydratedTemplate: { hydratedContentText: text, hydratedContentFooter: footer, hydratedButtons: content, }, }, }, }, };
const sendMsg = await conn.relayMessage(remoteJid, templateMessage, {}); 
};
const sendAud = (link) => { 
conn.sendMessage(from, { audio: { url: link }, fileName: `error.mp3`, mimetype: 'audio/mp4' }, { quoted: msg });
};
const sendVid = (link, thumbnail) => {
conn.sendMessage( from, { video: { url: link }, fileName: `error.mp4`, thumbnail: thumbnail, mimetype: 'video/mp4' }, { quoted: msg });
};      
const sendImgUrl = (link) => {
conn.sendMessage( from, { image: { url: link }, fileName: `error.jpg` }, { quoted: msg });
};         
      
/* Auto Read & Presence Online */
conn.readMessages([msg.key]);
conn.sendPresenceUpdate("available", from);

    // Logs;
    if (!isGroup && isCmd && !fromMe) {
      console.log("->[\x1b[1;32mCMD\x1b[1;37m]", color(moment(msg.messageTimestamp * 1000).format("DD/MM/YYYY HH:mm:ss"), "yellow"), color(`${command} [${args.length}]`), "DE", color(pushname), ":", chats);
    }
    if (isGroup && isCmd && !fromMe) {
      console.log("->[\x1b[1;32mCMD\x1b[1;37m]", color(moment(msg.messageTimestamp * 1000).format("DD/MM/YYYY HH:mm:ss"), "yellow"), color(`${command} [${args.length}]`), "DE", color(pushname), "in", color(groupName), ":", chats);
    }

switch (command) {
case 'start': case 'menu':
var textReply = `Hello @${senderJid.split`@`[0] || pushname || 'user'} 👋

I am a 🍃 Gamer V-3. 6 🎃.A WhatsApp Bot using OpenAI artificial intelligence (ChatGPT), I was created to answer your questions. Send me a question and I will answer you!

_The Bot is limited to answering ${MAX_TOKEN} words at most_
<------------------------------------------->

*AVAILABLE COMMANDS*

🔷 *General*
\`\`\`- ${prefix}menu
- ${prefix}mute
- ${prefix}unmute
- ${prefix}ping
- ${prefix}runtime\`\`\`

🤖 *AI*
\`\`\`- ${prefix}chatgpt
- ${prefix}chatgpt2
- ${prefix}delchatgpt
- ${prefix}dall-e\`\`\`

📥 *Multimedia*
\`\`\`- ${prefix}play
- ${prefix}play2
- ${prefix}ytmp3
- ${prefix}ytmp4
- ${prefix}sticker
- ${prefix}mediafirel\`\`\`

💫 *Groups*
\`\`\`- ${prefix}hidetag
- ${prefix}promote
- ${prefix}demote
- ${prefix}kick\`\`\`

🤴🏻 *Owner*
\`\`\`- ${prefix}update
- ${prefix}disablewa
- ${prefix}restrict enable
- ${prefix}restrict disable\`\`\`

*Coded By ᴹᵒʰᵃ×͜×ˡⁱᶜⁱᵒᵘˢ wa.me/254735306047*`
if (msg.isGroup) {
conn.sendMessage(from, { text: textReply, mentions: [...textReply.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}, { quoted: msg });    
} else {
let fkontak2 = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${senderJid.split('@')[0]}:${senderJid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }  
conn.sendMessage(from, { text: textReply, mentions: [...textReply.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}, { quoted: fkontak2 });  
}
break
case 'restrict':
if (!isOwner) return conn.sendMessage(from, { text: `*[❗] Este comando solo puede ser utilizado por el Owner del Bot*` }, { quoted: msg });        
if (!textoo) return conn.sendMessage(from, { text: `*[❗] Por favor usa una de las siguientes opciones:*\n*—◉ ${prefix}restrict enable*\n*—◉ ${prefix}restrict disable*` }, { quoted: msg });        
let bott = global.db.data.settings[conn.user.id] || {}            
if (textoo == 'enable') {
bott.restrict = true
conn.sendMessage(from, { text: `*[ ✔ ] Bot restrictions have been activated correctly, remember that the use of commands with restrictions can cause your number to be suspended and this is at your own risk*` }, { quoted: msg });
} else if (text == 'disable') {
bott.restrict = false
conn.sendMessage(from, { text: `*[ ✔ ] Successfully disabled Bot restrictions, now Bot has restrictions*` }, { quoted: msg });
} else {
conn.sendMessage(from, { text: `*[❗] Please use one of the following options:*\n*—◉ ${prefix}restrict enable*\n*—◉ ${prefix}restrict disable*` } , { quoted: msg })}
break
case 'runtime':
conn.sendMessage(from, { text: `*${require('../lib/myfunc').runtime(process.uptime())}*` }, { quoted: msg });
break
case 'hidetag':
if (!msg.isGroup) return conn.sendMessage(from, { text: `*[❗] This command can only be used in groups*` }, { quoted: msg })
if (!isAdmin) return conn.sendMessage(from, { text: `*[❗] This command can only be used by group admins*` }, { quoted: msg })    
try {
let users = participants.map(u => u.id).filter(id => id);
let htextos = `${textoo ? textoo : ''}`
if (isImage || isQuotedImage) {
await conn.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${senderJid.split("@")[0]}.jpg`)    
var mediax = await fs.readFileSync(`./tmp/${senderJid.split("@")[0]}.jpg`)
conn.sendMessage(from, { image: mediax, mentions: users, caption: htextos, mentions: users }, { quoted: msg })
fs.unlinkSync(`./tmp/${senderJid.split("@")[0]}.jpg`)
} else if (isVideo || isQuotedVideo) {
await conn.downloadAndSaveMediaMessage(msg, 'video', `./tmp/${senderJid.split("@")[0]}.mp4`) 
var mediax = await fs.readFileSync(`./tmp/${senderJid.split("@")[0]}.mp4`)    
conn.sendMessage(from, { video: mediax, mentions: users, mimetype: 'video/mp4', caption: htextos }, { quoted: msg })
fs.unlinkSync(`./tmp/${senderJid.split("@")[0]}.mp4`)    
} else if (isAudio || isQuotedAudio) {
await conn.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${senderJid.split("@")[0]}.mp3`)   
var mediax = await fs.readFileSync(`./tmp/${senderJid.split("@")[0]}.mp3`)    
conn.sendMessage(m.chat, { audio: mediax, mentions: users, mimetype: 'audio/mp4', fileName: `Hidetag.mp3` }, { quoted: msg })
fs.unlinkSync(`./tmp/${senderJid.split("@")[0]}.mp3`)    
} else if (isSticker || isQuotedSticker) {
await conn.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${senderJid.split("@")[0]}.jpg`) 
var mediax = await fs.readFileSync(`./tmp/${senderJid.split("@")[0]}.jpg`)    
conn.sendMessage(from, {sticker: mediax, mentions: users}, { quoted: msg })
fs.unlinkSync(`./tmp/${senderJid.split("@")[0]}.jpg`)    
} else {
await conn.sendMessage(from, { text : `${htextos}`, mentions: users }, { quoted: msg })}
} catch {
conn.sendMessage(from, { text: `*[❗] To use this command you must add a text or reply to an image or video*` }, { quoted: msg })}
break
case 'kick':
if (!restrictTOF) return conn.sendMessage(from, { text: `*[❗] The Owner is restricted (${prefix}restrict enable/disable) from using this command*`}, { quoted: msg });
if (!msg.isGroup) return conn.sendMessage(from, { text: `*[❗] This command can only be used in groups*`}, { quoted: msg })
if (!isBotAdmin) return conn.sendMessage(from, { text: `*[❗] To use this command, the Bot must be admin*`}, { quoted: msg })
if (!isAdmin) return conn.sendMessage(from, { text: `*[❗] This command can only be used by group admins*`}, { quoted: msg })                               
let iuserK = `${msg.quotedMsg ? msg.quotedMsg.key.participant || '' : ''}${msg.mentioned ? msg.mentioned : ''}`      
if (!iuserK) return conn.sendMessage(from, { text: `*[❗] Correct use of the command:*\n*┯┷*\n*┠≽ ${prefix}kick @${senderJid.split`@`[0] || 'tag'}*\n*┠≽ ${prefix}kick -> responder a un mensaje*\n*┷┯*`, mentions: [senderJid]}, { quoted: msg });                     
try {
var userrrK = '';
if (msg.quotedMsg && msg.quotedMsg.key && msg.quotedMsg.key.participant) {
userrrK = msg.quotedMsg.key.participant;
} else if (msg.mentioned && msg.mentioned.length > 0) {
userrrK = msg.mentioned[0];
}} catch (e) {
console.log(e);
} finally {
if (userrrK) {
if(conn.user.id.includes(userrrK)) return conn.sendMessage(from, { text: `*[❗] I can't delete myself, if you want to delete me do it manually*`, mentions: [userrrK]}, { quoted: msg })
let responseb = await conn.groupParticipantsUpdate(from, [userrrK], 'remove')
let success1 = `*@${userrrK.split`@`[0] || 'user'} was successfully removed from the group*`
let error1 = `*@${userrrK.split`@`[0] || 'user'} is the creator of the group, I can't remove the creator of the group*`
let error2 = `*@${userrrK.split`@`[0] || 'user'} has already been removed or has left the group*`
if (responseb[0].status === "200") { conn.sendMessage(from, { text: success1, mentions: [userrrK]}, { quoted: msg })
} else if (responseb[0].status === "406") { conn.sendMessage(from, { text: error1, mentions: [userrrK]}, { quoted: msg })
} else if (responseb[0].status === "404") { conn.sendMessage(from, { text: error2, mentions: [userrrK]}, { quoted: msg })
} else { conn.sendMessage(from, { text: `*[❗] Something went wrong and it was not possible to execute the command*`}, { quoted: msg })
}} else {
conn.sendMessage(from, { text: `*[❗] No valid user provided to kick out*`});
return; 
}}
break            
case 'promote':
if (!msg.isGroup) return conn.sendMessage(from, { text: `*[❗] This command can only be used on groups*` }, { quoted: msg })
if (!isAdmin) return conn.sendMessage(from, { text: `*[❗] This command can only be used by group admins*` }, { quoted: msg })  
let iuser = `${msg.quotedMsg ? msg.quotedMsg.key.participant || '' : ''}${msg.mentioned ? msg.mentioned : ''}`      
if (!iuser) return conn.sendMessage(from, { text: `*[❗] Correct use of the command:*\n*┯┷*\n*┠≽ ${prefix}promote @${senderJid.split`@`[0] || 'tag'}*\n*┠≽ ${prefix}promote -> responder a un mensaje*\n*┷┯*`, mentions: [senderJid] }, { quoted: msg });                     
try {
var userrr = '';
if (msg.quotedMsg && msg.quotedMsg.key && msg.quotedMsg.key.participant) {
userrr = msg.quotedMsg.key.participant;
} else if (msg.mentioned && msg.mentioned.length > 0) {
userrr = msg.mentioned[0];
}} catch(e) {
console.log(e);
} finally {
if (userrr) {
if (groupAdmins.includes(userrr)) {
conn.sendMessage(from, { text: `*[❗] @${userrr.split`@`[0] || 'user'} ya forma parte de l@s admins del grupo*`, mentions: [userrr] }, { quoted: msg }); 
} else {
conn.groupParticipantsUpdate(from, [userrr], 'promote')
conn.sendMessage(from, { text: `*[ ✔ ] Command executed successfully, now @${userrr.split`@`[0] || 'user'} is part of the group admins*`, mentions: [userrr] }, { quoted: msg })}}}
break
case 'demote':
if (!msg.isGroup) return conn.sendMessage(from, { text: `*[❗] This command can only be used in groups*` }, { quoted: msg })
if (!isAdmin) return conn.sendMessage(from, { text: `*[❗] This command can only be used by group admins*` }, { quoted: msg })
let iuser2 = `${msg.quotedMsg ? msg.quotedMsg.key.participant || '' : ''}${msg.mentioned ? msg.mentioned : ''}`
if(!iuser2) return conn.sendMessage(from, { text: `*[❗] Correct usage of command:*\n*┯┷*\n*┠≽ ${prefix}demote @${senderJid.split`@`[0] || 'tag'}*\n*┠≽ ${prefix}demote -> responder a un mensaje*\n*┷┯*`, mentions: [senderJid] }, { quoted: msg });                     
try {
var userrr2 = '';
if (msg.quotedMsg && msg.quotedMsg.key && msg.quotedMsg.key.participant) {
userrr2 = msg.quotedMsg.key.participant;
} else if (msg.mentioned && msg.mentioned.length > 0) {
userrr2 = msg.mentioned[0];
}} catch (e) {
console.log(e);
} finally {
if (userrr2) {
if (!groupAdmins.includes(userrr2)) {
conn.sendMessage(from, { text: `*[❗] @${userrr2.split`@`[0] || 'user'} is not part of the group admins*`, mentions: [userrr2] }, { quoted: msg }); 
} else {
conn.groupParticipantsUpdate(from, [userrr2], 'demote')
conn.sendMessage(from, { text: `*[ ✔ ] Command executed successfully, now @${userrr2.split`@`[0] || 'user'} is no longer part of the group admins*`, mentions: [userrr2] }, { quoted: msg })}}} 
break    
case 'ping':
var timestamp = speed();
var latensi = speed() - timestamp
conn.sendMessage(from, { text: `*Response time: ${latensi.toFixed(4)}s*` }, { quoted: msg });  
break     
case 'mute': case 'banchat':    
if (isGroup && !isAdmin) return conn.sendMessage(from, { text: `*[❗] This command can only be used by admins of the group*` }, { quoted: msg });
if (global.db.data.chats[from].mute) return conn.sendMessage(from, { text: `*[❗] This chat was already muted (banned) since before*` }, { quoted: msg }) ;
global.db.data.chats[from].mute = true
conn.sendMessage(from, { text: `*[❗] This chat has been mutated (banned) correctly, the bot will not respond to any message until it is unbanned with the command ${prefix}unmute*` }, { quoted: msg });
break           
case 'unmute': case 'unbanchat':
if (isGroup && !isAdmin) return conn.sendMessage(from, { text: `*[❗] This command can only be used by admins of the group*` }, { quoted: msg });
if (!global.db.data.chats[from].mute) return conn.sendMessage(from, { text: `*[❗] This chat is not muted (banned)*` }, { quoted: msg });
global.db.data.chats[from].mute = false
conn.sendMessage(from, { text: `*[❗] This chat has been unbanned successfully, now the Bot will respond normally*` }, { quoted: msg });
break          
case 'play':
if (!textoo) return conn.sendMessage(from, { text: `*[❗] Missing song name, please enter the command plus the name, title or link of any song or YouTube video*\n\n*—◉ Ejemplo:*\n*◉ ${prefix + command} Good Feeling - Flo Rida*` }, { quoted: msg });     
let res = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=BrunoSobrino&query=${textoo}`) 
let json = await res.json()
let kingcore = await ytplay(textoo)
let audiodownload = json.result.audio
if (!audiodownload) audiodownload = kingcore.result
await conn.sendMessage(from, { audio: { url: `${audiodownload}` }, fileName: `error.mp3`, mimetype: 'audio/mp4' }, { quoted: msg });    
break
case 'play2':    
if (!textoo) return conn.sendMessage(from, { text: `*[❗] Missing song name, please enter the command plus the name, title or link of any song or YouTube video*\n\n*—◉ Ejemplo:*\n*◉ ${prefix + command} Good Feeling - Flo Rida*` }, { quoted: msg });
let mediaa = await ytplayvid(textoo)
await conn.sendMessage(from, { video: { url: mediaa.result }, fileName: `error.mp4`, thumbnail: mediaa.thumb, mimetype: 'video/mp4' }, { quoted: msg });
break   
case 'ytmp3':
if (!textolink) return conn.sendMessage(from, { text: `*[❗] Enter a YouTube video link*\n\n*—◉ Example:*\n*◉ ${prefix + command}* https://youtu.be/WEdvakuztPc` }, { quoted: msg });     
let ress22 = await fetch(`https://api.lolhuman.xyz/api/ytaudio2?apikey=BrunoSobrino&url=${textolink}`) 
let jsonn22 = await ress22.json()
let kingcoreee2 = await ytmp3(textolink)
let audiodownloaddd2 = jsonn22.result.link
if (!audiodownloaddd2) audiodownloaddd2 = kingcoreee2.result
await conn.sendMessage(from, { audio: { url: `${audiodownloaddd2}` }, fileName: `error.mp3`, mimetype: 'audio/mp4' }, { quoted: msg });   
break        
case 'ytmp4':
if (!textolink) return conn.sendMessage(from, { text: `*[❗] Enter a YouTube video link*\n\n*—◉ Example:*\n*◉ ${prefix + command}* https://youtu.be/WEdvakuztPc` }, { quoted: msg });     
let ress2 = await fetch(`https://api.lolhuman.xyz/api/ytvideo?apikey=BrunoSobrino&url=${textolink}`) 
let jsonn2 = await ress2.json()
let kingcoreee = await ytmp4(textolink)
let videodownloaddd = jsonn2.result.link.link
if (!videodownloaddd) videodownloaddd = kingcoreee.result
await conn.sendMessage(from, { video: { url: videodownloaddd }, fileName: `error.mp4`, thumbnail: `${kingcoreee.thumb || ''}`, mimetype: 'video/mp4' }, { quoted: msg });  
break    
case 'dall-e': case 'draw': 
if (!textoo) return conn.sendMessage(from, { text: `*[❗] Ingrese un texto el cual sera la tematica de la imagen y así usar la función de la IA Dall-E*\n\n*—◉ Ejemplos de peticions:*\n*◉ ${prefix + command} gatitos llorando*\n*◉ ${prefix + command} hatsune miku beso*` }, { quoted: msg });     
try {       
const responsee = await openai.createImage({ prompt: textoo, n: 1, size: "512x512", });    
conn.sendMessage(from, { image: { url: responsee.data.data[0].url }, fileName: `error.jpg` }, { quoted: msg });  
} catch (jj) {
try {    
conn.sendMessage(from, { image: { url: `https://api.lolhuman.xyz/api/dall-e?apikey=BrunoSobrino&text=${textoo}` }, fileName: `error.jpg` }, { quoted: msg });  
} catch (jj2) {
conn.sendMessage(from, { text: "*[❗] Error, no image was obtained from the AI...*\n\n*—◉ Error:*\n" + jj2 }, { quoted: msg });   
}}
break 
case 'update':
if (!isOwner) return conn.sendMessage(from, { text: `*[❗] This command can only be used by the Owner of the Bot*` }, { quoted: msg });    
try {    
let stdout = execSync('git pull' + (m.fromMe && q ? ' ' + q : ''))
await conn.sendMessage(from, { text: stdout.toString() }, { quoted: msg });
} catch { 
let updatee = execSync('git remote set-url origin https://github.com/Mohalicious/gamer.git && git pull')
await conn.sendMessage(from, { text: updatee.toString() }, { quoted: msg })}  
break
case 'desactivarwa':      
if (!isOwner) return conn.sendMessage(from, { text: `*[❗] This command can only be used by the Owner of the Bot*` }, { quoted: msg });
if (!q || !args[1] || !textoo) return conn.sendMessage(from, { text: `*[❗] Enter a number, example ${prefix + command} +1 (450) 999-999*` }, { quoted: msg });
let ntah = await axios.get("https://www.whatsapp.com/contact/noclient/")
let email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=10")
let cookie = ntah.headers["set-cookie"].join("; ")
let $ = cheerio.load(ntah.data)
let $form = $("form");
let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
let form = new URLSearchParams()
form.append("jazoest", $form.find("input[name=jazoest]").val())
form.append("lsd", $form.find("input[name=lsd]").val())
form.append("step", "submit")
form.append("country_selector", "ID")
form.append("phone_number", q)
form.append("email", email.data[0])
form.append("email_confirm", email.data[0])
form.append("platform", "ANDROID")
form.append("your_message", "lost/stolen: disable my account")
form.append("__user", "0")
form.append("__a", "1")
form.append("__csr", "")
form.append("__req", "8")
form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0")
form.append("dpr", "1")
form.append("__ccg", "UNKNOWN")
form.append("__rev", "1006630858")
form.append("__comment_req", "0")
let ressss = await axios({ url, method: "POST", data: form, headers: { cookie } })
var payload = String(ressss.data)
if (payload.includes(`"payload":true`)) {
conn.sendMessage(from, { text: `##- WhatsApp Support -##\n\nHello,\n\nThank you for your message.\n\nWe have deactivated your WhatsApp account. This means your account is temporarily disabled and will be automatically deleted in 30 days if you don't re-register the account. Please note: WhatsApp Customer Support cannot delete your account manually.\n\nDuring the lockdown period:\n • Your contacts on WhatsApp may still see your name and profile picture.\n • Any messages your contacts may send to the account will remain in pending status for up to 30 days.\n\nIf you wish to recover your account, please re-register your account as soon as possible.\nRe-register your account by entering the 6-digit code, the code you receive by SMS or phone call. If you re-register\n\nIf you have any other questions or concerns, please feel free to contact us. We will be happy to help!` }, { quoted: msg });
} else if (payload.includes(`"payload":false`)) {
conn.sendMessage(from, { text: `##- WhatsApp Support -##\n\nHello:\n\nThank you for your message.\n\nTo proceed with your request, we need you to verify that this phone number belongs to you. Please send us documentation that allows us to verify ownership of the number, such as a copy of your phone bill or service contract.\n\nPlease be sure to enter your phone number in full international format. For more information on the international format, please see this article.\n\nIf you have any other questions or concerns, please feel free to contact us. We will be happy to help you.` }, { quoted: msg });
} else conn.sendMessage(from, { text: util.format(JSON.parse(res.data.replace("for (;;);", ""))) }, { quoted: msg });  
break   
case 'mediafiredl':
if (!textolink) return conn.sendMessage(from, { text: `*[❗] Enter a valid mediafire link, example: ${prefix}mediafiredl* https://www.mediafire.com/file/r0lrc9ir5j3e2fs/DOOM_v13_UNCLONE` }, { quoted: msg });            
let resss2 = await mediafireDl(textolink)
let caption = `*📓 Number:* ${resss2.name}\n*📁 Peso:* ${resss2.size}\n*📄 Tipo:* ${resss2.mime}\n\n*⏳ Wait while I send your file. . . .*`.trim()
await conn.sendMessage(from, { text: caption }, { quoted: msg });
await conn.sendMessage(from, { document : { url: resss2.link }, fileName: resss2.name, mimetype: resss2.mime.toUpperCase() }, { quoted: msg })       
break
/*-------------------------------------------------------*/
/* [❗]                      [❗]                      [❗] */  
/*                                                       */ 
/*       |- [ ⚠ ] - CODE CREDITS - [ ⚠ ] -|      */
/*     —◉ DEVELOPED BY MOHAMED:                       */
/*     ◉ Mohamed (https://github.com/Mohalicious)          */
/*     ◉ Number: wa.me/254735306047                       */
/*                                                       */
/*     —◉ FT:                                            */
/*     ◉ Mohamed (https://github.com/Mohalicious)  */
/*                                                       */
/* [❗]                      [❗]                      [❗] */
/*-------------------------------------------------------*/  
case 'chatgpt': case 'ia': 
if (!textoo) return conn.sendMessage(from, { text: `*[❗] Enter a request or command to use the ChatGPT function*\n\n*—◉ Examples of requests or commands:*\n*◉ ${prefix + command} Reflection on the series Merlina 2022 on netflix*\n*◉ $ {prefix + command} JS code for a card game*` }, { quoted: msg });    
try {    
let chgptdb = global.chatgpt.data.users[senderJid];
let textoModo = `You will act as a WhatsApp Bot and your main language is English, you will be gamer-v3.6 and you were created by Mohamed. If they ask you for your commands, menu or what you can do and/or your functions, you send them the following:\n\n*AVAILABLE COMMANDS*\n\n🔷 *Generales*\n\`\`\`- #menu\n- #mute\n- #unmute\n- #ping\n- #runtime\`\`\`\n\n🤖 *IA*\n\`\`\`- #chatgpt\n- #chatgpt2\n- #delchatgpt\n- #dall-e\`\`\`\n\n📥 *Multimedia*\n\`\`\`- #play\n- #play2\n- #ytmp3\n- #ytmp4\n- #sticker\n- #mediafiredl\`\`\`\n\n💫 *Grupos*\n\`\`\`- #hidetag\n- #promote\n- #demote\n- #kick\`\`\`\n\n🤴🏻 *Owner*\n\`\`\`- #update\n- #disablewa\n- #restrict enable\n- #restrict disable\`\`\`\n\nIf they ask you to do something that is in your menu but they don't do it correctly, show them with an example\n\nIf they ask you for a tutorial to make or install a Bot or something related to your installation or get yourself for a group, you recommend this channel https://www.youtube.com/@donbel_ovibel and if they ask you for your script or source, give them the video plus the link of your repository, which is this: https://github.com/Mohalicious`  
chgptdb.push({ role: 'user', content: textoo });
const config = { method: 'post', url: 'https://api.openai.com/v1/chat/completions', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + OPENAI_KEY }, data: JSON.stringify({ 'model': 'gpt-3.5-turbo', 'messages': [{ role: 'system', content: textoModo }, ...chgptdb ]})}
let response = await axios(config);
chgptdb.push({ role: 'assistant', content: response.data.choices[0].message.content }) 
conn.sendMessage(from, { text: `${response.data.choices[0].message.content}`.trim() }, { quoted: msg });  
} catch (efe1) {
try {
let IA = await fetch(`https://api.amosayomide05.cf/gpt/?question=${textoo}&string_id=${senderJid}`)  
let IAR = await IA.json()
conn.sendMessage(from, { text: `${IAR.response}`.trim() }, { quoted: msg });
} catch {
try {
const BotIA222 = await openai.createCompletion({ model: "text-davinci-003", prompt: textoo, temperature: 0.3, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
conn.sendMessage(from, { text: BotIA222.data.choices[0].text.trim() }, { quoted: msg });
} catch (efe2) {
try {  
let Rrres = await fetch(`https://api.ibeng.tech/api/info/openai?text=${textoo}&apikey=tamvan`)
let Jjjson = await Rrres.json()
conn.sendMessage(from, { text: Jjjson.data.data.trim() }, { quoted: msg });
} catch (efe3) {        
try {   
let tioress22 = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${textoo}&user=${senderJid}`)
let hasill22 = await tioress22.json()
conn.sendMessage(from, { text: `${hasill22.result}`.trim() }, { quoted: msg });
} catch (efe4) {    
console.log(efe4)}}}}}
break 
case 'delchatgpt':
try {
delete global.chatgpt.data.users[senderJid]  
conn.sendMessage(from, { text: `*[❗] Successfully deleted the message history between you and ChatGPT (IA)*\n\n*—◉ Remember that you can use this command when you have an error in the command ${prefix}chatgpt O ${prefix}ia*` }, { quoted: msg });  
} catch (error1) {   
console.log(error1)
conn.sendMessage(from, { text: `*[❗] Failed, try again*` }, { quoted: msg });  
}   
break    
case 'chatgpt2': case 'ia2':      
if (!textoo) return reply(`*[❗] Enter a request or command to use the ChatGPT function*\n\n*—◉ Examples of requests or commands:*\n*◉ ${prefix + command} Reflection on the series Merlina 2022 on netflix*\n*◉ $ {prefix + command} JS code for a card game*`)           
try {
let IA2 = await fetch(`https://api.amosayomide05.cf/gpt/?question=${textoo}&string_id=${senderJid}`)  
let IAR2 = await IA2.json()
reply(`${IAR2.response}`.trim())    
} catch {
try {
const BotIA = await openai.createCompletion({ model: "text-davinci-003", prompt: textoo, temperature: 0.3, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(BotIA.data.choices[0].text.trim())
} catch (qe) {
try {   
let rrEes = await fetch(`https://api.ibeng.tech/api/info/openai?text=${textoo}&apikey=tamvan`)
let jjJson = await rrEes.json()
reply(jjJson.data.data.trim())    
} catch (qe4) {      
try {    
let tioress = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${textoo}&user=user-unique-id`)
let hasill = await tioress.json()
reply(`${hasill.result}`.trim())   
} catch (qqe) {        
reply("*[❗] Error, got no responses from the AI...*\n\n*—◉ Error:*\n" + qqe)  
}}}}
break       
case 'sticker': case 's':
try {        
const pname = 'Mohalicious - Gamer V3.6'
const athor = '+' + conn.user.id.split(":")[0];
if (isImage || isQuotedImage) {
await conn.downloadAndSaveMediaMessage(msg, "image", `./tmp/${sender.split("@")[0]}.jpeg`)
var media = fs.readFileSync(`./tmp/${sender.split("@")[0]}.jpeg`)
var opt = { packname: pname, author: athor }
conn.sendImageAsSticker(from, media, msg, opt)
fs.unlinkSync(`./tmp/${sender.split("@")[0]}.jpeg`)
} else {
if(isVideo || isQuotedVideo) {
var media = await conn.downloadAndSaveMediaMessage(msg, 'video', `./tmp/${sender}.jpeg`)
var opt = { packname: pname, author: athor }
conn.sendImageAsSticker(from, media, msg, opt)
fs.unlinkSync(media)
} else {
const imageBuffer = await downloadMediaMessage(msg, 'buffer', {}, {});
let filenameJpg = "stk.jpg";
fs.writeFileSync(filenameJpg, imageBuffer);
await ffmpeg('./' + filenameJpg).input(filenameJpg).on('start', function(cmd){
console.log(`Started: ${cmd}`)
}).on('error', function(err) {
console.log(`Error: ${err}`);
reply('error')}).on('end', async function() {
console.log('Finish')
await conn.sendMessage(from, { sticker: { url:'stk.webp' }})
}).addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`]).toFormat('webp').save('stk.webp');
}}} catch {     
reply(`*[❗] Reply to an image, gif or video, which will be converted into a sticker, remember that you must send an image or reply to an image with the command ${prefix + command}*`)        
}
break 
default:
const botNumber22 = '@' + conn.user.id.split(":")[0];
if (msg.key.fromMe || msg.sender == conn.user.id) return //console.log('[❗] I only answer messages without commands from other users but I don't know myself')    
if (!chats.startsWith(botNumber22) && isGroup) return
if (isImage || isVideo || isSticker || isViewOnce || isAudio || isDocument || isLocation) return
let chatstext = chats.replace(conn.user.id.split(":")[0].split("@")[0], '')
const lines = chatstext.split('\n');
lines[0] = lines[0].replace('@', '').replace(prefix, '').replace(/^\s+|\s+$/g, '');
const resultLines = lines.join('\n');
if (isGroup) chatstext = resultLines //chatstext.replace("@", '').replace(prefix, '')
console.log("->[\x1b[1;32mNew\x1b[1;37m]", color('Pregunta De', 'yellow'), color(pushname, 'lightblue'), `: "${chatstext}"`)
conn.sendPresenceUpdate("composing", from);
try {
let chgptTdb = global.chatgpt.data.users[senderJid];
chgptTdb.push({ role: 'user', content: chatstext });
const conNfig = { method: 'post', url: 'https://api.openai.com/v1/chat/completions', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + OPENAI_KEY }, data: JSON.stringify({ 'model': 'gpt-3.5-turbo', 'messages': [{ role: 'system', content: 'You will act as a WhatsApp Bot and your main language is English, you will be gamer-v3.6 and you were created by Mohamed' }, ...chgptTdb ]})}
let responNse = await axios(conNfig);
chgptTdb.push({ role: 'assistant', content: responNse.data.choices[0].message.content }) 
reply(responNse.data.choices[0].message.content)  
} catch {   
try {
let IA3 = await fetch(`https://api.amosayomide05.cf/gpt/?question=${chatstext}&string_id=${senderJid}`)  
let IAR3 = await IA3.json()
reply(`${IAR3.response}`.trim())    
} catch {  
try {
const response = await openai.createCompletion({ model: "text-davinci-003", prompt: chatstext, temperature: 0.3, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(response.data.choices[0].text.trim())
} catch (eee1) {
try {
let rresSS = await fetch(`https://api.ibeng.tech/api/info/openai?text=${chatstext}&apikey=tamvan`)
let jjsonNN = await rresSS.json()
reply(jjsonNN.data.data.trim())     
} catch (eee) {  
try {    
let tiores = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${chatstext}&user=user-unique-id`)
let hasil = await tiores.json()
reply(`${hasil.result}`.trim())   
} catch (eeee) {        
reply("*[❗] Error, got no responses from the AI...*\n\n*—◉ Error:*\n" + eeee)  
}}}}}
break
}} catch (err) {
console.log(color("[ERROR]", "red"), err); }};
